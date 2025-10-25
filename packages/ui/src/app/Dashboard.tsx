import { useState } from "react";
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Text,
  TextField,
  TextArea,
} from "@radix-ui/themes";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useProfileTransactions } from "../sui/tx";
import { useOwnedProfiles } from "../sui/queries";

interface LinkItem {
  label: string;
  url: string;
  icon?: string;
}

export const Dashboard = () => {
  const account = useCurrentAccount();
  const { createProfile, updateLinks, updateLinksVerified, setTheme, deleteProfile } =
    useProfileTransactions();
  const { data: profiles, refetch } = useOwnedProfiles(account?.address || "");

  const [formData, setFormData] = useState({
    name: "",
    avatarCid: "",
    bio: "",
    theme: "dark",
  });

  const [links, setLinks] = useState<LinkItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateProfile = async () => {
    if (!account) return;

    setIsLoading(true);
    try {
      await createProfile(
        formData.name,
        formData.avatarCid,
        formData.bio,
        formData.theme,
      );
      await refetch();
      setFormData({ name: "", avatarCid: "", bio: "", theme: "dark" });
    } catch (error) {
      console.error("Failed to create profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateLinks = async (profileId: string) => {
    setIsLoading(true);
    try {
      await updateLinks(profileId, links);
      await refetch();
    } catch (error) {
      console.error("Failed to update links:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateLinksVerified = async (profileId: string) => {
    setIsLoading(true);
    try {
      await updateLinksVerified(profileId, links);
      await refetch();
    } catch (error) {
      console.error("Failed to update verified links:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTheme = async (profileId: string) => {
    setIsLoading(true);
    try {
      await setTheme(profileId, formData.theme);
      await refetch();
    } catch (error) {
      console.error("Failed to update theme:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProfile = async (profileId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this profile? This action cannot be undone.",
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      await deleteProfile(profileId);
      await refetch();
    } catch (error) {
      console.error("Failed to delete profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addLink = () => {
    setLinks([...links, { label: "", url: "", icon: "" }]);
  };

  const updateLink = (index: number, field: keyof LinkItem, value: string) => {
    const newLinks = [...links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setLinks(newLinks);
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  if (!account) {
    return (
      <Box p="4">
        <Heading>Connect your wallet to create your LinkTree profile</Heading>
      </Box>
    );
  }

  return (
    <Box p="4">
      <Heading mb="4">LinkTree Dashboard</Heading>

      {profiles?.data?.length === 0 ? (
        <Card>
          <Heading size="4" mb="4">
            Create Your Profile
          </Heading>
          <Flex direction="column" gap="3">
            <Box>
              <Text size="2" weight="bold" mb="1">
                Name
              </Text>
              <TextField.Root
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Your name"
              />
            </Box>

            <Box>
              <Text size="2" weight="bold" mb="1">
                Avatar CID
              </Text>
              <TextField.Root
                value={formData.avatarCid}
                onChange={(e) =>
                  setFormData({ ...formData, avatarCid: e.target.value })
                }
                placeholder="IPFS CID for your avatar"
              />
            </Box>

            <Box>
              <Text size="2" weight="bold" mb="1">
                Bio
              </Text>
              <TextArea
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                placeholder="Tell us about yourself"
                rows={3}
              />
            </Box>

            <Box>
              <Text size="2" weight="bold" mb="1">
                Theme
              </Text>
              <TextField.Root
                value={formData.theme}
                onChange={(e) =>
                  setFormData({ ...formData, theme: e.target.value })
                }
                placeholder="dark, light, etc."
              />
            </Box>

            <Button onClick={handleCreateProfile} disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Profile"}
            </Button>
          </Flex>
        </Card>
      ) : (
        <Flex direction="column" gap="4">
          {profiles?.data?.map((profile) => {
            const profileData = profile.data?.content?.fields;
            return (
              <Card key={profile.data?.objectId}>
                <Heading size="4" mb="3">
                  {profileData?.name || "Unnamed Profile"}
                </Heading>

                <Text size="2" mb="3">
                  {profileData?.bio || "No bio"}
                </Text>

                <Text size="1" color="gray" mb="3">
                  Object ID: {profile.data?.objectId}
                </Text>

                <Flex direction="column" gap="3">
                  <Box>
                    <Text size="2" weight="bold" mb="2">
                      Links
                    </Text>
                    {links.map((link, index) => (
                      <Flex key={index} gap="2" mb="2">
                        <TextField.Root
                          placeholder="Label"
                          value={link.label}
                          onChange={(e) =>
                            updateLink(index, "label", e.target.value)
                          }
                          size="1"
                        />
                        <TextField.Root
                          placeholder="URL"
                          value={link.url}
                          onChange={(e) =>
                            updateLink(index, "url", e.target.value)
                          }
                          size="1"
                        />
                        <TextField.Root
                          placeholder="Icon (optional)"
                          value={link.icon || ""}
                          onChange={(e) =>
                            updateLink(index, "icon", e.target.value)
                          }
                          size="1"
                        />
                        <Button
                          size="1"
                          color="red"
                          onClick={() => removeLink(index)}
                        >
                          Remove
                        </Button>
                      </Flex>
                    ))}
                    <Button size="1" onClick={addLink} mb="2">
                      Add Link
                    </Button>
                    <Button
                      size="1"
                      onClick={() =>
                        handleUpdateLinks(profile.data?.objectId || "")
                      }
                      disabled={isLoading}
                    >
                      Update Links
                    </Button>
                    <Button
                      size="1"
                      onClick={() =>
                        handleUpdateLinksVerified(profile.data?.objectId || "")
                      }
                      disabled={isLoading}
                      color="green"
                    >
                      Update Verified Links
                    </Button>
                  </Box>

                  <Box>
                    <Text size="2" weight="bold" mb="1">
                      Theme
                    </Text>
                    <Flex gap="2">
                      <TextField.Root
                        value={formData.theme}
                        onChange={(e) =>
                          setFormData({ ...formData, theme: e.target.value })
                        }
                        placeholder="Theme"
                        size="1"
                      />
                      <Button
                        size="1"
                        onClick={() =>
                          handleUpdateTheme(profile.data?.objectId || "")
                        }
                        disabled={isLoading}
                      >
                        Update Theme
                      </Button>
                    </Flex>
                  </Box>

                  <Box>
                    <Button
                      size="1"
                      color="red"
                      onClick={() =>
                        handleDeleteProfile(profile.data?.objectId || "")
                      }
                      disabled={isLoading}
                    >
                      Delete Profile
                    </Button>
                  </Box>
                </Flex>
              </Card>
            );
          })}
        </Flex>
      )}
    </Box>
  );
};
