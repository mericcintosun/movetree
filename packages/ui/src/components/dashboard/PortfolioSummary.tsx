import React from "react";
import { motion } from "framer-motion";
import { Text } from "@radix-ui/themes";

interface PortfolioSummaryProps {
  totalValue: string;
  dailyChange: string;
  coinsValue: string;
  investmentsValue: string;
}

export const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({
  totalValue = "$4,813.87",
  dailyChange = "+$12.61",
  coinsValue = "$4,690.42",
  investmentsValue = "$123.45",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card-modern"
      style={{
        padding: "var(--space-6)",
        background: "var(--bg-secondary)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        marginBottom: "var(--space-5)",
      }}
    >
      {/* Total Portfolio */}
      <div style={{ textAlign: "center", marginBottom: "var(--space-5)" }}>
        <Text
          size="2"
          color="gray"
          style={{
            textDecoration: "underline",
            fontSize: "14px",
            marginBottom: "var(--space-2)",
          }}
        >
          Total portfolio
        </Text>
        <div
          style={{
            fontSize: "36px",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: "var(--space-2)",
          }}
        >
          {totalValue}
        </div>
        <div
          style={{
            fontSize: "16px",
            fontWeight: 500,
            color: "#10B981", // Green for positive change
          }}
        >
          {dailyChange}
        </div>
      </div>

      {/* Portfolio Breakdown */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--space-4)",
        }}
      >
        {/* Coins Card */}
        <div
          style={{
            background: "var(--bg-tertiary)",
            padding: "var(--space-4)",
            borderRadius: "var(--radius-md)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <Text
            size="2"
            color="gray"
            style={{ fontSize: "14px", marginBottom: "var(--space-2)" }}
          >
            Coins
          </Text>
          <div
            style={{
              fontSize: "20px",
              fontWeight: 600,
              color: "var(--text-primary)",
              marginBottom: "var(--space-1)",
            }}
          >
            {coinsValue}
          </div>
          <div
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "#10B981",
            }}
          >
            {dailyChange}
          </div>
        </div>

        {/* Investments Card */}
        <div
          style={{
            background: "var(--bg-tertiary)",
            padding: "var(--space-4)",
            borderRadius: "var(--radius-md)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <Text
            size="2"
            color="gray"
            style={{ fontSize: "14px", marginBottom: "var(--space-2)" }}
          >
            Investments
          </Text>
          <div
            style={{
              fontSize: "20px",
              fontWeight: 600,
              color: "var(--text-primary)",
            }}
          >
            {investmentsValue}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
