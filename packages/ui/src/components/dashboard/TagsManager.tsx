import React, { useState } from "react";
import { Flex, Text, Heading } from "@radix-ui/themes";
import { FaTag, FaCheck, FaStar } from "react-icons/fa";

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

interface TagsManagerProps {
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  isLoading?: boolean;
  onSave: () => void;
}

export const TagsManager: React.FC<TagsManagerProps> = ({
  selectedTags,
  setSelectedTags,
  isLoading = false,
  onSave,
}) => {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div
      className="card-modern"
      style={{
        padding: "var(--space-6)",
        background: "var(--bg-secondary)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <Heading
        size="5"
        mb="4"
        style={{
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <FaTag /> Interest Tags
      </Heading>

      {selectedTags.length > 0 && (
        <Flex gap="2" wrap="wrap" mb="4">
          {selectedTags.map((tag) => (
            <div
              key={tag}
              className="badge-mint"
              style={{
                padding: "8px 14px",
                fontSize: "13px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <FaCheck size={12} /> {tag}
            </div>
          ))}
        </Flex>
      )}

      <Text size="2" color="gray" mb="3" style={{ fontWeight: 500 }}>
        Select your interests:
      </Text>
      <div className="mobile-tag-grid">
        <Flex gap="2" wrap="wrap" mb="4">
          {POPULAR_TAGS.map((tag) => (
            <div
              key={tag}
              onClick={() => toggleTag(tag)}
              style={{
                padding: "10px 16px",
                borderRadius: "var(--radius-full)",
                border: selectedTags.includes(tag)
                  ? "1.5px solid var(--mint-800)"
                  : "1.5px solid rgba(255, 255, 255, 0.2)",
                background: selectedTags.includes(tag)
                  ? "rgba(55, 197, 179, 0.15)"
                  : "transparent",
                color: selectedTags.includes(tag)
                  ? "var(--mint-700)"
                  : "var(--text-secondary)",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all var(--transition-base)",
              }}
              onMouseEnter={(e) => {
                if (!selectedTags.includes(tag)) {
                  e.currentTarget.style.borderColor = "var(--mint-700)";
                  e.currentTarget.style.background = "rgba(55, 197, 179, 0.05)";
                }
              }}
              onMouseLeave={(e) => {
                if (!selectedTags.includes(tag)) {
                  e.currentTarget.style.borderColor =
                    "rgba(255, 255, 255, 0.2)";
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
        style={{
          fontSize: "14px",
          padding: "12px 24px",
          opacity: isLoading ? 0.6 : 1,
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {isLoading ? (
          "Updating..."
        ) : (
          <>
            <FaStar /> Update Tags
          </>
        )}
      </button>
    </div>
  );
};
