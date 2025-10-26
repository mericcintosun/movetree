import React from "react";
import {
  useConnectWallet,
  useCurrentAccount,
  useWallets,
  useDisconnectWallet,
} from "@mysten/dapp-kit";
import { isEnokiWallet } from "@mysten/enoki";
import { Flex, Text } from "@radix-ui/themes";

export function LoginButtons() {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: connectWallet } = useConnectWallet();
  const { mutateAsync: disconnectWallet } = useDisconnectWallet();
  const wallets = useWallets();

  const isConnectedViaGoogleZklogin = () => {
    // En güvenilir sinyal: Enoki zkLogin hesabı JWT sağlar
    const jwt = (currentAccount as any)?.jwt;
    if (jwt) return true;

    // Geriye dönük/ikincil kontrol (daha zayıf): ortamda Enoki Google cüzdanı yüklü mü
    if (!currentAccount) return false;
    const enokiWallets = wallets.filter(isEnokiWallet);
    const googleWallet = enokiWallets.find(
      (w) => (w as any).provider === "google" || (w as any).name?.includes("Google"),
    );
    return !!googleWallet && currentAccount.address !== undefined && Boolean(jwt);
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
      <Flex align="center" gap="2">
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 16px",
          background: "rgba(55, 197, 179, 0.15)",
          borderRadius: "var(--radius-full)",
          border: "1px solid rgba(55, 197, 179, 0.3)",
        }}>
          <div style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "var(--mint-700)",
            boxShadow: "0 0 8px var(--mint-700)",
          }} />
          <Text size="2" style={{ color: "var(--mint-700)", fontWeight: 500 }}>
            Google Connected
          </Text>
        </div>
      </Flex>
    );
  }

  // If connected via another wallet, just show Google login option
  if (currentAccount && !isConnectedViaGoogleZklogin()) {
    return (
      <button
        className="btn-primary"
        onClick={handleGoogleLogin}
        style={{ 
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18">
          <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
          <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
          <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
          <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/>
        </svg>
        Sign in with Google
      </button>
    );
  }

  // Not connected, show Google login button
  return (
    <button
      className="btn-primary"
      onClick={handleGoogleLogin}
      style={{ 
        fontSize: "14px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18">
        <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
        <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
        <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
        <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/>
      </svg>
      Sign in with Google
    </button>
  );
}
