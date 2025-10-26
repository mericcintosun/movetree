import React from "react";
import { Box, Flex, Heading, Text } from "@radix-ui/themes";
import {
  FaLock,
  FaDollarSign,
  FaChartBar,
  FaBan,
  FaExclamationTriangle,
  FaSearch,
  FaLink,
  FaRocket,
  FaShieldAlt,
  FaCoins,
  FaCheckCircle,
} from "react-icons/fa";
import { TbFreeRights } from "react-icons/tb";

export const ProblemSolution: React.FC = () => {
  const problems = [
    {
      icon: <FaLock size={32} />,
      title: "Platform Lock-in",
      description:
        "Your data is trapped in corporate databases. If platforms change terms or shut down, you lose everything.",
    },
    {
      icon: <FaDollarSign size={32} />,
      title: "Hidden Costs",
      description:
        "Free platforms monetize your data. Premium features cost monthly fees that add up over time.",
    },
    {
      icon: <FaChartBar size={32} />,
      title: "Limited Analytics",
      description:
        "Basic analytics with no transparency. You can't verify if the data is accurate or complete.",
    },
    {
      icon: <FaBan size={32} />,
      title: "No Portability",
      description:
        "Can't move your profile to other platforms. Starting over means losing your audience and history.",
    },
    {
      icon: <FaExclamationTriangle size={32} />,
      title: "Account Deletion Risk",
      description:
        "Platforms can delete your account anytime. Thousands of creators have lost years of work.",
    },
    {
      icon: <FaSearch size={32} />,
      title: "No Verification",
      description:
        "Links can be changed without your knowledge. No way to prove authenticity or prevent tampering.",
    },
  ];

  const solutions = [
    {
      icon: <FaLink size={32} />,
      title: "On-Chain Storage",
      description:
        "Your entire profile lives on the Sui blockchain. Immutable, permanent, and truly yours.",
      benefit: "100% Ownership",
    },
    {
      icon: <TbFreeRights size={32} />,
      title: "Gasless Onboarding",
      description:
        "Create your profile with Google zkLogin. We sponsor your first transaction—no SUI needed.",
      benefit: "Zero Friction",
    },
    {
      icon: <FaChartBar size={32} />,
      title: "Transparent Analytics",
      description:
        "Real-time analytics with blockchain verification. Every view and click is auditable.",
      benefit: "Verified Data",
    },
    {
      icon: <FaRocket size={32} />,
      title: "Full Portability",
      description:
        "Your profile works across any dApp. Future platforms can import your Lynq profile.",
      benefit: "Future-Proof",
    },
    {
      icon: <FaShieldAlt size={32} />,
      title: "Cryptographic Security",
      description:
        "Links are cryptographically signed. Tamper-proof verification for high-security use cases.",
      benefit: "Bulletproof",
    },
    {
      icon: <FaCoins size={32} />,
      title: "No Hidden Costs",
      description:
        "One-time setup, permanent ownership. No monthly fees, no data monetization.",
      benefit: "Cost Effective",
    },
  ];

  return (
    <Box style={{ padding: "var(--space-8) 0", background: "transparent" }}>
      <div className="container-modern">
        <Flex direction="column" gap="8">
          {/* Problem Section */}
          <Box id="problem">
            <Box
              style={{
                textAlign: "center",
                maxWidth: "800px",
                margin: "0 auto var(--space-8)",
              }}
            >
              <Heading size="7" mb="4" style={{ color: "#ff6b6b" }}>
                The Problem
              </Heading>
              <Text size="4" color="gray" style={{ lineHeight: 1.6 }}>
                Traditional platforms like LinkTree own your data. Your links,
                analytics, and profile settings are locked in their database. If
                they change their terms, get acquired, or shut down, you lose
                everything.
              </Text>
            </Box>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
                gap: "var(--space-5)",
              }}
            >
              {problems.map((problem, index) => (
                <Box
                  key={index}
                  style={{
                    background: "transparent",
                    borderRadius: "var(--radius-lg)",
                    padding: "var(--space-5)",
                    border: "1px solid rgba(255, 100, 100, 0.2)",
                    transition: "all var(--transition-base)",
                    backdropFilter: "blur(10px)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.borderColor =
                      "rgba(255, 100, 100, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor =
                      "rgba(255, 100, 100, 0.1)";
                  }}
                >
                  <Flex direction="column" gap="3">
                    <div style={{ color: "#ff6b6b" }}>{problem.icon}</div>
                    <Heading size="4" style={{ color: "#ff6b6b" }}>
                      {problem.title}
                    </Heading>
                    <Text size="3" color="gray" style={{ lineHeight: 1.6 }}>
                      {problem.description}
                    </Text>
                  </Flex>
                </Box>
              ))}
            </div>
          </Box>

          {/* Solution Section */}
          <Box id="solution">
            <Box
              style={{
                textAlign: "center",
                maxWidth: "800px",
                margin: "0 auto var(--space-8)",
              }}
            >
              <Heading size="7" mb="4" style={{ color: "var(--mint-800)" }}>
                Our Solution
              </Heading>
              <Text size="4" color="gray" style={{ lineHeight: 1.6 }}>
                Lynq is a Web3-native link-in-bio platform where every profile
                is a Sui blockchain object. This means true ownership,
                portability, transparency, and verification—all while
                maintaining beautiful, customizable profiles.
              </Text>
            </Box>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
                gap: "var(--space-5)",
              }}
            >
              {solutions.map((solution, index) => (
                <Box
                  key={index}
                  className="card-modern"
                  style={{
                    padding: "var(--space-5)",
                    transition: "all var(--transition-base)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.borderColor =
                      "rgba(55, 197, 179, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor =
                      "rgba(255, 255, 255, 0.06)";
                  }}
                >
                  {/* Benefit Badge */}
                  <div
                    style={{
                      position: "absolute",
                      top: "var(--space-4)",
                      right: "var(--space-4)",
                      background: "var(--gradient-mint)",
                      color: "var(--bg-primary)",
                      padding: "var(--space-1) var(--space-3)",
                      borderRadius: "var(--radius-full)",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    {solution.benefit}
                  </div>

                  <Flex direction="column" gap="3">
                    <div style={{ color: "var(--mint-800)" }}>
                      {solution.icon}
                    </div>
                    <Heading size="4" style={{ color: "var(--text-primary)" }}>
                      {solution.title}
                    </Heading>
                    <Text size="3" color="gray" style={{ lineHeight: 1.6 }}>
                      {solution.description}
                    </Text>
                  </Flex>
                </Box>
              ))}
            </div>
          </Box>

          {/* Comparison Section */}
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
              Lynq vs Traditional Platforms
            </Heading>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "var(--space-6)",
              }}
            >
              {/* Traditional Platforms */}
              <Box>
                <Heading
                  size="5"
                  mb="4"
                  style={{ color: "#ff6b6b", textAlign: "center" }}
                >
                  Traditional Platforms
                </Heading>
                <Flex direction="column" gap="3">
                  {[
                    "Platform owns your data",
                    "Monthly subscription fees",
                    "Limited analytics",
                    "No portability",
                    "Account deletion risk",
                    "No link verification",
                    "Corporate control",
                  ].map((item, index) => (
                    <Flex key={index} align="center" gap="2">
                      <FaBan size={16} color="#ff6b6b" />
                      <Text size="3" color="gray">
                        {item}
                      </Text>
                    </Flex>
                  ))}
                </Flex>
              </Box>

              {/* Lynq */}
              <Box>
                <Heading
                  size="5"
                  mb="4"
                  style={{ color: "var(--mint-800)", textAlign: "center" }}
                >
                  Lynq
                </Heading>
                <Flex direction="column" gap="3">
                  {[
                    "You own your data (on-chain)",
                    "One-time setup, permanent ownership",
                    "Transparent, verifiable analytics",
                    "Full portability across dApps",
                    "Immutable, permanent storage",
                    "Cryptographic link verification",
                    "True digital sovereignty",
                  ].map((item, index) => (
                    <Flex key={index} align="center" gap="2">
                      <FaCheckCircle size={16} color="var(--mint-800)" />
                      <Text size="3" color="gray">
                        {item}
                      </Text>
                    </Flex>
                  ))}
                </Flex>
              </Box>
            </div>
          </Box>

          {/* Call to Action */}
          <Box style={{ textAlign: "center" }}>
            <Heading size="6" mb="4" style={{ color: "var(--text-primary)" }}>
              Ready to Take Control of Your Digital Identity?
            </Heading>
            <Text size="4" color="gray" mb="6" style={{ lineHeight: 1.6 }}>
              Join thousands of creators who have already made the switch to
              true ownership.
            </Text>
            <div
              style={{
                background: "var(--gradient-mint)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-6)",
                border: "1px solid rgba(55, 197, 179, 0.2)",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              <Text
                size="3"
                style={{ color: "var(--bg-primary)", fontWeight: 600 }}
              >
                "Link Once. Own Forever."
              </Text>
            </div>
          </Box>
        </Flex>
      </div>
    </Box>
  );
};
