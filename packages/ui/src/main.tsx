import React from "react";
import ReactDOM from "react-dom/client";
import "@mysten/dapp-kit/dist/index.css";
import "@radix-ui/themes/styles.css";
import "./styles/theme.css";

import { SuiClientProvider, WalletProvider, createNetworkConfig, useAutoConnectWallet } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Theme } from "@radix-ui/themes";
import App from "./App.tsx";
import { RegisterEnokiWallets } from "./sui/RegisterEnokiWallets";
import { EnokiProvider } from "./auth/EnokiProvider";

const queryClient = new QueryClient();

const { networkConfig } = createNetworkConfig({
  testnet: { url: "https://fullnode.testnet.sui.io:443" },
});

function AutoConnectOnce() {
  // dapp-kit'in son kullanılan cüzdanı otomatik bağlamasını tetikler
  useAutoConnectWallet();
  return null;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Theme appearance="dark">
      <QueryClientProvider client={queryClient}>
        <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
          {/* localStorage ile persist, sayfa yenileyince geri bağlanma */}
          <WalletProvider autoConnect storage={localStorage}>
            <EnokiProvider>
              <RegisterEnokiWallets />
              <AutoConnectOnce />
              <App />
            </EnokiProvider>
          </WalletProvider>
        </SuiClientProvider>
      </QueryClientProvider>
    </Theme>
  </React.StrictMode>,
);

