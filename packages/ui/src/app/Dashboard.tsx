import React, { useState } from "react";
import { Box, Flex, Heading, Text } from "@radix-ui/themes";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useProfileTransactions } from "../sui/tx";
import { useOwnedProfiles } from "../sui/queries";
import { updateAnalyticsLinks, deleteAnalytics } from "../firebase/analytics";
import { 
  ProfileCard, 
  CreateProfileForm
} from "../components/dashboard";
import { FaLock, FaExclamationTriangle } from "react-icons/fa";

interface LinkItem {
  label: string;
  url: string;
  icon?: string;
}

// Main Dashboard Component
export const Dashboard = () => {
  const account = useCurrentAccount();
  const { createProfile, updateLinks, updateTags, deleteProfile } = useProfileTransactions();
  const { data: profiles, refetch, isLoading: profilesLoading, error: profilesError } = useOwnedProfiles(account?.address || "");

  const [formData, setFormData] = useState({
    name: "",
    avatarCid: "",
    bio: "",
    theme: "dark",
  });
  const [isLoading, setIsLoading] = useState(false);

  const currentProfileData = profiles?.data?.[0]?.data?.content as any;

  const handleCreateProfile = async () => {
    if (!account) {
      alert("Please connect your wallet first");
      return;
    }
    if (!formData.name.trim()) {
      alert("Please enter a name");
      return;
    }
    
    // Normalize name -> slug for URL usage (lowercase, hyphenated)
    const nameSlug = formData.name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    
    // Prepare values used later in refresh/registration
    const initialList = profiles?.data || [];
    const initialIds = new Set((initialList as any[]).map((p: any) => p?.data?.objectId).filter(Boolean));
    const initialCount = initialList.length;
    setIsLoading(true);
    
    try {
      await createProfile(
        formData.name,
        formData.avatarCid,
        formData.bio,
        formData.theme,
      );
      await refetch();
      
      // Wait for profile to be created
      for (let i = 0; i < 8; i++) {
        const result: any = await refetch();
        const currCount = result?.data?.data?.length || 0;
        if (currCount > initialCount) break;
        await new Promise((r) => setTimeout(r, 800));
      }
      
      // Derive created objectId by diff if not previously registered
      try {
        const latest: any = await refetch();
        const latestList = (latest?.data?.data || []) as any[];
        const newItem = latestList.find((p: any) => p?.data?.objectId && !initialIds.has(p.data.objectId));
        const derivedId: string | undefined = newItem?.data?.objectId;
        
        if (derivedId) {
          const backendUrl = (import.meta as any).env?.VITE_BACKEND_URL as string | undefined;
          if (!backendUrl) {
            console.warn("[name-register:derived] VITE_BACKEND_URL is not set");
          } else {
            console.log("[name-register:derived] registering", nameSlug, derivedId);
            await fetch(`${backendUrl}/api/profile-name/register`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name: nameSlug, objectId: derivedId, owner: account.address }),
            });
          }
        }
      } catch (e) {
        console.warn("[name-register:derived] failed", e);
      }
      
      // Reset form for next profile creation
      setFormData({ name: "", avatarCid: "", bio: "", theme: "dark" });
      alert("Profile created successfully! You can view it at /" + nameSlug);
    } catch (error) {
      console.error("Failed to create profile:", error);
      alert(`Profile creation failed: ${(error as Error).message || error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateLinks = async (profileId: string, links: LinkItem[]) => {
    setIsLoading(true);
    try {
      await updateLinks(profileId, links);
      const urls = links.map((l) => l.url).filter((url) => url && url.trim() !== "");
      await updateAnalyticsLinks(profileId, urls);
      await refetch();
      alert("Links updated successfully!");
    } catch (error) {
      console.error("Failed to update links:", error);
      alert("Failed to update links: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTags = async (profileId: string, tags: string[]) => {
    setIsLoading(true);
    try {
      await updateTags(profileId, tags);
      await refetch();
      alert("Tags updated successfully!");
    } catch (error) {
      console.error("Failed to update tags:", error);
      alert("Failed to update tags: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProfile = async (profileId: string) => {
    if (!confirm("Are you sure you want to delete this profile? This action cannot be undone.")) {
      return;
    }
    setIsLoading(true);
    try {
      await deleteProfile(profileId);
      await deleteAnalytics(profileId);
      await refetch();
    } catch (error) {
      console.error("Failed to delete profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!account) {
    return (
      <Box className="fade-in" style={{ textAlign: "center", padding: "var(--space-8) 0" }}>
        <div style={{ marginBottom: "var(--space-5)" }}>
          <FaLock size={64} style={{ color: "var(--mint-700)" }} />
        </div>
        <Heading size="7" mb="3" className="text-gradient">
          Welcome to MoveTree
        </Heading>
        <Text size="3" color="gray">
          Connect your wallet to create your on-chain LinkTree profile
        </Text>
      </Box>
    );
  }

  if (profilesLoading) {
    return (
      <Box className="fade-in" style={{ textAlign: "center", padding: "var(--space-8) 0" }}>
        <div className="skeleton" style={{
          width: "100px",
          height: "100px",
          borderRadius: "var(--radius-full)",
          margin: "0 auto var(--space-5)",
        }} />
        <Text size="3" color="gray">Loading your profiles...</Text>
      </Box>
    );
  }

  if (!(import.meta as any).env?.VITE_PACKAGE_ID) {
    return (
      <Box className="card-modern fade-in" p="6">
        <Heading size="5" mb="3" style={{ color: "#ff6b6b", display: "flex", alignItems: "center", gap: "10px" }}>
          <FaExclamationTriangle /> Configuration Error
        </Heading>
        <Text color="gray">
          VITE_PACKAGE_ID environment variable is not set. Please configure it in your .env.local file.
        </Text>
      </Box>
    );
  }

  return (
    <Box className="fade-in">
      {(!profiles?.data || profiles.data.length === 0 || profilesError) ? (
        <CreateProfileForm
          formData={formData}
          setFormData={setFormData}
          isLoading={isLoading}
          onSubmit={handleCreateProfile}
        />
      ) : (
        <Flex direction="column" gap="5">
          {profiles?.data?.map((profile) => (
            <ProfileCard
              key={profile.data?.objectId}
              profile={profile}
              onUpdateLinks={handleUpdateLinks}
              onUpdateTags={handleUpdateTags}
              onDeleteProfile={handleDeleteProfile}
              isLoading={isLoading}
            />
          ))}
        </Flex>
      )}
    </Box>
  );
};