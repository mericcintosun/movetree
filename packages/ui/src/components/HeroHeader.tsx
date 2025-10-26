import React from "react";
import { Box, Flex, Heading, Text, Button } from "@radix-ui/themes";
import { ConnectButton } from "@mysten/dapp-kit";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { FaMicrophone, FaExternalLinkAlt } from "react-icons/fa";

interface HeroHeaderProps {
  onGetStarted: () => void;
  onVoiceProfile?: () => void;
}

export const HeroHeader: React.FC<HeroHeaderProps> = ({
  onGetStarted,
  onVoiceProfile,
}) => {
  const account = useCurrentAccount();

  const handleGetStarted = () => {
    if (account) {
      onGetStarted();
    }
  };

  return (
    <Box
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        background: "#004aac", // Deep blue background like in the image
      }}
    >
      {/* Background Effects */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(255, 165, 0, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 192, 203, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(255, 165, 0, 0.05) 0%, transparent 50%)
          `,
          zIndex: 0,
        }}
      />

      <div
        className="container-modern"
        style={{ position: "relative", zIndex: 1 }}
      >
        <Flex
          direction="column"
          align="center"
          justify="center"
          gap="6"
          style={{ minHeight: "80vh", textAlign: "center" }}
        >
          {/* LYNQ Logo - Pixel Art Style */}
          <Box mb="4">
            <div
              style={{
                fontSize: "48px",
                fontWeight: 800,
                color: "#87CEEB", // Sky blue color like in the image
                fontFamily: "monospace",
                letterSpacing: "4px",
                textShadow: "0 0 10px rgba(135, 206, 235, 0.5)",
                marginBottom: "var(--space-4)",
                animation: "glow 3s ease-in-out infinite",
              }}
            >
              LYNQ
            </div>
          </Box>

          {/* Main Slogan */}
          <Box mb="8">
            <Heading
              size="8"
              mb="4"
              style={{
                color: "#ffffff",
                fontWeight: 700,
                lineHeight: 1.1,
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
              }}
            >
              Own Your Digital DNA
            </Heading>

            <Text
              size="4"
              mb="6"
              style={{
                color: "rgba(255, 255, 255, 0.8)",
                lineHeight: 1.6,
                maxWidth: "600px",
                margin: "0 auto",
                fontSize: "clamp(1rem, 2vw, 1.25rem)",
              }}
            >
              The first decentralized LinkTree alternative powered by Sui
              blockchain. Your identity, immortalized on-chain.
            </Text>
          </Box>

          {/* CTA Buttons */}
          <Flex
            direction={{ initial: "column", sm: "row" }}
            gap="4"
            align="center"
            justify="center"
            mb="8"
          >
            <Button
              size="4"
              onClick={handleGetStarted}
              style={{
                fontSize: "18px",
                padding: "20px 40px",
                minWidth: "220px",
                background: "#ffffff",
                color: "#000000",
                border: "none",
                borderRadius: "12px",
                fontWeight: 700,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 6px 25px rgba(0, 0, 0, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 20px rgba(0, 0, 0, 0.3)";
              }}
            >
              {account ? "EXPLORE" : "CONNECT WALLET"}
            </Button>

            {account && onVoiceProfile && (
              <Button
                size="4"
                onClick={onVoiceProfile}
                style={{
                  fontSize: "16px",
                  padding: "16px 32px",
                  minWidth: "200px",
                  background: "rgba(255, 165, 0, 0.9)",
                  color: "#000000",
                  border: "none",
                  borderRadius: "12px",
                  fontWeight: 600,
                  boxShadow: "0 4px 20px rgba(255, 165, 0, 0.3)",
                }}
              >
                <FaMicrophone style={{ marginRight: "8px" }} /> Create Voice
                Profile
              </Button>
            )}
          </Flex>

          {/* Shrimp Character - Like in the image */}
          <Box
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "var(--space-6)",
            }}
          >
            {/* Colorful Background Effect */}
            <div
              style={{
                position: "absolute",
                width: "300px",
                height: "300px",
                background: `
                  radial-gradient(circle at 30% 30%, rgba(255, 192, 203, 0.3) 0%, transparent 50%),
                  radial-gradient(circle at 70% 70%, rgba(255, 165, 0, 0.3) 0%, transparent 50%),
                  radial-gradient(circle at 50% 50%, rgba(255, 255, 0, 0.2) 0%, transparent 50%)
                `,
                borderRadius: "50%",
                filter: "blur(20px)",
                zIndex: 1,
              }}
            />

            {/* Shrimp Character */}
            <div
              style={{
                position: "relative",
                zIndex: 2,
                fontSize: "120px",
                animation: "float 3s ease-in-out infinite",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: "120px" }}>🦐</span>
            </div>

            {/* External Link Icon */}
            <div
              style={{
                position: "absolute",
                top: "20%",
                right: "20%",
                fontSize: "24px",
                color: "#FFA500",
                animation: "pulse 2s ease-in-out infinite",
                zIndex: 3,
              }}
            >
              <FaExternalLinkAlt />
            </div>
          </Box>
        </Flex>
      </div>

      {/* Animation Keyframes */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.2); opacity: 1; }
          }
          
          @keyframes glow {
            0%, 100% { text-shadow: 0 0 10px rgba(135, 206, 235, 0.5); }
            50% { text-shadow: 0 0 20px rgba(135, 206, 235, 0.8), 0 0 30px rgba(135, 206, 235, 0.6); }
          }
        `}
      </style>
    </Box>
  );
};
