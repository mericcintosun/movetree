import React from "react";
import { Text } from "@radix-ui/themes";
import { motion } from "framer-motion";

interface StatsCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  gradient?: "mint" | "grape" | "sunset";
  icon?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  gradient = "mint",
  icon,
}) => {
  const gradientClass = {
    mint: "var(--gradient-mint)",
    grape: "var(--gradient-grape)",
    sunset: "var(--gradient-sunset)",
  }[gradient];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card-modern"
      style={{
        padding: "var(--space-5)",
        textAlign: "center",
        background: "var(--bg-secondary)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
      }}
    >
      {icon && (
        <div
          style={{
            fontSize: "20px",
            marginBottom: "var(--space-3)",
            opacity: 0.8,
          }}
        >
          {icon}
        </div>
      )}
      <div
        style={{
          fontSize: "28px",
          fontWeight: 700,
          background: gradientClass,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          marginBottom: "var(--space-2)",
        }}
      >
        {value}
      </div>
      <Text
        size="2"
        color="gray"
        style={{
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          fontSize: "12px",
          fontWeight: 500,
        }}
      >
        {title}
      </Text>
      {subtitle && (
        <Text
          size="1"
          color="gray"
          style={{
            marginTop: "var(--space-1)",
            fontSize: "11px",
          }}
        >
          {subtitle}
        </Text>
      )}
    </motion.div>
  );
};
