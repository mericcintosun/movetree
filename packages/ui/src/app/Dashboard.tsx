import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Text,
  TextField,
  TextArea,
  Badge,
} from "@radix-ui/themes";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useProfileTransactions } from "../sui/tx";
import { useOwnedProfiles, useSimilarProfiles } from "../sui/queries";
import { useFirebaseAnalytics } from "../hooks/useAnalytics";
import { useBlockchainSync } from "../hooks/useBlockchainSync";
import { updateAnalyticsLinks, initializeAnalytics, incrementLinkClick, getAnalytics, deleteAnalytics } from "../firebase/analytics";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

interface LinkItem {
  label: string;
  url: string;
  icon?: string;
}

// Popular tags for quick selection
const POPULAR_TAGS = [
  "Developer",
  "Designer",
  "Blockchain",
  "Web3",
  "AI/ML",
  "DeFi",
  "NFT",
  "Gaming",
  "Content Creator",
  "Marketing",
  "Business",
  "Entrepreneur",
];

// Separate component to avoid hook ordering issues
const ProfileCard = ({ 
  profile, 
  onUpdateLinks, 
  onUpdateTags, 
  onDeleteProfile,
  isLoading 
}: any) => {
  const profileData = (profile.data?.content as any)?.fields;
  const profileId = profile.data?.objectId || "";
  
  // Use Firebase analytics instead of blockchain
  const { analytics, refreshAnalytics } = useFirebaseAnalytics(profileId);
  
  // Debug analytics data (reduced logging)
  if (analytics && analytics.linkClicks) {
    console.log("Analytics loaded - Link clicks:", analytics.linkClicks);
  }
  
  // Auto-sync to blockchain every 2 days
  const { isSyncing, performSync } = useBlockchainSync();
  
  // Load existing links from blockchain
  const existingLinks = profileData?.links || [];
  const [links, setLinks] = useState<LinkItem[]>(
    existingLinks.length > 0 
      ? existingLinks.map((url: string) => ({ label: "", url, icon: "" }))
      : [{ label: "", url: "", icon: "" }]
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    profileData?.tags || []
  );

  // Debug links count (reduced logging)
  // console.log("Links count:", links.length);

  // Update links when profile data changes
  useEffect(() => {
    if (existingLinks.length > 0) {
      setLinks(existingLinks.map((url: string) => ({ label: "", url, icon: "" })));
    }
  }, [JSON.stringify(existingLinks)]);

  // Initialize Firebase analytics if needed (safe initialization)
  useEffect(() => {
    if (!profileId || existingLinks.length === 0) return;

    (async () => {
      const a = await getAnalytics(profileId);
      if (!a) {
        await initializeAnalytics(profileId, existingLinks);
      } else if (JSON.stringify(a.links) !== JSON.stringify(existingLinks)) {
        await updateAnalyticsLinks(profileId, existingLinks);
      }
      refreshAnalytics();
    })();
  }, [profileId, JSON.stringify(existingLinks), refreshAnalytics]);

  // Refresh analytics when component becomes visible (user returns from PublicProfile)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && profileId) {
        console.log("Page became visible, refreshing analytics...");
        refreshAnalytics();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Also refresh on focus (when user switches back to tab)
    const handleFocus = () => {
      if (profileId) {
        console.log("Page focused, refreshing analytics...");
        refreshAnalytics();
      }
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [profileId, refreshAnalytics]);


  const addLink = () => {
    setLinks([...links, { label: "", url: "", icon: "" }]);
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const updateLink = (index: number, field: keyof LinkItem, value: string) => {
    const newLinks = [...links];
    newLinks[index][field] = value;
    setLinks(newLinks);
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <Card>
      {/* Analytics Badge - GitHub style */}
      <Flex justify="between" align="center" mb="3">
        <Heading size="4">
          {profileData?.name || "Unnamed Profile"}
        </Heading>
        <Badge size="2" color="blue" radius="full">
          👁️ {analytics?.profileViews ?? 0} views
        </Badge>
      </Flex>

      <Text size="2" mb="3">
        {profileData?.bio || "No bio"}
      </Text>

      <Text size="1" color="gray" mb="3">
        Object ID: {profileId}
      </Text>

      <Flex direction="column" gap="3">
        <Box>
          <Text size="2" weight="bold" mb="2">
            Links
          </Text>
          {links.map((link, index) => (
            <Flex key={index} gap="2" mb="2" align="center">
              <TextField.Root
                placeholder="Label"
                value={link.label}
                onChange={(e: any) =>
                  updateLink(index, "label", e.target.value)
                }
                size="1"
              />
              <TextField.Root
                placeholder="https://example.com"
                value={link.url}
                onChange={(e: any) =>
                  updateLink(index, "url", e.target.value)
                }
                size="1"
              />
              <TextField.Root
                placeholder="Icon (optional)"
                value={link.icon || ""}
                onChange={(e: any) =>
                  updateLink(index, "icon", e.target.value)
                }
                size="1"
              />
              {/* Show click count */}
              <Badge color="gray" variant="soft">
                {analytics?.linkClicks?.[index] ?? 0} clicks
              </Badge>
              <Button
                size="1"
                color="red"
                onClick={() => removeLink(index)}
              >
                Remove
              </Button>
            </Flex>
          ))}
          <Button size="1" onClick={addLink} mb="2">
            Add Link
          </Button>
          <Button
            size="1"
            onClick={() => onUpdateLinks(profileId, links)}
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Links"}
          </Button>
          
          {/* Debug: Test analytics */}
          <Button
            size="1"
            variant="outline"
            onClick={async () => {
              console.log("Testing analytics...");
              try {
                // Test incrementLinkClick
                await incrementLinkClick(profileId, 0);
                console.log("Test click recorded");
                
                // Reload analytics
                const updated = await getAnalytics(profileId);
                console.log("Updated analytics:", updated);
                
                // Force refresh using hook
                refreshAnalytics();
              } catch (error) {
                console.error("Analytics test failed:", error);
              }
            }}
          >
            Test Analytics
          </Button>
          
          {/* Debug: Test Firebase connection */}
          <Button
            size="1"
            variant="outline"
            onClick={async () => {
              console.log("Testing Firebase connection...");
              try {
                // Test basic Firebase write
                const testData = {
                  test: true,
                  timestamp: new Date().toISOString(),
                  profileId: profileId
                };
                
                const testDoc = doc(db, "test", "connection");
                await setDoc(testDoc, testData);
                console.log("✅ Firebase write test successful");
                
                // Test read
                const testSnap = await getDoc(testDoc);
                console.log("✅ Firebase read test successful:", testSnap.data());
                
              } catch (error) {
                console.error("❌ Firebase test failed:", error);
                console.error("Error details:", {
                  code: error.code,
                  message: error.message,
                  stack: error.stack
                });
              }
            }}
          >
            Test Firebase
          </Button>
          
          {/* Manual analytics refresh */}
          <Button
            size="1"
            variant="outline"
            onClick={() => {
              console.log("Manually refreshing analytics...");
              refreshAnalytics();
            }}
          >
            Refresh Analytics
          </Button>
        </Box>

        {/* Analytics Chart - Simple Bar Graph */}
        {analytics && (
          <Box>
            <Text size="2" weight="bold" mb="2">
              📊 Link Performance
            </Text>
            <Box
              style={{
                background: "var(--gray-3)",
                padding: "12px",
                borderRadius: "8px",
              }}
            >
              {analytics.linkClicks && analytics.linkClicks.length > 0 ? (
                links.map((link, index) => {
                  const clicks = analytics.linkClicks[index] || 0;
                  const maxClicks = Math.max(...analytics.linkClicks, 1);
                  const percentage = (clicks / maxClicks) * 100;
                  
                  return (
                    <Box key={index} mb="2">
                      <Flex justify="between" mb="1">
                        <Text size="1" color="gray">
                          {link.label || link.url.slice(0, 30)}...
                        </Text>
                        <Text size="1" weight="bold">
                          {clicks} clicks
                        </Text>
                      </Flex>
                      <Box
                        style={{
                          height: "8px",
                          background: "var(--gray-5)",
                          borderRadius: "4px",
                          overflow: "hidden",
                        }}
                      >
                        <Box
                          style={{
                            height: "100%",
                            width: `${percentage}%`,
                            background: "var(--blue-9)",
                            transition: "width 0.3s ease",
                          }}
                        />
                      </Box>
                    </Box>
                  );
                })
              ) : (
                <Text size="2" color="gray" align="center">
                  No click data yet. Share your profile to see analytics!
                </Text>
              )}
            </Box>
          </Box>
        )}

        <Box>
          <Text size="2" weight="bold" mb="2">
            Interest Tags (for networking)
          </Text>
          
          {/* Selected tags display */}
          {selectedTags.length > 0 && (
            <Flex gap="2" wrap="wrap" mb="3">
              {selectedTags.map((tag) => (
                <Badge key={tag} size="2" color="blue">
                  {tag}
                </Badge>
              ))}
            </Flex>
          )}

          {/* Available tags */}
          <Text size="1" color="gray" mb="1">
            Select your interests (click to toggle):
          </Text>
          <Flex gap="1" wrap="wrap" mb="3">
            {POPULAR_TAGS.map((tag) => (
              <Badge
                key={tag}
                size="1"
                color={selectedTags.includes(tag) ? "green" : "gray"}
                onClick={() => toggleTag(tag)}
                style={{ cursor: "pointer" }}
              >
                {tag}
              </Badge>
            ))}
          </Flex>

          <Button
            size="1"
            onClick={() => onUpdateTags(profileId, selectedTags)}
            disabled={isLoading}
            color="purple"
          >
            Update Tags
          </Button>
        </Box>

        {/* Blockchain Sync Status */}
        <Box>
          <Flex justify="between" align="center" mb="2">
            <Text size="2" weight="bold">
              Blockchain Sync
            </Text>
            <Badge color={isSyncing ? "orange" : "green"} variant="soft">
              {isSyncing ? "Syncing..." : "Up to date"}
            </Badge>
          </Flex>
          <Text size="1" color="gray" mb="2">
            Analytics auto-sync to blockchain every 2 days
          </Text>
          <Button
            size="1"
            variant="outline"
            onClick={performSync}
            disabled={isSyncing}
          >
            {isSyncing ? "Syncing..." : "Force Sync Now"}
          </Button>
        </Box>

        <Box>
          <Button
            size="1"
            color="red"
            onClick={() => onDeleteProfile(profileId)}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete Profile"}
          </Button>
        </Box>
      </Flex>
    </Card>
  );
};

export const Dashboard = () => {
  // 1) TÜM hook'lar en üste - erken return'den önce!
  const account = useCurrentAccount();
  const { createProfile, updateLinks, updateTags, deleteProfile } =
    useProfileTransactions();
  const { data: profiles, refetch, isLoading: profilesLoading, error: profilesError } = useOwnedProfiles(account?.address || "");

  // Loading timeout removed - not needed anymore

  const [formData, setFormData] = useState({
    name: "",
    avatarCid: "",
    bio: "",
    theme: "dark",
  });

  const [isLoading, setIsLoading] = useState(false);

  // Debug logs removed for cleaner console

  // Get current profile's tags for similarity matching
  const currentProfileData = profiles?.data?.[0]?.data?.content as any;
  const currentProfileTags = currentProfileData?.fields?.tags || [];
  const currentProfileId = profiles?.data?.[0]?.data?.objectId;

  // Get similar profiles - hook'lar erken return'den önce!
  const { data: similarProfiles, refetch: refetchSimilarProfiles } = useSimilarProfiles(
    currentProfileTags,
    currentProfileId
  );

  const handleCreateProfile = async () => {
    if (!account) {
      alert("Please connect your wallet first");
      return;
    }

    // Form validation
    if (!formData.name.trim()) {
      alert("Please enter a name");
      return;
    }
    
    setIsLoading(true);
    try {
      await createProfile(
        formData.name,
        formData.avatarCid,
        formData.bio,
        formData.theme,
      );
      await refetch();
      // Don't clear form - let user see the created profile
      alert("Profile created successfully!");
    } catch (error) {
      console.error("Failed to create profile:", error);
      alert(`Profile creation failed: ${error.message || error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateLinks = async (profileId: string, links: LinkItem[]) => {
    setIsLoading(true);
    try {
      // Debug log removed
      
      // Update blockchain (updateLinks will filter empty URLs)
      await updateLinks(profileId, links);
      
      // Get filtered URLs for Firebase cache
      const urls = links
        .map(l => l.url)
        .filter(url => url && url.trim() !== "");
      
      // Update Firebase cache with filtered URLs
      await updateAnalyticsLinks(profileId, urls);
      
      await refetch();
      alert("✅ Links updated successfully!");
    } catch (error) {
      console.error("Failed to update links:", error);
      alert("❌ Failed to update links: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTags = async (profileId: string, tags: string[]) => {
    setIsLoading(true);
    try {
      await updateTags(profileId, tags);
      await refetch();
      await refetchSimilarProfiles(); // Refresh similar profiles
      alert("✅ Tags updated successfully on blockchain!");
    } catch (error) {
      console.error("Failed to update tags:", error);
      alert("❌ Failed to update tags: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProfile = async (profileId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this profile? This action cannot be undone.",
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      await deleteProfile(profileId);
      await deleteAnalytics(profileId);
      await refetch();
    } catch (error) {
      console.error("Failed to delete profile:", error);
    } finally {
      setIsLoading(false);
    }
  };



  // 2) Erken return şimdi hook'lardan SONRA geliyor → güvenli
  if (!account) {
    return (
      <Box p="4">
        <Heading>Connect your wallet to create your LinkTree profile</Heading>
      </Box>
    );
  }

  if (profilesLoading) {
    return (
      <Box p="4">
        <Heading mb="4">LinkTree Dashboard</Heading>
        <Text>Loading your profiles...</Text>
      </Box>
    );
  }

  // If no package ID is set, show a warning
  if (!import.meta.env.VITE_PACKAGE_ID) {
    return (
      <Box p="4">
        <Heading mb="4">LinkTree Dashboard</Heading>
        <Text color="red">
          ⚠️ VITE_PACKAGE_ID environment variable is not set. Please configure it in your .env.local file.
        </Text>
      </Box>
    );
  }

  return (
    <Box p="4">
      <Heading mb="4">LinkTree Dashboard</Heading>

      {(!profiles?.data || profiles.data.length === 0 || profilesError) ? (
        <Card>
          <Heading size="4" mb="4">
            Create Your Profile
          </Heading>
          <Flex direction="column" gap="3">
            <Box>
              <Text size="2" weight="bold" mb="1">
                Name
              </Text>
              <TextField.Root
                value={formData.name}
                onChange={(e: any) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Your name"
              />
            </Box>

            <Box>
              <Text size="2" weight="bold" mb="1">
                Avatar CID
              </Text>
              <TextField.Root
                value={formData.avatarCid}
                onChange={(e: any) =>
                  setFormData({ ...formData, avatarCid: e.target.value })
                }
                placeholder="IPFS CID for your avatar"
              />
            </Box>

            <Box>
              <Text size="2" weight="bold" mb="1">
                Bio
              </Text>
              <TextArea
                value={formData.bio}
                onChange={(e: any) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                placeholder="Tell us about yourself"
                rows={3}
              />
            </Box>

            <Box>
              <Text size="2" weight="bold" mb="1">
                Theme
              </Text>
              <TextField.Root
                value={formData.theme}
                onChange={(e: any) =>
                  setFormData({ ...formData, theme: e.target.value })
                }
                placeholder="dark, light, etc."
              />
            </Box>

            <Button onClick={handleCreateProfile} disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Profile"}
            </Button>
          </Flex>
        </Card>
      ) : (
        <Flex direction="column" gap="4">
          {profiles?.data?.map((profile) => (
            <ProfileCard
              key={profile.data?.objectId}
              profile={profile}
              onUpdateLinks={handleUpdateLinks}
              onUpdateTags={handleUpdateTags}
              onDeleteProfile={handleDeleteProfile}
              isLoading={isLoading}
            />
          ))}
        </Flex>
      )}

      {/* Similar Profiles Section */}
      {currentProfileTags.length > 0 && similarProfiles && similarProfiles.length > 0 && (
        <Box mt="6">
          <Heading size="5" mb="3">
            Recommended Profiles
          </Heading>
          <Text size="2" color="gray" mb="3">
            Based on your interests: {currentProfileTags.join(", ")}
          </Text>
          <Flex direction="column" gap="3">
            {similarProfiles.map((profile: any) => {
              const content = profile.data?.content as any;
              const fields = content?.fields;
              return (
                <Card key={profile.data?.objectId}>
                  <Flex justify="between" align="start">
                    <Box>
                      <Heading size="3" mb="1">
                        {fields?.name || "Anonymous"}
                      </Heading>
                      <Text size="2" color="gray" mb="2">
                        {fields?.bio || "No bio"}
                      </Text>
                      <Flex gap="1" wrap="wrap" mb="2">
                        {profile.matchingTags.map((tag: string) => (
                          <Badge key={tag} size="1" color="green">
                            {tag}
                          </Badge>
                        ))}
                      </Flex>
                      <Text size="1" color="gray">
                        {profile.matchScore} matching interest
                        {profile.matchScore > 1 ? "s" : ""}
                      </Text>
                    </Box>
                    <Button
                      size="2"
                      onClick={() => {
                        window.open(
                          `${window.location.origin}?profile=${profile.data?.objectId}`,
                          "_blank"
                        );
                      }}
                    >
                      View Profile
                    </Button>
                  </Flex>
                </Card>
              );
            })}
          </Flex>
        </Box>
      )}
    </Box>
  );
};
