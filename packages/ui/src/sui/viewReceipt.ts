import { Transaction } from "@mysten/sui/transactions";
import { useSignTransaction } from "@mysten/dapp-kit"; // NOT: sign&execute değil, sadece sign
import { requestSponsorship, executeSponsored } from "./sponsor";

/**
 * View receipt hook - sponsored transaction ile link görüntüleme
 * Bu hook kullanıcının link tıklamasını blockchain'e kaydeder
 * ve sponsorlu transaction kullanarak gas fee'siz işlem yapar
 */
export function useViewReceipt(profileId: string, pkgId: string) {
  const { mutateAsync: signTransaction } = useSignTransaction();

  const viewAndOpen = async (index: number, url: string, sender: string) => {
    try {
      // 1) PTB hazırla
      const tx = new Transaction();
      tx.moveCall({
        target: `${pkgId}::profile::view_link`,
        arguments: [tx.object(profileId), tx.pure.u64(index)],
      });
      tx.setSender(sender); // sponsor backend'e de gönderiyoruz

      // 2) Sponsor iste (sadece bu fonksiyona izin ver)
      const allowed = [`${pkgId}::profile::view_link`];
      const { txBytes, digest } = await requestSponsorship(tx, sender, allowed);

      // 3) Wallet ile İMZA (kullanıcıda wallet varsa)
      const { signature } = await signTransaction({ transaction: txBytes });

      // 4) Sponsor execute
      const exec = await executeSponsored(digest, signature);

      // 5) Başarılıysa linki aç
      if (exec?.effects?.status?.status === "success") {
        window.open(url, "_blank", "noopener,noreferrer");
        return true;
      } else {
        console.error("Transaction failed:", exec);
        return false;
      }
    } catch (error) {
      console.error("View receipt failed:", error);
      // Hata durumunda da linki aç (kullanıcı deneyimi için)
      window.open(url, "_blank", "noopener,noreferrer");
      return false;
    }
  };

  return { viewAndOpen };
}
