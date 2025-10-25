import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "@mysten/dapp-kit/dist/index.css";
import "@radix-ui/themes/styles.css";

import { SuiClientProvider, WalletProvider, createNetworkConfig, useSuiClientContext } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Theme } from "@radix-ui/themes";
import App from "./App.tsx";
import { EnokiNetwork, registerEnokiWallets } from "@mysten/enoki";

const queryClient = new QueryClient();

const { networkConfig } = createNetworkConfig({
  testnet: { url: "https://fullnode.testnet.sui.io:443" },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Theme appearance="dark">
      <QueryClientProvider client={queryClient}>
        <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
          <RegisterEnokiWallets />
          <WalletProvider>
            <App />
          </WalletProvider>
        </SuiClientProvider>
      </QueryClientProvider>
    </Theme>
  </React.StrictMode>,
);

function RegisterEnokiWallets() {
  const { client, network } = useSuiClientContext();
  console.log("network", network);
  console.log("client", client);
  useEffect(() => {
    const { unregister } = registerEnokiWallets({
      apiKey: "enoki_public_67cbde70ba0a0a238f086a9afc8b14bf",
      providers: {
        google: {
          clientId: "453473344189-dq28epkd2qdpumsl963fr6i5vcgqe9m4.apps.googleusercontent.com",
        },
      },
      client: client as any,
      network: network as EnokiNetwork,
    });

    return unregister;
  }, [client, network]);

  return null;
}
