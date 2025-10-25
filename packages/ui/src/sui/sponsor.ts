import { Transaction } from "@mysten/sui/transactions";
import { useSignTransaction } from "@mysten/dapp-kit";
import { fromB64, toB64 } from "@mysten/sui/utils";

/**
 * Sponsor helper hook
 */
export function useSponsor() {
  const { mutateAsync: signTransaction } = useSignTransaction();

  return async function sponsorAndExecute(tx: Transaction, sender: string) {
    // 1) onlyTransactionKind bytes üret
    const bytes = await tx.build({ onlyTransactionKind: true });

    // 2) sponsor isteği (backend)
    const s = await fetch(`${import.meta.env.VITE_BACKEND_URL}/sponsor`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        txBytesB64: toB64(bytes),
        sender,
        allowedMoveCallTargets: [
          `${import.meta.env.VITE_PACKAGE_ID}::profile::view_link`,
        ],
      }),
    }).then((r) => r.json());

    // 3) kullanıcı imzası
    const { signature } = await signTransaction({
      transaction: fromB64(s.bytes),
    });

    // 4) execute (backend)
    return fetch(`${import.meta.env.VITE_BACKEND_URL}/execute`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        digest: s.digest,
        signatureB64: toB64(signature),
      }),
    }).then((r) => r.json());
  };
}

/**
 * 1) Sponsor uç noktasına PTB (onlyKind) gönder
 * Enoki backend'ine PTB'nin sadece transaction kind kısmını gönderir
 * ve sponsorlu transaction bytes'ını alır
 */
export async function requestSponsorship(
  tx: Transaction,
  sender: string,
  allowedMoveCallTargets: string[],
) {
  // Güvenlik: onlyTransactionKind kullan
  const kindBytes = await tx.build({ onlyTransactionKind: true });

  const resp = await fetch("/api/enoki/sponsor", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      kindBytesBase64: toB64(kindBytes),
      sender,
      allowedMoveCallTargets,
    }),
  });

  if (!resp.ok) {
    const errorText = await resp.text();
    throw new Error(`Sponsor failed: ${errorText}`);
  }

  const { bytesBase64, digest } = await resp.json();
  return { txBytes: fromB64(bytesBase64), digest };
}

/**
 * 2) İmzayı backend'e gönder ve finalize et
 * Kullanıcının wallet imzasını alır ve Enoki backend'ine gönderir
 * Transaction finalize edilir
 */
export async function executeSponsored(
  digest: string,
  userSignature: Uint8Array,
) {
  const resp = await fetch("/api/enoki/execute", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      digest,
      userSignatureBase64: toB64(userSignature),
    }),
  });

  if (!resp.ok) {
    const errorText = await resp.text();
    throw new Error(`Execute failed: ${errorText}`);
  }

  return resp.json();
}
