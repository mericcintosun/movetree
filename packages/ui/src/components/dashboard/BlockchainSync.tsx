import React from "react";
import { Flex, Text, Heading } from "@radix-ui/themes";
import { FaLink, FaHourglassHalf, FaCheck, FaSync } from "react-icons/fa";

interface BlockchainSyncProps {
  isSyncing: boolean;
  performSync: () => void;
}

export const BlockchainSync: React.FC<BlockchainSyncProps> = ({
  isSyncing,
  performSync,
}) => {
  return (
    <div
      className="card-modern"
      style={{
        padding: "var(--space-6)",
        background: "var(--bg-secondary)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <Flex justify="between" align="center" mb="3">
        <Heading size="5" style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: "10px" }}>
          <FaLink /> Blockchain Sync
        </Heading>
        <div
          className={isSyncing ? "badge-grape" : "badge-mint"}
          style={{
            fontSize: "11px",
            padding: "6px 12px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          {isSyncing ? <><FaHourglassHalf /> Syncing...</> : <><FaCheck /> Up to date</>}
        </div>
      </Flex>
      <Text size="2" color="gray" mb="4">
        Analytics auto-sync every 2 days
      </Text>
      <button
        className="btn-outline"
        onClick={performSync}
        disabled={isSyncing}
        style={{
          fontSize: "14px",
          padding: "12px 24px",
          opacity: isSyncing ? 0.5 : 1,
          cursor: isSyncing ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {isSyncing ? (
          <>
            <FaHourglassHalf /> Syncing...
          </>
        ) : (
          <>
            <FaSync /> Force Sync Now
          </>
        )}
      </button>
    </div>
  );
};
