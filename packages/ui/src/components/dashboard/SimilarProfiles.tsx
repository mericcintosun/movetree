import React from "react";
import { Flex, Text, Heading } from "@radix-ui/themes";

interface SimilarProfilesProps {
  profiles: any[];
  currentProfileTags: string[];
}

export const SimilarProfiles: React.FC<SimilarProfilesProps> = ({
  profiles,
  currentProfileTags,
}) => {
  if (currentProfileTags.length === 0 || !profiles || profiles.length === 0) {
    return null;
  }

  return (
    <div style={{ marginTop: "var(--space-7)" }}>
      <Heading
        size="6"
        mb="4"
        className="text-gradient-grape"
        style={{ fontWeight: 700 }}
      >
        🌟 Recommended Profiles
      </Heading>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "var(--space-4)",
        }}
      >
        {profiles.map((profile) => {
          const content = profile.data?.content as any;
          const fields = content?.fields;
          return (
            <div
              key={profile.data?.objectId}
              className="card-modern"
              style={{
                padding: "var(--space-5)",
                background: "var(--bg-secondary)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                transition: "all var(--transition-base)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = "rgba(197, 132, 246, 0.3)";
                e.currentTarget.style.boxShadow =
                  "var(--shadow-lg), var(--shadow-glow-grape)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                e.currentTarget.style.boxShadow = "var(--shadow-md)";
              }}
            >
              <Heading size="4" mb="2" style={{ fontWeight: 600 }}>
                {fields?.name || "Anonymous"}
              </Heading>
              <Text size="2" color="gray" mb="3">
                {fields?.bio || "No bio"}
              </Text>
              <Flex gap="2" wrap="wrap" mb="3">
                {profile.matchingTags.map((tag: string) => (
                  <div
                    key={tag}
                    className="badge-mint"
                    style={{ fontSize: "11px" }}
                  >
                    {tag}
                  </div>
                ))}
              </Flex>
              <button
                className="btn-primary"
                onClick={() =>
                  window.open(
                    `${window.location.origin}?profile=${profile.data?.objectId}`,
                    "_blank"
                  )
                }
                style={{ fontSize: "14px", width: "100%" }}
              >
                View Profile →
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
