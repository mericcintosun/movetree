import React from "react";
import { Box, Flex, Heading, Text } from "@radix-ui/themes";
import {
  FaWrench,
  FaPalette,
  FaLaptopCode,
  FaRobot,
  FaGlobe,
  FaRocket,
  FaHandshake,
  FaLock,
} from "react-icons/fa";

export const TeamMembers: React.FC = () => {
  const teamMembers = [
    {
      name: "Meriç Cintosun",
      role: "Blockchain Developer",
      expertise: "Sui Move, Rust, Web3, Cryptography",
      description:
        "Meriç is the mastermind behind Lynq's blockchain infrastructure. With deep expertise in Sui Move and Rust, he architected the on-chain profile system, designed the gas-efficient data structures, and implemented the cryptographic link verification system that sets Lynq apart from traditional platforms.",
      linkedin: "https://linkedin.com/in/mericcintosun",
      avatar: <FaWrench size={32} />,
      color: "var(--mint-800)",
    },
    {
      name: "Melis Çildir",
      role: "Designer & Researcher",
      expertise: "UX/UI Design, User Research, Product Strategy",
      description:
        "Melis crafted Lynq's beautiful, intuitive interface and identified the critical problem traditional link-in-bio platforms create. Her research into creator needs and blockchain user experience shaped every design decision, ensuring Lynq is both powerful and accessible to Web2 users.",
      linkedin: "https://linkedin.com/in/meliscildir",
      avatar: <FaPalette size={32} />,
      color: "var(--grape-800)",
    },
    {
      name: "Muhsin Ali Kulbak",
      role: "Frontend Developer",
      expertise: "React, TypeScript, Vite, Modern Web Development",
      description:
        "Muhsin brought Lynq's design to life with pixel-perfect precision. He built the dashboard, public profile views, analytics components, and integrated the Sui dApp Kit seamlessly. His focus on performance and user experience ensures Lynq loads instantly and runs smoothly on all devices.",
      linkedin: "https://linkedin.com/in/muhsinalikulbak",
      avatar: <FaLaptopCode size={32} />,
      color: "var(--mint-700)",
    },
    {
      name: "Samet Özgişi",
      role: "AI Developer",
      expertise: "Machine Learning, Data Science, LLM Integration",
      description:
        "Samet is building the future of Lynq—AI-powered features like content suggestions, automated profile optimization, and intelligent link recommendations. His expertise in ML will help creators maximize their profile's impact.",
      linkedin: "https://linkedin.com/in/sametozgisi",
      avatar: <FaRobot size={32} />,
      color: "var(--grape-700)",
    },
  ];

  const values = [
    {
      icon: <FaGlobe size={32} />,
      title: "Decentralization",
      description: "We believe in true digital sovereignty and user ownership.",
    },
    {
      icon: <FaRocket size={32} />,
      title: "Innovation",
      description:
        "Pushing the boundaries of what's possible with blockchain technology.",
    },
    {
      icon: <FaHandshake size={32} />,
      title: "Community",
      description:
        "Building for creators, by creators, with the Sui ecosystem.",
    },
    {
      icon: <FaLock size={32} />,
      title: "Security",
      description: "Cryptographic verification and immutable data storage.",
    },
  ];

  return (
    <Box
      id="team"
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
              Meet Our Team
            </Heading>
            <Text size="4" color="gray" style={{ lineHeight: 1.6 }}>
              A passionate team of blockchain developers, designers, and
              innovators building the future of decentralized identity.
            </Text>
          </Box>

          {/* Team Members Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "var(--space-6)",
            }}
          >
            {teamMembers.map((member, index) => (
              <Box
                key={index}
                className="card-modern"
                style={{
                  padding: "var(--space-6)",
                  transition: "all var(--transition-base)",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.borderColor = `${member.color}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor =
                    "rgba(255, 255, 255, 0.06)";
                }}
              >
                {/* Avatar */}
                <Box
                  style={{
                    textAlign: "center",
                    marginBottom: "var(--space-4)",
                  }}
                >
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${member.color}40, ${member.color}20)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto",
                      border: `2px solid ${member.color}30`,
                      color: member.color,
                    }}
                  >
                    {member.avatar}
                  </div>
                </Box>

                {/* Content */}
                <Flex direction="column" gap="3">
                  <Box style={{ textAlign: "center" }}>
                    <Heading
                      size="5"
                      mb="2"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {member.name}
                    </Heading>
                    <Text
                      size="3"
                      style={{ color: member.color, fontWeight: 600 }}
                    >
                      {member.role}
                    </Text>
                  </Box>

                  <Box
                    style={{
                      background: "transparent",
                      backdropFilter: "blur(10px)",
                      borderRadius: "var(--radius-md)",
                      padding: "var(--space-3)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <Text size="2" color="gray" style={{ fontWeight: 500 }}>
                      Expertise: {member.expertise}
                    </Text>
                  </Box>

                  <Text size="3" color="gray" style={{ lineHeight: 1.6 }}>
                    {member.description}
                  </Text>

                  {/* LinkedIn Button */}
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-block",
                      background: "var(--gradient-mint)",
                      color: "var(--bg-primary)",
                      padding: "var(--space-2) var(--space-4)",
                      borderRadius: "var(--radius-full)",
                      textDecoration: "none",
                      fontSize: "14px",
                      fontWeight: 600,
                      textAlign: "center",
                      transition: "all var(--transition-base)",
                      marginTop: "var(--space-2)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "var(--shadow-md)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                    }}
                  >
                    LinkedIn →
                  </a>
                </Flex>
              </Box>
            ))}
          </div>

          {/* Values Section */}
          <Box>
            <Heading
              size="6"
              mb="6"
              style={{ textAlign: "center", color: "var(--text-primary)" }}
            >
              Our Values
            </Heading>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "var(--space-5)",
              }}
            >
              {values.map((value, index) => (
                <Box
                  key={index}
                  style={{
                    background: "transparent",
                    backdropFilter: "blur(10px)",
                    borderRadius: "var(--radius-lg)",
                    padding: "var(--space-5)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    textAlign: "center",
                    transition: "all var(--transition-base)",
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
                  <Flex direction="column" gap="3" align="center">
                    <div style={{ color: "var(--mint-800)" }}>{value.icon}</div>
                    <Heading size="4" style={{ color: "var(--text-primary)" }}>
                      {value.title}
                    </Heading>
                    <Text size="3" color="gray" style={{ lineHeight: 1.6 }}>
                      {value.description}
                    </Text>
                  </Flex>
                </Box>
              ))}
            </div>
          </Box>

          {/* Join Us Section */}
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
              Join Our Mission
            </Heading>
            <Text
              size="4"
              color="gray"
              mb="6"
              style={{
                lineHeight: 1.6,
                maxWidth: "600px",
                margin: "0 auto var(--space-6)",
              }}
            >
              We're always looking for passionate developers, designers, and
              blockchain enthusiasts who share our vision of true digital
              sovereignty.
            </Text>
            <Flex
              direction={{ initial: "column", sm: "row" }}
              gap="4"
              justify="center"
              align="center"
            >
              <a
                href="https://github.com/autonomys/lynq"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{
                  fontSize: "16px",
                  padding: "16px 32px",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                View on GitHub
              </a>
              <a
                href="https://discord.gg/autonomys"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
                style={{
                  fontSize: "16px",
                  padding: "16px 32px",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Join Discord
              </a>
            </Flex>
          </Box>
        </Flex>
      </div>
    </Box>
  );
};
