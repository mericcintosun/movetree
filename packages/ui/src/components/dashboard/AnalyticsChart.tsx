import React from "react";
import { Flex, Text, Heading } from "@radix-ui/themes";
import { FaChartBar } from "react-icons/fa";

interface LinkItem {
  label: string;
  url: string;
  icon?: string;
}

interface AnalyticsChartProps {
  links: LinkItem[];
  analytics?: any;
}

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({
  links,
  analytics,
}) => {
  if (
    !analytics ||
    !analytics.linkClicks ||
    analytics.linkClicks.length === 0
  ) {
    return (
      <div
        className="card-modern"
        style={{
          padding: "var(--space-6)",
          background: "var(--bg-secondary)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          textAlign: "center",
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
          <FaChartBar /> Performance Analytics
        </Heading>
        <Text size="2" color="gray" style={{ fontStyle: "italic" }}>
          No clicks yet. Share your profile to start tracking!
        </Text>
      </div>
    );
  }

  const maxClicks = Math.max(...analytics.linkClicks, 1);
  const totalClicks = analytics.linkClicks.reduce(
    (a: number, b: number) => a + b,
    0
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
          <FaChartBar /> Performance Analytics
        </Heading>
        <div
          className="badge-grape"
          style={{ fontSize: "12px", padding: "8px 16px" }}
        >
          {totalClicks} total clicks
        </div>
      </Flex>

      <Flex direction="column" gap="4">
        {links.map((link, index) => {
          const clicks = analytics.linkClicks[index] || 0;
          const percentage = maxClicks > 0 ? (clicks / maxClicks) * 100 : 0;

          return (
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
                e.currentTarget.style.borderColor = "var(--mint-700)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)";
              }}
            >
              <Flex justify="between" align="center" mb="3">
                <div style={{ flex: 1 }}>
                  <Text
                    size="2"
                    style={{
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      marginBottom: "4px",
                      display: "block",
                    }}
                  >
                    {link.label || "Unlabeled Link"}
                  </Text>
                  <Text
                    size="1"
                    style={{
                      color: "var(--text-tertiary)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                    }}
                  >
                    {link.url.length > 50
                      ? link.url.slice(0, 50) + "..."
                      : link.url}
                  </Text>
                </div>
                <div
                  style={{ textAlign: "right", marginLeft: "var(--space-4)" }}
                >
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: 700,
                      background: "var(--gradient-mint)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {clicks}
                  </div>
                  <Text size="1" color="gray" style={{ fontSize: "11px" }}>
                    clicks
                  </Text>
                </div>
              </Flex>

              <div
                style={{
                  height: "12px",
                  background: "var(--bg-secondary)",
                  borderRadius: "var(--radius-full)",
                  overflow: "hidden",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${percentage}%`,
                    background:
                      index % 2 === 0
                        ? "linear-gradient(90deg, var(--mint-900) 0%, var(--mint-700) 100%)"
                        : "linear-gradient(90deg, var(--grape-900) 0%, var(--grape-700) 100%)",
                    transition: "width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    boxShadow:
                      index % 2 === 0
                        ? "0 0 12px rgba(55, 197, 179, 0.5)"
                        : "0 0 12px rgba(197, 132, 246, 0.5)",
                    borderRadius: "var(--radius-full)",
                  }}
                />
              </div>
            </div>
          );
        })}
      </Flex>
    </div>
  );
};
