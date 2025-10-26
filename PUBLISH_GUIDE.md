# 🚀 Contract Publish Rehberi

## Adım Adım Setup

### 1. Sui Client'ı Başlat

```bash
cd /home/muhsin/Desktop/movetree/packages/move
sui client
```

### 2. Sorulara Cevaplar (DOĞRU SIRA):

**Soru 1:**
```
Do you want to connect to a Sui Full node server [y/N]?
```
👉 Cevap: **y** (enter)

---

**Soru 2:**
```
Sui Full node server URL (Defaults to Sui Testnet if not specified) :
```
👉 Cevap: **BOŞ BIRAK, sadece enter** (testnet kullanacak)

---

**Soru 3:**
```
Environment alias for [https://fullnode.testnet.sui.io:443] :
```
👉 Cevap: **testnet** (enter)

---

**Soru 4:** ⚠️ BURADA YANLIŞ YAPTIK
```
Select key scheme to generate keypair (0 for ed25519, 1 for secp256k1, 2: for secp256r1):
```
👉 Cevap: **0** (sıfır rakamı, sonra enter)

---

### 3. Çıktı

Başarılı olursa göreceksin:

```
Generated new keypair and alias for address with scheme "ed25519" [...]
Secret Recovery Phrase : [12 kelime]
```

**ÖNEMLİ:** Bu 12 kelimeyi bir yere kaydet! Wallet'ını kurtarmak için gerekli.

---

### 4. Testnet Token Al

```bash
sui client faucet
```

Çıktı:
```
Request successful. It can take up to 1 minute to get the coin. Run sui client gas to check your gas coins.
```

30 saniye bekle, sonra:

```bash
sui client gas
```

Göreceksin:
```
╭─────────────────────────────────────────────────────────────────────────────────╮
│ gasCoinId                  │ gasBalance │
├─────────────────────────────────────────────────────────────────────────────────┤
│ 0x123...                   │ 1000000000 │ (1 SUI)
╰─────────────────────────────────────────────────────────────────────────────────╯
```

---

### 5. Contract'ı Publish Et

```bash
sui client publish --gas-budget 100000000
```

**Çıktı (önemli kısımlar):**

```
INCLUDING DEPENDENCY Sui
INCLUDING DEPENDENCY MoveStdlib
BUILDING LinkTreeProfile
Successfully verified dependencies on-chain against source.
Transaction Digest: 0xabc...
╭──────────────────────────────────────────────────────────────────────╮
│ Object Changes                                                       │
├──────────────────────────────────────────────────────────────────────┤
│ Published Objects:                                                   │
│  ┌──                                                                 │
│  │ PackageID: 0x1234567890abcdef...  👈 BU ÖNEMLİ!                  │
│  │ Version: 1                                                        │
│  └──                                                                 │
╰──────────────────────────────────────────────────────────────────────╯
```

**Package ID'yi kopyala!** (0x ile başlayan)

---

### 6. Frontend'i Güncelle

```bash
cd /home/muhsin/Desktop/movetree/packages/ui

# .env dosyası oluştur (PackageID'yi yapıştır)
echo "VITE_PACKAGE_ID=0x1234567890abcdef..." > .env
```

Kontrol et:
```bash
cat .env
```

Görmeli:
```
VITE_PACKAGE_ID=0x1234567890abcdef...
```

---

### 7. Dashboard Alert'i Kaldır

Dosya: `packages/ui/src/app/Dashboard.tsx`

**Satır ~168-172 civarı:**

```typescript
// ÖNCESİ:
const handleUpdateTags = async (profileId: string) => {
  setIsLoading(true);
  try {
    // TODO: Contract needs to be re-published with update_tags function
    alert("⚠️ Tag feature is ready! Please re-publish the Move contract...");
    console.log("Tags to update:", selectedTags);
    // await updateTags(profileId, selectedTags);
    // await refetch();
  } catch (error) {

// SONRASI:
const handleUpdateTags = async (profileId: string) => {
  setIsLoading(true);
  try {
    await updateTags(profileId, selectedTags);
    await refetch();
  } catch (error) {
```

**Yani:**
1. ❌ Alert satırını SİL
2. ❌ console.log satırını SİL  
3. ✅ await updateTags... satırını UNCOMMENT
4. ✅ await refetch(); satırını UNCOMMENT

---

### 8. Dev Server'ı Restart Et

```bash
cd /home/muhsin/Desktop/movetree
pnpm run dev
```

---

### 9. Test Et! 🎉

Tarayıcıda http://localhost:5173:

1. ✅ Wallet bağla (testnet)
2. ✅ Tag seç (Developer, Blockchain, Web3)
3. ✅ "Update Tags" butonuna tık
4. ✅ Wallet popup → Approve
5. ✅ **Success!** Tags blockchain'e kaydedildi

---

## ⚠️ Sık Karşılaşılan Hatalar

### "Invalid key scheme"
- ❌ Yanlış: "testnet" yazdın
- ✅ Doğru: **0** (sıfır) yaz

### "Insufficient gas"
```bash
sui client faucet
# 30 saniye bekle
sui client gas
```

### "Package not found" (frontend'de)
```bash
# .env dosyasını kontrol et
cat packages/ui/.env

# Yoksa oluştur
echo "VITE_PACKAGE_ID=0x..." > packages/ui/.env
```

### "Transaction failed: Object not found"
- Wallet'ın testnet'te olduğundan emin ol
- Contract'ı testnet'e publish ettin mi?

---

## 📝 Quick Reference

```bash
# Setup (bir kez)
sui client
# y → enter → testnet → 0

# Token al
sui client faucet

# Publish
sui client publish --gas-budget 100000000

# .env oluştur
echo "VITE_PACKAGE_ID=0x..." > packages/ui/.env

# Test
pnpm run dev
```

---

**İlk Denemede Hata Yaptıysan:**

Sui client zaten kuruldu mu kontrol et:
```bash
cat ~/.sui/sui_config/client.yaml
```

Varsa tekrar publish edebilirsin:
```bash
sui client publish --gas-budget 100000000
```

Yoksa `sui client` komutunu tekrar çalıştır, bu sefer doğru cevapları ver!

---

Şimdi **sui client** komutunu tekrar çalıştır, doğru sırayla:
1. **y**
2. **enter** (boş)
3. **testnet**
4. **0** (sıfır!)

Hazır mısın? 🚀
