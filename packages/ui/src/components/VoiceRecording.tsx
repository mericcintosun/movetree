import React, { useState, useRef, useEffect } from "react";
import { Box, Flex, Heading, Text, Button } from "@radix-ui/themes";

interface VoiceRecordingProps {
  onProfileCreated: (profileData: any) => void;
  onClose: () => void;
}

export const VoiceRecording: React.FC<VoiceRecordingProps> = ({
  onProfileCreated,
  onClose,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [step, setStep] = useState<
    "intro" | "name" | "bio" | "links" | "review"
  >("intro");
  const [profileData, setProfileData] = useState({
    name: "",
    bio: "",
    links: [] as string[],
  });
  const [recordingTime, setRecordingTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Mock voice recognition simulation
  const mockVoiceResponses = {
    name: [
      "Benim adım Ahmet Yılmaz",
      "Merhaba, ben Zeynep Kaya",
      "Selam, ben Mehmet Özkan",
      "Ben Emre Demir",
      "Merhaba, ben Ayşe Çelik",
    ],
    bio: [
      "Ben bir yazılım geliştiricisiyim ve blockchain teknolojileri ile ilgileniyorum. Sui ekosisteminde çalışıyorum ve Web3 projeleri geliştiriyorum.",
      "Merhaba, ben bir tasarımcıyım. UI/UX tasarımı yapıyorum ve özellikle Web3 projelerinde çalışmayı seviyorum.",
      "Selam, ben bir içerik üreticisiyim. YouTube'da teknoloji videoları çekiyorum ve blockchain konularında içerik üretiyorum.",
      "Merhaba, ben bir girişimciyim. Blockchain tabanlı projeler geliştiriyorum ve startup'lar kuruyorum.",
      "Selam, ben bir öğrenciyim. Bilgisayar mühendisliği okuyorum ve blockchain teknolojilerini öğreniyorum.",
    ],
    links: [
      "GitHub hesabım github.com/ahmetyilmaz",
      "LinkedIn profilim linkedin.com/in/ahmetyilmaz",
      "Twitter hesabım twitter.com/ahmetyilmaz",
      "YouTube kanalım youtube.com/ahmetyilmaz",
      "Kişisel web sitem ahmetyilmaz.com",
    ],
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    setTranscript("");

    // Start timer
    intervalRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);

    // Simulate recording for 3-5 seconds
    setTimeout(() => {
      stopRecording();
    }, Math.random() * 2000 + 3000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsProcessing(true);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Simulate processing time
    setTimeout(() => {
      processVoiceInput();
    }, 2000);
  };

  const processVoiceInput = () => {
    let response = "";

    switch (step) {
      case "name":
        response =
          mockVoiceResponses.name[
            Math.floor(Math.random() * mockVoiceResponses.name.length)
          ];
        break;
      case "bio":
        response =
          mockVoiceResponses.bio[
            Math.floor(Math.random() * mockVoiceResponses.bio.length)
          ];
        break;
      case "links":
        response =
          mockVoiceResponses.links[
            Math.floor(Math.random() * mockVoiceResponses.links.length)
          ];
        break;
    }

    setTranscript(response);
    setIsProcessing(false);
  };

  const handleNext = () => {
    if (step === "name") {
      setProfileData({ ...profileData, name: transcript });
      setStep("bio");
    } else if (step === "bio") {
      setProfileData({ ...profileData, bio: transcript });
      setStep("links");
    } else if (step === "links") {
      setProfileData({
        ...profileData,
        links: [...profileData.links, transcript],
      });
      setStep("review");
    }
    setTranscript("");
  };

  const handleSkip = () => {
    if (step === "name") {
      setStep("bio");
    } else if (step === "bio") {
      setStep("links");
    } else if (step === "links") {
      setStep("review");
    }
    setTranscript("");
  };

  const handleCreateProfile = () => {
    const mockProfile = {
      name: profileData.name || "Voice User",
      bio: profileData.bio || "Profile created using voice input",
      avatarCid: "",
      theme: "dark",
      links: profileData.links.map((link) => ({
        label: link.split(" ")[0],
        url: link.split(" ").slice(1).join(" "),
        icon: "",
      })),
    };

    onProfileCreated(mockProfile);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const getStepTitle = () => {
    switch (step) {
      case "intro":
        return "Sesli Profil Oluşturma";
      case "name":
        return "Adınızı Söyleyin";
      case "bio":
        return "Kendinizi Tanıtın";
      case "links":
        return "Sosyal Medya Linklerinizi Söyleyin";
      case "review":
        return "Profilinizi Kontrol Edin";
      default:
        return "";
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case "intro":
        return "Görme engelliler için özel olarak tasarlanmış sesli profil oluşturma sistemi. Mikrofonunuza konuşarak profilinizi kolayca oluşturabilirsiniz.";
      case "name":
        return "Lütfen adınızı ve soyadınızı net bir şekilde söyleyin. Örnek: 'Benim adım Ahmet Yılmaz'";
      case "bio":
        return "Kendinizi tanıtın. Ne iş yaptığınızı, hobilerinizi veya ilgi alanlarınızı anlatın.";
      case "links":
        return "Sosyal medya hesaplarınızı veya web sitenizi söyleyin. Örnek: 'GitHub hesabım github.com/kullaniciadi'";
      case "review":
        return "Oluşturulan profilinizi kontrol edin ve gerekirse düzenleyin.";
      default:
        return "";
    }
  };

  if (step === "intro") {
    return (
      <Box
        className="card-modern"
        style={{
          padding: "var(--space-6)",
          maxWidth: "600px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "64px", marginBottom: "var(--space-4)" }}>
          <span style={{ fontSize: "64px" }}>🎤</span>
        </div>
        <Heading size="6" mb="4" style={{ color: "var(--mint-800)" }}>
          {getStepTitle()}
        </Heading>
        <Text size="4" color="gray" mb="6" style={{ lineHeight: 1.6 }}>
          {getStepDescription()}
        </Text>

        <Flex gap="4" justify="center">
          <Button
            size="4"
            className="btn-primary"
            onClick={() => setStep("name")}
            style={{ fontSize: "16px", padding: "16px 32px" }}
          >
            Başlayalım
          </Button>
          <Button
            size="4"
            className="btn-outline"
            onClick={onClose}
            style={{ fontSize: "16px", padding: "16px 32px" }}
          >
            İptal
          </Button>
        </Flex>
      </Box>
    );
  }

  if (step === "review") {
    return (
      <Box
        className="card-modern"
        style={{
          padding: "var(--space-6)",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <Heading size="6" mb="4" style={{ color: "var(--mint-800)" }}>
          {getStepTitle()}
        </Heading>

        <Flex direction="column" gap="4" mb="6">
          <Box>
            <Text
              size="3"
              style={{ fontWeight: 600, color: "var(--text-primary)" }}
            >
              Ad Soyad:
            </Text>
            <Text size="3" color="gray">
              {profileData.name || "Belirtilmedi"}
            </Text>
          </Box>

          <Box>
            <Text
              size="3"
              style={{ fontWeight: 600, color: "var(--text-primary)" }}
            >
              Hakkımda:
            </Text>
            <Text size="3" color="gray">
              {profileData.bio || "Belirtilmedi"}
            </Text>
          </Box>

          <Box>
            <Text
              size="3"
              style={{ fontWeight: 600, color: "var(--text-primary)" }}
            >
              Linkler:
            </Text>
            {profileData.links.length > 0 ? (
              profileData.links.map((link, index) => (
                <Text key={index} size="3" color="gray">
                  • {link}
                </Text>
              ))
            ) : (
              <Text size="3" color="gray">
                Belirtilmedi
              </Text>
            )}
          </Box>
        </Flex>

        <Flex gap="4" justify="center">
          <Button
            size="4"
            className="btn-primary"
            onClick={handleCreateProfile}
            style={{ fontSize: "16px", padding: "16px 32px" }}
          >
            Profili Oluştur
          </Button>
          <Button
            size="4"
            className="btn-outline"
            onClick={() => setStep("name")}
            style={{ fontSize: "16px", padding: "16px 32px" }}
          >
            Baştan Başla
          </Button>
        </Flex>
      </Box>
    );
  }

  return (
    <Box
      className="card-modern"
      style={{
        padding: "var(--space-6)",
        maxWidth: "600px",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <Heading size="6" mb="4" style={{ color: "var(--mint-800)" }}>
        {getStepTitle()}
      </Heading>

      <Text size="4" color="gray" mb="6" style={{ lineHeight: 1.6 }}>
        {getStepDescription()}
      </Text>

      {/* Recording Interface */}
      <Box mb="6">
        {isRecording && (
          <Box mb="4">
            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                background: "var(--gradient-mint)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
                animation: "pulse 1s infinite",
                fontSize: "48px",
              }}
            >
              <span style={{ fontSize: "48px" }}>🎤</span>
            </div>
            <Text size="3" color="gray" mt="3">
              Kayıt Süresi: {formatTime(recordingTime)}
            </Text>
          </Box>
        )}

        {isProcessing && (
          <Box mb="4">
            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                background: "var(--gradient-grape)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
                fontSize: "48px",
              }}
            >
              <span style={{ fontSize: "48px" }}>⚙️</span>
            </div>
            <Text size="3" color="gray" mt="3">
              Ses işleniyor...
            </Text>
          </Box>
        )}

        {!isRecording && !isProcessing && (
          <Button
            size="4"
            className="btn-primary"
            onClick={startRecording}
            disabled={isProcessing}
            style={{
              fontSize: "18px",
              padding: "20px 40px",
              minWidth: "200px",
            }}
          >
            Konuşmaya Başla
          </Button>
        )}

        {isRecording && (
          <Button
            size="4"
            className="btn-secondary"
            onClick={stopRecording}
            style={{
              fontSize: "18px",
              padding: "20px 40px",
              minWidth: "200px",
            }}
          >
            Kaydı Durdur
          </Button>
        )}
      </Box>

      {/* Transcript Display */}
      {transcript && (
        <Box
          style={{
            background: "var(--bg-tertiary)",
            borderRadius: "var(--radius-md)",
            padding: "var(--space-4)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            marginBottom: "var(--space-4)",
            textAlign: "left",
          }}
        >
          <Text
            size="3"
            style={{ fontWeight: 600, marginBottom: "var(--space-2)" }}
          >
            Anlaşılan Metin:
          </Text>
          <Text size="3" color="gray" style={{ lineHeight: 1.6 }}>
            "{transcript}"
          </Text>
        </Box>
      )}

      {/* Action Buttons */}
      {transcript && (
        <Flex gap="4" justify="center">
          <Button
            size="4"
            className="btn-primary"
            onClick={handleNext}
            style={{ fontSize: "16px", padding: "16px 32px" }}
          >
            Devam Et →
          </Button>
          <Button
            size="4"
            className="btn-outline"
            onClick={handleSkip}
            style={{ fontSize: "16px", padding: "16px 32px" }}
          >
            Atlayın
          </Button>
        </Flex>
      )}

      {/* Progress Indicator */}
      <Box mt="6">
        <Flex gap="2" justify="center">
          {["name", "bio", "links", "review"].map((stepName, index) => (
            <div
              key={stepName}
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background:
                  step === stepName
                    ? "var(--mint-800)"
                    : ["name", "bio", "links", "review"].indexOf(step) > index
                    ? "var(--mint-600)"
                    : "var(--bg-tertiary)",
              }}
            />
          ))}
        </Flex>
        <Text size="2" color="gray" mt="2">
          Adım {["name", "bio", "links", "review"].indexOf(step) + 1} / 4
        </Text>
      </Box>

      {/* Pulse Animation */}
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </Box>
  );
};
