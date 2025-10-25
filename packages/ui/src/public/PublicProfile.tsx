import React, { useState } from "react";
import { Box, Card, Flex, Heading, Text, Button } from "@radix-ui/themes";
import { useProfile } from "../sui/queries";
import { useProfileTransactions } from "../sui/tx";

interface PublicProfileProps {
  objectId: string;
}

export const PublicProfile = ({ objectId }: PublicProfileProps) => {
  const { data: profile, isLoading, error } = useProfile(objectId);
  const { viewLinkEvent } = useProfileTransactions();
  const [clickingIndex, setClickingIndex] = useState<number | null>(null);

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

  const profileData = (profile.data.content as any).fields;
  const links = (profileData.links || []).filter(
    (url: string) => url && url.trim() !== "",
  );

  const handleLinkClick = async (url: string, index: number) => {
    setClickingIndex(index);
    try {
      // Record view event on blockchain
      await viewLinkEvent(objectId, index);
    } catch (error) {
      console.warn("Failed to record view event:", error);
    } finally {
      // Open link regardless of blockchain success
      window.open(url, "_blank", "noopener,noreferrer");
      setClickingIndex(null);
    }
  };

  console.log("Profile data:", profileData);
  console.log("Links:", links);

  return (
    <Box p="4" style={{ maxWidth: 600, margin: "0 auto" }}>
      <Card>
        <Flex direction="column" align="center" gap="4" p="4">
          {/* Avatar */}
          {profileData.avatar_cid && (
            <Box
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                backgroundColor: "var(--gray-3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text size="6">👤</Text>
            </Box>
          )}

          {/* Name */}
          <Heading size="6">{profileData.name || "Anonymous"}</Heading>

          {/* Bio */}
          {profileData.bio && (
            <Text size="3" color="gray" align="center">
              {profileData.bio}
            </Text>
          )}

          {/* Links */}
          <Flex direction="column" gap="2" style={{ width: "100%" }}>
            {links.length > 0 ? (
              links.map((url: string, index: number) => (
                <Button
                  key={index}
                  size="3"
                  style={{ width: "100%" }}
                  onClick={() => handleLinkClick(url, index)}
                  disabled={clickingIndex === index}
                >
                  {clickingIndex === index ? "Recording view..." : url}
                </Button>
              ))
            ) : (
              <Text size="2" color="gray" align="center">
                No links available
              </Text>
            )}
          </Flex>

          {/* Theme indicator */}
          <Text size="1" color="gray">
            Theme: {profileData.theme || "default"}
          </Text>
        </Flex>
      </Card>
    </Box>
  );
};
