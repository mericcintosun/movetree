import { PropsWithChildren } from 'react';
import { EnokiFlowProvider } from '@mysten/enoki/react';

export function EnokiProvider({ children }: PropsWithChildren) {
  return (
    <EnokiFlowProvider
      apiKey={import.meta.env.VITE_ENOKI_PUBLIC_KEY!}
      network={(import.meta.env.VITE_ENOKI_NETWORK ?? 'testnet') as 'testnet' | 'mainnet'}
    >
      {children}
    </EnokiFlowProvider>
  );
}
