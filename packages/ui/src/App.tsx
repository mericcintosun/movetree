import React, { useState } from "react";
import { ConnectButton } from "@mysten/dapp-kit";
import { Box, Container, Flex, Heading, Button } from "@radix-ui/themes";
import { Dashboard } from "./app/Dashboard";
import { PublicProfile } from "./public/PublicProfile";
import { LoginButtons } from "./auth/LoginButtons";
import { RegisterEnokiWallets } from "./sui/RegisterEnokiWallets";
import { InteractiveBackground } from "./components/InteractiveBackground";
import "./styles/theme.css";

function App() {
  const [currentView, setCurrentView] = useState<"dashboard" | "profile">(
    "dashboard",
  );
  const [profileObjectId, setProfileObjectId] = useState("");

  return (
    <>
      <RegisterEnokiWallets />
      
      {/* Interactive Background */}
      <InteractiveBackground />
      
      {/* Modern Glass Header */}
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
            {/* Logo */}
            <Box>
              <Heading
                size="6"
                className="text-gradient"
                style={{
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  cursor: "pointer",
                }}
                onClick={() => setCurrentView("dashboard")}
              >
                🌳 MoveTree
              </Heading>
            </Box>

            {/* Navigation */}
            <Flex gap="3" align="center">
              <Flex gap="2" align="center">
                <button
                  className={currentView === "dashboard" ? "btn-primary" : "btn-outline"}
                  onClick={() => setCurrentView("dashboard")}
                  style={{
                    fontSize: "14px",
                    padding: "10px 20px",
                  }}
                >
                  Dashboard
                </button>
                <button
                  className={currentView === "profile" ? "btn-primary" : "btn-outline"}
                  onClick={() => setCurrentView("profile")}
                  style={{
                    fontSize: "14px",
                    padding: "10px 20px",
                  }}
                >
                  View Profile
                </button>
              </Flex>
              <LoginButtons />
              <div style={{
                borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
                height: "32px",
                margin: "0 8px",
              }} />
              <ConnectButton />
            </Flex>
          </Flex>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        minHeight: "calc(100vh - 72px)",
        position: "relative",
        zIndex: 1,
      }}>
        <Container size="4" style={{ paddingTop: "var(--space-6)", paddingBottom: "var(--space-8)" }}>
          {currentView === "dashboard" ? (
            <Dashboard />
          ) : (
            <Box className="fade-in">
              <Box mb="5" className="card-modern" p="5">
                <Heading size="5" mb="4" style={{ fontWeight: 600 }}>
                  🔍 View Profile
                </Heading>
                <Flex gap="3" direction="column">
                  <input
                    className="input-modern"
                    type="text"
                    placeholder="Enter Profile Object ID..."
                    value={profileObjectId}
                    onChange={(e) => setProfileObjectId(e.target.value)}
                    style={{
                      width: "100%",
                      fontSize: "15px",
                    }}
                  />
                  <button
                    className="btn-primary"
                    onClick={() => setCurrentView("profile")}
                    disabled={!profileObjectId.trim()}
                    style={{
                      alignSelf: "flex-start",
                      opacity: !profileObjectId.trim() ? 0.5 : 1,
                      cursor: !profileObjectId.trim() ? "not-allowed" : "pointer",
                    }}
                  >
                    Load Profile →
                  </button>
                </Flex>
              </Box>

              {profileObjectId && <PublicProfile objectId={profileObjectId} />}
            </Box>
          )}
        </Container>
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        padding: "var(--space-5) 0",
        textAlign: "center",
        color: "var(--text-tertiary)",
        fontSize: "14px",
        position: "relative",
        zIndex: 1,
      }}>
        <div className="container-modern">
          <p style={{ margin: 0 }}>
            Built with 💚 on <span className="text-gradient">Sui Blockchain</span>
          </p>
        </div>
      </footer>
    </>
  );
}

export default App;
