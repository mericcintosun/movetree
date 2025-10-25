import { Transaction } from "@mysten/sui/transactions";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { bcs } from "@mysten/sui/bcs";
import { sha3_256 } from "@noble/hashes/sha3.js";
import { useSponsor } from "./sponsor";

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
    // Filter out empty links and get only URLs (for now, until new contract is deployed)
    const urls = links
      .map((l) => l.url)
      .filter((url) => url && url.trim() !== "");

    console.log('updateLinks called with:', { 
      profileId, 
      originalLinks: links, 
      filteredUrls: urls
    });

    const tx = new Transaction();
    tx.moveCall({
      target: `${import.meta.env.VITE_PACKAGE_ID}::profile::upsert_links`,
      arguments: [
        tx.object(profileId), 
        tx.pure.vector("string", urls)
      ],
    });

    return await signAndExecuteTransaction({ transaction: tx });
  };

  // NEW: verified links
  const updateLinksVerified = async (
    profileId: string,
    links: Array<{ label: string; url: string; icon?: string }>
  ) => {
    const urls = links.map((l) => l.url).filter(Boolean);

    // BCS(urls) - SerializedBcs objesi döndürür
    const urlsBytes = bcs.vector(bcs.string()).serialize(urls).toBytes(); // <-- toBytes()
    const hashBytes = sha3_256(urlsBytes); // Uint8Array(32)

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
      arguments: [
        tx.object(profileId),        // <-- address DEĞİL, object()
        tx.pure.u64(index),
      ],
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

  const updateTags = async (profileId: string, tags: string[]) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${import.meta.env.VITE_PACKAGE_ID}::profile::update_tags`,
      arguments: [tx.object(profileId), tx.pure.vector("string", tags)],
    });

    return await signAndExecuteTransaction({ transaction: tx });
  };

  const incrementProfileView = async (profileId: string) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${import.meta.env.VITE_PACKAGE_ID}::profile::increment_profile_view`,
      arguments: [tx.object(profileId)],
    });

    return await signAndExecuteTransaction({ transaction: tx });
  };

  const trackLinkClick = async (profileId: string, linkIndex: number) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${import.meta.env.VITE_PACKAGE_ID}::profile::view_link`,
      arguments: [tx.object(profileId), tx.pure.u64(linkIndex)],
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
    updateTags,
    incrementProfileView,
    trackLinkClick,
  };
};

/**
 * Sponsored view link - zkLogin kullanıcılar için
 * Bu fonksiyon cüzdan gerektirmez, backend sponsor eder
 */
export function useViewLinkSponsored() {
  const sponsorAndExecute = useSponsor();

  return async function viewLinkSponsored(pkgId: string, profileId: string, index: number, sender: string) {
    const tx = new Transaction();
    tx.moveCall({
      target: `${pkgId}::profile::view_link`,
      arguments: [tx.object(profileId), tx.pure.u64(index)],
    });

    return sponsorAndExecute(tx, sender);
  };
}
