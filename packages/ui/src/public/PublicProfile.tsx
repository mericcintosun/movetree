import React, { useState, useEffect } from "react";
import { useProfile } from "../sui/queries";
import { 
  getAnalytics, 
  incrementProfileView, 
  incrementLinkClick 
} from "../firebase/analytics";

interface PublicProfileProps {
  objectId: string;
}

export const PublicProfile = ({ objectId }: PublicProfileProps) => {
  const { data: profile, isLoading, error } = useProfile(objectId);
  const [analytics, setAnalytics] = useState<any>(null);
  const [viewIncremented, setViewIncremented] = useState(false);
  const [clickingIndex, setClickingIndex] = useState<number | null>(null);

  const profileData = (profile?.data?.content as any)?.fields;
  const links = (profileData?.links || []).filter(
    (url: string) => url && url.trim() !== "",
  );
  const tags = profileData?.tags || [];

  // Load analytics from Firebase
  useEffect(() => {
    if (!objectId) return;

    const loadAnalytics = async () => {
      const data = await getAnalytics(objectId);
      setAnalytics(data);
    };

    loadAnalytics();
  }, [objectId]);

  // Increment view count (once per page load)
  useEffect(() => {
    if (!objectId || viewIncremented) return;

    const incrementView = async () => {
      await incrementProfileView(objectId);
      setViewIncremented(true);
      
      const updated = await getAnalytics(objectId);
      setAnalytics(updated);
    };

    incrementView();
  }, [objectId, viewIncremented]);

  const handleLinkClick = async (url: string, index: number) => {
    setClickingIndex(index);
    
    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }
    
    window.open(finalUrl, "_blank", "noopener,noreferrer");
    
    try {
      await incrementLinkClick(objectId, index);
      const updated = await getAnalytics(objectId);
      setAnalytics(updated);
    } catch (error) {
      console.warn("Failed to record click (link still opened):", error);
    } finally {
      setClickingIndex(null);
    }
  };

  if (isLoading) {
    return (
      <div className="apple-text-center apple-p-8">
        <div className="apple-flex apple-flex-center apple-gap-3">
          <div className="apple-loading"></div>
          <p className="apple-text-base">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile?.data?.content) {
    return (
      <div className="apple-text-center apple-p-8">
        <div className="apple-card apple-p-6" style={{ backgroundColor: "var(--apple-badge-error)", color: "white" }}>
          <p className="apple-text-base">Profile not found</p>
        </div>
      </div>
    );
  }

  const avatarUrl = profileData?.avatar_cid 
    ? `https://ipfs.io/ipfs/${profileData.avatar_cid}`
    : undefined;

  return (
    <div className="apple-animate-fade-in" style={{ maxWidth: "500px", margin: "0 auto" }}>
      <div className="apple-card apple-card-elevated apple-p-8">
        <div className="apple-flex-column apple-flex-center apple-gap-6">
          {/* Avatar with View Count */}
          <div className="apple-flex-column apple-flex-center apple-gap-3">
            <div style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              background: avatarUrl ? `url(${avatarUrl})` : "linear-gradient(135deg, var(--primary), var(--apple-blue-light))",
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "48px",
              fontWeight: "600",
              color: "white",
              boxShadow: "var(--shadow-lg)",
              border: "4px solid var(--surface-elevated)"
            }}>
              {!avatarUrl && (profileData?.name?.charAt(0) || "?")}
            </div>
            <div className="apple-badge apple-badge-primary">
              👁️ {analytics?.profileViews || 0} views
            </div>
          </div>

          {/* Name */}
          <h1 className="apple-heading-2 apple-text-center">
            {profileData?.name || "Anonymous"}
          </h1>

          {/* Bio */}
          {profileData?.bio && (
            <p className="apple-text-large apple-text-center" style={{ color: "var(--text-secondary)" }}>
              {profileData.bio}
            </p>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="apple-flex apple-flex-wrap apple-gap-2 apple-flex-center">
              {tags.map((tag: string) => (
                <div key={tag} className="apple-badge apple-badge-secondary">
                  {tag}
                </div>
              ))}
            </div>
          )}

          {/* Links */}
          <div className="apple-flex-column apple-gap-3 apple-w-full">
            {links.length > 0 ? (
              links.map((url: string, index: number) => {
                const clicks = analytics?.linkClicks?.[index] || 0;
                const label = url;
                
                return (
                  <div key={index} style={{ position: "relative" }}>
                    <button
                      className="apple-button apple-button-primary apple-w-full"
                      style={{ 
                        padding: "var(--space-4) var(--space-6)",
                        fontSize: "var(--font-size-lg)",
                        borderRadius: "var(--radius-xl)",
                        position: "relative",
                        overflow: "hidden"
                      }}
                      onClick={() => handleLinkClick(url, index)}
                      disabled={clickingIndex === index}
                    >
                      {clickingIndex === index ? (
                        <>
                          <div className="apple-loading"></div>
                          Opening...
                        </>
                      ) : (
                        label
                      )}
                    </button>
                    <div 
                      className="apple-badge apple-badge-secondary"
                      style={{ 
                        position: "absolute", 
                        top: "var(--space-2)", 
                        right: "var(--space-3)",
                        pointerEvents: "none",
                        fontSize: "var(--font-size-xs)"
                      }}
                    >
                      {clicks} clicks
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="apple-text-center apple-p-6">
                <p className="apple-text-base" style={{ color: "var(--text-tertiary)" }}>
                  No links available
                </p>
              </div>
            )}
          </div>

          {/* Theme indicator */}
          <div className="apple-text-center">
            <p className="apple-text-xs" style={{ color: "var(--text-tertiary)" }}>
              Theme: {profileData?.theme || "default"} | Powered by MoveTree on Sui 🌳
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
