import React from "react";
import {
  useConnectWallet,
  useCurrentAccount,
  useWallets,
  useDisconnectWallet,
} from "@mysten/dapp-kit";
import { isEnokiWallet, EnokiWallet, AuthProvider } from "@mysten/enoki";

export function LoginButtons() {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: connectWallet } = useConnectWallet();
  const { mutateAsync: disconnectWallet } = useDisconnectWallet();
  const wallets = useWallets();
  
  const isConnectedViaGoogleZklogin = () => {
    if (!currentAccount) return false;
    const enokiWallets = wallets.filter(isEnokiWallet);
    const googleWallet = enokiWallets.find(
      (w) => w.provider === "google" || w.name?.includes("Google"),
    );

    return !!googleWallet && currentAccount.address !== undefined;
  };

  const handleGoogleLogin = async () => {
    try {
      if (currentAccount) {
        await disconnectWallet();
      }

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

      await connectWallet({ wallet: googleWallet });
    } catch (error) {
      console.error("Google zkLogin failed:", error);
      alert("Login failed: " + (error as Error).message);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
    } catch (error) {
      console.error("Disconnect failed:", error);
    }
  };

  // If connected via Google zkLogin, show connected status
  if (currentAccount && isConnectedViaGoogleZklogin()) {
    return (
      <div className="apple-flex apple-flex-center apple-gap-3">
        <div className="apple-badge apple-badge-success">
          ✓ Connected via Google zkLogin
        </div>
        <button 
          className="apple-button apple-button-small"
          style={{ 
            backgroundColor: "var(--apple-badge-error)",
            color: "white",
            border: "none"
          }}
          onClick={handleDisconnect}
        >
          Disconnect
        </button>
      </div>
    );
  }

  // If connected via another wallet, show warning and force Google login
  if (currentAccount && !isConnectedViaGoogleZklogin()) {
    return (
      <div className="apple-flex-column apple-gap-3">
        <div className="apple-badge apple-badge-warning">
          ⚠️ Connected with another wallet
        </div>
        <div className="apple-flex apple-gap-3">
          <button 
            className="apple-button apple-button-primary apple-button-small"
            onClick={handleGoogleLogin}
          >
            Sign in with Google zkLogin
          </button>
          <button
            className="apple-button apple-button-secondary apple-button-small"
            onClick={handleDisconnect}
          >
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  // Not connected, show Google login button
  return (
    <button 
      className="apple-button apple-button-primary apple-button-small"
      onClick={handleGoogleLogin}
    >
      Sign in with Google zkLogin
    </button>
  );
}
