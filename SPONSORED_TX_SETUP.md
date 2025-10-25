# Sponsored Transaction Setup

Bu dokümantasyon MoveTree projesinde Enoki sponsored transaction akışının nasıl
kurulacağını açıklar.

## 🏗️ Mimari

```
Frontend (React) → Backend (Express) → Enoki API
     ↓                ↓                    ↓
PTB Build → Sponsor Request → Execute Transaction
```

## 🚀 Kurulum

### 1. Environment Variables

**Backend (.env):**

```bash
ENOKI_API_KEY=enoki_private_a1762bfab75c0b7b92a1d8ee87db61b2
ENOKI_NETWORK=testnet
PORT=8787
```

**Frontend (packages/ui/.env.local):**

```bash
VITE_PACKAGE_ID=0x9bf09f...f7e594c
VITE_SUI_NETWORK=testnet
```

### 2. Dependencies Install

```bash
# Root dependencies
pnpm install

# UI dependencies
cd packages/ui && pnpm install
```

### 3. Backend Server Start

```bash
# Terminal 1: Backend server
pnpm run dev:api
```

### 4. Frontend Development

```bash
# Terminal 2: Frontend dev server
pnpm run dev
```

## 🔄 Akış

### 1. Link Tıklama (Sponsored)

1. Kullanıcı link'e tıklar
2. Frontend PTB oluşturur (`onlyTransactionKind`)
3. Backend'e sponsor isteği gönderir
4. Backend Enoki API'ye sponsor isteği yapar
5. Frontend wallet ile imzalar
6. Backend imzayı Enoki'ye gönderir
7. Transaction execute edilir
8. Link açılır

### 2. Verified Links

1. Kullanıcı link'leri günceller
2. Frontend BCS serialize + SHA3-256 hash oluşturur
3. Move contract hash'i doğrular
4. Links güncellenir

## 🧪 Test

```bash
# Sponsor akışını test et
pnpm run test:sponsor

# Move contract test
pnpm run move:test
```

## 🔧 API Endpoints

### Backend Server (Port 8787)

- `POST /api/enoki/sponsor` - Sponsor request
- `POST /api/enoki/execute` - Execute sponsored transaction
- `GET /api/health` - Health check

### Request/Response Examples

**Sponsor Request:**

```json
{
  "kindBytesBase64": "base64_encoded_bytes",
  "sender": "0x123...",
  "allowedMoveCallTargets": ["0x9bf09f...f7e594c::profile::view_link"]
}
```

**Sponsor Response:**

```json
{
  "bytesBase64": "base64_encoded_tx_bytes",
  "digest": "transaction_digest"
}
```

## 🛡️ Güvenlik

- **PRIVATE KEY sadece backend'te**: Frontend'te Enoki private key tutulmaz
- **Allowed Move Call Targets**: Sadece izinli fonksiyonlar çağrılabilir
- **onlyTransactionKind**: PTB'nin sadece transaction kind kısmı gönderilir

## 🐛 Troubleshooting

### "Invalid hook call" hatası

```bash
# React versiyonlarını kontrol et
pnpm list react
# Tek React kopyası olduğundan emin ol
```

### Backend connection hatası

```bash
# Backend server'ın çalıştığını kontrol et
curl http://localhost:8787/api/health
```

### Enoki API hatası

```bash
# API key'in doğru olduğunu kontrol et
echo $ENOKI_API_KEY
```

## 📚 Kaynaklar

- [Enoki Documentation](https://docs.enoki.mystenlabs.com/)
- [Sui Move Documentation](https://docs.sui.io/build/move)
- [dApp Kit Documentation](https://sdk.mystenlabs.com/dapp-kit)
