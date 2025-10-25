import React, { useState } from "react";
import { ConnectButton } from "@mysten/dapp-kit";
import { Box, Container, Flex, Heading, Button } from "@radix-ui/themes";
import { Dashboard } from "./app/Dashboard";
import { PublicProfile } from "./public/PublicProfile";

function App() {
  const [currentView, setCurrentView] = useState<"dashboard" | "profile">(
    "dashboard",
  );
  const [profileObjectId, setProfileObjectId] = useState("");

  return (
    <>
      <Flex
        position="sticky"
        px="4"
        py="2"
        justify="between"
        style={{
          borderBottom: "1px solid var(--gray-a2)",
        }}
      >
        <Box>
          <Heading>MoveTree</Heading>
        </Box>

        <Flex gap="2" align="center">
          <Button
            variant={currentView === "dashboard" ? "solid" : "outline"}
            onClick={() => setCurrentView("dashboard")}
          >
            Dashboard
          </Button>
          <Button
            variant={currentView === "profile" ? "solid" : "outline"}
            onClick={() => setCurrentView("profile")}
          >
            View Profile
          </Button>
          <ConnectButton />
        </Flex>
      </Flex>

      <Container>
        {currentView === "dashboard" ? (
          <Dashboard />
        ) : (
          <Box p="4">
            <Box mb="4">
              <Heading size="4" mb="2">
                View Profile
              </Heading>
              <Flex gap="2">
                <input
                  type="text"
                  placeholder="Enter Object ID"
                  value={profileObjectId}
                  onChange={(e) => setProfileObjectId(e.target.value)}
                  style={{
                    padding: "8px 12px",
                    border: "1px solid var(--gray-6)",
                    borderRadius: "4px",
                    backgroundColor: "var(--gray-2)",
                    color: "var(--gray-12)",
                    minWidth: "300px",
                  }}
                />
                <Button onClick={() => setCurrentView("profile")}>
                  Load Profile
                </Button>
              </Flex>
            </Box>

            {profileObjectId && <PublicProfile objectId={profileObjectId} />}
          </Box>
        )}
      </Container>
    </>
  );
}

export default App;
