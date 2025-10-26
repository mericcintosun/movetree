import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProfile } from "../sui/queries";
import { 
  getAnalytics, 
  incrementProfileView, 
  incrementLinkClick 
} from "../firebase/analytics";
import { 
  FaGithub, 
  FaLinkedin, 
  FaTwitter, 
  FaYoutube, 
  FaMedium,
  FaEnvelope,
  FaInstagram,
  FaDiscord,
  FaPinterest,
  FaBell,
  FaStar,
  FaHeart,
  FaEye,
  FaExternalLinkAlt
} from "react-icons/fa";

interface PublicProfileProps {
  objectId: string;
}

const platformIcons: { [key: string]: any } = {
  github: FaGithub,
  linkedin: FaLinkedin,
  twitter: FaTwitter,
  youtube: FaYoutube,
  medium: FaMedium,
};

const socialIcons = [
  { name: "email", icon: FaEnvelope, color: "#EA4335" },
  { name: "linkedin", icon: FaLinkedin, color: "#0077B5" },
  { name: "instagram", icon: FaInstagram, color: "#E4405F" },
  { name: "youtube", icon: FaYoutube, color: "#FF0000" },
  { name: "twitter", icon: FaTwitter, color: "#1DA1F2" },
  { name: "discord", icon: FaDiscord, color: "#5865F2" },
  { name: "pinterest", icon: FaPinterest, color: "#BD081C" },
];

export const PublicProfile = ({ objectId }: PublicProfileProps) => {
  const { data: profile, isLoading, error } = useProfile(objectId);
  const [analytics, setAnalytics] = useState<any>(null);
  const [viewIncremented, setViewIncremented] = useState(false);
  const [clickingIndex, setClickingIndex] = useState<number | null>(null);
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);

  const profileData = (profile?.data?.content as any)?.fields;
  const links = (profileData?.links || []).filter(
    (url: string) => url && url.trim() !== "",
  );

  // Load analytics from Firebase
  useEffect(() => {
    if (!objectId) return;

    const loadAnalytics = async () => {
      const data = await getAnalytics(objectId);
      setAnalytics(data);
    };

    loadAnalytics();
  }, [objectId]);

  // Increment view count (once per page load)
  useEffect(() => {
    if (!objectId || viewIncremented) return;

    const incrementView = async () => {
      await incrementProfileView(objectId);
      setViewIncremented(true);
      
      const updated = await getAnalytics(objectId);
      setAnalytics(updated);
    };

    incrementView();
  }, [objectId, viewIncremented]);

  const handleLinkClick = async (url: string, index: number) => {
    setClickingIndex(index);
    
    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }
    
    window.open(finalUrl, "_blank", "noopener,noreferrer");
    
    try {
      await incrementLinkClick(objectId, index);
      const updated = await getAnalytics(objectId);
      setAnalytics(updated);
    } catch (error) {
      console.warn("Failed to record click:", error);
    } finally {
      setClickingIndex(null);
    }
  };

  const getPlatformIcon = (url: string) => {
    const urlLower = url.toLowerCase();
    for (const [platform, Icon] of Object.entries(platformIcons)) {
      if (urlLower.includes(platform)) {
        return Icon;
      }
    }
    return null;
  };

  const getPlatformName = (url: string) => {
    const urlLower = url.toLowerCase();
    if (urlLower.includes('github')) return 'GitHub';
    if (urlLower.includes('linkedin')) return 'LinkedIn';
    if (urlLower.includes('twitter') || urlLower.includes('x.com')) return 'Twitter';
    if (urlLower.includes('youtube')) return 'YouTube';
    if (urlLower.includes('medium')) return 'Medium';
    return 'Link';
  };

  if (isLoading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#004aac",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            width: "100%",
            maxWidth: "400px",
            background: "rgba(45, 45, 45, 0.95)",
            backdropFilter: "blur(20px)",
            borderRadius: "24px",
            padding: "40px 20px",
            textAlign: "center",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              background: "url(/logo.png)",
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              margin: "0 auto 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />
          <div style={{ color: "white", fontSize: "18px", fontWeight: "500" }}>
            Loading profile...
          </div>
        </motion.div>
      </div>
    );
  }

  if (error || !profile?.data?.content) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#004aac",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            width: "100%",
            maxWidth: "400px",
            background: "rgba(45, 45, 45, 0.95)",
            backdropFilter: "blur(20px)",
            borderRadius: "24px",
            padding: "40px 20px",
            textAlign: "center",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            color: "white",
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ fontSize: "64px", marginBottom: "20px" }}
          >
            😕
          </motion.div>
          <h2 style={{ color: "#ff6b6b", marginBottom: "10px", fontSize: "24px" }}>Profile not found</h2>
          <p style={{ color: "#A0A0A0" }}>The profile you're looking for doesn't exist.</p>
        </motion.div>
      </div>
    );
  }

  const avatarUrl = profileData?.avatar_cid 
    ? `https://ipfs.io/ipfs/${profileData.avatar_cid}`
    : undefined;

  const totalClicks = analytics?.linkClicks?.reduce((a: number, b: number) => a + b, 0) || 0;

  return (
      <div style={{
        minHeight: "100vh",
        background: "#004aac",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        position: "relative",
      }}>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "rgba(45, 45, 45, 0.95)",
          backdropFilter: "blur(20px)",
          borderRadius: "24px",
          padding: "30px 20px",
          position: "relative",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
        }}
      >
        {/* Gradient overlay */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "200px",
          background: "linear-gradient(135deg, rgba(55, 197, 179, 0.1) 0%, rgba(165, 111, 241, 0.1) 100%)",
          borderRadius: "24px 24px 0 0",
          pointerEvents: "none",
        }} />

        {/* Top Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <FaStar style={{ color: "#FFD700", fontSize: "20px" }} />
          <FaBell style={{ color: "white", fontSize: "20px" }} />
        </motion.div>

        {/* Profile Picture */}
        <div style={{ textAlign: "center", marginBottom: "20px", position: "relative", zIndex: 1 }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              background: avatarUrl ? `url(${avatarUrl})` : `url(/logo.png)`,
              backgroundSize: avatarUrl ? "cover" : "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              margin: "0 auto",
              border: "6px solid white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "72px",
              fontWeight: "bold",
              color: "white",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
              position: "relative",
            }}
          >
            {!avatarUrl && !profileData?.avatar_cid && (profileData?.name?.charAt(0) || "?")}
            
            {/* View count badge */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.8 }}
              style={{
                position: "absolute",
                bottom: "-5px",
                right: "-5px",
                background: "linear-gradient(135deg, #37C5B3, #A56FF1)",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                color: "white",
                fontWeight: "bold",
                border: "2px solid white",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
              }}
            >
              <FaEye />
            </motion.div>
          </motion.div>
        </div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#37C5B3",
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          {profileData?.name || "Anonymous"}
        </motion.h1>

        {/* Bio */}
        {profileData?.bio && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            style={{
              fontSize: "14px",
              color: "rgba(255, 255, 255, 0.9)",
              textAlign: "center",
              marginBottom: "20px",
              lineHeight: "1.4",
            }}
          >
            {profileData.bio.split('\n').map((line: string, index: number) => (
              <div key={index}>{line}</div>
            ))}
          </motion.div>
        )}

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          <div style={{
            textAlign: "center",
            padding: "8px 16px",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}>
            <div style={{ color: "#37C5B3", fontSize: "16px", fontWeight: "bold" }}>
              {analytics?.profileViews || 0}
            </div>
            <div style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "12px" }}>
              Views
            </div>
          </div>
          <div style={{
            textAlign: "center",
            padding: "8px 16px",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}>
            <div style={{ color: "#A56FF1", fontSize: "16px", fontWeight: "bold" }}>
              {totalClicks}
            </div>
            <div style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "12px" }}>
              Clicks
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.7 }}
          style={{
            fontSize: "16px",
            color: "white",
            textAlign: "center",
            marginBottom: "30px",
            fontWeight: "500",
            textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
          }}
        >
          Let's connect! ✨
        </motion.div>

        {/* Main Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
          style={{ marginBottom: "30px" }}
        >
          <AnimatePresence>
            {links.length > 0 ? (
              links.map((url: string, index: number) => {
                const IconComponent = getPlatformIcon(url);
                const platformName = getPlatformName(url);
                const clicks = analytics?.linkClicks?.[index] || 0;
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                    style={{ marginBottom: "12px" }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.button
                      onClick={() => handleLinkClick(url, index)}
                      disabled={clickingIndex === index}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        width: "100%",
                        padding: "16px 20px",
                        background: "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(10px)",
                        border: "none",
                        borderRadius: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        cursor: clickingIndex === index ? "wait" : "pointer",
                        transition: "all 0.2s ease",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      {/* Gradient overlay on hover */}
                      <motion.div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: "linear-gradient(135deg, #37C5B3, #A56FF1)",
                          opacity: 0,
                        }}
                        whileHover={{ opacity: 0.1 }}
                      />
                      
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", position: "relative", zIndex: 1 }}>
                        {IconComponent && (
                          <IconComponent style={{ color: "#2D2D2D", fontSize: "20px" }} />
                        )}
                        <span style={{ 
                          color: "#2D2D2D", 
                          fontSize: "16px", 
                          fontWeight: "500" 
                        }}>
                          {platformName}
                        </span>
                      </div>
                      
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", position: "relative", zIndex: 1 }}>
                        {clicks > 0 && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            style={{
                              background: "linear-gradient(135deg, #37C5B3, #A56FF1)",
                              color: "white",
                              padding: "4px 8px",
                              borderRadius: "12px",
                              fontSize: "12px",
                              fontWeight: "bold",
                            }}
                          >
                            {clicks}
                          </motion.div>
                        )}
                        <FaExternalLinkAlt style={{ color: "#2D2D2D", fontSize: "14px" }} />
                      </div>
                    </motion.button>
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  textAlign: "center",
                  padding: "40px 20px",
                  color: "white",
                }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ fontSize: "48px", marginBottom: "20px" }}
                >
                  🔗
                </motion.div>
                <p style={{ color: "rgba(255, 255, 255, 0.7)" }}>No links available yet</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Social Icons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1.2 }}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            paddingTop: "20px",
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {socialIcons.map((social, index) => (
            <motion.div
              key={social.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: 1.3 + index * 0.05 }}
              whileHover={{ scale: 1.2, y: -2 }}
              whileTap={{ scale: 0.9 }}
              onHoverStart={() => setHoveredSocial(social.name)}
              onHoverEnd={() => setHoveredSocial(null)}
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: hoveredSocial === social.name 
                  ? social.color 
                  : "rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: `2px solid ${hoveredSocial === social.name ? social.color : "transparent"}`,
                boxShadow: hoveredSocial === social.name 
                  ? `0 8px 20px ${social.color}40` 
                  : "0 4px 12px rgba(0,0,0,0.2)",
              }}
            >
              <social.icon style={{ 
                color: hoveredSocial === social.name ? "white" : "rgba(255,255,255,0.8)", 
                fontSize: "18px" 
              }} />
            </motion.div>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1.5 }}
          style={{
            textAlign: "center",
            marginTop: "20px",
            fontSize: "12px",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          Powered by{" "}
          <span style={{ 
            color: "#37C5B3",
            fontWeight: "bold",
          }}>
            Lynq
          </span>{" "}
          🌳
        </motion.div>
      </motion.div>
    </div>
  );
};