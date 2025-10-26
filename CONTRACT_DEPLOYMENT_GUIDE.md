# Contract Deployment Guide

## Mevcut Durum

Move contract'ında `link_labels` field'ı eklendi ama henüz deploy edilmedi. Bu yüzden frontend eski contract formatını kullanıyor.

## 1. Yeni Contract Deploy Etme

### Adım 1: Contract'ı Deploy Edin

```bash
cd packages/move
sui client publish --gas-budget 100000000
```

### Adım 2: Package ID'yi Alın

Deploy sonrası çıkan package ID'yi kopyalayın:
```
Published Objects:
  - PackageID: 0xYOUR_NEW_PACKAGE_ID
  - ... (diğer object'ler)
```

### Adım 3: Environment Variables Güncelleyin

`.env.local` dosyasında (veya environment variables'da):

```env
VITE_PACKAGE_ID=0xYOUR_NEW_PACKAGE_ID
```

### Adım 4: Frontend'i Güncelleyin

Contract deploy edildikten sonra `tx.ts` dosyasını güncelleyin:

```typescript
// packages/ui/src/sui/tx.ts
const updateLinks = async (
  profileId: string,
  links: Array<{ label: string; url: string; icon?: string }>,
) => {
  // Filter out empty links and get URLs and labels
  const filteredLinks = links.filter((l) => l.url && l.url.trim() !== "");
  const urls = filteredLinks.map((l) => l.url);
  const labels = filteredLinks.map((l) => l.label || l.url);

  const tx = new Transaction();
  tx.moveCall({
    target: `${import.meta.env.VITE_PACKAGE_ID}::profile::upsert_links`,
    arguments: [
      tx.object(profileId), 
      tx.pure.vector("string", urls),
      tx.pure.vector("string", labels)  // YENİ: labels parametresi
    ],
  });

  return await signAndExecuteTransaction({ transaction: tx });
};
```

### Adım 5: PublicProfile'ı Güncelleyin

```typescript
// packages/ui/src/public/PublicProfile.tsx
const profileData = (profile?.data?.content as any)?.fields;
const links = (profileData?.links || []).filter(
  (url: string) => url && url.trim() !== "",
);
const linkLabels = profileData?.link_labels || []; // YENİ: labels'ı aktif et
const tags = profileData?.tags || [];

// Link gösteriminde:
const label = linkLabels[index] || url; // Label kullan
```

## 2. Test Etme

1. **Link Ekleme**: Label ve URL birlikte kaydediliyor mu?
2. **Link Silme**: Silinen linkler blockchain'den de siliniyor mu?
3. **Link Tıklama**: Click sayıları artıyor mu?
4. **Label Gösterimi**: PublicProfile'da label'lar görünüyor mu?

## 3. Rollback (Gerekirse)

Eğer sorun olursa, eski contract'a geri dönmek için:

1. Eski package ID'yi kullanın
2. Frontend'i eski haline getirin (sadece URL'ler)

## 4. Notlar

- Yeni contract deploy edilene kadar label özelliği çalışmayacak
- Mevcut profiller etkilenmeyecek
- Yeni profiller label desteği ile oluşturulacak
