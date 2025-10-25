import { PropsWithChildren } from "react";
import { EnokiFlowProvider } from "@mysten/enoki/react";

export function EnokiProvider({ children }: PropsWithChildren) {
  return (
    <EnokiFlowProvider
      apiKey={
        import.meta.env.VITE_ENOKI_PUBLIC_KEY ||
        "enoki_public_67cbde70ba0a0a238f086a9afc8b14bf"
      }
      network="testnet"
    >
      {children}
    </EnokiFlowProvider>
  );
}
