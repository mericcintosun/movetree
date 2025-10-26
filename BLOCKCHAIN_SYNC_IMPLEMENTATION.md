# Blockchain Sync Implementation Guide

## Mevcut Durum

Şu anda Firebase'den blockchain'e sync sistemi placeholder olarak implement edildi. Gerçek blockchain sync için aşağıdaki adımları takip edin:

## 1. Wallet Connection Entegrasyonu

`useBlockchainSync` hook'unu güncelleyerek wallet connection ekleyin:

```typescript
// hooks/useBlockchainSync.ts
import { useCurrentAccount, useSignAndExecuteTransactionBlock } from '@mysten/dapp-kit';

export function useBlockchainSync() {
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransactionBlock } = useSignAndExecuteTransactionBlock();
  
  const performSync = async () => {
    if (!account) {
      console.warn('No wallet connected for blockchain sync');
      return;
    }
    
    // Sync logic here...
  };
}
```

## 2. Contract Package ID

Move contract'ınızı deploy ettikten sonra package ID'yi alın ve güncelleyin:

```typescript
// firebase/analytics.ts
const PACKAGE_ID = '0xYOUR_PACKAGE_ID_HERE'; // Deploy sonrası güncelleyin

txb.moveCall({
  target: `${PACKAGE_ID}::profile::increment_profile_view`,
  arguments: [txb.object(profileId)]
});
```

## 3. Gerçek Blockchain Sync Implementation

```typescript
export async function syncToBlockchain(
  profileId: string, 
  analytics: ProfileAnalytics,
  signer: any // Wallet signer
): Promise<boolean> {
  try {
    const { TransactionBlock } = await import('@mysten/sui/transactions');
    const { suiClient } = await import('../sui/client');
    
    const txb = new TransactionBlock();
    const client = suiClient;
    
    // Verify profile exists
    const profileObject = await client.getObject({
      id: profileId,
      options: { showContent: true }
    });
    
    if (!profileObject.data) {
      throw new Error(`Profile object ${profileId} not found`);
    }
    
    // Sync profile views
    if (analytics.profileViews > 0) {
      for (let i = 0; i < analytics.profileViews; i++) {
        txb.moveCall({
          target: `${PACKAGE_ID}::profile::increment_profile_view`,
          arguments: [txb.object(profileId)]
        });
      }
    }
    
    // Sync link clicks
    for (let i = 0; i < analytics.linkClicks.length; i++) {
      const clicks = analytics.linkClicks[i];
      if (clicks > 0) {
        for (let j = 0; j < clicks; j++) {
          txb.moveCall({
            target: `${PACKAGE_ID}::profile::view_link`,
            arguments: [
              txb.object(profileId),
              txb.pure.u64(i)
            ]
          });
        }
      }
    }
    
    // Execute transaction
    const result = await signer.signAndExecuteTransactionBlock({
      transactionBlock: txb,
      options: {
        showEffects: true,
        showObjectChanges: true,
      }
    });
    
    console.log(`Blockchain sync transaction: ${result.digest}`);
    return true;
    
  } catch (error) {
    console.error('Error syncing to blockchain:', error);
    return false;
  }
}
```

## 4. Gas Fee Optimization

Çok sayıda increment işlemi için gas fee'yi optimize etmek için batch işlemler yapın:

```typescript
// Batch multiple increments into single transaction
const BATCH_SIZE = 10; // Her transaction'da maksimum 10 increment

for (let batch = 0; batch < Math.ceil(analytics.profileViews / BATCH_SIZE); batch++) {
  const txb = new TransactionBlock();
  const start = batch * BATCH_SIZE;
  const end = Math.min(start + BATCH_SIZE, analytics.profileViews);
  
  for (let i = start; i < end; i++) {
    txb.moveCall({
      target: `${PACKAGE_ID}::profile::increment_profile_view`,
      arguments: [txb.object(profileId)]
    });
  }
  
  await signer.signAndExecuteTransactionBlock({ transactionBlock: txb });
}
```

## 5. Error Handling ve Retry Logic

```typescript
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function syncWithRetry(profileId: string, analytics: ProfileAnalytics, signer: any) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const success = await syncToBlockchain(profileId, analytics, signer);
      if (success) return true;
    } catch (error) {
      console.warn(`Sync attempt ${attempt} failed:`, error);
      if (attempt === MAX_RETRIES) throw error;
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempt));
    }
  }
  return false;
}
```

## 6. Testing

1. Testnet'te contract'ı deploy edin
2. Package ID'yi güncelleyin
3. Wallet connection'ı test edin
4. Analytics sync'i test edin
5. Gas fee'leri kontrol edin

## 7. Production Considerations

- Gas fee'leri için kullanıcı onayı alın
- Sync işlemi sırasında loading state gösterin
- Hata durumlarında kullanıcıya bilgi verin
- Sync frequency'yi optimize edin (çok sık sync pahalı olabilir)

