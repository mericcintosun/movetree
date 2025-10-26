import { Transaction } from "@mysten/sui/transactions";
import { bcs } from "@mysten/sui/bcs";
import { sha3_256 } from "@noble/hashes/sha3.js";
import { normalizeSuiObjectId, isValidSuiObjectId } from '@mysten/sui/utils';
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useSponsoredExecute } from './sponsor';

// Normalize package ID once at module level
const PKG_ID = (() => {
  // Yeni deploy edilen kontrat ID'si
  const raw = '0xbc3daaf8d67a2dc61c0dd15f4b66634d522693661f6f465654a7538fb386ed83';
  const normalized = normalizeSuiObjectId(raw);   // objectId için doğru helper
  if (!isValidSuiObjectId(normalized)) {
    throw new Error(`Invalid VITE_PACKAGE_ID: ${raw}`);
  }
  return normalized;
})();

// Debug: PKG_ID kontrolü
console.log('PKG_ID', PKG_ID, PKG_ID.length); // 66 karakter (0x + 64 hex) olmalı

export const useProfileTransactions = () => {
  const account = useCurrentAccount();
  const sponsorAndExecute = useSponsoredExecute();
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const jwt = (account as any)?.jwt as string | undefined;

  // Centralized execution: sponsored if Google zkLogin (JWT), else normal wallet execution
  const executeTx = async (
    tx: Transaction,
    allowedMoveCallTargets: string[]
  ) => {
    if (jwt) {
      return sponsorAndExecute(tx, { allowedMoveCallTargets });
    }
    return signAndExecuteTransaction({ transaction: tx });
  };

  // Early return if no account
  if (!account) {
    return {
      createProfile: () => Promise.reject(new Error("Please connect wallet first")),
      updateLinks: () => Promise.reject(new Error("Please connect wallet first")),
      updateLinksVerified: () => Promise.reject(new Error("Please connect wallet first")),
      viewLinkEvent: () => Promise.reject(new Error("Please connect wallet first")),
      setTheme: () => Promise.reject(new Error("Please connect wallet first")),
      deleteProfile: () => Promise.reject(new Error("Please connect wallet first")),
      updateTags: () => Promise.reject(new Error("Please connect wallet first")),
      incrementProfileView: () => Promise.reject(new Error("Please connect wallet first")),
      trackLinkClick: () => Promise.reject(new Error("Please connect wallet first")),
    };
  }

  const createProfile = async (
    name: string,
    avatarCid: string,
    bio: string,
    theme: string,
  ) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${PKG_ID}::profile::create_profile`,
      arguments: [
        tx.pure.string(name),
        tx.pure.string(avatarCid),
        tx.pure.string(bio),
        tx.pure.string(theme),
      ],
    });

    return await executeTx(tx, [`${PKG_ID}::profile::create_profile`]);
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
      target: `${PKG_ID}::profile::upsert_links`,
      arguments: [
        tx.object(profileId), 
        tx.pure.vector("string", urls)
      ],
    });

    return await executeTx(tx, [`${PKG_ID}::profile::upsert_links`]);
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
      target: `${PKG_ID}::profile::upsert_links_verified`,
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
      target: `${PKG_ID}::profile::view_link`,
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
      target: `${PKG_ID}::profile::set_theme`,
      arguments: [tx.object(profileId), tx.pure.string(theme)],
    });

    return await executeTx(tx, [`${PKG_ID}::profile::set_theme`]);
  };

  const deleteProfile = async (profileId: string) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${PKG_ID}::profile::delete_profile`,
      arguments: [tx.object(profileId)],
    });

    return await executeTx(tx, [`${PKG_ID}::profile::delete_profile`]);
  };

  const updateTags = async (profileId: string, tags: string[]) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${PKG_ID}::profile::update_tags`,
      arguments: [tx.object(profileId), tx.pure.vector("string", tags)],
    });

    return await executeTx(tx, [`${PKG_ID}::profile::update_tags`]);
  };

  const incrementProfileView = async (profileId: string) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${PKG_ID}::profile::increment_profile_view`,
      arguments: [tx.object(profileId)],
    });

    return await executeTx(tx, [`${PKG_ID}::profile::increment_profile_view`]);
  };

  const trackLinkClick = async (profileId: string, linkIndex: number) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${PKG_ID}::profile::view_link`,
      arguments: [tx.object(profileId), tx.pure.u64(linkIndex)],
    });

    return await executeTx(tx, [`${PKG_ID}::profile::view_link`]);
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

