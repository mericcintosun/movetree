import { useSuiClientQuery } from "@mysten/dapp-kit";

export const useProfile = (objectId: string) => {
  return useSuiClientQuery("getObject", {
    id: objectId,
    options: {
      showContent: true,
      showOwner: true,
      showPreviousTransaction: true,
      showStorageRebate: true,
      showType: true,
    },
  });
};

export const useOwnedProfiles = (address: string) => {
  return useSuiClientQuery("getOwnedObjects", {
    owner: address,
    filter: {
      StructType: `${import.meta.env.VITE_PACKAGE_ID}::profile::LinkTreeProfile`,
    },
    options: {
      showContent: true,
      showOwner: true,
      showPreviousTransaction: true,
      showStorageRebate: true,
      showType: true,
    },
  }, {
    enabled: !!address, // Sadece address varsa query çalıştır
  });
};
