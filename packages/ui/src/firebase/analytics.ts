import { db } from "./config";
import {
  doc,
  deleteDoc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  serverTimestamp,
  Timestamp,
  runTransaction,
} from "firebase/firestore";

export interface ProfileAnalytics {
  profileId: string;
  profileViews: number;
  linkClicks: number[];
  links: string[];
  lastSyncedToBlockchain: Date | null;
  lastUpdated: Date;
  needsBlockchainSync: boolean;
}

const SYNC_INTERVAL_MS = 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds

/**
 * Get analytics from Firebase (cache)
 */
export async function getAnalytics(
  profileId: string
): Promise<ProfileAnalytics | null> {
  try {
    const docRef = doc(db, "analytics", profileId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        profileId,
        profileViews: data.profileViews || 0,
        linkClicks: data.linkClicks || [],
        links: data.links || [],
        lastSyncedToBlockchain: data.lastSyncedToBlockchain?.toDate() || null,
        lastUpdated: data.lastUpdated?.toDate() || new Date(),
        needsBlockchainSync: data.needsBlockchainSync || false,
      };
    }

    return null;
  } catch (error) {
    console.error("Error getting analytics from Firebase:", error);
    return null;
  }
}

/**
 * Delete analytics for a profile
 */
export async function deleteAnalytics(profileId: string): Promise<void> {
  try {
    const docRef = doc(db, "analytics", profileId);
    await deleteDoc(docRef);
    console.log(`Analytics deleted for profile ${profileId}`);
  } catch (error) {
    console.error("Error deleting analytics:", error);
    throw error;
  }
}

/**
 * Initialize analytics for a profile (idempotent - won't overwrite existing data)
 */
export async function initializeAnalytics(
  profileId: string,
  links: string[]
): Promise<void> {
  try {
    const docRef = doc(db, "analytics", profileId);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      // Document exists - only update missing fields, preserve existing counts
      const data = snap.data() || {};
      const oldClicks: number[] = Array.isArray(data.linkClicks)
        ? data.linkClicks
        : [];
      const mergedClicks = links.map((_, i) => oldClicks[i] ?? 0);

      await updateDoc(docRef, {
        links,
        linkClicks: mergedClicks,
        lastUpdated: serverTimestamp(),
      });
      console.log(`Analytics updated for existing profile ${profileId}`);
      return;
    }

    // First time setup (document doesn't exist)
    await setDoc(docRef, {
      profileId,
      profileViews: 0,
      linkClicks: new Array(links.length).fill(0),
      links,
      lastSyncedToBlockchain: null,
      lastUpdated: serverTimestamp(),
      needsBlockchainSync: false,
    });
    console.log(`Analytics initialized for new profile ${profileId}`);
  } catch (error) {
    console.error("Error initializing analytics:", error);
    throw error;
  }
}

/**
 * Increment profile view count
 */
export async function incrementProfileView(profileId: string): Promise<void> {
  try {
    const docRef = doc(db, "analytics", profileId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      await initializeAnalytics(profileId, []);
    }

    await updateDoc(docRef, {
      profileViews: increment(1),
      lastUpdated: serverTimestamp(),
      needsBlockchainSync: true,
    });
  } catch (error) {
    console.error("Error incrementing profile view:", error);
  }
}

/**
 * Increment link click count (atomic with transaction)
 */
export async function incrementLinkClick(
  profileId: string,
  linkIndex: number
): Promise<void> {
  try {
    console.log(
      `Incrementing link click for profile ${profileId}, link ${linkIndex}`
    );

    const docRef = doc(db, "analytics", profileId);

    await runTransaction(db, async (tx) => {
      const snap = await tx.get(docRef);

      if (!snap.exists()) {
        // Create new document
        tx.set(docRef, {
          profileId,
          profileViews: 0,
          linkClicks: new Array(linkIndex + 1)
            .fill(0)
            .map((v, i) => (i === linkIndex ? 1 : 0)),
          links: [],
          lastSyncedToBlockchain: null,
          lastUpdated: serverTimestamp(),
          needsBlockchainSync: true,
        });
        console.log(
          `Created analytics document and incremented click for profile ${profileId}`
        );
        return;
      }

      // Update existing document
      const data = snap.data() || {};
      const arr: number[] = Array.isArray(data.linkClicks)
        ? [...data.linkClicks]
        : [];

      // Ensure array is long enough
      while (arr.length <= linkIndex) {
        arr.push(0);
      }

      arr[linkIndex] += 1;

      tx.update(docRef, {
        linkClicks: arr,
        lastUpdated: serverTimestamp(),
        needsBlockchainSync: true,
      });
    });

    console.log(`Successfully incremented link click for profile ${profileId}`);
  } catch (error) {
    console.error("Error incrementing link click:", error);
    throw error; // Re-throw to let caller handle it
  }
}

/**
 * Update links in analytics
 */
export async function updateAnalyticsLinks(
  profileId: string,
  links: string[]
): Promise<void> {
  try {
    const docRef = doc(db, "analytics", profileId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      await initializeAnalytics(profileId, links);
      return;
    }

    const data = docSnap.data();
    const oldLinkClicks = data.linkClicks || [];

    // Preserve existing click counts, add zeros for new links
    const newLinkClicks = links.map((_, index) => oldLinkClicks[index] || 0);

    await updateDoc(docRef, {
      links,
      linkClicks: newLinkClicks,
      lastUpdated: serverTimestamp(),
      needsBlockchainSync: true,
    });
  } catch (error) {
    console.error("Error updating analytics links:", error);
  }
}

/**
 * Check if profile needs blockchain sync (2 days passed)
 */
export async function needsBlockchainSync(profileId: string): Promise<boolean> {
  try {
    const analytics = await getAnalytics(profileId);

    if (!analytics) return false;
    if (analytics.needsBlockchainSync === false) return false;

    const lastSync = analytics.lastSyncedToBlockchain;
    if (!lastSync) return true; // Never synced

    const timeSinceSync = Date.now() - lastSync.getTime();
    return timeSinceSync >= SYNC_INTERVAL_MS;
  } catch (error) {
    console.error("Error checking sync status:", error);
    return false;
  }
}

/**
 * Mark analytics as synced to blockchain
 */
export async function markAsSynced(profileId: string): Promise<void> {
  try {
    const docRef = doc(db, "analytics", profileId);
    await updateDoc(docRef, {
      lastSyncedToBlockchain: serverTimestamp(),
      needsBlockchainSync: false,
    });
  } catch (error) {
    console.error("Error marking as synced:", error);
  }
}

/**
 * Get all profiles that need blockchain sync
 */
export async function getProfilesNeedingSync(): Promise<string[]> {
  try {
    const { collection, query, where, getDocs } = await import(
      "firebase/firestore"
    );
    const analyticsCollection = collection(db, "analytics");
    const q = query(
      analyticsCollection,
      where("needsBlockchainSync", "==", true)
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => doc.id);
  } catch (error) {
    console.error("Error getting profiles needing sync:", error);
    return [];
  }
}

/**
 * Reset analytics data after blockchain sync
 */
export async function resetAnalyticsAfterSync(
  profileId: string
): Promise<void> {
  try {
    const docRef = doc(db, "analytics", profileId);
    await updateDoc(docRef, {
      profileViews: 0,
      linkClicks: [],
      lastSyncedToBlockchain: serverTimestamp(),
      needsBlockchainSync: false,
      lastUpdated: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error resetting analytics after sync:", error);
  }
}

/**
 * Sync analytics data to blockchain
 * Note: This is a placeholder implementation. In production, you would need:
 * 1. A proper signer (wallet connection)
 * 2. The correct package ID for your deployed contract
 * 3. Proper error handling for blockchain transactions
 */
export async function syncToBlockchain(
  profileId: string,
  analytics: ProfileAnalytics
): Promise<boolean> {
  try {
    console.log(`🔄 Syncing analytics for profile ${profileId}:`, {
      profileViews: analytics.profileViews,
      linkClicks: analytics.linkClicks,
      totalClicks: analytics.linkClicks.reduce(
        (sum, clicks) => sum + clicks,
        0
      ),
    });

    // TODO: Implement actual blockchain sync
    // This would require:
    // 1. Wallet connection to get a signer
    // 2. The correct package ID for your deployed contract
    // 3. Proper transaction handling

    // For now, simulate sync delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log(`✅ Analytics sync completed for profile ${profileId}`);

    // Mark as synced
    await markAsSynced(profileId);
    return true;
  } catch (error) {
    console.error("Error syncing to blockchain:", error);
    return false;
  }
}
