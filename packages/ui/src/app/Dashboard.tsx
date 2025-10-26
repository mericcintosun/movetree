import React, { useState, useEffect } from "react";
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

// Apple-style Profile Card Component
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

  // Update links when profile data changes
  useEffect(() => {
    if (existingLinks.length > 0) {
      setLinks(existingLinks.map((url: string) => ({ label: "", url, icon: "" })));
    }
  }, [JSON.stringify(existingLinks)]);

  // Initialize Firebase analytics if needed
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

  // Refresh analytics when component becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && profileId) {
        refreshAnalytics();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
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
    <div className="apple-card apple-card-elevated apple-p-6 apple-animate-scale-in">
      {/* Header with Analytics */}
      <div className="apple-flex apple-flex-between apple-mb-6">
        <h3 className="apple-heading-3">
          {profileData?.name || "Unnamed Profile"}
        </h3>
        <div className="apple-badge apple-badge-primary">
          👁️ {analytics?.profileViews ?? 0} views
        </div>
      </div>

      <p className="apple-text-base apple-mb-4">
        {profileData?.bio || "No bio"}
      </p>

      <p className="apple-text-xs apple-mb-6" style={{ color: "var(--text-tertiary)" }}>
        Object ID: {profileId}
      </p>

      <div className="apple-flex-column apple-gap-6">
        {/* Links Section */}
        <div>
          <h4 className="apple-text-large apple-mb-4" style={{ fontWeight: 600 }}>
            Links
          </h4>
          <div className="apple-flex-column apple-gap-3">
            {links.map((link, index) => (
              <div key={index} className="apple-link-form-row apple-flex apple-gap-3">
                <div className="apple-link-inputs apple-flex apple-gap-2">
                  <input
                    className="apple-input"
                    placeholder="Label"
                    value={link.label}
                    onChange={(e) => updateLink(index, "label", e.target.value)}
                  />
                  <input
                    className="apple-input"
                    placeholder="https://example.com"
                    value={link.url}
                    onChange={(e) => updateLink(index, "url", e.target.value)}
                  />
                  <input
                    className="apple-input"
                    placeholder="Icon (optional)"
                    value={link.icon || ""}
                    onChange={(e) => updateLink(index, "icon", e.target.value)}
                  />
                </div>
                <div className="apple-flex apple-gap-2 apple-flex-center">
                  <div className="apple-badge apple-badge-secondary">
                    {analytics?.linkClicks?.[index] ?? 0} clicks
                  </div>
                  <button
                    className="apple-button apple-button-small"
                    style={{ 
                      backgroundColor: "var(--apple-badge-error)",
                      color: "white",
                      border: "none"
                    }}
                    onClick={() => removeLink(index)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="apple-flex apple-gap-3 apple-mt-4">
            <button className="apple-button apple-button-secondary" onClick={addLink}>
              Add Link
            </button>
            <button
              className="apple-button apple-button-primary"
              onClick={() => onUpdateLinks(profileId, links)}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="apple-loading"></div>
                  Updating...
                </>
              ) : (
                "Update Links"
              )}
            </button>
          </div>
        </div>

        {/* Analytics Chart */}
        {analytics && (
          <div>
            <h4 className="apple-text-large apple-mb-4" style={{ fontWeight: 600 }}>
              📊 Link Performance
            </h4>
            <div className="apple-card apple-p-4">
              {analytics.linkClicks && analytics.linkClicks.length > 0 ? (
                <div className="apple-flex-column apple-gap-3">
                  {links.map((link, index) => {
                    const clicks = analytics.linkClicks[index] || 0;
                    const maxClicks = Math.max(...analytics.linkClicks, 1);
                    const percentage = (clicks / maxClicks) * 100;
                    
                    return (
                      <div key={index}>
                        <div className="apple-flex apple-flex-between apple-mb-2">
                          <span className="apple-text-small">
                            {link.label || link.url.slice(0, 30)}...
                          </span>
                          <span className="apple-text-small" style={{ fontWeight: 600 }}>
                            {clicks} clicks
                          </span>
                        </div>
                        <div style={{
                          height: "8px",
                          backgroundColor: "var(--border-light)",
                          borderRadius: "var(--radius-sm)",
                          overflow: "hidden",
                        }}>
                          <div
                            style={{
                              height: "100%",
                              width: `${percentage}%`,
                              background: "linear-gradient(90deg, var(--primary), var(--apple-blue-light))",
                              transition: "width var(--transition-normal)",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="apple-text-base apple-text-center" style={{ color: "var(--text-tertiary)" }}>
                  No click data yet. Share your profile to see analytics!
                </p>
              )}
            </div>
          </div>
        )}

        {/* Tags Section */}
        <div>
          <h4 className="apple-text-large apple-mb-4" style={{ fontWeight: 600 }}>
            Interest Tags
          </h4>
          
          {/* Selected tags display */}
          {selectedTags.length > 0 && (
            <div className="apple-flex apple-flex-wrap apple-gap-2 apple-mb-4">
              {selectedTags.map((tag) => (
                <div key={tag} className="apple-badge apple-badge-primary">
                  {tag}
                </div>
              ))}
            </div>
          )}

          {/* Available tags */}
          <p className="apple-text-small apple-mb-3" style={{ color: "var(--text-tertiary)" }}>
            Select your interests (click to toggle):
          </p>
          <div className="apple-flex apple-flex-wrap apple-gap-2 apple-mb-4">
            {POPULAR_TAGS.map((tag) => (
              <button
                key={tag}
                className={`apple-badge ${
                  selectedTags.includes(tag) ? "apple-badge-success" : "apple-badge-secondary"
                } apple-pointer`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          <button
            className="apple-button apple-button-secondary"
            onClick={() => onUpdateTags(profileId, selectedTags)}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="apple-loading"></div>
                Updating...
              </>
            ) : (
              "Update Tags"
            )}
          </button>
        </div>

        {/* Blockchain Sync Status */}
        <div>
          <div className="apple-flex apple-flex-between apple-mb-3">
            <h4 className="apple-text-large" style={{ fontWeight: 600 }}>
              Blockchain Sync
            </h4>
            <div className={`apple-badge ${
              isSyncing ? "apple-badge-warning" : "apple-badge-success"
            }`}>
              {isSyncing ? "Syncing..." : "Up to date"}
            </div>
          </div>
          <p className="apple-text-small apple-mb-3" style={{ color: "var(--text-tertiary)" }}>
            Analytics auto-sync to blockchain every 2 days
          </p>
          <button
            className="apple-button apple-button-secondary"
            onClick={performSync}
            disabled={isSyncing}
          >
            {isSyncing ? (
              <>
                <div className="apple-loading"></div>
                Syncing...
              </>
            ) : (
              "Force Sync Now"
            )}
          </button>
        </div>

        {/* Delete Profile */}
        <div>
          <button
            className="apple-button apple-button-small"
            style={{ 
              backgroundColor: "var(--apple-badge-error)",
              color: "white",
              border: "none"
            }}
            onClick={() => onDeleteProfile(profileId)}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="apple-loading"></div>
                Deleting...
              </>
            ) : (
              "Delete Profile"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export const Dashboard = () => {
  const account = useCurrentAccount();
  const { createProfile, updateLinks, updateTags, deleteProfile } =
    useProfileTransactions();
  const { data: profiles, refetch, isLoading: profilesLoading, error: profilesError } = useOwnedProfiles(account?.address || "");

  const [formData, setFormData] = useState({
    name: "",
    avatarCid: "",
    bio: "",
    theme: "dark",
  });

  const [isLoading, setIsLoading] = useState(false);

  // Get current profile's tags for similarity matching
  const currentProfileData = profiles?.data?.[0]?.data?.content as any;
  const currentProfileTags = currentProfileData?.fields?.tags || [];
  const currentProfileId = profiles?.data?.[0]?.data?.objectId;

  // Get similar profiles
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
      alert(`Profile creation failed: ${error.message || error}`);
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

  if (!account) {
    return (
      <div className="apple-text-center apple-p-8">
        <h1 className="apple-heading-2 apple-mb-4">Connect your wallet to create your LinkTree profile</h1>
        <p className="apple-text-large" style={{ color: "var(--text-secondary)" }}>
          Connect your Sui wallet to get started with MoveTree
        </p>
      </div>
    );
  }

  if (profilesLoading) {
    return (
      <div className="apple-text-center apple-p-8">
        <h1 className="apple-heading-2 apple-mb-4">LinkTree Dashboard</h1>
        <div className="apple-flex apple-flex-center apple-gap-3">
          <div className="apple-loading"></div>
          <p className="apple-text-base">Loading your profiles...</p>
        </div>
      </div>
    );
  }

  if (!import.meta.env.VITE_PACKAGE_ID) {
    return (
      <div className="apple-text-center apple-p-8">
        <h1 className="apple-heading-2 apple-mb-4">LinkTree Dashboard</h1>
        <div className="apple-card apple-p-6" style={{ backgroundColor: "var(--apple-badge-error)", color: "white" }}>
          <p className="apple-text-base">
            ⚠️ VITE_PACKAGE_ID environment variable is not set. Please configure it in your .env.local file.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="apple-animate-fade-in">
      <h1 className="apple-heading-2 apple-mb-8 apple-text-center">LinkTree Dashboard</h1>

      {(!profiles?.data || profiles.data.length === 0 || profilesError) ? (
        <div className="apple-card apple-card-elevated apple-p-8" style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2 className="apple-heading-3 apple-mb-6 apple-text-center">
            Create Your Profile
          </h2>
          <div className="apple-flex-column apple-gap-4">
            <div>
              <label className="apple-text-base apple-mb-2" style={{ fontWeight: 600, display: "block" }}>
                Name
              </label>
              <input
                className="apple-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="apple-text-base apple-mb-2" style={{ fontWeight: 600, display: "block" }}>
                Avatar CID
              </label>
              <input
                className="apple-input"
                value={formData.avatarCid}
                onChange={(e) => setFormData({ ...formData, avatarCid: e.target.value })}
                placeholder="IPFS CID for your avatar"
              />
            </div>

            <div>
              <label className="apple-text-base apple-mb-2" style={{ fontWeight: 600, display: "block" }}>
                Bio
              </label>
              <textarea
                className="apple-input"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us about yourself"
                rows={3}
                style={{ resize: "vertical", minHeight: "80px" }}
              />
            </div>

            <div>
              <label className="apple-text-base apple-mb-2" style={{ fontWeight: 600, display: "block" }}>
                Theme
              </label>
              <input
                className="apple-input"
                value={formData.theme}
                onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                placeholder="dark, light, etc."
              />
            </div>

            <button 
              className="apple-button apple-button-primary apple-button-large"
              onClick={handleCreateProfile} 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="apple-loading"></div>
                  Creating...
                </>
              ) : (
                "Create Profile"
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="apple-flex-column apple-gap-6">
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
        </div>
      )}

      {/* Similar Profiles Section */}
      {currentProfileTags.length > 0 && similarProfiles && similarProfiles.length > 0 && (
        <div className="apple-mt-12">
          <h2 className="apple-heading-3 apple-mb-4 apple-text-center">
            Recommended Profiles
          </h2>
          <p className="apple-text-base apple-text-center apple-mb-6" style={{ color: "var(--text-secondary)" }}>
            Based on your interests: {currentProfileTags.join(", ")}
          </p>
          <div className="apple-grid apple-grid-2">
            {similarProfiles.map((profile: any) => {
              const content = profile.data?.content as any;
              const fields = content?.fields;
              return (
                <div key={profile.data?.objectId} className="apple-card apple-p-6 apple-animate-slide-up">
                  <div className="apple-flex apple-flex-between">
                    <div className="apple-flex-column apple-gap-3">
                      <h3 className="apple-heading-4">
                        {fields?.name || "Anonymous"}
                      </h3>
                      <p className="apple-text-base" style={{ color: "var(--text-secondary)" }}>
                        {fields?.bio || "No bio"}
                      </p>
                      <div className="apple-flex apple-flex-wrap apple-gap-2">
                        {profile.matchingTags.map((tag: string) => (
                          <div key={tag} className="apple-badge apple-badge-success">
                            {tag}
                          </div>
                        ))}
                      </div>
                      <p className="apple-text-small" style={{ color: "var(--text-tertiary)" }}>
                        {profile.matchScore} matching interest
                        {profile.matchScore > 1 ? "s" : ""}
                      </p>
                    </div>
                    <button
                      className="apple-button apple-button-primary"
                      onClick={() => {
                        window.open(
                          `${window.location.origin}?profile=${profile.data?.objectId}`,
                          "_blank"
                        );
                      }}
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};