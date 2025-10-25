import { useSuiClient } from "@mysten/dapp-kit";
import { SuiClient } from "@mysten/sui/client";
import { getFullnodeUrl } from "@mysten/sui/client";

export const useSuiClientHelper = () => {
  const client = useSuiClient();
  return client;
};

// Create a singleton client for non-hook usage
export const suiClient = new SuiClient({
  url: getFullnodeUrl("testnet"),
});
