# 🔥 Firebase Setup Guide

MoveTree uses Firebase Firestore as a cache layer for analytics data. This allows instant UX without blockchain delays, while syncing to blockchain every 2 days.

## 📋 Benefits

- **Instant Analytics**: View counts and link clicks update immediately
- **Cost Efficient**: Reduces blockchain transactions by 99%
- **Better UX**: No wallet approvals for view tracking
- **Reliable Sync**: Auto-sync to blockchain every 2 days

## 🚀 Setup Instructions

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Name it "movetree" (or your choice)
4. Disable Google Analytics (optional)
5. Click "Create Project"

### 2. Enable Firestore

1. In Firebase Console, click "Firestore Database"
2. Click "Create Database"
3. Choose "Start in test mode" (for development)
4. Select a region (choose closest to your users)
5. Click "Enable"

### 3. Get Configuration

1. In Project Settings (gear icon) → General
2. Scroll to "Your apps"
3. Click the web icon (`</>`)
4. Register app with nickname "movetree-ui"
5. Copy the `firebaseConfig` object

### 4. Update Environment Variables

Edit `packages/ui/.env`:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=movetree-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=movetree-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=movetree-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### 5. Set Firestore Rules

In Firestore → Rules, paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Analytics collection
    match /analytics/{profileId} {
      // Anyone can read analytics
      allow read: if true;
      
      // Anyone can increment views/clicks (for public profiles)
      allow create, update: if true;
      
      // Only allow delete for now (can restrict later)
      allow delete: if true;
    }
  }
}
```

**⚠️ For Production**: Add authentication rules to prevent abuse

### 6. Test Connection

Restart dev server:

```bash
cd /home/muhsin/Desktop/movetree
pnpm run dev
```

Check browser console for:
- ✅ "Firebase initialized successfully"
- ❌ Any Firebase connection errors

## 📊 Data Structure

### Analytics Document

```typescript
{
  profileId: string;          // Sui object ID
  profileViews: number;        // Total view count
  linkClicks: number[];        // [link0_clicks, link1_clicks, ...]
  links: string[];             // Current links (for reference)
  lastSyncedToBlockchain: Timestamp | null;
  lastUpdated: Timestamp;
  needsBlockchainSync: boolean;
}
```

## 🔄 Sync Logic

### Auto-Sync (Every 2 Days)

```typescript
// Checks every hour
if (Date.now() - lastSync > 2_DAYS) {
  syncToBlockchain();
}
```

### Manual Sync

Dashboard has "Force Sync Now" button to sync immediately.

## 🎯 How It Works

1. **User visits public profile**:
   - Frontend calls `incrementProfileView(profileId)`
   - Firebase updates immediately
   - No blockchain transaction needed

2. **User clicks a link**:
   - Frontend calls `incrementLinkClick(profileId, linkIndex)`
   - Firebase updates immediately
   - Link opens without delay

3. **Every 2 days**:
   - Background job checks `needsBlockchainSync`
   - Batches all analytics updates
   - Writes to Sui blockchain
   - Marks as synced in Firebase

4. **Profile owner dashboard**:
   - Shows real-time analytics from Firebase
   - Displays sync status
   - Can force sync manually

## 🛡️ Security Best Practices

### Production Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /analytics/{profileId} {
      allow read: if true;
      
      allow create: if request.resource.data.profileViews == 0
                   && request.resource.data.needsBlockchainSync == false;
      
      allow update: if request.resource.data.profileViews <= resource.data.profileViews + 1
                   && request.resource.data.linkClicks.size() == resource.data.linkClicks.size();
      
      allow delete: if false; // Never delete
    }
  }
}
```

### Rate Limiting

Consider adding Cloud Functions to:
- Limit views per IP (prevent spam)
- Validate link click patterns
- Alert on suspicious activity

## 📈 Monitoring

### Firebase Console

- Go to Firestore → Data
- Monitor `analytics` collection
- Check read/write usage

### Cost Estimation

Free tier includes:
- 50K reads/day
- 20K writes/day
- 1 GB storage

MoveTree typical usage:
- ~100 profiles = 100 docs
- ~1000 views/day = 2000 ops/day (read + write)
- **Estimate**: Completely free for small/medium projects

## 🚨 Troubleshooting

### "Permission Denied"

**Cause**: Firestore rules too restrictive

**Fix**: Check rules in Firestore → Rules tab

### "Firebase not initialized"

**Cause**: Missing .env variables

**Fix**: Ensure all `VITE_FIREBASE_*` vars are set

### "Document doesn't exist"

**Cause**: Profile not initialized in Firebase

**Fix**: Visit dashboard, it auto-initializes on first load

## 🎓 Next Steps

1. ✅ Set up Firebase project
2. ✅ Configure Firestore
3. ✅ Update .env with credentials
4. ✅ Test analytics on public profile
5. ✅ Verify sync works after 2 days
6. 🔜 Add authentication (optional)
7. 🔜 Set up monitoring (optional)

---

**Questions?** Check [Firebase Docs](https://firebase.google.com/docs/firestore) or open an issue.
