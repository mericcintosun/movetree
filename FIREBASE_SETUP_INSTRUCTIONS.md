# Firebase Kurulum Talimatları

## 1. Firebase Projesi Oluşturma

1. [Firebase Console](https://console.firebase.google.com/)'a gidin
2. "Add project" butonuna tıklayın
3. Proje adını girin (örn: `movetree-hackathon`)
4. Google Analytics'i etkinleştirin (opsiyonel)
5. "Create project" butonuna tıklayın

## 2. Firestore Database Kurulumu

1. Firebase Console'da projenizi seçin
2. Sol menüden "Firestore Database" seçin
3. "Create database" butonuna tıklayın
4. "Start in test mode" seçin (güvenlik için daha sonra rules güncellenecek)
5. Lokasyon seçin (örn: `us-central1`)

## 3. Web App Yapılandırması

1. Firebase Console'da proje ayarlarına gidin (⚙️ Project settings)
2. "Your apps" sekmesinde "</>" (Web) simgesine tıklayın
3. App nickname girin (örn: `movetree-web`)
4. "Register app" butonuna tıklayın
5. Yapılandırma kodunu kopyalayın

## 4. Environment Variables Ayarlama

`packages/ui/.env.local` dosyası oluşturun:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# Sui Network Configuration
VITE_SUI_NETWORK=testnet
```

## 5. Firestore Rules Ayarlama

Firebase Console > Firestore Database > Rules sekmesinde:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Analytics collection - allow read/write for all (test mode)
    match /analytics/{document} {
      allow read, write: if true;
    }
    
    // Test collection - allow read/write for all (test mode)
    match /test/{document} {
      allow read, write: if true;
    }
  }
}
```

## 6. Test Etme

1. Uygulamayı çalıştırın: `npm run dev`
2. "Firebase Test" sekmesine gidin
3. "Test Firebase" butonuna tıklayın
4. Başarılı mesajı görmelisiniz

## 7. Güvenlik (Production için)

Test modundan çıkmak için Firestore rules'u güncelleyin:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /analytics/{profileId} {
      allow read: if true; // Herkes okuyabilir
      allow write: if request.auth != null; // Sadece giriş yapmış kullanıcılar yazabilir
    }
  }
}
```

## Sorun Giderme

### "your-project-id" Hatası
- Environment variables'ların doğru ayarlandığından emin olun
- `.env.local` dosyasının `packages/ui/` klasöründe olduğunu kontrol edin

### 400 Bad Request Hatası
- Firebase projesinin doğru oluşturulduğunu kontrol edin
- Firestore Database'in aktif olduğunu kontrol edin
- API key'in doğru olduğunu kontrol edin

### Link Tıklama Sorunu
- Linkler artık Firebase hatası olsa bile açılacak şekilde düzenlendi
- Console'da hata mesajlarını kontrol edin
- Firebase Test sayfasını kullanarak bağlantıyı test edin
