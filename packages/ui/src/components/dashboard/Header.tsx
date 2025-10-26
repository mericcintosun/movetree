import React from "react";
import { Flex, Box, Text } from "@radix-ui/themes";
import { FaTrash } from "react-icons/fa";

interface HeaderProps {
  profileName?: string;
  profileId?: string;
  onDelete?: () => void;
  isLoading?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  profileName = "Unnamed Profile",
  profileId,
  onDelete,
  isLoading = false,
}) => {
  return (
    <div
      className="card-modern"
      style={{
        padding: "var(--space-6)",
        marginBottom: "var(--space-5)",
        background: "var(--bg-secondary)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <Flex justify="between" align="center" mb="3">
        <div>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: 700,
              marginBottom: "var(--space-2)",
              background: "var(--gradient-mint)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {profileName}
          </h1>
          <Text size="3" color="gray">
            Manage your profile and analytics
          </Text>
        </div>
        {onDelete && (
          <button
            onClick={onDelete}
            disabled={isLoading}
            style={{
              background: "transparent",
              border: "1.5px solid rgba(255, 100, 100, 0.3)",
              color: "#ff6b6b",
              padding: "12px 24px",
              borderRadius: "var(--radius-full)",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all var(--transition-base)",
              opacity: isLoading ? 0.5 : 1,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 100, 100, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <FaTrash /> Delete Profile
          </button>
        )}
      </Flex>
      {profileId && (
        <Text
          size="1"
          color="gray"
          style={{
            fontFamily: "var(--font-mono)",
            opacity: 0.6,
            fontSize: "12px",
          }}
        >
          Profile ID: {profileId}
        </Text>
      )}
    </div>
  );
};
