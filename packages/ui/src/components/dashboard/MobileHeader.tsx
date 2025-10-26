import React from "react";
import { motion } from "framer-motion";
import { Text } from "@radix-ui/themes";
import { FaTrash, FaSignal, FaBatteryFull, FaUser } from "react-icons/fa";

interface MobileHeaderProps {
  profileName?: string;
  profileId?: string;
  onDelete?: () => void;
  isLoading?: boolean;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  profileName = "Unnamed Profile",
  profileId,
  onDelete,
  isLoading = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        padding: "var(--space-4)",
        marginBottom: "var(--space-4)",
        background: "var(--bg-primary)",
      }}
    >
      {/* Mobile Status Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "var(--space-4)",
          fontSize: "14px",
          color: "var(--text-primary)",
          fontWeight: 600,
        }}
      >
        <span>9:41</span>
        <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
          <FaSignal size={12} />
          <FaSignal size={12} />
          <FaBatteryFull size={12} />
        </div>
      </div>

      {/* App Logo and User */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "var(--space-5)",
        }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "var(--radius-full)",
            background: "var(--text-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            fontWeight: 700,
            color: "var(--bg-primary)",
          }}
        >
          S
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            background: "var(--bg-secondary)",
            padding: "6px 12px",
            borderRadius: "var(--radius-full)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "var(--radius-full)",
              background: "var(--gradient-grape)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "10px",
            }}
          >
            <FaUser size={10} />
          </div>
          <Text size="2" style={{ fontWeight: 500 }}>
            mamos
          </Text>
        </div>
      </div>

      {/* Profile Info */}
      <div style={{ textAlign: "center", marginBottom: "var(--space-4)" }}>
        <Text
          size="4"
          style={{
            fontWeight: 700,
            marginBottom: "var(--space-2)",
            color: "var(--text-primary)",
          }}
        >
          {profileName}
        </Text>
        <Text size="2" color="gray">
          Manage your profile and analytics
        </Text>
      </div>

      {/* Delete Button */}
      {onDelete && (
        <div style={{ textAlign: "center" }}>
          <button
            onClick={onDelete}
            disabled={isLoading}
            style={{
              background: "transparent",
              border: "1.5px solid rgba(255, 100, 100, 0.3)",
              color: "#ff6b6b",
              padding: "8px 16px",
              borderRadius: "var(--radius-full)",
              fontSize: "12px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "opacity var(--transition-base)",
              opacity: isLoading ? 0.5 : 1,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              margin: "0 auto",
            }}
          >
            <FaTrash size={12} /> Delete Profile
          </button>
        </div>
      )}

      {profileId && (
        <div
          style={{
            textAlign: "center",
            marginTop: "var(--space-2)",
            fontSize: "10px",
            color: "var(--text-tertiary)",
            fontFamily: "var(--font-mono)",
            opacity: 0.6,
          }}
        >
          ID: {profileId.slice(0, 8)}...
        </div>
      )}
    </motion.div>
  );
};
