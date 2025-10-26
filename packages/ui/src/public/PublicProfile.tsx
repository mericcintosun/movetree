import React, { useState, useEffect } from "react";
import { Box, Flex, Heading, Text, Avatar } from "@radix-ui/themes";
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
      console.warn("Failed to record click:", error);
    } finally {
      setClickingIndex(null);
    }
  };

  if (isLoading) {
    return (
      <Box className="fade-in" style={{ 
        maxWidth: 600, 
        margin: "0 auto",
        textAlign: "center",
        padding: "var(--space-8) 0",
      }}>
        <div className="skeleton" style={{ 
          width: "120px", 
          height: "120px", 
          borderRadius: "var(--radius-full)",
          margin: "0 auto var(--space-5)",
        }} />
        <div className="skeleton" style={{ 
          width: "200px", 
          height: "32px", 
          margin: "0 auto var(--space-3)",
        }} />
        <div className="skeleton" style={{ 
          width: "300px", 
          height: "20px", 
          margin: "0 auto",
        }} />
      </Box>
    );
  }

  if (error || !profile?.data?.content) {
    return (
      <Box className="fade-in" style={{ 
        maxWidth: 600, 
        margin: "0 auto",
        textAlign: "center",
        padding: "var(--space-8)",
      }}>
        <div style={{ fontSize: "64px", marginBottom: "var(--space-4)" }}>
          😕
        </div>
        <Heading size="5" mb="2" style={{ color: "#ff6b6b" }}>
          Profile not found
        </Heading>
        <Text color="gray">
          The profile you're looking for doesn't exist or has been deleted.
        </Text>
      </Box>
    );
  }

  const avatarUrl = profileData?.avatar_cid 
    ? `https://ipfs.io/ipfs/${profileData.avatar_cid}`
    : undefined;

  return (
    <Box className="fade-in" style={{ 
      maxWidth: 600, 
      margin: "0 auto",
      padding: "var(--space-6) 0",
    }}>
      <div className="card-modern" style={{
        padding: "var(--space-7)",
        background: "var(--bg-secondary)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative gradient background */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "200px",
          background: "var(--gradient-sunset)",
          opacity: 0.1,
          filter: "blur(40px)",
          zIndex: 0,
        }} />

        <Flex direction="column" align="center" gap="5" style={{ position: "relative", zIndex: 1 }}>
          {/* Avatar with View Count */}
          <Flex direction="column" align="center" gap="3">
            <div style={{ position: "relative" }}>
              <Avatar
                size="8"
                src={avatarUrl}
                fallback={profileData?.name?.charAt(0) || "?"}
                radius="full"
                style={{
                  width: "120px",
                  height: "120px",
                  border: "4px solid var(--bg-secondary)",
                  boxShadow: "var(--shadow-lg), var(--shadow-glow-mint)",
                }}
              />
              <div 
                className="badge-mint"
                style={{
                  position: "absolute",
                  bottom: "0",
                  right: "-10px",
                  padding: "6px 12px",
                  fontSize: "12px",
                  fontWeight: 600,
                  boxShadow: "var(--shadow-md)",
                }}
              >
                👁️ {analytics?.profileViews || 0}
              </div>
            </div>
          </Flex>

          {/* Name */}
          <Heading 
            size="8" 
            style={{ 
              fontWeight: 700,
              textAlign: "center",
              letterSpacing: "-0.02em",
            }}
          >
            {profileData?.name || "Anonymous"}
          </Heading>

          {/* Bio */}
          {profileData?.bio && (
            <Text 
              size="3" 
              color="gray" 
              align="center"
              style={{
                maxWidth: "400px",
                lineHeight: 1.6,
              }}
            >
              {profileData.bio}
            </Text>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <Flex gap="2" wrap="wrap" justify="center">
              {tags.map((tag: string) => (
                <div 
                  key={tag} 
                  className="badge-grape"
                  style={{
                    padding: "8px 16px",
                    fontSize: "13px",
                  }}
                >
                  {tag}
                </div>
              ))}
            </Flex>
          )}

          {/* Links */}
          <Flex direction="column" gap="3" style={{ width: "100%", marginTop: "var(--space-4)" }}>
            {links.length > 0 ? (
              links.map((url: string, index: number) => {
                const clicks = analytics?.linkClicks?.[index] || 0;
                const label = url;
                
                return (
                  <div key={index} style={{ position: "relative" }}>
                    <button
                      onClick={() => handleLinkClick(url, index)}
                      disabled={clickingIndex === index}
                      style={{
                        width: "100%",
                        padding: "18px 24px",
                        background: "var(--bg-tertiary)",
                        border: "1.5px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "var(--radius-lg)",
                        color: "var(--text-primary)",
                        fontSize: "15px",
                        fontWeight: 500,
                        cursor: clickingIndex === index ? "wait" : "pointer",
                        transition: "all var(--transition-base)",
                        textAlign: "center",
                        fontFamily: "var(--font-body)",
                        position: "relative",
                        overflow: "hidden",
                      }}
                      onMouseEnter={(e) => {
                        if (clickingIndex !== index) {
                          e.currentTarget.style.background = "var(--bg-elevated)";
                          e.currentTarget.style.borderColor = "var(--mint-800)";
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "var(--shadow-md), var(--shadow-glow-mint)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (clickingIndex !== index) {
                          e.currentTarget.style.background = "var(--bg-tertiary)";
                          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "none";
                        }
                      }}
                    >
                      {/* Hover gradient effect */}
                      <div style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "var(--gradient-mint)",
                        opacity: 0,
                        transition: "opacity var(--transition-base)",
                        pointerEvents: "none",
                      }} 
                      onMouseEnter={(e) => {
                        if (clickingIndex !== index) {
                          e.currentTarget.style.opacity = "0.05";
                        }
                      }}
                      />
                      
                      <span style={{ position: "relative", zIndex: 1 }}>
                        {clickingIndex === index ? "Opening..." : label}
                      </span>
                    </button>
                    
                    {/* Click count badge */}
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        right: "20px",
                        transform: "translateY(-50%)",
                        background: "rgba(197, 132, 246, 0.15)",
                        color: "var(--grape-700)",
                        padding: "4px 10px",
                        borderRadius: "var(--radius-full)",
                        fontSize: "11px",
                        fontWeight: 600,
                        border: "1px solid rgba(197, 132, 246, 0.3)",
                        pointerEvents: "none",
                      }}
                    >
                      {clicks} 🔥
                    </div>
                  </div>
                );
              })
            ) : (
              <Box style={{ 
                textAlign: "center", 
                padding: "var(--space-6)",
                color: "var(--text-tertiary)",
              }}>
                <div style={{ fontSize: "48px", marginBottom: "var(--space-3)" }}>
                  🔗
                </div>
                <Text size="2">
                  No links available yet
                </Text>
              </Box>
            )}
          </Flex>

          {/* Footer */}
          <Text 
            size="1" 
            color="gray" 
            align="center"
            style={{
              marginTop: "var(--space-5)",
              opacity: 0.5,
            }}
          >
            Theme: {profileData?.theme || "default"} • Powered by{" "}
            <span className="text-gradient">MoveTree</span> on Sui 🌳
          </Text>
        </Flex>
      </div>
    </Box>
  );
};
