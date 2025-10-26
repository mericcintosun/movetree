import React, { useState } from "react";
import { Flex, Text, Heading } from "@radix-ui/themes";
import { FaLink, FaEye, FaEdit, FaTrash, FaPlus, FaSave } from "react-icons/fa";

interface LinkItem {
  label: string;
  url: string;
  icon?: string;
}

interface LinkManagerProps {
  links: LinkItem[];
  setLinks: (links: LinkItem[]) => void;
  analytics?: any;
  isLoading?: boolean;
  onSave: () => void;
}

export const LinkManager: React.FC<LinkManagerProps> = ({
  links,
  setLinks,
  analytics,
  isLoading = false,
  onSave,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);

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

  const getDomainFromUrl = (url: string) => {
    if (!url) return "Link";
    try {
      const domain = new URL(url).hostname.replace("www.", "");
      return domain.split(".")[0];
    } catch {
      return url.length > 20 ? url.slice(0, 20) + "..." : url;
    }
  };

  const hasValidLinks = links.some(
    (link) => link.url && link.url.trim() !== ""
  );

  return (
    <div
      className="card-modern"
      style={{
        padding: "var(--space-6)",
        background: "var(--bg-secondary)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <Flex justify="between" align="center" mb="4">
        <Heading
          size="5"
          style={{
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <FaLink /> Your Links
        </Heading>
        <button
          className="btn-outline"
          onClick={() => setIsEditMode(!isEditMode)}
          style={{
            fontSize: "13px",
            padding: "8px 16px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          {isEditMode ? (
            <>
              <FaEye /> View Mode
            </>
          ) : (
            <>
              <FaEdit /> Edit Mode
            </>
          )}
        </button>
      </Flex>

      {isEditMode ? (
        // Edit Mode - Original functionality
        <>
          <Flex direction="column" gap="3" mb="4">
            {links.map((link, index) => (
              <div
                key={index}
                style={{
                  background: "var(--bg-tertiary)",
                  padding: "var(--space-4)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  transition: "all var(--transition-base)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(55, 197, 179, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor =
                    "rgba(255, 255, 255, 0.06)";
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "var(--space-3)",
                    marginBottom: "var(--space-3)",
                  }}
                >
                  <input
                    className="input-modern"
                    placeholder="Label"
                    value={link.label}
                    onChange={(e) => updateLink(index, "label", e.target.value)}
                    style={{
                      padding: "12px 16px",
                      fontSize: "14px",
                      background: "var(--bg-elevated)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  />
                  <input
                    className="input-modern"
                    placeholder="https://..."
                    value={link.url}
                    onChange={(e) => updateLink(index, "url", e.target.value)}
                    style={{
                      padding: "12px 16px",
                      fontSize: "14px",
                      background: "var(--bg-elevated)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  />
                </div>

                <Flex justify="between" align="center">
                  <div
                    className="badge-grape"
                    style={{ fontSize: "11px", padding: "6px 12px" }}
                  >
                    {analytics?.linkClicks?.[index] ?? 0} clicks
                  </div>
                  <button
                    className="btn-outline"
                    onClick={() => removeLink(index)}
                    style={{
                      padding: "8px 16px",
                      fontSize: "12px",
                      borderColor: "rgba(255, 100, 100, 0.3)",
                      color: "#ff6b6b",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255, 100, 100, 0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <FaTrash size={12} />
                    Remove
                  </button>
                </Flex>
              </div>
            ))}
          </Flex>

          <Flex gap="3" wrap="wrap">
            <button
              className="btn-outline"
              onClick={addLink}
              style={{
                fontSize: "14px",
                padding: "12px 24px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <FaPlus /> Add Link
            </button>
            <button
              className="btn-primary"
              onClick={() => {
                onSave();
                setIsEditMode(false);
              }}
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
                "Saving..."
              ) : (
                <>
                  <FaSave /> Save Changes
                </>
              )}
            </button>
          </Flex>
        </>
      ) : (
        // View Mode - Linktree Style
        <>
          {!hasValidLinks ? (
            <div
              style={{
                textAlign: "center",
                padding: "var(--space-8)",
                color: "var(--text-tertiary)",
              }}
            >
              <Text size="3" style={{ marginBottom: "var(--space-2)" }}>
                No links added yet
              </Text>
              <Text size="2" color="gray">
                Click "Edit Mode" to add your first link
              </Text>
            </div>
          ) : (
            <Flex direction="column" gap="3">
              {links
                .filter((link) => link.url && link.url.trim() !== "")
                .map((link, index) => {
                  const displayLabel = link.label || getDomainFromUrl(link.url);
                  const clicks = analytics?.linkClicks?.[index] ?? 0;

                  return (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "var(--space-5)",
                        background: "var(--bg-tertiary)",
                        borderRadius: "var(--radius-md)",
                        border: "2px solid rgba(255, 255, 255, 0.08)",
                        textDecoration: "none",
                        transition: "all var(--transition-base)",
                        position: "relative",
                        overflow: "hidden",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "var(--mint-700)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow =
                          "0 8px 24px rgba(55, 197, 179, 0.2)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor =
                          "rgba(255, 255, 255, 0.08)";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <Flex justify="between" align="center">
                        <div style={{ flex: 1 }}>
                          <Text
                            size="4"
                            style={{
                              fontWeight: 600,
                              color: "var(--text-primary)",
                              display: "block",
                              marginBottom: "4px",
                            }}
                          >
                            {displayLabel}
                          </Text>
                          <Text
                            size="2"
                            style={{
                              color: "var(--text-tertiary)",
                              fontFamily: "var(--font-mono)",
                              fontSize: "12px",
                            }}
                          >
                            {link.url.length > 50
                              ? link.url.slice(0, 50) + "..."
                              : link.url}
                          </Text>
                        </div>
                        {clicks > 0 && (
                          <div
                            className="badge-grape"
                            style={{
                              fontSize: "11px",
                              padding: "6px 12px",
                              marginLeft: "var(--space-3)",
                            }}
                          >
                            {clicks} clicks
                          </div>
                        )}
                      </Flex>
                    </a>
                  );
                })}
            </Flex>
          )}
        </>
      )}
    </div>
  );
};
