import React from "react";
import { motion } from "framer-motion";
import { Text } from "@radix-ui/themes";
import { FaCheckCircle } from "react-icons/fa";

interface Asset {
  id: string;
  name: string;
  icon: string;
  price: string;
  change: string;
  totalValue: string;
  quantity?: string;
  verified?: boolean;
}

interface AssetListProps {
  assets: Asset[];
}

export const AssetList: React.FC<AssetListProps> = ({ assets }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="card-modern"
      style={{
        padding: "var(--space-5)",
        background: "var(--bg-secondary)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
      }}
    >
      <div style={{ marginBottom: "var(--space-4)" }}>
        <Text
          size="3"
          style={{ fontWeight: 600, color: "var(--text-primary)" }}
        >
          Assets
        </Text>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-3)",
        }}
      >
        {assets.map((asset, index) => (
          <motion.div
            key={asset.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "var(--space-3)",
              background: "var(--bg-tertiary)",
              borderRadius: "var(--radius-md)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            {/* Asset Icon */}
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "var(--radius-full)",
                background: asset.name === "Sui" ? "#37C5B3" : "#A56FF1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "var(--space-3)",
                fontSize: "18px",
              }}
            >
              {asset.icon}
            </div>

            {/* Asset Info */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "var(--space-1)",
                }}
              >
                <Text
                  size="2"
                  style={{ fontWeight: 600, color: "var(--text-primary)" }}
                >
                  {asset.name}
                </Text>
                {asset.verified && (
                  <FaCheckCircle
                    style={{
                      marginLeft: "var(--space-2)",
                      color: "#37C5B3",
                      fontSize: "14px",
                    }}
                  />
                )}
              </div>
              <Text size="1" style={{ color: "var(--text-secondary)" }}>
                {asset.price}{" "}
                <span style={{ color: "#10B981" }}>{asset.change}</span>
              </Text>
            </div>

            {/* Asset Values */}
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  marginBottom: "var(--space-1)",
                }}
              >
                {asset.totalValue}
              </div>
              {asset.quantity && (
                <Text size="1" style={{ color: "var(--text-secondary)" }}>
                  {asset.quantity}
                </Text>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
