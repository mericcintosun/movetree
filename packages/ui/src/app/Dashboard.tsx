import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Badge,
  Grid,
  Card,
  Section,
} from "@radix-ui/themes";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { useProfileTransactions } from "../sui/tx";
import { useOwnedProfiles, useSimilarProfiles } from "../sui/queries";
import { useFirebaseAnalytics } from "../hooks/useAnalytics";
import { useBlockchainSync } from "../hooks/useBlockchainSync";
import { updateAnalyticsLinks, initializeAnalytics, getAnalytics, deleteAnalytics } from "../firebase/analytics";

interface LinkItem {
  label: string;
  url: string;
  icon?: string;
}

const POPULAR_TAGS = [
  "Developer", "Designer", "Blockchain", "Web3", "AI/ML", "DeFi",
  "NFT", "Gaming", "Content Creator", "Marketing", "Business", "Entrepreneur",
];

// Profile Stats Component
const ProfileStats = ({ analytics }: any) => (
  <div style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "var(--space-3)",
    marginBottom: "var(--space-5)",
  }}>
    <div className="card-modern" style={{ padding: "var(--space-4)", textAlign: "center" }}>
      <div style={{ fontSize: "28px", fontWeight: 700, color: "var(--mint-700)" }}>
        {analytics?.profileViews ?? 0}
      </div>
      <Text size="2" color="gray">Profile Views</Text>
    </div>
    <div className="card-modern" style={{ padding: "var(--space-4)", textAlign: "center" }}>
      <div style={{ fontSize: "28px", fontWeight: 700, color: "var(--grape-700)" }}>
        {analytics?.linkClicks?.reduce((a: number, b: number) => a + b, 0) ?? 0}
      </div>
      <Text size="2" color="gray">Total Clicks</Text>
    </div>
  </div>
);

// Link Manager Component
const LinkManager = ({ links, setLinks, analytics, isLoading, onSave }: any) => {
  const addLink = () => {
    setLinks([...links, { label: "", url: "", icon: "" }]);
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_: any, i: number) => i !== index));
  };

  const updateLink = (index: number, field: keyof LinkItem, value: string) => {
    const newLinks = [...links];
    newLinks[index][field] = value;
    setLinks(newLinks);
  };

  return (
    <div className="card-modern" style={{ padding: "var(--space-6)" }}>
      <Heading size="5" mb="4" style={{ fontWeight: 600 }}>
        🔗 Manage Links
      </Heading>
      
      <Flex direction="column" gap="3" mb="4">
        {links.map((link: LinkItem, index: number) => (
          <div key={index} style={{
            background: "var(--bg-tertiary)",
            padding: "var(--space-4)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-light)",
          }}>
            <Grid columns="2" gap="2" mb="2">
              <input
                className="input-modern"
                placeholder="Label"
                value={link.label}
                onChange={(e) => updateLink(index, "label", e.target.value)}
                style={{ padding: "10px 12px", fontSize: "14px" }}
              />
              <input
                className="input-modern"
                placeholder="https://..."
                value={link.url}
                onChange={(e) => updateLink(index, "url", e.target.value)}
                style={{ padding: "10px 12px", fontSize: "14px" }}
              />
            </Grid>
            
            <Flex justify="between" align="center">
              <div className="badge-grape" style={{ fontSize: "11px" }}>
                {analytics?.linkClicks?.[index] ?? 0} clicks
              </div>
              <button
                className="btn-outline"
                onClick={() => removeLink(index)}
                style={{
                  padding: "6px 14px",
                  fontSize: "12px",
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

      <Flex gap="2">
        <button
          className="btn-outline"
          onClick={addLink}
          style={{ fontSize: "14px" }}
        >
          + Add Link
        </button>
        <button
          className="btn-primary"
          onClick={onSave}
          disabled={isLoading}
          style={{ fontSize: "14px", opacity: isLoading ? 0.6 : 1 }}
        >
          {isLoading ? "Saving..." : "💾 Save Changes"}
        </button>
      </Flex>
    </div>
  );
};

// Tags Manager Component
const TagsManager = ({ selectedTags, setSelectedTags, isLoading, onSave }: any) => {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t: string) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="card-modern" style={{ padding: "var(--space-6)" }}>
      <Flex direction="column" gap="4">
        <Heading size="5" style={{ fontWeight: 600 }}>
          🏷️ Interest Tags
        </Heading>

        {selectedTags.length > 0 && (
          <div style={{
            background: "var(--bg-tertiary)",
            padding: "var(--space-4)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-light)",
          }}>
            <Text size="2" style={{ color: "var(--text-secondary)", marginBottom: "var(--space-3)", display: "block" }}>
              Selected Tags ({selectedTags.length}):
            </Text>
            <Flex gap="2" wrap="wrap">
              {selectedTags.map((tag: string) => (
                <div key={tag} className="badge-mint" style={{ padding: "8px 14px", fontSize: "13px" }}>
                  ✓ {tag}
                </div>
              ))}
            </Flex>
          </div>
        )}

        <div>
          <Text size="2" style={{ color: "var(--text-secondary)", marginBottom: "var(--space-3)", display: "block" }}>
            Select your interests:
          </Text>
          <Flex gap="2" wrap="wrap">
            {POPULAR_TAGS.map((tag) => (
              <div
                key={tag}
                onClick={() => toggleTag(tag)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "var(--radius-full)",
                  border: selectedTags.includes(tag)
                    ? "1.5px solid var(--mint-800)"
                    : "1.5px solid var(--border-light)",
                  background: selectedTags.includes(tag)
                    ? "rgba(55, 197, 179, 0.15)"
                    : "transparent",
                  color: selectedTags.includes(tag) ? "var(--mint-700)" : "var(--text-secondary)",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all var(--transition-base)",
                }}
                onMouseEnter={(e) => {
                  if (!selectedTags.includes(tag)) {
                    e.currentTarget.style.borderColor = "var(--border-medium)";
                    e.currentTarget.style.background = "var(--bg-tertiary)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!selectedTags.includes(tag)) {
                    e.currentTarget.style.borderColor = "var(--border-light)";
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                {tag}
              </div>
            ))}
          </Flex>
        </div>

        <button
          className="btn-secondary"
          onClick={onSave}
          disabled={isLoading}
          style={{ fontSize: "14px", opacity: isLoading ? 0.6 : 1, width: "100%" }}
        >
          {isLoading ? "Updating..." : "💫 Update Tags"}
        </button>
      </Flex>
    </div>
  );
};

// Analytics Chart Component
const AnalyticsChart = ({ links, analytics }: any) => {
  if (!analytics || !analytics.linkClicks || analytics.linkClicks.length === 0) {
    return null;
  }

  const maxClicks = Math.max(...analytics.linkClicks, 1);
  const totalClicks = analytics.linkClicks.reduce((a: number, b: number) => a + b, 0);

  return (
    <div className="card-modern" style={{ padding: "var(--space-6)" }}>
      <Flex justify="between" align="center" mb="4">
        <Heading size="5" style={{ fontWeight: 600 }}>
          📊 Performance Analytics
        </Heading>
        <div className="badge-grape" style={{ fontSize: "12px", padding: "6px 14px" }}>
          {totalClicks} total clicks
        </div>
      </Flex>
      
      <Flex direction="column" gap="4">
        {links.map((link: LinkItem, index: number) => {
          const clicks = analytics.linkClicks[index] || 0;
          const percentage = maxClicks > 0 ? (clicks / maxClicks) * 100 : 0;
          
          return (
            <div key={index} style={{
              background: "var(--bg-tertiary)",
              padding: "var(--space-4)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-light)",
              transition: "all var(--transition-base)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.borderColor = "var(--mint-700)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "var(--border-light)";
            }}
            >
              <Flex justify="between" align="center" mb="3">
                <div style={{ flex: 1 }}>
                  <Text size="2" style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px", display: "block" }}>
                    {link.label || "Unlabeled Link"}
                  </Text>
                  <Text size="1" style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-mono)", fontSize: "11px" }}>
                    {link.url.length > 50 ? link.url.slice(0, 50) + "..." : link.url}
                  </Text>
                </div>
                <div style={{ textAlign: "right", marginLeft: "var(--space-4)" }}>
                  <div style={{ 
                    fontSize: "24px", 
                    fontWeight: 700, 
                    background: "var(--gradient-mint)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}>
                    {clicks}
                  </div>
                  <Text size="1" color="gray" style={{ fontSize: "11px" }}>
                    clicks
                  </Text>
                </div>
              </Flex>
              
              <div style={{
                height: "10px",
                background: "var(--bg-secondary)",
                borderRadius: "var(--radius-full)",
                overflow: "hidden",
                border: "1px solid var(--border-light)",
                position: "relative",
              }}>
                <div style={{
                  height: "100%",
                  width: `${percentage}%`,
                  background: index % 2 === 0 
                    ? "linear-gradient(90deg, var(--mint-900) 0%, var(--mint-700) 100%)"
                    : "linear-gradient(90deg, var(--grape-900) 0%, var(--grape-700) 100%)",
                  transition: "width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  boxShadow: index % 2 === 0
                    ? "0 0 12px rgba(55, 197, 179, 0.5)"
                    : "0 0 12px rgba(197, 132, 246, 0.5)",
                  borderRadius: "var(--radius-full)",
                }} />
              </div>
            </div>
          );
        })}
      </Flex>
      
      {totalClicks === 0 && (
        <Text size="2" color="gray" style={{ textAlign: "center", marginTop: "var(--space-4)", fontStyle: "italic" }}>
          No clicks yet. Share your profile to start tracking!
        </Text>
      )}
    </div>
  );
};

// Blockchain Sync Component
const BlockchainSync = ({ isSyncing, performSync }: any) => (
  <div className="card-modern" style={{ padding: "var(--space-6)" }}>
    <Flex direction="column" gap="4">
      <Flex justify="between" align="center">
        <Heading size="5" style={{ fontWeight: 600 }}>
          ⛓️ Blockchain Sync
        </Heading>
        <div className={isSyncing ? "badge-grape" : "badge-mint"} style={{ 
          fontSize: "11px",
          padding: "6px 12px",
        }}>
          {isSyncing ? "⏳ Syncing..." : "✓ Up to date"}
        </div>
      </Flex>
      
      <div style={{
        background: "var(--bg-tertiary)",
        padding: "var(--space-4)",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border-light)",
      }}>
        <Text size="2" style={{ color: "var(--text-secondary)", marginBottom: "var(--space-3)", display: "block" }}>
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
            width: "100%",
          }}
        >
          {isSyncing ? "⏳ Syncing..." : "🔄 Force Sync Now"}
        </button>
      </div>
    </Flex>
  </div>
);

// Main Profile Card Component
const ProfileCard = ({
  profile,
  onUpdateLinks,
  onUpdateTags,
  onDeleteProfile,
  isLoading,
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

  // Load links with labels from Firebase
  useEffect(() => {
    if (existingLinks.length === 0) return;
    
    // If we have analytics with labels, use them
    if (analytics?.linkLabels && analytics.linkLabels.length > 0) {
      setLinks(existingLinks.map((url: string, index: number) => ({
        label: analytics.linkLabels?.[index] || "",
        url,
        icon: "",
      })));
    } else {
      // Otherwise just set URLs with empty labels
      setLinks(existingLinks.map((url: string) => ({ label: "", url, icon: "" })));
    }
  }, [JSON.stringify(existingLinks), analytics?.linkLabels?.length]);

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
      if (!document.hidden && profileId) refreshAnalytics();
    };
    const handleFocus = () => {
      if (profileId) refreshAnalytics();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [profileId, refreshAnalytics]);

  return (
    <div className="fade-in">
      {/* Profile Header */}
      <div className="card-modern" style={{ padding: "var(--space-6)", marginBottom: "var(--space-5)" }}>
        <Flex justify="between" align="center" mb="3">
          <div>
            <Heading size="7" style={{ fontWeight: 700, marginBottom: "var(--space-2)" }}>
              {profileData?.name || "Unnamed Profile"}
            </Heading>
            <Text size="3" color="gray">
              {profileData?.bio || "No bio"}
            </Text>
          </div>
          <button
            onClick={() => onDeleteProfile(profileId)}
            disabled={isLoading}
            style={{
              background: "transparent",
              border: "1.5px solid rgba(255, 100, 100, 0.3)",
              color: "#ff6b6b",
              padding: "10px 20px",
              borderRadius: "var(--radius-full)",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all var(--transition-base)",
              opacity: isLoading ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 100, 100, 0.1)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            🗑️ Delete Profile
          </button>
        </Flex>
        <Text size="1" color="gray" style={{ fontFamily: "var(--font-mono)", opacity: 0.6 }}>
          Profile ID: {profileId}
        </Text>
      </div>

      {/* Stats - Now Separate */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "var(--space-4)",
        marginBottom: "var(--space-5)",
      }}>
        <div className="card-modern" style={{ padding: "var(--space-5)", textAlign: "center" }}>
          <div style={{ 
            fontSize: "32px", 
            fontWeight: 700, 
            background: "var(--gradient-mint)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: "var(--space-2)",
          }}>
            {analytics?.profileViews ?? 0}
          </div>
          <Text size="2" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.5px", fontSize: "12px" }}>
            Profile Views
          </Text>
        </div>
        
        <div className="card-modern" style={{ padding: "var(--space-5)", textAlign: "center" }}>
          <div style={{ 
            fontSize: "32px", 
            fontWeight: 700, 
            background: "var(--gradient-grape)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: "var(--space-2)",
          }}>
            {analytics?.linkClicks?.reduce((a: number, b: number) => a + b, 0) ?? 0}
          </div>
          <Text size="2" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.5px", fontSize: "12px" }}>
            Total Clicks
          </Text>
        </div>
        
        <div className="card-modern" style={{ padding: "var(--space-5)", textAlign: "center" }}>
          <div style={{ 
            fontSize: "32px", 
            fontWeight: 700, 
            background: "var(--gradient-sunset)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: "var(--space-2)",
          }}>
            {links.length}
          </div>
          <Text size="2" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.5px", fontSize: "12px" }}>
            Active Links
          </Text>
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "var(--space-5)",
        marginBottom: "var(--space-5)",
      }}>
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
          <LinkManager
            links={links}
            setLinks={setLinks}
            analytics={analytics}
            isLoading={isLoading}
            onSave={() => onUpdateLinks(profileId, links)}
          />
          <AnalyticsChart links={links} analytics={analytics} />
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
          <TagsManager
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            isLoading={isLoading}
            onSave={() => onUpdateTags(profileId, selectedTags)}
          />
          <BlockchainSync isSyncing={isSyncing} performSync={performSync} />
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
export const Dashboard = () => {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const { createProfile, updateLinks, updateTags, deleteProfile } = useProfileTransactions();
  const { data: profiles, refetch, isLoading: profilesLoading, error: profilesError } = useOwnedProfiles(account?.address || "");

  const [formData, setFormData] = useState({
    name: "",
    avatarCid: "",
    bio: "",
    theme: "dark",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [overrideProfiles, setOverrideProfiles] = useState<any[] | null>(null);

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
    
    // Normalize name -> slug for URL usage (lowercase, hyphenated)
    const nameSlug = formData.name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    // Prepare values used later in refresh/registration
    const initialList = profiles?.data || [];
    const initialIds = new Set((initialList as any[]).map((p: any) => p?.data?.objectId).filter(Boolean));
    const initialCount = initialList.length;
    setIsLoading(true);
    try {
      await createProfile(
        formData.name,
        formData.avatarCid,
        formData.bio,
        formData.theme,
      );
      await refetch();
      for (let i = 0; i < 8; i++) {
        const result: any = await refetch();
        const currCount = result?.data?.data?.length || 0;
        if (currCount > initialCount) break;
        await new Promise((r) => setTimeout(r, 800));
      }
      // Derive created objectId by diff if not previously registered
      try {
        const latest: any = await refetch();
        const latestList = (latest?.data?.data || []) as any[];
        const newItem = latestList.find((p: any) => p?.data?.objectId && !initialIds.has(p.data.objectId));
        const derivedId: string | undefined = newItem?.data?.objectId;
        if (derivedId) {
          const backendUrl = (import.meta as any).env?.VITE_BACKEND_URL as string | undefined;
          if (!backendUrl) {
            console.warn("[name-register:derived] VITE_BACKEND_URL is not set");
          } else {
            console.log("[name-register:derived] registering", nameSlug, derivedId);
            await fetch(`${backendUrl}/api/profile-name/register`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name: nameSlug, objectId: derivedId, owner: account.address }),
            });
          }
        }
      } catch (e) {
        console.warn("[name-register:derived] failed", e);
      }
      // Clear override after successful refresh
      setOverrideProfiles(null);
      // Reset form for next profile creation
      setFormData({ name: "", avatarCid: "", bio: "", theme: "dark" });
      alert("Profile created successfully! You can view it at /" + nameSlug);
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
      const urls = links.map((l) => l.url).filter((url) => url && url.trim() !== "");
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
    if (!confirm("Are you sure you want to delete this profile? This action cannot be undone.")) {
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
        <div style={{ fontSize: "64px", marginBottom: "var(--space-5)" }}>🔐</div>
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

  if (!(import.meta as any).env?.VITE_PACKAGE_ID) {
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

      {/* Similar Profiles */}
      {currentProfileTags.length > 0 && similarProfiles && similarProfiles.length > 0 && (
        <Box mt="7">
          <Heading size="6" mb="4" className="text-gradient-grape" style={{ fontWeight: 700 }}>
            🌟 Recommended Profiles
          </Heading>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "var(--space-4)",
          }}>
            {similarProfiles.map((profile: any) => {
              const content = profile.data?.content as any;
              const fields = content?.fields;
              return (
                <div key={profile.data?.objectId} className="card-modern" style={{ padding: "var(--space-5)" }}>
                  <Heading size="4" mb="2" style={{ fontWeight: 600 }}>
                    {fields?.name || "Anonymous"}
                  </Heading>
                  <Text size="2" color="gray" mb="3">
                    {fields?.bio || "No bio"}
                  </Text>
                  <Flex gap="2" wrap="wrap" mb="3">
                    {profile.matchingTags.map((tag: string) => (
                      <div key={tag} className="badge-mint" style={{ fontSize: "11px" }}>
                        {tag}
                      </div>
                    ))}
                  </Flex>
                  <button
                    className="btn-primary"
                    onClick={() => window.open(`${window.location.origin}?profile=${profile.data?.objectId}`, "_blank")}
                    style={{ fontSize: "14px", width: "100%" }}
                  >
                    View Profile →
                  </button>
                </div>
              );
            })}
          </div>
        </Box>
      )}
    </Box>
  );
};
