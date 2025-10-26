import React, { useState, useEffect } from "react";
import { Flex } from "@radix-ui/themes";
import { motion } from "framer-motion";
import { Header } from "./Header";
import { MobileHeader } from "./MobileHeader";
import { LinkManager } from "./LinkManager";
import { AnalyticsChart } from "./AnalyticsChart";
import { TagsManager } from "./TagsManager";
import { BlockchainSync } from "./BlockchainSync";
import { useFirebaseAnalytics } from "../../hooks/useAnalytics";
import { useBlockchainSync } from "../../hooks/useBlockchainSync";
import { useIsMobile } from "../../hooks/useIsMobile";
import {
  updateAnalyticsLinks,
  initializeAnalytics,
  getAnalytics,
} from "../../firebase/analytics";

interface LinkItem {
  label: string;
  url: string;
  icon?: string;
}

interface ProfileCardProps {
  profile: any;
  onUpdateLinks: (profileId: string, links: LinkItem[]) => void;
  onUpdateTags: (profileId: string, tags: string[]) => void;
  onDeleteProfile: (profileId: string) => void;
  isLoading: boolean;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  onUpdateLinks,
  onUpdateTags,
  onDeleteProfile,
  isLoading,
}) => {
  const profileData = (profile.data?.content as any)?.fields;
  const profileId = profile.data?.objectId || "";

  const { analytics, refreshAnalytics } = useFirebaseAnalytics(profileId);
  const { isSyncing, performSync } = useBlockchainSync();
  const isMobile = useIsMobile();

  const existingLinks = profileData?.links || [];
  const [links, setLinks] = useState<LinkItem[]>(
    existingLinks.length > 0
      ? existingLinks.map((url: string) => ({ label: "", url, icon: "" }))
      : [{ label: "", url: "", icon: "" }]
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    profileData?.tags || []
  );

  // Load links with labels from Firebase
  useEffect(() => {
    if (existingLinks.length === 0) return;

    if (analytics?.linkLabels && analytics.linkLabels.length > 0) {
      setLinks(
        existingLinks.map((url: string, index: number) => ({
          label: analytics.linkLabels?.[index] || "",
          url,
          icon: "",
        }))
      );
    } else {
      setLinks(
        existingLinks.map((url: string) => ({ label: "", url, icon: "" }))
      );
    }
  }, [JSON.stringify(existingLinks), analytics?.linkLabels?.length]);

  useEffect(() => {
    if (!profileId || existingLinks.length === 0) return;
    (async () => {
      const a = await getAnalytics(profileId);
      if (!a) {
        await initializeAnalytics(profileId, existingLinks);
      } else if (JSON.stringify(a.links) !== JSON.stringify(existingLinks)) {
        await updateAnalyticsLinks(profileId, existingLinks);
      }
      refreshAnalytics();
    })();
  }, [profileId, JSON.stringify(existingLinks), refreshAnalytics]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && profileId) refreshAnalytics();
    };
    const handleFocus = () => {
      if (profileId) refreshAnalytics();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [profileId, refreshAnalytics]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Profile Header */}
      {isMobile ? (
        <MobileHeader
          profileName={profileData?.name || "Unnamed Profile"}
          profileId={profileId}
          onDelete={() => onDeleteProfile(profileId)}
          isLoading={isLoading}
        />
      ) : (
        <Header
          profileName={profileData?.name || "Unnamed Profile"}
          profileId={profileId}
          onDelete={() => onDeleteProfile(profileId)}
          isLoading={isLoading}
        />
      )}

      {/* LinkManager - Main LinkTree Display - Full Width */}
      <div style={{ marginTop: "var(--space-6)" }}>
        <LinkManager
          links={links}
          setLinks={setLinks}
          analytics={analytics}
          isLoading={isLoading}
          onSave={() => onUpdateLinks(profileId, links)}
        />
      </div>

      {/* Bottom Sections - Grid Layout */}
      <div
        className="mobile-single-column"
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: "var(--space-5)",
          marginTop: "var(--space-5)",
        }}
      >
        {/* Analytics Chart */}
        <AnalyticsChart links={links} analytics={analytics} />

        {/* Tags Manager */}
        <TagsManager
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          isLoading={isLoading}
          onSave={() => onUpdateTags(profileId, selectedTags)}
        />
      </div>

      {/* Blockchain Sync - Full Width at Bottom */}
      <div style={{ marginTop: "var(--space-5)" }}>
        <BlockchainSync isSyncing={isSyncing} performSync={performSync} />
      </div>
    </motion.div>
  );
};
