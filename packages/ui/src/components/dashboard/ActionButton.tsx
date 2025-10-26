import React from "react";
import { Text } from "@radix-ui/themes";
import { motion } from "framer-motion";
import { FaCoins, FaQrcode, FaPaperPlane, FaExchangeAlt } from "react-icons/fa";

interface ActionButtonProps {
  icon: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "outline";
}

const iconMap = {
  "💰": FaCoins,
  "📥": FaQrcode,
  "📤": FaPaperPlane,
  "🔄": FaExchangeAlt,
};

export const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  label,
  onClick,
  disabled = false,
  variant = "primary",
}) => {
  const IconComponent = iconMap[icon as keyof typeof iconMap] || FaCoins;

  const baseStyles = {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    padding: "var(--space-4)",
    borderRadius: "var(--radius-lg)",
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "opacity var(--transition-base)",
    minHeight: "80px",
    opacity: disabled ? 0.5 : 1,
    fontSize: "14px",
    fontWeight: 500,
  };

  const variantStyles = {
    primary: {
      background: "var(--bg-secondary)",
      border: "1px solid rgba(255, 255, 255, 0.06)",
      color: "var(--text-primary)",
    },
    secondary: {
      background: "var(--gradient-mint)",
      color: "var(--bg-primary)",
    },
    outline: {
      background: "transparent",
      border: "1.5px solid rgba(255, 255, 255, 0.2)",
      color: "var(--text-primary)",
    },
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      whileHover={{ opacity: 0.8 }}
      style={{
        ...baseStyles,
        ...variantStyles[variant],
      }}
      onClick={onClick}
      disabled={disabled}
    >
      <div
        style={{
          fontSize: "20px",
          marginBottom: "var(--space-2)",
          opacity: 0.9,
        }}
      >
        <IconComponent />
      </div>
      <Text size="2" style={{ fontWeight: 500 }}>
        {label}
      </Text>
    </motion.button>
  );
};
