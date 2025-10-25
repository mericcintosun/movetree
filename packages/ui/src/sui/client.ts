import { useSuiClient } from "@mysten/dapp-kit";

export const useSuiClientHelper = () => {
  const client = useSuiClient();
  return client;
};
