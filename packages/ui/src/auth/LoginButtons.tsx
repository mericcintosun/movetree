import React from "react";
import {
  useConnectWallet,
  useCurrentAccount,
  useWallets,
  useDisconnectWallet,
} from "@mysten/dapp-kit";
import { isEnokiWallet, EnokiWallet, AuthProvider } from "@mysten/enoki";
import { Button, Flex, Text } from "@radix-ui/themes";

export function LoginButtons() {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: connectWallet } = useConnectWallet();
  const { mutateAsync: disconnectWallet } = useDisconnectWallet();
  const wallets = useWallets();
  console.log("wallets", wallets);
  const isConnectedViaGoogleZklogin = () => {
    if (!currentAccount) return false;
    console.log("wallets", wallets);
    const enokiWallets = wallets.filter(isEnokiWallet);
    console.log("enokiWallets", enokiWallets);
    const googleWallet = enokiWallets.find(
      (w) => w.provider === "google" || w.name?.includes("Google"),
    );

    return !!googleWallet && currentAccount.address !== undefined;
  };

  const handleGoogleLogin = async () => {
    console.log("handleGoogleLogin");
    try {
      if (currentAccount) {
        await disconnectWallet();
        console.log("Disconnected existing wallet");
      }

      // Find Enoki Google wallet
      const enokiWallets = wallets.filter(isEnokiWallet);

      const googleWallet = enokiWallets.find(
        (wallet: any) =>
          wallet.provider === "google" || wallet.name?.includes("Google"),
      );

      if (!googleWallet) {
        alert(
          "Google zkLogin wallet not found. Make sure Enoki is configured properly.",
        );
        return;
      }

      // Connect with Google zkLogin
      await connectWallet({ wallet: googleWallet });
      console.log("Google zkLogin successful!");
    } catch (error) {
      console.error("Google zkLogin failed:", error);
      alert("Login failed: " + (error as Error).message);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
      console.log("Wallet disconnected");
    } catch (error) {
      console.error("Disconnect failed:", error);
    }
  };

  // If connected via Google zkLogin, show connected status
  if (currentAccount && isConnectedViaGoogleZklogin()) {
    return (
      <Flex align="center" gap="2">
        <Text size="2" color="green">
          ✓ Connected via Google zkLogin
        </Text>
        <Button onClick={handleDisconnect} variant="soft" color="red" size="1">
          Disconnect
        </Button>
      </Flex>
    );
  }

  // If connected via another wallet, show warning and force Google login
  if (currentAccount && !isConnectedViaGoogleZklogin()) {
    return (
      <Flex direction="column" gap="2">
        <Text size="2" color="orange">
          ⚠️ Connected with another wallet
        </Text>
        <Flex gap="2">
          <Button onClick={handleGoogleLogin} variant="solid" color="blue">
            Sign in with Google zkLogin
          </Button>
          <Button
            onClick={handleDisconnect}
            variant="soft"
            color="gray"
            size="2"
          >
            Disconnect
          </Button>
        </Flex>
      </Flex>
    );
  }

  // Not connected, show Google login button
  return (
    <Flex gap="2">
      <Button onClick={handleGoogleLogin} variant="solid" color="blue">
        Sign in with Google zkLogin
      </Button>
    </Flex>
  );
}
