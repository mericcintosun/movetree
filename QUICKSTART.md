## 🚀 HIZLI DEPLOYMENT KILAVUZU

### ⏱️ Tahmini Süre: 15 dakika

---

## 📝 ÖNKOŞUl: GitHub'a Push

Önce tüm değişiklikleri GitHub'a push edin:

```bash
git add .
git commit -m "feat: production deployment config"
git push origin UI
```

---

## 1️⃣ BACKEND (Railway) - 5 dakika

### Adımlar:
1. https://railway.app/ → Sign in with GitHub
2. **New Project** → **Deploy from GitHub repo**
3. Repository seç: `mericcintosun/movetree`
4. ⚠️ **Root Directory:** `packages/api` (MUTLAKA AYARLA!)
5. **Variables** sekmesine şunları ekle:

```
ENOKI_PRIVATE_KEY=enoki_private_a1762bfab75c0b7b92a1d8ee87db61b2
ENOKI_NETWORK=testnet
PORT=3001
NODE_ENV=production
```

6. Deploy'u bekle (2-3 dakika)
7. ✅ URL'i kopyala: `https://movetree-api-xxxxx.up.railway.app`

### Test:
```bash
curl https://YOUR-RAILWAY-URL/health
```
Sonuç: `{"status":"ok"}`

---

## 2️⃣ FRONTEND (Vercel) - 10 dakika

### Adımlar:
1. https://vercel.com/ → Sign in with GitHub
2. **Add New** → **Project**
3. Import: `mericcintosun/movetree`
4. **Root Directory:** `packages/ui`
5. **Framework Preset:** Vite (otomatik seçilecek)
6. **Environment Variables** (hepsini ekle):

```bash
VITE_PACKAGE_ID=0xbc3daaf8d67a2dc61c0dd15f4b66634d522693661f6f465654a7538fb386ed83
VITE_ENOKI_PUBLIC_KEY=enoki_public_67cbde70ba0a0a238f086a9afc8b14bf
VITE_ENOKI_NETWORK=testnet
VITE_BACKEND_URL=https://YOUR-RAILWAY-URL-BURAYA
VITE_FIREBASE_API_KEY=AIzaSyCxdpCrngxNDjr-m98eA9fanwORJMp18aQ
VITE_FIREBASE_AUTH_DOMAIN=movetree-firestor.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=movetree-firestor
VITE_FIREBASE_STORAGE_BUCKET=movetree-firestor.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=803935135473
VITE_FIREBASE_APP_ID=1:803935135473:web:62eb94dd377b714b642b50
VITE_GOOGLE_CLIENT_ID=453473344189-dq28epkd2qdpumsl963fr6i5vcgqe9m4.apps.googleusercontent.com
```

⚠️ **ÖNEMLİ:** `VITE_BACKEND_URL` değerini Railway'den aldığınız URL ile değiştirin!

7. **Deploy** butonuna tıkla
8. 3-5 dakika bekle
9. ✅ URL'i aç: `https://movetree-xxxxx.vercel.app`

---

## 3️⃣ TEST - 2 dakika

### ✅ Backend Test:
```bash
curl https://YOUR-RAILWAY-URL/health
```

### ✅ Frontend Test:
1. Vercel URL'ini tarayıcıda aç
2. Google ile giriş yap
3. Profil oluştur
4. Link ekle

### ❌ Hata Alırsanız:

**"Failed to fetch":**
- `VITE_BACKEND_URL` doğru Railway URL'i mi kontrol edin
- Railway backend çalışıyor mu? (health check)

**"No gas coins":**
- Enoki portal: https://portal.enoki.mystenlabs.com/
- Balance kontrol edin

---

## 🎉 TAMAMLANDI!

✅ Backend: Railway'de live
✅ Frontend: Vercel'de live
✅ Production ready!

### Linkler:
- **Frontend:** https://movetree-xxxxx.vercel.app
- **Backend:** https://movetree-api-xxxxx.up.railway.app
- **Smart Contract:** 0xbc3daaf8d67a2dc61c0dd15f4b66634d522693661f6f465654a7538fb386ed83

### Next Steps:
- [ ] Custom domain ekle
- [ ] Google Analytics ekle
- [ ] Error monitoring (Sentry)
- [ ] Mainnet'e geç

---

## 💡 PRO TİPS:

1. **Otomatik Deploy:** Her `git push` sonrası otomatik deploy olacak
2. **Vercel Preview:** Her PR için önizleme URL'i oluşur
3. **Railway Logs:** `railway logs` komutu ile hata takibi
4. **Maliyet:** İlk ay $0-5 arası (çoğu ücretsiz)

---

Sorularınız için: Vercel ve Railway dashboard'larında detaylı logs var!
