import React from "react";
import { Box, Flex, Heading, Text } from "@radix-ui/themes";
import {
  FaLock,
  FaSync,
  FaCheckCircle,
  FaBolt,
  FaPalette,
  FaChartBar,
} from "react-icons/fa";
import {
  IoLink,
  IoShieldCheckmark,
  IoFlash,
  IoColorPalette,
  IoStatsChart,
} from "react-icons/io5";

export const AboutUs: React.FC = () => {
  const features = [
    {
      icon: <FaLock size={32} />,
      title: "True Ownership",
      description:
        "Your profile is yours forever. No company can delete it or change your data.",
    },
    {
      icon: <FaSync size={32} />,
      title: "Portable",
      description:
        "Your on-chain profile works across any dApp—future platforms can import your Lynq profile.",
    },
    {
      icon: <FaCheckCircle size={32} />,
      title: "Transparent & Verifiable",
      description:
        "Links can be cryptographically signed and verified on-chain.",
    },
    {
      icon: <FaBolt size={32} />,
      title: "Gasless Onboarding",
      description:
        "Use Google zkLogin to create your profile with sponsored gas fees—no SUI needed.",
    },
    {
      icon: <FaPalette size={32} />,
      title: "Beautiful UI",
      description:
        "A modern, responsive design built with React, Radix UI, and cutting-edge animations.",
    },
    {
      icon: <FaChartBar size={32} />,
      title: "Real-Time Analytics",
      description:
        "Track profile views and link clicks with hybrid Firebase + blockchain sync.",
    },
  ];

  const stats = [
    { number: "100%", label: "On-Chain Storage" },
    { number: "0", label: "Gas Fees for First Transaction" },
    { number: "∞", label: "Permanent Ownership" },
    { number: "<1s", label: "Transaction Finality" },
  ];

  return (
    <Box
      id="about"
      style={{
        padding: "var(--space-8) 0",
        background: "transparent",
        position: "relative",
      }}
    >
      <div className="container-modern">
        <Flex direction="column" gap="8">
          {/* Header */}
          <Box
            style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto" }}
          >
            <Heading size="7" mb="4" style={{ color: "var(--text-primary)" }}>
              About Lynq
            </Heading>
            <Text size="4" color="gray" style={{ lineHeight: 1.6 }}>
              Lynq is the first decentralized LinkTree alternative powered by
              the Sui blockchain. Built for creators, entrepreneurs, and
              visionaries who believe in true digital sovereignty.
            </Text>
          </Box>

          {/* Stats */}
          <Box
            style={{
              background: "transparent",
              backdropFilter: "blur(10px)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-6)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <Flex
              direction={{ initial: "column", sm: "row" }}
              gap="6"
              justify="around"
              align="center"
            >
              {stats.map((stat, index) => (
                <Box key={index} style={{ textAlign: "center" }}>
                  <Heading
                    size="6"
                    style={{
                      color: "var(--mint-800)",
                      marginBottom: "var(--space-2)",
                    }}
                  >
                    {stat.number}
                  </Heading>
                  <Text size="2" color="gray">
                    {stat.label}
                  </Text>
                </Box>
              ))}
            </Flex>
          </Box>

          {/* Features Grid */}
          <Box>
            <Heading
              size="6"
              mb="6"
              style={{ textAlign: "center", color: "var(--text-primary)" }}
            >
              Why Choose Lynq?
            </Heading>
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
                    cursor: "default",
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
                  <Flex direction="column" gap="3">
                    <div style={{ color: "var(--mint-800)" }}>
                      {feature.icon}
                    </div>
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
          </Box>

          {/* Mission Statement */}
          <Box
            style={{
              background: "var(--gradient-glass)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-7)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              textAlign: "center",
            }}
          >
            <Heading size="5" mb="4" style={{ color: "var(--mint-800)" }}>
              Our Mission
            </Heading>
            <Text
              size="4"
              color="gray"
              style={{ lineHeight: 1.6, maxWidth: "800px", margin: "0 auto" }}
            >
              We believe in a future where creators own their digital identity
              completely. No more platform lock-in, no more data loss, no more
              corporate control. Your links, your analytics, your identity—truly
              yours, forever.
            </Text>
            <Text
              size="3"
              style={{
                color: "var(--mint-700)",
                fontWeight: 600,
                marginTop: "var(--space-4)",
              }}
            >
              "Link Once. Own Forever."
            </Text>
          </Box>

          {/* Technology Stack */}
          <Box>
            <Heading
              size="6"
              mb="6"
              style={{ textAlign: "center", color: "var(--text-primary)" }}
            >
              Built on Cutting-Edge Technology
            </Heading>
            <Flex
              direction={{ initial: "column", md: "row" }}
              gap="6"
              justify="around"
              align="center"
            >
              <Box style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "var(--gradient-mint)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto var(--space-3)",
                  }}
                >
                  <IoLink size={32} />
                </div>
                <Heading size="4" mb="2">
                  Sui Blockchain
                </Heading>
                <Text size="2" color="gray">
                  Sub-second finality, high throughput
                </Text>
              </Box>

              <Box style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "var(--gradient-grape)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto var(--space-3)",
                  }}
                >
                  <FaLock size={32} />
                </div>
                <Heading size="4" mb="2">
                  zkLogin
                </Heading>
                <Text size="2" color="gray">
                  Gasless onboarding with Google
                </Text>
              </Box>

              <Box style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "var(--gradient-sunset)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto var(--space-3)",
                  }}
                >
                  <FaPalette size={32} />
                </div>
                <Heading size="4" mb="2">
                  Modern UI
                </Heading>
                <Text size="2" color="gray">
                  React, TypeScript, Radix UI
                </Text>
              </Box>
            </Flex>
          </Box>
        </Flex>
      </div>
    </Box>
  );
};
