import { useEffect, useState } from 'react';
import { useProfileTransactions } from '../sui/tx';
import { 
  getAnalytics, 
  needsBlockchainSync, 
  markAsSynced,
  updateAnalyticsLinks,
  initializeAnalytics
} from '../firebase/analytics';


/**
 * Hook to manage analytics with Firebase cache
 */
export function useFirebaseAnalytics(profileId: string | undefined) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profileId) return;

    const loadAnalytics = async () => {
      setLoading(true);
      try {
        const data = await getAnalytics(profileId);
        setAnalytics(data);
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();

    // Refresh every minute
    const interval = setInterval(loadAnalytics, 60 * 1000);

    return () => clearInterval(interval);
  }, [profileId]);

  return { analytics, loading };
}
