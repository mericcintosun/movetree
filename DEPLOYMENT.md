# 🚀 MoveTree Production Deployment

## 📋 Deployment Checklist

- [ ] Backend (Railway)
- [ ] Frontend (Vercel)
- [ ] Enoki SUI Balance
- [ ] Test Production

---

## 1️⃣ BACKEND DEPLOYMENT (Railway)

### Step 1: Railway Hesabı Oluşturun
1. https://railway.app/ → GitHub ile giriş yapın
2. "New Project" → "Deploy from GitHub repo"
3. Repository: `mericcintosun/movetree`
4. **ÖNEMLİ:** Root Directory olarak `packages/api` seçin

### Step 2: Environment Variables Ekleyin
Railway dashboard → Variables sekmesinde:

```bash
ENOKI_PRIVATE_KEY=enoki_private_a1762bfab75c0b7b92a1d8ee87db61b2
ENOKI_NETWORK=testnet
PORT=3001
NODE_ENV=production
```

### Step 3: Deploy
- Railway otomatik deploy edecek (2-3 dakika)
- Deploy tamamlandığında URL alacaksınız:
  - Örnek: `https://movetree-api.up.railway.app`
- ⚠️ **Bu URL'i not alın, frontend'de kullanacaksınız!**

### Step 4: Test Backend
```bash
curl https://YOUR-RAILWAY-URL.up.railway.app/health
```

Beklenen response:
```json
{"status":"ok","timestamp":"2025-10-26T..."}
```

---

## 2️⃣ FRONTEND DEPLOYMENT (Vercel)

### Step 1: Vercel Hesabı
1. https://vercel.com/ → GitHub ile giriş yapın
2. "Add New" → "Project"
3. Repository: `mericcintosun/movetree`
4. Root Directory: `packages/ui`
5. Framework Preset: **Vite**

### Step 2: Build Settings (Otomatik ayarlanacak)
```
Build Command: pnpm build
Output Directory: dist
Install Command: pnpm install
```

### Step 3: Environment Variables
Vercel dashboard → Settings → Environment Variables:

```bash
VITE_PACKAGE_ID=0xbc3daaf8d67a2dc61c0dd15f4b66634d522693661f6f465654a7538fb386ed83
VITE_ENOKI_PUBLIC_KEY=enoki_public_67cbde70ba0a0a238f086a9afc8b14bf
VITE_ENOKI_NETWORK=testnet
VITE_BACKEND_URL=https://YOUR-RAILWAY-URL.up.railway.app
VITE_FIREBASE_API_KEY=AIzaSyCxdpCrngxNDjr-m98eA9fanwORJMp18aQ
VITE_FIREBASE_AUTH_DOMAIN=movetree-firestor.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=movetree-firestor
VITE_FIREBASE_STORAGE_BUCKET=movetree-firestor.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=803935135473
VITE_FIREBASE_APP_ID=1:803935135473:web:62eb94dd377b714b642b50
VITE_GOOGLE_CLIENT_ID=453473344189-dq28epkd2qdpumsl963fr6i5vcgqe9m4.apps.googleusercontent.com
```

⚠️ **KRITIK:** `VITE_BACKEND_URL` değerini Railway'den aldığınız gerçek URL ile değiştirin!

### Step 4: Deploy
- "Deploy" butonuna tıklayın
- 3-5 dakika bekleyin
- Vercel size URL verecek: `https://movetree-xxxxx.vercel.app`

---

## 3️⃣ ENOKI SUI BALANCE EKLEME

### Otomatik Yöntem (Önerilen)
Enoki testnet'te otomatik sponsorship sağlar, ekstra SUI eklemenize gerek olmayabilir.

### Manuel Yöntem (Gerekirse)
1. https://portal.enoki.mystenlabs.com/ adresine gidin
2. API Key ile giriş yapın: `enoki_private_a1762bfab75c0b7b92a1d8ee87db61b2`
3. "Sponsorship" → "Add Funds" sekmesine gidin
4. Testnet için faucet kullanın veya balance kontrol edin

---

## 4️⃣ PRODUCTION TEST

### Test 1: Backend Health Check
```bash
curl https://YOUR-RAILWAY-URL.up.railway.app/health
```

✅ Başarılı: `{"status":"ok"}`
❌ Hata: Railway logs kontrol edin

### Test 2: Frontend Yüklenme
1. Vercel URL'inizi tarayıcıda açın
2. Sayfa yüklenmeli
3. Console'da hata olmamalı (F12)

### Test 3: Wallet Bağlama
1. "Connect Wallet" tıklayın
2. Google ile giriş yapın
3. zkLogin çalışmalı

### Test 4: Profil Oluşturma (GAS TEST!)
1. "Create Profile" tıklayın
2. Bilgileri doldurun
3. Transaction sponsor edilmeli
4. ✅ Başarılı: Profil oluşturuldu
5. ❌ Hata: "No gas coins" → Enoki balance kontrol edin

---

## 5️⃣ CUSTOM DOMAIN (Opsiyonel)

### Frontend Domain (Vercel)
1. Vercel dashboard → Settings → Domains
2. Add domain: `movetree.com` (sizin domain'iniz)
3. DNS kayıtlarını güncelleyin:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21 (Vercel IP)
   ```

### Backend Domain (Railway)
1. Railway dashboard → Settings → Custom Domain
2. Add domain: `api.movetree.com`
3. DNS kayıtlarını güncelleyin (Railway gösterecek)

---

## 🔧 Troubleshooting

### "Failed to fetch" hatası
**Sebep:** Frontend backend'e bağlanamıyor
**Çözüm:**
1. `VITE_BACKEND_URL` doğru Railway URL'i mi kontrol edin
2. Railway backend çalışıyor mu? → Health check yapın
3. CORS hatası var mı? → Backend logs kontrol edin

### "No valid gas coins" hatası
**Sebep:** Enoki sponsorship çalışmıyor
**Çözüm:**
1. Enoki portal'da balance kontrol edin
2. API key doğru mu kontrol edin
3. Backend logs'da Enoki hataları var mı bakın

### Build hatası (Vercel)
**Sebep:** Dependencies veya environment variables eksik
**Çözüm:**
1. Vercel logs kontrol edin
2. Tüm `VITE_*` environment variables eklenmiş mi?
3. Build command doğru mu? (`pnpm build`)

### Transaction imzalanamıyor
**Sebep:** zkLogin veya Enoki konfigürasyonu hatalı
**Çözüm:**
1. `VITE_ENOKI_PUBLIC_KEY` doğru mu?
2. `VITE_GOOGLE_CLIENT_ID` doğru mu?
3. Google OAuth redirect URL'leri Vercel domain'ini içeriyor mu?

---

## 💰 Maliyet

| Servis   | Plan      | Aylık Maliyet |
|----------|-----------|---------------|
| Vercel   | Hobby     | $0 (Ücretsiz) |
| Railway  | Hobby     | $5 (500 saat) |
| Firebase | Spark     | $0 (Düşük trafik için) |
| Enoki    | Testnet   | $0 (Mainnet için pricing kontrol) |

**Toplam:** ~$5/ay (test aşaması için)

---

## 📊 Monitoring

### Railway Logs
```bash
# Railway CLI kurulumu
npm i -g @railway/cli
railway login
railway logs
```

### Vercel Logs
Vercel dashboard → Deployments → Logs

### Error Tracking (Gelecek için)
- Sentry eklenebilir
- LogRocket eklenebilir
- Google Analytics eklenebilir

---

## 🎉 Deployment Tamamlandığında

1. ✅ Backend URL: `https://movetree-api.up.railway.app`
2. ✅ Frontend URL: `https://movetree.vercel.app`
3. ✅ Profil oluşturma çalışıyor
4. ✅ Link ekleme çalışıyor
5. ✅ Analytics kaydediliyor

### Next Steps
- [ ] Custom domain ekleyin
- [ ] Google Analytics ekleyin
- [ ] SEO optimize edin (meta tags)
- [ ] Social media preview kartları ekleyin
- [ ] Mainnet'e geçmeyi planlayın

---

## 🚨 Acil Durum

### Backend crash olursa
Railway otomatik restart eder (railway.toml'da ayarlandı)

### Frontend build fail olursa
Vercel önceki başarılı deployment'ı yayında tutar

### Enoki balance biterse
Users kendi gas'larını ödemeleri gerekir (wallet'larından)

---

## 📞 Destek Linkleri

- Railway Docs: https://docs.railway.app/
- Vercel Docs: https://vercel.com/docs
- Enoki Docs: https://docs.enoki.mystenlabs.com/
- Sui Docs: https://docs.sui.io/

---

**Son Güncelleme:** 26 Ekim 2025
**Deployment Time:** ~15-20 dakika
**Zorluk:** ⭐⭐⭐☆☆ (Orta)
