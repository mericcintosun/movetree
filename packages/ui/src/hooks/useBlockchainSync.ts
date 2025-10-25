import { useEffect, useState } from 'react';
import { 
  getProfilesNeedingSync, 
  getAnalytics, 
  syncToBlockchain, 
  resetAnalyticsAfterSync,
  needsBlockchainSync 
} from '../firebase/analytics';

const SYNC_CHECK_INTERVAL = 30 * 60 * 1000; // Check every 30 minutes
const SYNC_INTERVAL = 2 * 24 * 60 * 60 * 1000; // 2 days

export function useBlockchainSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [syncStatus, setSyncStatus] = useState<string>('idle');

  const performSync = async () => {
    if (isSyncing) return;
    
    setIsSyncing(true);
    setSyncStatus('checking');
    
    try {
      // Get all profiles that need sync
      const profilesNeedingSync = await getProfilesNeedingSync();
      
      if (profilesNeedingSync.length === 0) {
        setSyncStatus('no-sync-needed');
        return;
      }

      setSyncStatus(`syncing-${profilesNeedingSync.length}-profiles`);
      
      let successCount = 0;
      let errorCount = 0;

      for (const profileId of profilesNeedingSync) {
        try {
          // Check if this profile actually needs sync (2 days passed)
          const needsSync = await needsBlockchainSync(profileId);
          
          if (!needsSync) {
            console.log(`Profile ${profileId} doesn't need sync yet`);
            continue;
          }

          // Get analytics data
          const analytics = await getAnalytics(profileId);
          
          if (!analytics) {
            console.warn(`No analytics data found for profile ${profileId}`);
            continue;
          }

          // Sync to blockchain
          const syncSuccess = await syncToBlockchain(profileId, analytics);
          
          if (syncSuccess) {
            // Reset Firebase data after successful blockchain sync
            await resetAnalyticsAfterSync(profileId);
            successCount++;
            console.log(`Successfully synced profile ${profileId}`);
          } else {
            errorCount++;
            console.error(`Failed to sync profile ${profileId}`);
          }
        } catch (error) {
          errorCount++;
          console.error(`Error syncing profile ${profileId}:`, error);
        }
      }

      setLastSyncTime(new Date());
      setSyncStatus(`completed-${successCount}-success-${errorCount}-errors`);
      
      console.log(`Sync completed: ${successCount} successful, ${errorCount} errors`);
      
    } catch (error) {
      console.error('Error during sync process:', error);
      setSyncStatus('error');
    } finally {
      setIsSyncing(false);
    }
  };

  // Set up automatic sync checking
  useEffect(() => {
    const checkAndSync = async () => {
      await performSync();
    };

    // Initial check
    checkAndSync();

    // Set up interval for regular checking
    const interval = setInterval(checkAndSync, SYNC_CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return {
    isSyncing,
    lastSyncTime,
    syncStatus,
    performSync,
  };
}
