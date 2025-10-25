import { Transaction } from "@mysten/sui/transactions";
import { toB64 } from "@mysten/sui/utils";
import {
  useSignTransaction,
  useCurrentAccount,
  useSuiClient,
} from "@mysten/dapp-kit";

export function useSponsoredExecute() {
  const { mutateAsync: signTransaction } = useSignTransaction();
  const account = useCurrentAccount();
  const client = useSuiClient();

  return async function sponsorAndExecute(
    tx: Transaction,
    opts: {
      allowedMoveCallTargets?: string[];
      allowedAddresses?: string[];
    } = {},
  ) {
    // Account kontrolü fonksiyon içinde yapılıyor
    if (!account?.address) {
      throw new Error("No account connected");
    }

    // 1) Sadece transaction kind byte'larını üret
    const txBytes = await tx.build({
      client,
      onlyTransactionKind: true,
    });
    const transactionKindBytesB64 = toB64(txBytes);

    // 2) Backend'ten sponsor iste
    console.log("🔗 Backend URL:", import.meta.env.VITE_BACKEND_URL);
    console.log("📤 Request data:", {
      transactionKindBytesB64: transactionKindBytesB64.substring(0, 50) + "...",
      sender: account.address,
      allowedMoveCallTargets: opts.allowedMoveCallTargets ?? [],
      allowedAddresses: opts.allowedAddresses ?? [],
    });

    const resp = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/enoki/sponsor`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionBlockKindBytesB64: transactionKindBytesB64,
          sender: account.address,
          allowedMoveCallTargets: opts.allowedMoveCallTargets ?? [],
          allowedAddresses: opts.allowedAddresses ?? [],
          zkLoginJwt: "mock-jwt", // TODO: Get real JWT from Enoki wallet
        }),
      },
    );

    console.log("📥 Response status:", resp.status);
    const respData = await resp.json();
    console.log("📥 Response data:", respData);

    if (respData.error) throw new Error(respData.error);

    // 3) Kullanıcı imzası (Enoki wallet bağlıysa bu noktada imzalayabilir)
    console.log("🔐 Requesting signature for transaction:", respData.digest);
    const { signature } = await signTransaction({
      transaction: respData.bytesB64,
    });
    console.log("✅ Signature received:", signature ? "Yes" : "No");
    if (!signature) throw new Error("Failed to sign sponsored tx.");

    // 4) Backend execute
    const exec = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/enoki/execute`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          digest: respData.digest,
          userSignatureB64: signature,
        }),
      },
    ).then((r) => r.json());

    if (exec.error) throw new Error(exec.error);
    return exec;
  };
}
