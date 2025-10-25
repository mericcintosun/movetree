import { useSuiClientQuery } from "@mysten/dapp-kit";
import { useQuery } from "@tanstack/react-query";
import { useSuiClient } from "@mysten/dapp-kit";

export const useProfile = (objectId: string) => {
  return useSuiClientQuery("getObject", {
    id: objectId,
    options: {
      showContent: true,
      showOwner: true,
      showPreviousTransaction: true,
      showStorageRebate: true,
      showType: true,
    },
  });
};

export const useOwnedProfiles = (address: string) => {
  const packageId = import.meta.env.VITE_PACKAGE_ID;
  const structType = `${packageId}::profile::LinkTreeProfile`;
  
  // Debug logs removed for cleaner console
  
  return useSuiClientQuery("getOwnedObjects", {
    owner: address,
    filter: {
      StructType: structType,
    },
    options: {
      showContent: true,
      showOwner: true,
      showPreviousTransaction: true,
      showStorageRebate: true,
      showType: true,
    },
  }, {
    enabled: !!address && !!packageId, // Sadece address ve packageId varsa query çalıştır
    retry: 1, // Sadece 1 kez retry
    retryDelay: 1000, // 1 saniye bekle
    staleTime: 30000, // 30 saniye cache
  });
};

// Find profiles with similar tags
// IMPORTANT: This requires Sui GraphQL or a custom indexer
// Current implementation uses a workaround that may not scale well
export const useSimilarProfiles = (userTags: string[], currentProfileId?: string) => {
  const client = useSuiClient();
  
  return useQuery({
    queryKey: ["similarProfiles", userTags, currentProfileId],
    queryFn: async () => {
      if (!userTags || userTags.length === 0) return [];

      try {
        // APPROACH 1: Use Sui GraphQL (recommended for production)
        // This requires @mysten/sui.js GraphQL client
        // const profiles = await graphqlClient.query({
        //   query: `{
        //     objects(
        //       filter: {
        //         type: "${import.meta.env.VITE_PACKAGE_ID}::profile::LinkTreeProfile"
        //       }
        //     ) {
        //       nodes {
        //         objectId
        //         content {
        //           ... on MoveObject {
        //             fields
        //           }
        //         }
        //       }
        //     }
        //   }`
        // });

        // APPROACH 2: Query dynamic fields (current workaround)
        // Note: This won't work without knowing all profile addresses
        // For hackathon/demo, we'll use mock data with fallback message
        
        console.warn(`
          ⚠️ PRODUCTION NOTICE:
          To query all profiles by tags, you need:
          
          Option 1: Sui GraphQL (Recommended)
          - Install: npm install @mysten/sui.js
          - Use GraphQL client to query all LinkTreeProfile objects
          - Filter by tags in the query
          
          Option 2: Custom Indexer
          - Set up a backend service
          - Listen to profile creation/update events
          - Build a searchable database of profiles + tags
          
          Option 3: Event-based Discovery
          - Emit events when profiles are created/updated
          - Index events and build a tag registry
          
          Current: Using mock data for demo purposes
        `);

        // For now, return mock data
        const mockProfiles = [
          {
            data: {
              objectId: "0xdemo1",
              content: {
                fields: {
                  name: "Alice (Demo)",
                  bio: "Web3 Developer passionate about DeFi",
                  tags: userTags.slice(0, 2),
                },
              },
            },
            matchScore: Math.min(2, userTags.length),
            matchingTags: userTags.slice(0, 2),
          },
          {
            data: {
              objectId: "0xdemo2",
              content: {
                fields: {
                  name: "Bob (Demo)",
                  bio: "Blockchain enthusiast and NFT collector",
                  tags: [userTags[0]],
                },
              },
            },
            matchScore: 1,
            matchingTags: [userTags[0]],
          },
        ].filter((p) => p.data.objectId !== currentProfileId && p.matchScore > 0);

        return mockProfiles;
      } catch (error) {
        console.error("Failed to fetch similar profiles:", error);
        return [];
      }
    },
    enabled: userTags && userTags.length > 0,
  });
};

// Get profile analytics (views and link clicks)
export const useProfileAnalytics = (objectId: string) => {
  const { data: profile } = useProfile(objectId);
  
  if (!profile?.data?.content || profile.data.content.dataType !== "moveObject") {
    return { profileViews: 0, linkClicks: [] };
  }

  const fields = profile.data.content.fields as any;
  return {
    profileViews: Number(fields.profile_views || 0),
    linkClicks: (fields.link_clicks || []).map((count: string) => Number(count)),
  };
};
