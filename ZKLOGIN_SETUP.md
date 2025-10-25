# zkLogin + Sponsored Transaction Setup

Bu dokümantasyon MoveTree projesinde zkLogin + sponsored transaction akışının nasıl kurulacağını açıklar.

## 🔑 Anahtar Yönetimi

### Hangi Anahtar Nereden?

1. **Google OAuth Client ID** → Google Cloud Console'da "Web application" OAuth client oluştur
2. **Enoki Public API Key** → Enoki Portal > Apps > API keys (frontend'te kullanılır)
3. **Enoki Private API Key** → Enoki Portal > Apps > API keys (backend'te "Sponsored Transactions" için kullanılır)

## 🏗️ Mimari

```
Frontend (React + zkLogin) → Backend (Express + Enoki) → Sui Blockchain
     ↓                           ↓                           ↓
Google OAuth → Enoki Connect → Sponsored TX → View Receipt
```

## 🚀 Kurulum

### 1. Environment Variables

**Frontend (packages/ui/.env.local):**
```bash
VITE_PACKAGE_ID=0x9bf09f...f7e594c
VITE_SUI_NETWORK=testnet
VITE_ENOKI_PUBLIC_KEY=enoki_public_...  # Enoki Public API Key
VITE_GOOGLE_CLIENT_ID=123456789-abcdef...  # Google OAuth Web Client ID
VITE_BACKEND_URL=http://localhost:3001
VITE_ENOKI_NETWORK=testnet
```

**Backend (packages/api/.env):**
```bash
ENOKI_PRIVATE_KEY=enoki_private_...  # Enoki Private API Key
PORT=3001
ENOKI_NETWORK=testnet
```

### 2. Dependencies Install

```bash
# Root dependencies
pnpm install

# API dependencies
cd packages/api && pnpm install

# UI dependencies  
cd packages/ui && pnpm install
```

### 3. Backend Server Start

```bash
# Terminal 1: Backend server
pnpm run api:dev
```

### 4. Frontend Development

```bash
# Terminal 2: Frontend dev server
pnpm run dev
```

## 🔄 Akış

### 1. zkLogin Giriş
1. Kullanıcı "Continue with Google" butonuna tıklar
2. Google OAuth popup açılır
3. Kullanıcı Google hesabıyla giriş yapar
4. Enoki Connect zkLogin proof oluşturur
5. Kullanıcı otomatik olarak giriş yapar

### 2. Link Tıklama (Sponsored)
1. Kullanıcı link'e tıklar
2. Frontend PTB oluşturur
3. Backend'e sponsor isteği gönderir
4. Backend Enoki API ile sponsor eder
5. Transaction execute edilir
6. Link açılır

## 🧪 Test

```bash
# Backend health check
curl http://localhost:3001/health

# Frontend test
# 1. "Continue with Google" butonuna tıkla
# 2. Google ile giriş yap
# 3. Profil sayfasında link'e tıkla
# 4. Backend log'unda sponsor-execute çağrısını gör
```

## 🔧 API Endpoints

### Backend Server (Port 3001)

- `POST /sponsor/execute` - Sponsor + execute transaction
- `GET /health` - Health check

### Request/Response Examples

**Sponsor Execute Request:**
```json
{
  "txBytesBase64": "base64_encoded_ptb"
}
```

**Sponsor Execute Response:**
```json
{
  "digest": "transaction_digest",
  "effects": { ... },
  "events": [ ... ]
}
```

## 🛡️ Güvenlik

- **PRIVATE KEY sadece backend'te**: Frontend'te Enoki private key tutulmaz
- **Google OAuth**: Sadece Google ile giriş yapılabilir
- **zkLogin**: Kullanıcı cüzdan gerektirmez
- **Sponsored Transactions**: Gas fee kullanıcıya yansımaz

## 🐛 Troubleshooting

### "Invalid hook call" hatası
```bash
# React versiyonlarını kontrol et
pnpm list react
# Tek React kopyası olduğundan emin ol
```

### Google OAuth hatası
```bash
# Google Cloud Console'da OAuth client'ın doğru domain'de olduğunu kontrol et
# localhost:5173 için authorized origins ekle
```

### Enoki API hatası
```bash
# API key'lerin doğru olduğunu kontrol et
echo $VITE_ENOKI_PUBLIC_KEY  # Frontend
echo $ENOKI_PRIVATE_KEY      # Backend
```

### Backend connection hatası
```bash
# Backend server'ın çalıştığını kontrol et
curl http://localhost:3001/health
```

## 📚 Kaynaklar

- [Enoki Documentation](https://docs.enoki.mystenlabs.com/)
- [Google OAuth Setup](https://developers.google.com/identity/oauth2/web/guides/get-google-api-clientid)
- [Sui zkLogin Documentation](https://docs.sui.io/concepts/cryptography/zklogin)
- [dApp Kit Documentation](https://sdk.mystenlabs.com/dapp-kit)
