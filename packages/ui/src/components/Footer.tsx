import React from "react";
import { Box, Flex, Text, Heading } from "@radix-ui/themes";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Roadmap", href: "#roadmap" },
      { label: "Documentation", href: "https://docs.autonomys.xyz/" },
    ],
    company: [
      { label: "About Us", href: "#about" },
      { label: "Team", href: "#team" },
      { label: "Careers", href: "#careers" },
      { label: "Contact", href: "#contact" },
    ],
    community: [
      { label: "Discord", href: "https://discord.gg/autonomys" },
      { label: "Twitter", href: "https://twitter.com/lynq_sui" },
      { label: "GitHub", href: "https://github.com/autonomys/lynq" },
      { label: "Blog", href: "#blog" },
    ],
    resources: [
      { label: "Help Center", href: "#help" },
      { label: "API Docs", href: "#api" },
      { label: "Tutorials", href: "#tutorials" },
      { label: "Status", href: "#status" },
    ],
  };

  return (
    <footer
      style={{
        background: "transparent",
        backdropFilter: "blur(10px)",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        padding: "var(--space-8) 0 var(--space-5)",
        marginTop: "var(--space-8)",
      }}
    >
      <div className="container-modern">
        <Flex direction="column" gap="6">
          {/* Main Footer Content */}
          <Flex
            direction={{ initial: "column", sm: "row" }}
            gap="6"
            justify="between"
            align="start"
          >
            {/* Brand Section */}
            <Box style={{ flex: 1, minWidth: "300px" }}>
              <Flex align="center" gap="3" mb="4">
                <img
                  src="/left-logo.png"
                  alt="Lynq Logo"
                  style={{
                    height: "48px",
                    width: "auto",
                  }}
                />
                <Heading size="5" style={{ color: "var(--mint-800)" }}>
                  Lynq
                </Heading>
              </Flex>
              <Text size="3" color="gray" mb="4" style={{ lineHeight: 1.6 }}>
                The first decentralized LinkTree alternative powered by the Sui
                blockchain. Your identity, immortalized on-chain.
              </Text>
              <Text
                size="2"
                style={{ color: "var(--mint-700)", fontWeight: 600 }}
              >
                "Link Once. Own Forever."
              </Text>
            </Box>

            {/* Links Sections */}
            <Flex
              direction={{ initial: "column", md: "row" }}
              gap="6"
              style={{ flex: 2 }}
            >
              {/* Product Links */}
              <Box>
                <Heading
                  size="4"
                  mb="3"
                  style={{ color: "var(--text-primary)" }}
                >
                  Product
                </Heading>
                <Flex direction="column" gap="2">
                  {footerLinks.product.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      style={{
                        color: "var(--text-secondary)",
                        textDecoration: "none",
                        fontSize: "14px",
                        transition: "color var(--transition-base)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "var(--mint-700)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "var(--text-secondary)";
                      }}
                    >
                      {link.label}
                    </a>
                  ))}
                </Flex>
              </Box>

              {/* Company Links */}
              <Box>
                <Heading
                  size="4"
                  mb="3"
                  style={{ color: "var(--text-primary)" }}
                >
                  Company
                </Heading>
                <Flex direction="column" gap="2">
                  {footerLinks.company.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      style={{
                        color: "var(--text-secondary)",
                        textDecoration: "none",
                        fontSize: "14px",
                        transition: "color var(--transition-base)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "var(--mint-700)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "var(--text-secondary)";
                      }}
                    >
                      {link.label}
                    </a>
                  ))}
                </Flex>
              </Box>

              {/* Community Links */}
              <Box>
                <Heading
                  size="4"
                  mb="3"
                  style={{ color: "var(--text-primary)" }}
                >
                  Community
                </Heading>
                <Flex direction="column" gap="2">
                  {footerLinks.community.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "var(--text-secondary)",
                        textDecoration: "none",
                        fontSize: "14px",
                        transition: "color var(--transition-base)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "var(--mint-700)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "var(--text-secondary)";
                      }}
                    >
                      {link.label}
                    </a>
                  ))}
                </Flex>
              </Box>

              {/* Resources Links */}
              <Box>
                <Heading
                  size="4"
                  mb="3"
                  style={{ color: "var(--text-primary)" }}
                >
                  Resources
                </Heading>
                <Flex direction="column" gap="2">
                  {footerLinks.resources.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      style={{
                        color: "var(--text-secondary)",
                        textDecoration: "none",
                        fontSize: "14px",
                        transition: "color var(--transition-base)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "var(--mint-700)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "var(--text-secondary)";
                      }}
                    >
                      {link.label}
                    </a>
                  ))}
                </Flex>
              </Box>
            </Flex>
          </Flex>

          {/* Bottom Section */}
          <Box
            style={{
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              paddingTop: "var(--space-5)",
            }}
          >
            <Flex
              direction={{ initial: "column", sm: "row" }}
              justify="between"
              align="center"
              gap="4"
            >
              <Text size="2" color="gray">
                © {currentYear} Lynq. Built with{" "}
                <span style={{ color: "var(--mint-800)" }}>Sui Blockchain</span>
              </Text>

              <Flex gap="4" align="center">
                <a
                  href="#privacy"
                  style={{
                    color: "var(--text-tertiary)",
                    textDecoration: "none",
                    fontSize: "12px",
                    transition: "color var(--transition-base)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--mint-700)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--text-tertiary)";
                  }}
                >
                  Privacy Policy
                </a>
                <a
                  href="#terms"
                  style={{
                    color: "var(--text-tertiary)",
                    textDecoration: "none",
                    fontSize: "12px",
                    transition: "color var(--transition-base)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--mint-700)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--text-tertiary)";
                  }}
                >
                  Terms of Service
                </a>
                <Text size="1" color="gray">
                  MIT License
                </Text>
              </Flex>
            </Flex>
          </Box>
        </Flex>
      </div>
    </footer>
  );
};
