import { Transaction } from "@mysten/sui/transactions";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { bcs } from "@mysten/sui/bcs";
import { sha3_256 } from "@noble/hashes/sha3.js";

export const useProfileTransactions = () => {
  const { mutateAsync: signAndExecuteTransaction } =
    useSignAndExecuteTransaction();

  const createProfile = async (
    name: string,
    avatarCid: string,
    bio: string,
    theme: string,
  ) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${import.meta.env.VITE_PACKAGE_ID}::profile::create_profile`,
      arguments: [
        tx.pure.string(name),
        tx.pure.string(avatarCid),
        tx.pure.string(bio),
        tx.pure.string(theme),
      ],
    });

    return await signAndExecuteTransaction({ transaction: tx });
  };

  const updateLinks = async (
    profileId: string,
    links: Array<{ label: string; url: string; icon?: string }>,
  ) => {
    const urls = links
      .map((l) => l.url)
      .filter((url) => url && url.trim() !== "");

    const tx = new Transaction();
    tx.moveCall({
      target: `${import.meta.env.VITE_PACKAGE_ID}::profile::upsert_links`,
      arguments: [tx.object(profileId), tx.pure.vector("string", urls)],
    });

    return await signAndExecuteTransaction({ transaction: tx });
  };

  // NEW: verified links
  const updateLinksVerified = async (
    profileId: string,
    links: Array<{ label: string; url: string; icon?: string }>
  ) => {
    const urls = links.map((l) => l.url);

    // BCS(urls) - SerializedBcs objesi döndürür
    const urlsBytesRaw = bcs.vector(bcs.string()).serialize(urls);
    console.log("urlsBytesRaw:", urlsBytesRaw, Object.keys(urlsBytesRaw));
    
    // SerializedBcs'den Uint8Array'e çevir
    const urlsBytes: Uint8Array = urlsBytesRaw.toBytes();
    console.log("urlsBytes type:", urlsBytes, urlsBytes instanceof Uint8Array);
    
    // SHA3-256 over BCS(urls) - Uint8Array
    const hashBytes = sha3_256(urlsBytes);
    console.log("hashBytes:", hashBytes);

    const tx = new Transaction();
    tx.moveCall({
      target: `${import.meta.env.VITE_PACKAGE_ID}::profile::upsert_links_verified`,
      arguments: [
        tx.object(profileId),
        tx.pure.vector("string", urls),
        tx.pure.vector("u8", Array.from(hashBytes)),
      ],
    });
    return signAndExecuteTransaction({ transaction: tx });
  };

  // NEW: permissionless event (non-sponsored versiyon)
  const viewLinkEvent = async (profileId: string, index: number) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${import.meta.env.VITE_PACKAGE_ID}::profile::view_link`,
      arguments: [tx.pure.address(profileId), tx.pure.u64(index)],
    });
    return signAndExecuteTransaction({ transaction: tx });
  };

  const setTheme = async (profileId: string, theme: string) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${import.meta.env.VITE_PACKAGE_ID}::profile::set_theme`,
      arguments: [tx.object(profileId), tx.pure.string(theme)],
    });

    return await signAndExecuteTransaction({ transaction: tx });
  };

  const deleteProfile = async (profileId: string) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${import.meta.env.VITE_PACKAGE_ID}::profile::delete_profile`,
      arguments: [tx.object(profileId)],
    });

    return await signAndExecuteTransaction({ transaction: tx });
  };

  return {
    createProfile,
    updateLinks,
    updateLinksVerified,
    viewLinkEvent,
    setTheme,
    deleteProfile,
  };
};
