import { Transaction } from "@mysten/sui/transactions";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";

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
    setTheme,
    deleteProfile,
  };
};
