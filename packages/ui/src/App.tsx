import React, { useEffect, useState } from "react";
import { ConnectButton } from "@mysten/dapp-kit";
import { Box, Container, Flex, Heading, Button, Text } from "@radix-ui/themes";
import { Dashboard } from "./app/Dashboard";
import { PublicProfile } from "./public/PublicProfile";
import { LoginButtons } from "./auth/LoginButtons";
import { RegisterEnokiWallets } from "./sui/RegisterEnokiWallets";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HeroHeader } from "./components/HeroHeader";
import { AboutUs } from "./components/AboutUs";
import { ProblemSolution } from "./components/ProblemSolution";
import { TeamMembers } from "./components/TeamMembers";
import { Features } from "./components/Features";
import { VoiceRecording } from "./components/VoiceRecording";
import "./styles/theme.css";

function App() {
  const [currentView, setCurrentView] = useState<"landing" | "dashboard" | "profile" | "voice">("landing");
  const [currentSection, setCurrentSection] = useState<string>("home");
  const [profileObjectId, setProfileObjectId] = useState("");
  const [pathName, setPathName] = useState<string>("/");

  // Resolve /:name to objectId via backend registry
  useEffect(() => {
    const handle = async () => {
      try {
        const path = window.location.pathname || "/";
        setPathName(path);
        const slug = path.replace(/^\//, "");
        if (!slug) return;
        const backendUrl = (import.meta as any).env?.VITE_BACKEND_URL as string | undefined;
        if (!backendUrl) {
          console.warn("[resolver] VITE_BACKEND_URL is not set; skipping name resolution");
          return;
        }
        console.log("[resolver] resolving name", slug, "via", backendUrl);
        const resp = await fetch(`${backendUrl}/api/profile-name/resolve/${encodeURIComponent(slug)}`);
        if (resp.ok) {
          const data = await resp.json();
          if (data?.objectId) {
            setProfileObjectId(data.objectId);
            setCurrentView("profile");
          }
        } else {
          console.log("[resolver] name not found:", slug, resp.status);
        }
      } catch (e) {
        console.warn("[resolver] failed:", e);
      }
    };
    handle();
  }, []);

  const handleWalletConnect = () => {
    // Redirect to dashboard when wallet connects
    setCurrentView("dashboard");
  };

  const handleNavigate = (section: string) => {
    setCurrentSection(section);
    if (section === "dashboard") {
      setCurrentView("dashboard");
    } else if (section === "voice") {
      setCurrentView("voice");
    } else if (section === "profile") {
      // Show profile input form - clear any existing profile ID
      setProfileObjectId("");
      setCurrentView("profile");
    } else {
      setCurrentView("landing");
      // Scroll to section if it's a landing page section
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleGetStarted = () => {
    setCurrentView("dashboard");
  };

  const handleVoiceProfile = () => {
    setCurrentView("voice");
  };

  // If we're viewing a specific profile, show the profile view
  if (currentView === "profile") {
    return (
      <>
        <RegisterEnokiWallets />
        <Navbar onNavigate={handleNavigate} currentSection={currentSection} />
        <main style={{ minHeight: "calc(100vh - 72px)", position: "relative", zIndex: 1 }}>
          <Container size="4" style={{ paddingTop: "var(--space-6)", paddingBottom: "var(--space-8)" }}>
            <Box className="fade-in">
              <Box mb="5" className="card-modern" p="5">
                                  <Heading size="5" mb="4" style={{ fontWeight: 600 }}>
                  View Profile
                </Heading>
                <Flex gap="3" direction="column">
                  <input
                    className="input-modern"
                    type="text"
                    placeholder="Enter Profile Object ID (e.g., 0x4bacee79cd0577b370da00c1355dff5c52154e6776ccc3b8b833bab268072f1c)..."
                    value={profileObjectId}
                    onChange={(e) => setProfileObjectId(e.target.value)}
                    style={{ width: "100%", fontSize: "15px" }}
                  />
                  <Text size="2" color="gray" style={{ textAlign: "center" }}>
                    Object ID'yi girdikten sonra profil otomatik olarak yüklenecek
                  </Text>
                </Flex>
              </Box>
              {profileObjectId && <PublicProfile objectId={profileObjectId} />}
            </Box>
          </Container>
        </main>
        <Footer />
      </>
    );
  }

  // If we're in dashboard mode, show the dashboard
  if (currentView === "dashboard") {
    return (
      <>
        <RegisterEnokiWallets />
        <Navbar onNavigate={handleNavigate} currentSection={currentSection} />
        <main style={{ minHeight: "calc(100vh - 72px)", position: "relative", zIndex: 1 }}>
          <Container size="4" style={{ paddingTop: "var(--space-6)", paddingBottom: "var(--space-8)" }}>
            <Dashboard />
          </Container>
        </main>
        <Footer />
      </>
    );
  }

  // If we're in voice recording mode, show the voice interface
  if (currentView === "voice") {
    return (
      <>
        <RegisterEnokiWallets />
        <Navbar onNavigate={handleNavigate} currentSection={currentSection} />
        <main style={{ minHeight: "calc(100vh - 72px)", position: "relative", zIndex: 1 }}>
          <Container size="4" style={{ paddingTop: "var(--space-6)", paddingBottom: "var(--space-8)" }}>
            <VoiceRecording
              onProfileCreated={(profileData) => {
                // Mock profile creation - redirect to dashboard
                alert("Sesli profil başarıyla oluşturuldu! Dashboard'a yönlendiriliyorsunuz.");
                setCurrentView("dashboard");
              }}
              onClose={() => setCurrentView("dashboard")}
            />
          </Container>
        </main>
        <Footer />
      </>
    );
  }

  // Landing page with all sections
  return (
    <>
      <RegisterEnokiWallets />
      <Navbar onNavigate={handleNavigate} currentSection={currentSection} />
      
      <main style={{ position: "relative", zIndex: 1 }}>
        {/* Hero Section */}
        <HeroHeader onGetStarted={handleGetStarted} onVoiceProfile={handleVoiceProfile} />
        
        {/* About Section */}
        <AboutUs />
        
        {/* Problem & Solution Section */}
        <ProblemSolution />
        
        {/* Features Section */}
        <Features />
        
        {/* Team Section */}
        <TeamMembers />
      </main>
      
      <Footer />
    </>
  );
}

export default App;