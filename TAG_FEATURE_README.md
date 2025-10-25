# Tag-Based Networking Feature

## 📋 Özet

Bu branch'e LinkedIn tarzı ama daha basit bir tag-based networking özelliği eklendi. Kullanıcılar ilgi alanlarını seçiyor, benzer tag'lere sahip profiller öneriliyor.

## ✅ Tamamlanan İşler

### 1. Move Contract (`packages/move/sources/profile.move`)

**Yeni Field:**
```move
public struct LinkTreeProfile has key {
    // ... diğer fieldlar
    tags: vector<String>, // Kullanıcının ilgi alanları
}
```

**Yeni Fonksiyonlar:**
- ✅ `update_tags()` - Entry function (frontend'den çağrılabilir)
- ✅ `get_tags()` - Read-only getter
- ✅ Event tracking eklendi (indexer için)

**Event'ler:**
```move
// Profil oluşturulduğunda
public struct ProfileCreated has copy, drop {
    profile_id: address,
    owner: address,
    name: String,
    tags: vector<String>,
}

// Tag'ler güncellendiğinde
public struct TagsUpdated has copy, drop {
    profile_id: address,
    tags: vector<String>,
}
```

### 2. Frontend UI (`packages/ui/src/app/Dashboard.tsx`)

**Yeni UI Elementleri:**
- 12 popüler tag (Developer, Designer, Blockchain, Web3, AI/ML, DeFi, NFT, Gaming, Content Creator, Marketing, Business, Entrepreneur)
- Custom tag input
- Tag selection badges
- Similar profiles section

**Örnek:**
```typescript
const POPULAR_TAGS = [
  "Developer", "Designer", "Blockchain", "Web3",
  "AI/ML", "DeFi", "NFT", "Gaming",
  "Content Creator", "Marketing", "Business", "Entrepreneur"
];
```

### 3. Transaction Functions (`packages/ui/src/sui/tx.ts`)

```typescript
const updateTags = async (profileId: string, tags: string[]) => {
  const tx = new Transaction();
  tx.moveCall({
    target: `${PACKAGE_ID}::profile::update_tags`,
    arguments: [tx.object(profileId), tx.pure.vector("string", tags)],
  });
  return await signAndExecuteTransaction({ transaction: tx });
};
```

## ⚠️ ÖNEMLİ: Benzer Profil Araması

### Mevcut Durum
Şu anda `useSimilarProfiles` **mock data** kullanıyor çünkü:

**Sorun:** Sui blockchain'de tüm profilleri query etmek için:
- ❌ `getOwnedObjects` sadece belirli owner'a ait objeleri getirir
- ❌ Sui RPC API'sinde "tüm objeleri getir" yok

### Production Çözümleri

#### Seçenek 1: Sui GraphQL (ÖNERİLEN) 🚀

```typescript
// @mysten/sui.js kullanarak
const profiles = await graphqlClient.query({
  query: `{
    objects(
      filter: {
        type: "${PACKAGE_ID}::profile::LinkTreeProfile"
      }
    ) {
      nodes {
        objectId
        content {
          fields {
            tags
            name
            bio
          }
        }
      }
    }
  }`
});

// Tag'lere göre filtrele
const similarProfiles = profiles.filter(p => 
  p.tags.some(tag => userTags.includes(tag))
);
```

**Avantajları:**
- ✅ Sui'nin resmi çözümü
- ✅ Ek backend gerekmez
- ✅ Gerçek zamanlı data

#### Seçenek 2: Event-Based Indexer

Contract zaten event'leri emit ediyor:

```bash
# Backend servis kurulumu
1. ProfileCreated event'lerini dinle
2. TagsUpdated event'lerini dinle
3. PostgreSQL/MongoDB'ye kaydet
4. Tag'lere göre arama API'si sun
```

**Örnek Event Listener:**
```typescript
// Backend servis
suiClient.subscribeEvent({
  filter: {
    Package: PACKAGE_ID,
  },
  onMessage: (event) => {
    if (event.type === 'ProfileCreated') {
      // Database'e kaydet
      db.profiles.insert({
        id: event.profile_id,
        tags: event.tags,
        // ...
      });
    }
  }
});
```

#### Seçenek 3: Global Tag Registry (Contract Değişikliği)

```move
// Merkezi tag takibi
public struct TagRegistry has key {
    id: UID,
    // tag -> profil listesi
    profiles_by_tag: Table<String, VecSet<address>>,
}

public entry fun update_tags(
    profile: &mut LinkTreeProfile, 
    registry: &mut TagRegistry,
    tags: vector<String>
) {
    // Eski tag'lerden kaldır
    // Yeni tag'lere ekle
    // ...
}
```

**Trade-offs:**
- ✅ Hızlı arama
- ❌ Gas maliyeti artar (her tag update registry'yi günceller)
- ❌ Merkezi bir nokta gerekir

## 🚀 Deployment Adımları

### Şimdi (Code Review İçin)

```bash
# Branch'i push et
git add .
git commit -m "feat: Add tag-based networking with event tracking"
git push origin muhsin

# GitHub'da PR aç
# Takım arkadaşı ile review yap
```

### Merge Sonrası (Birlikte)

```bash
# 1. Main branch'e merge et
git checkout main
git pull
git merge muhsin

# 2. Contract'ı publish et
cd packages/move
sui client publish --gas-budget 100000000

# 3. Yeni Package ID'yi kopyala ve .env'e ekle
# VITE_PACKAGE_ID=0x... (yeni ID)

# 4. Dashboard.tsx'teki temporary alert'i kaldır
# Line ~393: alert() satırını sil
# await updateTags(profileId, selectedTags); // bunu aç

# 5. Dev server'ı yeniden başlat
pnpm run dev
```

## 🎯 Test Senaryosu

1. **Tag Seçimi:**
   - Dashboard'a git
   - "Developer", "Blockchain", "Web3" tag'lerini seç
   - "Update Tags" butonuna bas
   - Contract publish edildiğinde blockchain'e kaydedilecek

2. **Benzer Profiller:**
   - Tag'leri güncelledikten sonra
   - "Recommended Profiles" kısmında benzer profiller görünür
   - Mock data (Alice & Bob) gösterilir
   - Production'da gerçek profiller görünecek

3. **Custom Tag:**
   - "Add custom tag" input'una "Hackathon" yaz
   - "Add" butonuna bas
   - Tag listesine eklenir

## 📝 Notlar

### Lint Warnings
Contract build edilirken 14 warning var ama **hepsi güvenli**:
- `duplicate_alias` - Default import'lar (normal)
- `unused_field` - LinkItem gelecekte kullanılacak
- `public_entry` - Frontend çağrısı için gerekli

### TypeScript Type Safety
UI'da bazı `any` type'lar var (Radix UI event handler'lar için), production'da düzeltilebilir.

### Gas Optimization
Tag update'i çok ucuz (~0.001 SUI), event emit de minimal gas kullanır.

## 🤝 İletişim

Sorular için:
- Contract: `packages/move/sources/profile.move`
- Frontend: `packages/ui/src/app/Dashboard.tsx`
- Queries: `packages/ui/src/sui/queries.ts`
- Transactions: `packages/ui/src/sui/tx.ts`

## 📊 Karşılaştırma

| Özellik | LinkedIn | MoveTree Tags |
|---------|----------|---------------|
| Tag Limit | ~50 skill | Sınırsız |
| Arama | Merkezi DB | Blockchain + Indexer |
| Gizlilik | Şirketin elinde | On-chain, şeffaf |
| Değiştirme | Anında | Transaction gerekir (~1-2 sn) |
| Maliyet | Ücretsiz | ~0.001 SUI per update |

---

**Branch:** `muhsin`  
**Status:** ✅ Ready for Review  
**Next:** Code review + Production indexer seçimi
