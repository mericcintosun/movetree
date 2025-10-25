# 🧪 Lokal Test Rehberi

## Adım 1: Contract'ı Test Et

```bash
# Move contract test (unit tests varsa)
cd packages/move
sui move test

# Contract build
sui move build
```

**Beklenen:** ✅ Build başarılı (warnings normal)

---

## Adım 2: Frontend Dev Server'ı Başlat

```bash
# Root dizinde
cd /home/muhsin/Desktop/movetree
pnpm run dev
```

**Beklenen:** 
- UI: http://localhost:5173
- Port zaten kullanılıyorsa farklı port önerir

---

## Adım 3: Wallet Bağla

1. Tarayıcıda http://localhost:5173 aç
2. Sui Wallet extension'ını aç
3. "Connect Wallet" butonuna tık
4. Wallet'ı onayla
5. **Önemli:** Testnet'te olduğundan emin ol

---

## Adım 4: Profil Oluştur

### İlk Profil Yoksa:

```
Dashboard'da:
1. Name: "Test User"
2. Avatar CID: "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi" (örnek)
3. Bio: "Testing tag feature"
4. Theme: "dark"
5. "Create Profile" butonuna tık
```

**Beklenen:** 
- Sui wallet popup açılır
- Transaction approve et
- ~2-3 saniye sonra profil oluşur

---

## Adım 5: Tag Seçimi (ŞU AN MOCK MODE)

### Tag'leri Seç:
```
Dashboard'da "Interest Tags" bölümünde:
1. Quick select'ten tıkla: "Developer", "Blockchain", "Web3"
2. Veya custom tag ekle: "Hackathon" yazıp "Add"
3. "Update Tags" butonuna tık
```

**ŞU AN NE OLACAK:**
```javascript
⚠️ Alert göreceksin:
"Tag feature is ready! Please re-publish the Move contract..."

Çünkü:
- Contract henüz publish edilmemiş (local build var sadece)
- Blockchain'de henüz update_tags fonksiyonu yok
```

---

## Adım 6: Benzer Profiller (Mock Data)

### Tag seçtikten sonra:
```
Dashboard'ın altında "Recommended Profiles" bölümü görünecek:
- Alice (Demo) - 2 matching tags
- Bob (Demo) - 1 matching tag
```

**Bu Mock Data Çünkü:**
- Sui RPC API tüm profilleri getiremiyor
- Production'da Sui GraphQL veya indexer gerekli
- Console'da warning mesajı var

---

## 🔍 Console'u Kontrol Et

Tarayıcıda F12 → Console:

```javascript
⚠️ PRODUCTION NOTICE:
To query all profiles by tags, you need:

Option 1: Sui GraphQL (Recommended)
- Install: npm install @mysten/sui.js
- Use GraphQL client...

Option 2: Custom Indexer
- Set up a backend service...

Option 3: Event-based Discovery
- Emit events when profiles are created...

Current: Using mock data for demo purposes
```

---

## 🎯 Ne Test Edilebilir Şu An?

### ✅ ÇALIŞAN (Local):
1. ✅ Tag UI - selection/deselection
2. ✅ Custom tag ekleme
3. ✅ Tag listesi gösterimi
4. ✅ Mock similar profiles
5. ✅ Profil oluşturma (mevcut özellik)
6. ✅ Link ekleme (mevcut özellik)

### ❌ ÇALIŞMAYAN (Contract publish gerekli):
1. ❌ Tag'leri blockchain'e kaydetme
2. ❌ Tag'leri profile object'te saklama
3. ❌ Gerçek similar profile araması

---

## 🚀 Production Test İçin

### Contract Publish Et:

```bash
# 1. Testnet'e publish
cd packages/move
sui client publish --gas-budget 100000000

# 2. Package ID'yi kopyala
# Output: Published Objects:
# └── PackageID: 0x...123

# 3. .env dosyasına ekle
cd ../ui
echo "VITE_PACKAGE_ID=0x...123" > .env

# 4. Dashboard.tsx'i güncelle (alert satırını kaldır)
# Line 393: Alert satırını comment out
# Line 394: await updateTags(...) satırını uncomment

# 5. Dev server'ı restart et
pnpm run dev
```

### Şimdi Test Et:
```
1. Tag seç → "Update Tags" 
2. Wallet popup → Approve
3. Transaction success
4. Tags blockchain'de saklanır ✅
```

---

## 🐛 Troubleshooting

### "Insufficient gas"
```bash
# Testnet faucet'ten SUI al
sui client faucet
```

### "Network error"
```bash
# Wallet'ın network'ünü kontrol et
# Testnet olmalı
```

### "Package not found"
```bash
# .env dosyasını kontrol et
cat packages/ui/.env
# VITE_PACKAGE_ID=0x... olmalı
```

### "Transaction failed"
```bash
# Gas budget'i artır
# veya
# Wallet'ta yeterli SUI var mı kontrol et
```

---

## 📊 Test Checklist

Lokal test için:
- [ ] Contract build başarılı
- [ ] Dev server çalışıyor
- [ ] Wallet bağlandı (testnet)
- [ ] Profil oluşturuldu
- [ ] Tag UI göründü
- [ ] Tag seçimi çalıştı
- [ ] Mock profiller göründü
- [ ] Console warning'leri okudum

Production test için (publish sonrası):
- [ ] Contract publish edildi
- [ ] .env güncellendi
- [ ] Alert kaldırıldı
- [ ] Tag update transaction başarılı
- [ ] Tags blockchain'de saklanıyor
- [ ] Indexer kurulumu (opsiyonel)

---

## 💡 Pro Tips

1. **Console'u Aç:** F12 → Console (tüm debug mesajları orada)
2. **Network Tab:** Transaction'ları görmek için
3. **Sui Explorer:** Transaction hash'i ile kontrol et
4. **React DevTools:** Component state'leri görmek için

---

## 📝 Notlar

### Mock Data Neden Var?
```typescript
// packages/ui/src/sui/queries.ts:91
const mockProfiles = [
  { name: "Alice (Demo)", tags: [...] },
  { name: "Bob (Demo)", tags: [...] }
];
```

Bu mock data sayesinde:
- ✅ UI flow'u test edilebilir
- ✅ Tag matching algoritması çalışır
- ✅ Frontend logic doğrulanır
- ❌ Gerçek blockchain verileri yok (henüz)

### Production'a Geçiş
1. Contract publish et
2. Indexer kur (Sui GraphQL veya custom)
3. Mock data'yı kaldır
4. Gerçek query logic'i ekle

---

**Current Status:** 🟡 Mock Mode (UI test edilebilir)  
**Next Step:** 🟢 Contract Publish (Blockchain test için)  
**Final Step:** 🔵 Indexer Setup (Production için)
