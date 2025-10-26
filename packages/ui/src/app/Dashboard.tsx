import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
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
  
  const { analytics, refreshAnalytics } = useFirebaseAnalytics(profileId);
  const { isSyncing, performSync } = useBlockchainSync();
  
  const existingLinks = profileData?.links || [];
  const [links, setLinks] = useState<LinkItem[]>(
    existingLinks.length > 0 
      ? existingLinks.map((url: string) => ({ label: "", url, icon: "" }))
      : [{ label: "", url: "", icon: "" }]
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    profileData?.tags || []
  );

  useEffect(() => {
    if (existingLinks.length > 0) {
      setLinks(existingLinks.map((url: string) => ({ label: "", url, icon: "" })));
    }
  }, [JSON.stringify(existingLinks)]);

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

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && profileId) {
        refreshAnalytics();
      }
    };

    const handleFocus = () => {
      if (profileId) {
        refreshAnalytics();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
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
    <div className="card-modern fade-in" style={{ padding: "var(--space-6)" }}>
      {/* Header */}
      <Flex justify="between" align="center" mb="5">
        <div>
          <Heading size="6" style={{ fontWeight: 700, marginBottom: "var(--space-2)" }}>
            {profileData?.name || "Unnamed Profile"}
          </Heading>
          <Text size="2" color="gray">
            {profileData?.bio || "No bio"}
          </Text>
        </div>
        <div className="badge-mint" style={{ padding: "var(--space-2) var(--space-4)" }}>
          👁️ {analytics?.profileViews ?? 0} views
        </div>
      </Flex>

      <Text size="1" color="gray" mb="5" style={{ 
        fontFamily: "var(--font-mono)", 
        wordBreak: "break-all",
        opacity: 0.6 
      }}>
        ID: {profileId}
      </Text>

      {/* Links Section */}
      <Box mb="6">
        <Text size="3" weight="bold" mb="3" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          🔗 Links
        </Text>
        
        <Flex direction="column" gap="3">
          {links.map((link, index) => (
            <div
              key={index}
              style={{
                background: "var(--bg-tertiary)",
                padding: "var(--space-4)",
                borderRadius: "var(--radius-md)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
              }}
            >
              <Flex gap="2" mb="2" wrap="wrap">
                <input
                  className="input-modern"
                  placeholder="Label (optional)"
                  value={link.label}
                  onChange={(e: any) => updateLink(index, "label", e.target.value)}
                  style={{ flex: "1", minWidth: "150px" }}
                />
                <input
                  className="input-modern"
                  placeholder="https://example.com"
                  value={link.url}
                  onChange={(e: any) => updateLink(index, "url", e.target.value)}
                  style={{ flex: "2", minWidth: "200px" }}
                />
                <input
                  className="input-modern"
                  placeholder="Icon 🔥"
                  value={link.icon || ""}
                  onChange={(e: any) => updateLink(index, "icon", e.target.value)}
                  style={{ flex: "0 0 80px" }}
                />
              </Flex>
              
              <Flex justify="between" align="center">
                <div className="badge-grape" style={{ fontSize: "11px" }}>
                  {analytics?.linkClicks?.[index] ?? 0} clicks
                </div>
                <button
                  className="btn-outline"
                  onClick={() => removeLink(index)}
                  style={{
                    padding: "6px 16px",
                    fontSize: "13px",
                    borderColor: "rgba(255, 100, 100, 0.3)",
                    color: "#ff6b6b",
                  }}
                >
                  Remove
                </button>
              </Flex>
            </div>
          ))}
        </Flex>

        <Flex gap="2" mt="4">
          <button className="btn-outline" onClick={addLink} style={{ fontSize: "14px" }}>
            + Add Link
          </button>
          <button
            className="btn-primary"
            onClick={() => onUpdateLinks(profileId, links)}
            disabled={isLoading}
            style={{ fontSize: "14px", opacity: isLoading ? 0.6 : 1 }}
          >
            {isLoading ? "Updating..." : "💾 Save Links"}
          </button>
        </Flex>
      </Box>

      {/* Analytics Chart */}
      {analytics && analytics.linkClicks && analytics.linkClicks.length > 0 && (
        <Box mb="6">
          <Text size="3" weight="bold" mb="3" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            📊 Link Performance
          </Text>
          <div
            style={{
              background: "var(--bg-tertiary)",
              padding: "var(--space-5)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            {links.map((link, index) => {
              const clicks = analytics.linkClicks[index] || 0;
              const maxClicks = Math.max(...analytics.linkClicks, 1);
              const percentage = (clicks / maxClicks) * 100;
              
              return (
                <Box key={index} mb="3">
                  <Flex justify="between" mb="2">
                    <Text size="2" style={{ fontWeight: 500 }}>
                      {link.label || link.url.slice(0, 40) + "..."}
                    </Text>
                    <Text size="2" weight="bold" className="text-gradient-grape">
                      {clicks} clicks
                    </Text>
                  </Flex>
                  <div
                    style={{
                      height: "10px",
                      background: "var(--bg-secondary)",
                      borderRadius: "var(--radius-full)",
                      overflow: "hidden",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${percentage}%`,
                        background: "var(--gradient-mint)",
                        transition: "width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                        boxShadow: "0 0 10px rgba(55, 197, 179, 0.4)",
                      }}
                    />
                  </div>
                </Box>
              );
            })}
          </div>
        </Box>
      )}

      {/* Tags Section */}
      <Box mb="6">
        <Text size="3" weight="bold" mb="3" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          🏷️ Interest Tags
        </Text>
        
        {selectedTags.length > 0 && (
          <Flex gap="2" wrap="wrap" mb="3">
            {selectedTags.map((tag) => (
              <div key={tag} className="badge-mint" style={{ padding: "6px 14px", fontSize: "13px" }}>
                ✓ {tag}
              </div>
            ))}
          </Flex>
        )}

        <Text size="1" color="gray" mb="2">
          Click to toggle:
        </Text>
        <Flex gap="2" wrap="wrap" mb="3">
          {POPULAR_TAGS.map((tag) => (
            <div
              key={tag}
              onClick={() => toggleTag(tag)}
              style={{
                padding: "6px 12px",
                borderRadius: "var(--radius-full)",
                border: selectedTags.includes(tag)
                  ? "1.5px solid var(--mint-800)"
                  : "1.5px solid rgba(255, 255, 255, 0.15)",
                background: selectedTags.includes(tag)
                  ? "rgba(55, 197, 179, 0.15)"
                  : "transparent",
                color: selectedTags.includes(tag) ? "var(--mint-700)" : "var(--text-secondary)",
                fontSize: "12px",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all var(--transition-base)",
              }}
            >
              {tag}
            </div>
          ))}
        </Flex>

        <button
          className="btn-secondary"
          onClick={() => onUpdateTags(profileId, selectedTags)}
          disabled={isLoading}
          style={{ fontSize: "14px", opacity: isLoading ? 0.6 : 1 }}
        >
          {isLoading ? "Updating..." : "💫 Update Tags"}
        </button>
      </Box>

      {/* Blockchain Sync */}
      <Box mb="6">
        <Flex justify="between" align="center" mb="3">
          <Text size="3" weight="bold" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            ⛓️ Blockchain Sync
          </Text>
          <div className={isSyncing ? "badge-grape" : "badge-mint"} style={{ fontSize: "11px" }}>
            {isSyncing ? "⏳ Syncing..." : "✓ Up to date"}
          </div>
        </Flex>
        <Text size="2" color="gray" mb="3">
          Analytics auto-sync every 2 days
        </Text>
        <button
          className="btn-outline"
          onClick={performSync}
          disabled={isSyncing}
          style={{ 
            fontSize: "14px",
            opacity: isSyncing ? 0.5 : 1,
            cursor: isSyncing ? "not-allowed" : "pointer",
          }}
        >
          {isSyncing ? "⏳ Syncing..." : "🔄 Force Sync Now"}
        </button>
      </Box>

      {/* Delete Profile */}
      <Box>
        <button
          onClick={() => onDeleteProfile(profileId)}
          disabled={isLoading}
          style={{
            background: "transparent",
            border: "1.5px solid rgba(255, 100, 100, 0.3)",
            color: "#ff6b6b",
            padding: "var(--space-3) var(--space-5)",
            borderRadius: "var(--radius-full)",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all var(--transition-base)",
            opacity: isLoading ? 0.5 : 1,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 100, 100, 0.1)";
            e.currentTarget.style.borderColor = "#ff6b6b";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "rgba(255, 100, 100, 0.3)";
          }}
        >
          {isLoading ? "Deleting..." : "🗑️ Delete Profile"}
        </button>
      </Box>
    </div>
  );
};

export const Dashboard = () => {
  const account = useCurrentAccount();
  const { createProfile, updateLinks, updateTags, deleteProfile } = useProfileTransactions();
  const { data: profiles, refetch, isLoading: profilesLoading, error: profilesError } = useOwnedProfiles(account?.address || "");

  const [formData, setFormData] = useState({
    name: "",
    avatarCid: "",
    bio: "",
    theme: "dark",
  });

  const [isLoading, setIsLoading] = useState(false);

  const currentProfileData = profiles?.data?.[0]?.data?.content as any;
  const currentProfileTags = currentProfileData?.fields?.tags || [];
  const currentProfileId = profiles?.data?.[0]?.data?.objectId;

  const { data: similarProfiles, refetch: refetchSimilarProfiles } = useSimilarProfiles(
    currentProfileTags,
    currentProfileId
  );

  const handleCreateProfile = async () => {
    if (!account) {
      alert("Please connect your wallet first");
      return;
    }

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
      alert("Profile created successfully!");
    } catch (error) {
      console.error("Failed to create profile:", error);
      alert(`Profile creation failed: ${(error as Error).message || error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateLinks = async (profileId: string, links: LinkItem[]) => {
    setIsLoading(true);
    try {
      await updateLinks(profileId, links);
      
      const urls = links
        .map(l => l.url)
        .filter(url => url && url.trim() !== "");
      
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
      await refetchSimilarProfiles();
      alert("✅ Tags updated successfully!");
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

  if (!account) {
    return (
      <Box className="fade-in" style={{ textAlign: "center", padding: "var(--space-8) 0" }}>
        <div style={{ 
          fontSize: "64px",
          marginBottom: "var(--space-5)",
          filter: "grayscale(0.3)",
        }}>
          🔐
        </div>
        <Heading size="7" mb="3" className="text-gradient">
          Welcome to MoveTree
        </Heading>
        <Text size="3" color="gray">
          Connect your wallet to create your on-chain LinkTree profile
        </Text>
      </Box>
    );
  }

  if (profilesLoading) {
    return (
      <Box className="fade-in" style={{ textAlign: "center", padding: "var(--space-8) 0" }}>
        <div className="skeleton" style={{ 
          width: "100px", 
          height: "100px", 
          borderRadius: "var(--radius-full)",
          margin: "0 auto var(--space-5)",
        }} />
        <Text size="3" color="gray">Loading your profiles...</Text>
      </Box>
    );
  }

  if (!import.meta.env.VITE_PACKAGE_ID) {
    return (
      <Box className="card-modern fade-in" p="6">
        <Heading size="5" mb="3" style={{ color: "#ff6b6b" }}>
          ⚠️ Configuration Error
        </Heading>
        <Text color="gray">
          VITE_PACKAGE_ID environment variable is not set. Please configure it in your .env.local file.
        </Text>
      </Box>
    );
  }

  return (
    <Box className="fade-in">
      {(!profiles?.data || profiles.data.length === 0 || profilesError) ? (
        <div className="card-modern" style={{ padding: "var(--space-7)" }}>
          <Heading size="6" mb="5" className="text-gradient" style={{ fontWeight: 700 }}>
            ✨ Create Your Profile
          </Heading>
          
          <Flex direction="column" gap="4">
            <Box>
              <Text size="2" weight="bold" mb="2" style={{ color: "var(--text-primary)" }}>
                Name *
              </Text>
              <input
                className="input-modern"
                value={formData.name}
                onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
                style={{ width: "100%", fontSize: "15px" }}
              />
            </Box>

            <Box>
              <Text size="2" weight="bold" mb="2" style={{ color: "var(--text-primary)" }}>
                Avatar CID
              </Text>
              <input
                className="input-modern"
                value={formData.avatarCid}
                onChange={(e: any) => setFormData({ ...formData, avatarCid: e.target.value })}
                placeholder="IPFS CID for your avatar (optional)"
                style={{ width: "100%", fontSize: "15px" }}
              />
            </Box>

            <Box>
              <Text size="2" weight="bold" mb="2" style={{ color: "var(--text-primary)" }}>
                Bio
              </Text>
              <textarea
                className="input-modern"
                value={formData.bio}
                onChange={(e: any) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us about yourself"
                rows={4}
                style={{ 
                  width: "100%", 
                  fontSize: "15px",
                  resize: "vertical",
                  fontFamily: "var(--font-body)",
                }}
              />
            </Box>

            <Box>
              <Text size="2" weight="bold" mb="2" style={{ color: "var(--text-primary)" }}>
                Theme
              </Text>
              <input
                className="input-modern"
                value={formData.theme}
                onChange={(e: any) => setFormData({ ...formData, theme: e.target.value })}
                placeholder="dark, light, etc."
                style={{ width: "100%", fontSize: "15px" }}
              />
            </Box>

            <button
              className="btn-primary"
              onClick={handleCreateProfile}
              disabled={isLoading}
              style={{ 
                fontSize: "15px",
                padding: "14px 28px",
                marginTop: "var(--space-3)",
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              {isLoading ? "⏳ Creating..." : "🚀 Create Profile"}
            </button>
          </Flex>
        </div>
      ) : (
        <Flex direction="column" gap="5">
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
        <Box mt="7">
          <Heading size="6" mb="4" className="text-gradient-grape" style={{ fontWeight: 700 }}>
            🌟 Recommended Profiles
          </Heading>
          <Text size="2" color="gray" mb="4">
            Based on your interests: {currentProfileTags.join(", ")}
          </Text>
          <Flex direction="column" gap="3">
            {similarProfiles.map((profile: any) => {
              const content = profile.data?.content as any;
              const fields = content?.fields;
              return (
                <div
                  key={profile.data?.objectId}
                  className="card-modern"
                  style={{
                    padding: "var(--space-5)",
                    cursor: "pointer",
                  }}
                >
                  <Flex justify="between" align="start">
                    <Box style={{ flex: 1 }}>
                      <Heading size="4" mb="2" style={{ fontWeight: 600 }}>
                        {fields?.name || "Anonymous"}
                      </Heading>
                      <Text size="2" color="gray" mb="3">
                        {fields?.bio || "No bio"}
                      </Text>
                      <Flex gap="2" wrap="wrap" mb="2">
                        {profile.matchingTags.map((tag: string) => (
                          <div key={tag} className="badge-mint" style={{ fontSize: "11px" }}>
                            {tag}
                          </div>
                        ))}
                      </Flex>
                      <Text size="1" className="text-gradient">
                        {profile.matchScore} matching interest{profile.matchScore > 1 ? "s" : ""}
                      </Text>
                    </Box>
                    <button
                      className="btn-primary"
                      onClick={() => {
                        window.open(
                          `${window.location.origin}?profile=${profile.data?.objectId}`,
                          "_blank"
                        );
                      }}
                      style={{ fontSize: "14px" }}
                    >
                      View Profile →
                    </button>
                  </Flex>
                </div>
              );
            })}
          </Flex>
        </Box>
      )}
    </Box>
  );
};
