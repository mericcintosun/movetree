import React, { useState, useEffect } from "react";
import { Box, Card, Flex, Heading, Text, Button, Badge, Avatar } from "@radix-ui/themes";
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
  // Note: link_labels will be available after contract deployment
  // const linkLabels = profileData?.link_labels || [];
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
      
      // Reload analytics
      const updated = await getAnalytics(objectId);
      setAnalytics(updated);
    };

    incrementView();
  }, [objectId, viewIncremented]);

  const handleLinkClick = async (url: string, index: number) => {
    console.log(`Link clicked: ${url} (index: ${index})`);
    setClickingIndex(index);
    
    // Ensure URL has proper protocol
    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }
    
    console.log(`Opening URL: ${finalUrl}`);
    
    // Always open the link first, regardless of analytics
    window.open(finalUrl, "_blank", "noopener,noreferrer");
    
    try {
      // Track click in Firebase (non-blocking)
      console.log(`Tracking click for profile: ${objectId}, link index: ${index}`);
      await incrementLinkClick(objectId, index);
      console.log('Click tracked successfully');
      
      // Reload analytics
      const updated = await getAnalytics(objectId);
      console.log('Reloaded analytics:', updated);
      setAnalytics(updated);
      console.log('Analytics updated successfully');
    } catch (error) {
      console.warn("Failed to record click (link still opened):", error);
      // Don't prevent link opening - analytics is optional
    } finally {
      setClickingIndex(null);
    }
  };

  if (isLoading) {
    return (
      <Box p="4">
        <Text>Loading profile...</Text>
      </Box>
    );
  }

  if (error || !profile?.data?.content) {
    return (
      <Box p="4">
        <Text color="red">Profile not found</Text>
      </Box>
    );
  }

  const avatarUrl = profileData?.avatar_cid 
    ? `https://ipfs.io/ipfs/${profileData.avatar_cid}`
    : undefined;

  console.log("Profile data:", profileData);
  console.log("Links:", links);
  console.log("Analytics:", analytics);

  return (
    <Box p="4" style={{ maxWidth: 600, margin: "0 auto" }}>
      <Card>
        <Flex direction="column" align="center" gap="4" p="4">
          {/* Avatar with View Count */}
          <Flex direction="column" align="center" gap="2">
            <Avatar
              size="8"
              src={avatarUrl}
              fallback={profileData?.name?.charAt(0) || "?"}
              radius="full"
            />
            <Badge size="2" color="blue" radius="full">
              👁️ {analytics?.profileViews || 0} views
            </Badge>
          </Flex>

          {/* Name */}
          <Heading size="6">{profileData?.name || "Anonymous"}</Heading>

          {/* Bio */}
          {profileData?.bio && (
            <Text size="3" color="gray" align="center">
              {profileData.bio}
            </Text>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <Flex gap="2" wrap="wrap" justify="center">
              {tags.map((tag: string) => (
                <Badge key={tag} size="2" color="purple">
                  {tag}
                </Badge>
              ))}
            </Flex>
          )}

          {/* Links */}
          <Flex direction="column" gap="2" style={{ width: "100%" }}>
            {links.length > 0 ? (
              links.map((url: string, index: number) => {
                const clicks = analytics?.linkClicks?.[index] || 0;
                // For now, show URL as label until new contract is deployed
                const label = url;
                
                return (
                  <Box key={index} style={{ position: "relative" }}>
                    <Button
                      size="3"
                      style={{ width: "100%" }}
                      onClick={() => handleLinkClick(url, index)}
                      disabled={clickingIndex === index}
                    >
                      {clickingIndex === index ? "Opening..." : label}
                    </Button>
                    <Badge 
                      color="gray" 
                      variant="soft" 
                      size="1"
                      style={{ 
                        position: "absolute", 
                        top: "8px", 
                        right: "12px",
                        pointerEvents: "none"
                      }}
                    >
                      {clicks} clicks
                    </Badge>
                  </Box>
                );
              })
            ) : (
              <Text size="2" color="gray" align="center">
                No links available
              </Text>
            )}
          </Flex>

          {/* Theme indicator */}
          <Text size="1" color="gray">
            Theme: {profileData?.theme || "default"} | Powered by MoveTree on Sui 🌳
          </Text>
        </Flex>
      </Card>
    </Box>
  );
};
