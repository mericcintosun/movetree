import { useEffect, useState } from "react";
import { useProfileTransactions } from "../sui/tx";
import {
  getAnalytics,
  needsBlockchainSync,
  markAsSynced,
  updateAnalyticsLinks,
  initializeAnalytics,
} from "../firebase/analytics";

/**
 * Hook to manage analytics with Firebase cache
 */
export function useFirebaseAnalytics(profileId: string | undefined) {
  const [analytics, setAnalytics] = useState<any>(undefined); // undefined = not loaded yet, null = no data, object = data
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async (isInitial = false) => {
    if (!profileId) return;

    // Only set loading on initial load, not on refreshes
    if (isInitial) {
      setLoading(true);
    }

    try {
      const data = await getAnalytics(profileId);
      console.log("Hook loaded analytics:", data);
      setAnalytics(data);
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      if (isInitial) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!profileId) return;

    // Initial load with loading state
    loadAnalytics(true);

    // Refresh every 60 seconds (less frequent to avoid flickering)
    const interval = setInterval(() => loadAnalytics(false), 60 * 1000);

    return () => clearInterval(interval);
  }, [profileId]);

  return { analytics, loading, refreshAnalytics: loadAnalytics };
}
