import React from "react";
import { Box, Flex, Heading, Text } from "@radix-ui/themes";
import {
  FaLock,
  FaLink,
  FaShieldAlt,
  FaPalette,
  FaChartBar,
  FaTag,
  FaGlobe,
  FaMobile,
  FaTicketAlt,
  FaHandshake,
  FaRobot,
  FaDollarSign,
  FaCheckCircle,
} from "react-icons/fa";

export const Features: React.FC = () => {
  const features = [
    {
      icon: <FaLock size={32} />,
      title: "zkLogin + Sponsored Gas",
      description:
        "First-time users can create their profile by signing in with Google—no SUI, no wallet funding required. We sponsor the gas for your first transaction.",
      status: "Live",
      color: "var(--mint-800)",
    },
    {
      icon: <FaLink size={32} />,
      title: "On-Chain Profile Storage",
      description:
        "Your entire profile lives in a Sui Move object with immutable data structures. Name, avatar, bio, links, and analytics—all on-chain.",
      status: "Live",
      color: "var(--mint-800)",
    },
    {
      icon: <FaShieldAlt size={32} />,
      title: "Verified Links",
      description:
        "Links are stored with SHA-3 hash for cryptographic verification. Future updates can be verified on-chain—ensuring your links are never tampered with.",
      status: "In Progress",
      color: "var(--grape-800)",
    },
    {
      icon: <FaPalette size={32} />,
      title: "Customizable Themes",
      description:
        "Beautiful, responsive profiles with dark mode optimization, glass-morphism design, and custom background patterns.",
      status: "Live",
      color: "var(--mint-800)",
    },
    {
      icon: <FaChartBar size={32} />,
      title: "Real-Time Analytics",
      description:
        "Hybrid Firebase + blockchain sync. Instant analytics updates with automatic sync to blockchain every 2 days for permanent records.",
      status: "Live",
      color: "var(--mint-800)",
    },
    {
      icon: <FaTag size={32} />,
      title: "Profile Tags & Discovery",
      description:
        "Add tags to your profile for networking and discovery. Future features will let users explore profiles by interest.",
      status: "In Progress",
      color: "var(--grape-800)",
    },
    {
      icon: <FaGlobe size={32} />,
      title: "Human-Readable URLs",
      description:
        "Link your profile to a .sui domain via SuiNS. Combined with Walrus hosting, your profile is accessible at memorable URLs.",
      status: "In Progress",
      color: "var(--grape-800)",
    },
    {
      icon: <FaMobile size={32} />,
      title: "Mobile Responsive",
      description:
        "Optimized for all devices with touch-friendly interactions and mobile-first design principles.",
      status: "Live",
      color: "var(--mint-800)",
    },
    {
      icon: <FaTicketAlt size={32} />,
      title: "Token/NFT-Gated Links",
      description:
        "Select links can require ownership of specific NFTs or tokens. Perfect for exclusive content and VIP access.",
      status: "Planned",
      color: "var(--text-tertiary)",
    },
    {
      icon: <FaHandshake size={32} />,
      title: "Multi-Profile Support",
      description:
        "Create multiple profiles per wallet for different personas or use cases.",
      status: "Planned",
      color: "var(--text-tertiary)",
    },
    {
      icon: <FaRobot size={32} />,
      title: "AI-Powered Suggestions",
      description:
        "AI-powered content suggestions, automated profile optimization, and intelligent link recommendations.",
      status: "Planned",
      color: "var(--text-tertiary)",
    },
    {
      icon: <FaDollarSign size={32} />,
      title: "Sponsored Link Marketplace",
      description:
        "Monetize your profile with sponsored link slots and partnership opportunities.",
      status: "Planned",
      color: "var(--text-tertiary)",
    },
  ];

  const roadmap = [
    {
      phase: "v1.0 - Foundation",
      status: "Completed",
      features: [
        "On-chain profile storage on Sui",
        "Google zkLogin + sponsored gas onboarding",
        "Basic link management (add, remove, reorder)",
        "Public profile display with custom themes",
        "Real-time analytics via Firebase + blockchain sync",
        "Human-readable URLs via name registry",
        "Beautiful, responsive UI with dark mode",
        "Walrus deployment with CI/CD",
      ],
      color: "var(--mint-800)",
    },
    {
      phase: "v1.1 - Enhancement",
      status: "In Progress",
      features: [
        "Verified links with cryptographic hashing (UI implementation)",
        "SuiNS domain integration (.sui URLs)",
        "Profile tags and discovery features",
        "Analytics dashboard with charts and insights",
        "Mobile app (React Native)",
      ],
      color: "var(--grape-800)",
    },
    {
      phase: "v2.0 - Advanced",
      status: "Planned",
      features: [
        "Token/NFT-gated links",
        "Multi-profile support per wallet",
        "Collaborative profiles (shared ownership)",
        "AI-powered content suggestions",
        "Sponsored link marketplace",
        "Farcaster integration",
        "ENS/SNS cross-chain compatibility",
      ],
      color: "var(--text-tertiary)",
    },
  ];

  return (
    <Box
      id="features"
      style={{
        padding: "var(--space-8) 0",
        background: "transparent",
      }}
    >
      <div className="container-modern">
        <Flex direction="column" gap="8">
          {/* Header */}
          <Box
            style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto" }}
          >
            <Heading size="7" mb="4" style={{ color: "var(--text-primary)" }}>
              Features & Roadmap
            </Heading>
            <Text size="4" color="gray" style={{ lineHeight: 1.6 }}>
              From gasless onboarding to AI-powered optimization, Lynq is packed
              with features that put you in complete control of your digital
              identity.
            </Text>
          </Box>

          {/* Features Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
              gap: "var(--space-5)",
            }}
          >
            {features.map((feature, index) => (
              <Box
                key={index}
                className="card-modern"
                style={{
                  padding: "var(--space-5)",
                  transition: "all var(--transition-base)",
                  position: "relative",
                  opacity: feature.status === "Planned" ? 0.7 : 1,
                }}
                onMouseEnter={(e) => {
                  if (feature.status !== "Planned") {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.borderColor = `${feature.color}40`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (feature.status !== "Planned") {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor =
                      "rgba(255, 255, 255, 0.06)";
                  }
                }}
              >
                {/* Status Badge */}
                <div
                  style={{
                    position: "absolute",
                    top: "var(--space-4)",
                    right: "var(--space-4)",
                    background:
                      feature.status === "Live"
                        ? "var(--gradient-mint)"
                        : feature.status === "In Progress"
                        ? "var(--gradient-grape)"
                        : "var(--bg-tertiary)",
                    color:
                      feature.status === "Planned"
                        ? "var(--text-tertiary)"
                        : "var(--bg-primary)",
                    padding: "var(--space-1) var(--space-3)",
                    borderRadius: "var(--radius-full)",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  {feature.status}
                </div>

                <Flex direction="column" gap="3">
                  <div style={{ color: feature.color }}>{feature.icon}</div>
                  <Heading size="4" style={{ color: "var(--text-primary)" }}>
                    {feature.title}
                  </Heading>
                  <Text size="3" color="gray" style={{ lineHeight: 1.6 }}>
                    {feature.description}
                  </Text>
                </Flex>
              </Box>
            ))}
          </div>

          {/* Roadmap Section */}
          <Box>
            <Heading
              size="6"
              mb="6"
              style={{ textAlign: "center", color: "var(--text-primary)" }}
            >
              Development Roadmap
            </Heading>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
                gap: "var(--space-6)",
              }}
            >
              {roadmap.map((phase, index) => (
                <Box
                  key={index}
                  style={{
                    background: "transparent",
                    backdropFilter: "blur(10px)",
                    borderRadius: "var(--radius-lg)",
                    padding: "var(--space-6)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    position: "relative",
                  }}
                >
                  {/* Phase Header */}
                  <Flex justify="between" align="center" mb="4">
                    <Heading size="5" style={{ color: "var(--text-primary)" }}>
                      {phase.phase}
                    </Heading>
                    <div
                      style={{
                        background:
                          phase.status === "Completed"
                            ? "var(--gradient-mint)"
                            : phase.status === "In Progress"
                            ? "var(--gradient-grape)"
                            : "var(--bg-tertiary)",
                        color:
                          phase.status === "Planned"
                            ? "var(--text-tertiary)"
                            : "var(--bg-primary)",
                        padding: "var(--space-1) var(--space-3)",
                        borderRadius: "var(--radius-full)",
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                    >
                      {phase.status}
                    </div>
                  </Flex>

                  {/* Features List */}
                  <Flex direction="column" gap="2">
                    {phase.features.map((feature, featureIndex) => (
                      <Flex key={featureIndex} align="center" gap="3">
                        <div
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: phase.color,
                            flexShrink: 0,
                          }}
                        />
                        <Text size="3" color="gray">
                          {feature}
                        </Text>
                      </Flex>
                    ))}
                  </Flex>
                </Box>
              ))}
            </div>
          </Box>

          {/* Technical Architecture */}
          <Box
            style={{
              background: "var(--gradient-glass)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-7)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <Heading
              size="6"
              mb="6"
              style={{ textAlign: "center", color: "var(--text-primary)" }}
            >
              Technical Architecture
            </Heading>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "var(--space-6)",
              }}
            >
              {/* Frontend */}
              <Box>
                <Heading
                  size="5"
                  mb="4"
                  style={{ color: "var(--mint-800)", textAlign: "center" }}
                >
                  Frontend Stack
                </Heading>
                <Flex direction="column" gap="2">
                  {[
                    "React + TypeScript",
                    "Vite (Lightning-fast builds)",
                    "Sui dApp Kit",
                    "Radix UI Components",
                    "TanStack Query",
                    "Framer Motion",
                    "Firebase Firestore",
                  ].map((tech, index) => (
                    <Text key={index} size="3" color="gray">
                      • {tech}
                    </Text>
                  ))}
                </Flex>
              </Box>

              {/* Smart Contracts */}
              <Box>
                <Heading
                  size="5"
                  mb="4"
                  style={{ color: "var(--grape-800)", textAlign: "center" }}
                >
                  Smart Contracts
                </Heading>
                <Flex direction="column" gap="2">
                  {[
                    "Sui Move Language",
                    "LinkTreeProfile Object",
                    "Entry Functions",
                    "Cryptographic Verification",
                    "Event Emission",
                    "Gas Optimization",
                  ].map((tech, index) => (
                    <Text key={index} size="3" color="gray">
                      • {tech}
                    </Text>
                  ))}
                </Flex>
              </Box>

              {/* Infrastructure */}
              <Box>
                <Heading
                  size="5"
                  mb="4"
                  style={{ color: "var(--mint-700)", textAlign: "center" }}
                >
                  Infrastructure
                </Heading>
                <Flex direction="column" gap="2">
                  {[
                    "Walrus (Decentralized Hosting)",
                    "SuiNS (Domain Service)",
                    "Enoki (zkLogin Infrastructure)",
                    "Firebase (Analytics Cache)",
                    "GitHub Actions (CI/CD)",
                    "Monorepo (pnpm workspace)",
                  ].map((tech, index) => (
                    <Text key={index} size="3" color="gray">
                      • {tech}
                    </Text>
                  ))}
                </Flex>
              </Box>
            </div>
          </Box>
        </Flex>
      </div>
    </Box>
  );
};
