import React from "react";
import {
  useCurrentAccount,
  useWallets,
  useDisconnectWallet,
} from "@mysten/dapp-kit";
import { isEnokiWallet } from "@mysten/enoki";
import { Flex, Text } from "@radix-ui/themes";

interface LoginButtonsProps {
  onWalletConnect?: () => void;
}

export function LoginButtons({ onWalletConnect }: LoginButtonsProps = {}) {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: disconnectWallet } = useDisconnectWallet();
  const wallets = useWallets();

  // Move useEffect to the top level - always call hooks in the same order
  React.useEffect(() => {
    if (currentAccount && onWalletConnect) {
      onWalletConnect();
    }
  }, [currentAccount, onWalletConnect]);

  const isConnectedViaGoogleZklogin = () => {
    const jwt = (currentAccount as any)?.jwt;
    if (jwt) return true;

    if (!currentAccount) return false;
    const enokiWallets = wallets.filter(isEnokiWallet);
    const googleWallet = enokiWallets.find(
      (w) =>
        (w as any).provider === "google" || (w as any).name?.includes("Google"),
    );
    return (
      !!googleWallet && currentAccount.address !== undefined && Boolean(jwt)
    );
  };

  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
    } catch (error) {
      console.error("Disconnect failed:", error);
    }
  };

  // If connected, show connected status
  if (currentAccount) {
    return (
      <Flex align="center" gap="2">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            background: "rgba(55, 197, 179, 0.15)",
            borderRadius: "var(--radius-full)",
            border: "1px solid rgba(55, 197, 179, 0.3)",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "var(--mint-700)",
              boxShadow: "0 0 8px var(--mint-700)",
            }}
          />
          <Text size="2" style={{ color: "var(--mint-700)", fontWeight: 500 }}>
            {isConnectedViaGoogleZklogin()
              ? "Google Connected"
              : "Wallet Connected"}
          </Text>
        </div>
        <button
          onClick={handleDisconnect}
          style={{
            padding: "8px 16px",
            background: "transparent",
            border: "1.5px solid rgba(255, 100, 100, 0.3)",
            borderRadius: "var(--radius-full)",
            color: "#ff6b6b",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all var(--transition-base)",
            fontFamily: "var(--font-body)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 100, 100, 0.1)";
            e.currentTarget.style.borderColor = "#ff6b6b";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "rgba(255, 100, 100, 0.3)";
          }}
        >
          Disconnect
        </button>
      </Flex>
    );
  }

  // Not connected - just show empty state
  return null;
}
