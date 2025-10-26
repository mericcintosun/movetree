import React from "react";
import { Flex, Text, Heading } from "@radix-ui/themes";

interface CreateProfileFormProps {
  formData: {
    name: string;
    avatarCid: string;
    bio: string;
    theme: string;
  };
  setFormData: (data: any) => void;
  isLoading: boolean;
  onSubmit: () => void;
}

export const CreateProfileForm: React.FC<CreateProfileFormProps> = ({
  formData,
  setFormData,
  isLoading,
  onSubmit,
}) => {
  return (
    <div
      className="card-modern"
      style={{
        padding: "var(--space-7)",
        background: "var(--bg-secondary)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <Heading
        size="6"
        mb="5"
        className="text-gradient"
        style={{ fontWeight: 700 }}
      >
        ✨ Create Your Profile
      </Heading>

      <Flex direction="column" gap="4">
        <div>
          <Text
            size="2"
            weight="bold"
            mb="2"
            style={{ color: "var(--text-primary)" }}
          >
            Name *
          </Text>
          <input
            className="input-modern"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Your name"
            style={{
              width: "100%",
              fontSize: "15px",
              padding: "14px 16px",
              background: "var(--bg-tertiary)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          />
        </div>

        <div>
          <Text
            size="2"
            weight="bold"
            mb="2"
            style={{ color: "var(--text-primary)" }}
          >
            Avatar CID
          </Text>
          <input
            className="input-modern"
            value={formData.avatarCid}
            onChange={(e) =>
              setFormData({ ...formData, avatarCid: e.target.value })
            }
            placeholder="IPFS CID for your avatar (optional)"
            style={{
              width: "100%",
              fontSize: "15px",
              padding: "14px 16px",
              background: "var(--bg-tertiary)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          />
        </div>

        <div>
          <Text
            size="2"
            weight="bold"
            mb="2"
            style={{ color: "var(--text-primary)" }}
          >
            Bio
          </Text>
          <textarea
            className="input-modern"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Tell us about yourself"
            rows={4}
            style={{
              width: "100%",
              fontSize: "15px",
              padding: "14px 16px",
              resize: "vertical",
              fontFamily: "var(--font-body)",
              background: "var(--bg-tertiary)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          />
        </div>

        <div>
          <Text
            size="2"
            weight="bold"
            mb="2"
            style={{ color: "var(--text-primary)" }}
          >
            Theme
          </Text>
          <input
            className="input-modern"
            value={formData.theme}
            onChange={(e) =>
              setFormData({ ...formData, theme: e.target.value })
            }
            placeholder="dark, light, etc."
            style={{
              width: "100%",
              fontSize: "15px",
              padding: "14px 16px",
              background: "var(--bg-tertiary)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          />
        </div>

        <button
          className="btn-primary"
          onClick={onSubmit}
          disabled={isLoading}
          style={{
            fontSize: "15px",
            padding: "16px 32px",
            marginTop: "var(--space-3)",
            opacity: isLoading ? 0.6 : 1,
            alignSelf: "flex-start",
          }}
        >
          {isLoading ? "Creating..." : "Create Profile"}
        </button>
      </Flex>
    </div>
  );
};
