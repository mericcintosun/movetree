import React, { useState, useEffect } from "react";
import { Box, Flex, Text, Button } from "@radix-ui/themes";
import { ConnectButton } from "@mysten/dapp-kit";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { FaMicrophone, FaEye, FaBars, FaTimes } from "react-icons/fa";

interface NavbarProps {
  onNavigate: (section: string) => void;
  currentSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  currentSection,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const account = useCurrentAccount();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const mainNavItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "problem", label: "Problem" },
    { id: "solution", label: "Solution" },
    { id: "team", label: "Team" },
    { id: "features", label: "Features" },
  ];

  const handleConnectAndRedirect = () => {
    if (account) {
      onNavigate("dashboard");
    }
  };

  return (
    <header
      className="glass"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <div className="container-modern">
        <Flex
          py="4"
          justify="between"
          align="center"
          style={{ minHeight: "72px" }}
        >
          {/* Left Section: Logo + Navigation */}
          <Flex gap="6" align="center">
            {/* Circular Logo */}
            <Box>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => onNavigate("home")}
              >
                <img
                  src="/logo.png"
                  alt="Lynq Logo"
                  style={{
                    height: "48px",
                    width: "48px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid rgba(55, 197, 179, 0.2)",
                    transition: "all var(--transition-base)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--mint-700)";
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(55, 197, 179, 0.2)";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                />
              </div>
            </Box>

            {/* Desktop Navigation Links */}
            <Flex
              gap="1"
              align="center"
              style={{ display: isMobile ? "none" : "flex" }}
            >
              {mainNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  style={{
                    fontSize: "14px",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    background:
                      currentSection === item.id
                        ? "rgba(55, 197, 179, 0.15)"
                        : "transparent",
                    border: "none",
                    color:
                      currentSection === item.id
                        ? "var(--mint-300)"
                        : "var(--text-primary)",
                    fontWeight: currentSection === item.id ? 600 : 500,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (currentSection !== item.id) {
                      e.currentTarget.style.background =
                        "rgba(255, 255, 255, 0.05)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentSection !== item.id) {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  {item.label}
                </button>
              ))}
            </Flex>
          </Flex>

          {/* Right Section: Actions */}
          <Flex
            gap="3"
            align="center"
            style={{ display: isMobile ? "none" : "flex" }}
          >
            {/* Voice Profile Button */}
            <button
              onClick={() => onNavigate("voice")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                background: "transparent",
                color: "var(--text-primary)",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(55, 197, 179, 0.1)";
                e.currentTarget.style.borderColor = "var(--mint-700)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
              }}
            >
              <FaMicrophone size={14} />
              <span>Voice</span>
            </button>

            {/* View Profile Button */}
            <button
              onClick={() => onNavigate("profile")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                background: "transparent",
                color: "var(--text-primary)",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(55, 197, 179, 0.1)";
                e.currentTarget.style.borderColor = "var(--mint-700)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
              }}
            >
              <FaEye size={14} />
              <span>View Profile</span>
            </button>

            {/* Divider */}
            <div
              style={{
                borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
                height: "32px",
              }}
            />

            {/* Wallet Connect */}
            <div onClick={handleConnectAndRedirect}>
              <ConnectButton />
            </div>
          </Flex>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            style={{
              display: isMobile ? "flex" : "none",
              background: "transparent",
              border: "none",
              color: "var(--text-primary)",
              fontSize: "24px",
              padding: "8px",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </Button>
        </Flex>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <Box
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              background: "rgba(10, 10, 15, 0.95)",
              backdropFilter: "blur(20px)",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              padding: "20px",
              display: isMobile ? "block" : "none",
            }}
          >
            <Flex direction="column" gap="2">
              {/* Mobile Logo */}
              <Box mb="3" style={{ textAlign: "center" }}>
                <img
                  src="/logo.png"
                  alt="Lynq Logo"
                  style={{
                    height: "64px",
                    width: "64px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid rgba(55, 197, 179, 0.2)",
                  }}
                />
              </Box>

              {mainNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  style={{
                    fontSize: "15px",
                    padding: "14px 20px",
                    width: "100%",
                    textAlign: "left",
                    borderRadius: "8px",
                    background:
                      currentSection === item.id
                        ? "rgba(55, 197, 179, 0.15)"
                        : "transparent",
                    border: "none",
                    color:
                      currentSection === item.id
                        ? "var(--mint-300)"
                        : "var(--text-primary)",
                    fontWeight: currentSection === item.id ? 600 : 500,
                  }}
                >
                  {item.label}
                </button>
              ))}

              <div
                style={{
                  borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                  margin: "12px 0",
                  paddingTop: "12px",
                }}
              >
                <button
                  onClick={() => {
                    onNavigate("voice");
                    setIsMobileMenuOpen(false);
                  }}
                  style={{
                    fontSize: "15px",
                    padding: "14px 20px",
                    width: "100%",
                    textAlign: "left",
                    borderRadius: "8px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    background: "transparent",
                    color: "var(--text-primary)",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "8px",
                  }}
                >
                  <FaMicrophone size={16} />
                  Voice Profile
                </button>

                <button
                  onClick={() => {
                    onNavigate("profile");
                    setIsMobileMenuOpen(false);
                  }}
                  style={{
                    fontSize: "15px",
                    padding: "14px 20px",
                    width: "100%",
                    textAlign: "left",
                    borderRadius: "8px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    background: "transparent",
                    color: "var(--text-primary)",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <FaEye size={16} />
                  View Profile
                </button>
              </div>

              <div
                style={{
                  borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                  marginTop: "12px",
                  paddingTop: "12px",
                }}
              >
                <div onClick={handleConnectAndRedirect}>
                  <ConnectButton />
                </div>
              </div>
            </Flex>
          </Box>
        )}
      </div>
    </header>
  );
};
