import { useEffect } from "react";
import { useSuiClientContext } from "@mysten/dapp-kit";
import { EnokiNetwork, registerEnokiWallets } from "@mysten/enoki";
export function RegisterEnokiWallets() {
  const { client, network } = useSuiClientContext();

  useEffect(() => {
    const { unregister } = registerEnokiWallets({
      apiKey:
        import.meta.env.VITE_ENOKI_PUBLIC_KEY ||
        "enoki_public_67cbde70ba0a0a238f086a9afc8b14bf", // public key
      providers: {
        google: {
          clientId:
            import.meta.env.VITE_GOOGLE_CLIENT_ID ||
            "453473344189-dq28epkd2qdpumsl963fr6i5vcgqe9m4.apps.googleusercontent.com",
        },
      },
      client: client as unknown as SuiClient,
      network: (network as EnokiNetwork) ?? "testnet",
    });
    return unregister;
  }, [client, network]);

  return null;
}
