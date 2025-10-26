import React, { useState } from "react";
import { ConnectButton } from "@mysten/dapp-kit";
import { Dashboard } from "./app/Dashboard";
import { PublicProfile } from "./public/PublicProfile";
import { LoginButtons } from "./auth/LoginButtons";
import { RegisterEnokiWallets } from "./sui/RegisterEnokiWallets";
import "./styles/globals.css";

function App() {
  const [currentView, setCurrentView] = useState<"dashboard" | "profile">(
    "dashboard",
  );
  const [profileObjectId, setProfileObjectId] = useState("");
  console.log("google client id", import.meta.env.VITE_GOOGLE_CLIENT_ID);

  return (
    <>
      <RegisterEnokiWallets />
      
      {/* Apple-style Navigation */}
      <nav className="apple-flex apple-flex-between apple-p-4" style={{
        position: "sticky",
        top: 0,
        backgroundColor: "var(--background)",
        borderBottom: "1px solid var(--border-light)",
        backdropFilter: "blur(20px)",
        zIndex: 1000,
      }}>
        <div className="apple-flex apple-flex-center apple-gap-3">
          <div className="apple-heading-3" style={{ 
            background: "linear-gradient(135deg, var(--primary), var(--apple-blue-light))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            🌳 MoveTree
          </div>
        </div>

        <div className="apple-flex apple-flex-center apple-gap-3">
          <button
            className={`apple-button apple-button-small ${
              currentView === "dashboard" ? "apple-button-primary" : "apple-button-secondary"
            }`}
            onClick={() => setCurrentView("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={`apple-button apple-button-small ${
              currentView === "profile" ? "apple-button-primary" : "apple-button-secondary"
            }`}
            onClick={() => setCurrentView("profile")}
          >
            View Profile
          </button>
          <LoginButtons />
          <ConnectButton />
        </div>
      </nav>

      {/* Apple-style Main Content */}
      <main className="apple-container apple-section">
        {currentView === "dashboard" ? (
          <Dashboard />
        ) : (
          <div className="apple-animate-fade-in">
            <div className="apple-card apple-p-6 apple-mb-6">
              <h2 className="apple-heading-4 apple-mb-4">View Profile</h2>
              <div className="apple-flex apple-gap-3">
                <input
                  type="text"
                  className="apple-input"
                  placeholder="Enter Object ID"
                  value={profileObjectId}
                  onChange={(e) => setProfileObjectId(e.target.value)}
                  style={{ minWidth: "300px" }}
                />
                <button 
                  className="apple-button apple-button-primary"
                  onClick={() => setCurrentView("profile")}
                >
                  Load Profile
                </button>
              </div>
            </div>

            {profileObjectId && <PublicProfile objectId={profileObjectId} />}
          </div>
        )}
      </main>
    </>
  );
}

export default App;
