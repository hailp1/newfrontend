// FILE: pages/settings.tsx
import { useState, useRef } from "react";
import { useRouter } from "next/router";
// [FIX] 4.1: Import component Image từ next/image
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AuthModal from "../components/AuthModal";

// [FIX] 1.1: Định nghĩa một interface cụ thể cho settings
interface SiteSettings {
  siteTitle: string;
  favicon: string;
  logo: string;
  logoImage?: string;
}

interface SettingsProps {
  themeContext: {
    theme: "light" | "dark";
    siteSettings: SiteSettings;
    updateTheme: (theme: "light" | "dark") => void;
    // [FIX] 1.2: Sử dụng interface SiteSettings thay vì 'any'
    updateSiteSettings: (settings: Partial<SiteSettings>) => void;
  };
}

export default function Settings({ themeContext }: SettingsProps) {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState("setting");
  const [logoPreview, setLogoPreview] = useState<string>(
    themeContext.siteSettings.logoImage || ""
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊", onClick: () => router.push("/") },
    { id: "project", label: "Project Management", icon: "📁", onClick: () => router.push("/project-management") },
    { id: "literature", label: "Literature Review", icon: "📚", onClick: () => router.push("/literature-review") },
    { id: "data", label: "Data Management", icon: "💾", onClick: () => router.push("/data-analysis") },
    { id: "analysis", label: "Analysis Tools", icon: "📈", onClick: () => router.push("/analysis-tools") },
    { id: "writing", label: "Thesis Writing", icon: "✍️", onClick: () => router.push("/thesis-writing") },
    { id: "setting", label: "Settings", icon: "⚙️", onClick: () => {} },
  ];

  const handleLogin = (userData: { name: string; email: string }) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setLogoPreview(imageUrl);
        themeContext.updateSiteSettings({ logoImage: imageUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoPreview("");
    themeContext.updateSiteSettings({ logoImage: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSaveSettings = () => {
    // Settings đã được apply real-time thông qua themeContext
    alert("Settings have been saved successfully!");
  };

  const handleResetSettings = () => {
    themeContext.updateTheme("light");
    themeContext.updateSiteSettings({
      siteTitle: "ResearchHub",
      favicon: "🔬",
      logo: "ResearchHub",
      logoImage: "",
    });
    setLogoPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    alert("Settings have been reset to default!");
  };

  // ... (phần styles không thay đổi, giữ nguyên như cũ)
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column" as const,
      minHeight: "100vh",
      backgroundColor: "var(--bg-color, #f8fafc)",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: "var(--text-color, #1f2937)",
    },
    mainContainer: {
      display: "flex",
      flex: 1,
      minHeight: 0,
    },
    sidebar: {
      width: "280px",
      backgroundColor: "var(--sidebar-bg, white)",
      borderRight: "1px solid var(--border-color, #e2e8f0)",
      padding: "24px 0",
      boxShadow: "0 0 20px rgba(0, 0, 0, 0.05)",
      overflowY: "auto" as const,
    },
    logoSidebar: {
      padding: "0 24px 24px",
      borderBottom: "1px solid var(--border-color, #e2e8f0)",
      marginBottom: "24px",
    },
    logoText: {
      fontSize: "20px",
      fontWeight: "bold",
      color: "var(--text-color, #1e293b)",
    },
    menu: {
      padding: "0 16px",
    },
    menuItem: {
      display: "flex",
      alignItems: "center",
      padding: "12px 16px",
      borderRadius: "8px",
      marginBottom: "8px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      color: "var(--text-muted, #64748b)",
      textDecoration: "none",
    },
    menuItemActive: {
      backgroundColor: "var(--primary-color, #3b82f6)",
      color: "white",
    },
    menuIcon: {
      marginRight: "12px",
    },
    mainContent: {
      flex: 1,
      padding: "32px",
      backgroundColor: "var(--bg-color, #f8fafc)",
      overflowY: "auto" as const,
    },
    headerSection: {
      marginBottom: "32px",
    },
    title: {
      fontSize: "28px",
      fontWeight: "bold",
      color: "var(--text-color, #1e293b)",
      marginBottom: "8px",
    },
    subtitle: {
      fontSize: "16px",
      color: "var(--text-muted, #64748b)",
    },
    settingsGrid: {
      display: "grid",
      gap: "24px",
      maxWidth: "800px",
    },
    settingCard: {
      backgroundColor: "var(--card-bg, white)",
      borderRadius: "12px",
      padding: "24px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      border: "1px solid var(--border-color, #e2e8f0)",
    },
    settingTitle: {
      fontSize: "18px",
      fontWeight: "600",
      color: "var(--text-color, #1e293b)",
      marginBottom: "16px",
    },
    settingGroup: {
      marginBottom: "20px",
    },
    settingLabel: {
      display: "block",
      fontSize: "14px",
      fontWeight: "500",
      color: "var(--text-color, #374151)",
      marginBottom: "8px",
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      border: "1px solid var(--border-color, #d1d5db)",
      borderRadius: "6px",
      fontSize: "14px",
      marginBottom: "16px",
      backgroundColor: "var(--input-bg, white)",
      color: "var(--text-color, #374151)",
    },
    select: {
      width: "100%",
      padding: "12px 16px",
      border: "1px solid var(--border-color, #d1d5db)",
      borderRadius: "6px",
      fontSize: "14px",
      marginBottom: "16px",
      backgroundColor: "var(--input-bg, white)",
      color: "var(--text-color, #374151)",
    },
    radioGroup: {
      display: "flex",
      gap: "16px",
      marginBottom: "16px",
      flexWrap: "wrap" as const,
    },
    radioLabel: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      cursor: "pointer",
      fontSize: "14px",
    },
    button: {
      backgroundColor: "var(--primary-color, #3b82f6)",
      color: "white",
      border: "none",
      padding: "12px 24px",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "500",
      fontSize: "14px",
      marginRight: "12px",
      marginBottom: "8px",
    },
    fileUpload: {
      width: "100%",
      padding: "12px 16px",
      border: "2px dashed var(--border-color, #d1d5db)",
      borderRadius: "6px",
      fontSize: "14px",
      marginBottom: "16px",
      backgroundColor: "var(--input-bg, white)",
      textAlign: "center" as const,
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    logoPreview: {
      width: "120px",
      height: "60px",
      objectFit: "contain" as const,
      border: "1px solid var(--border-color, #e2e8f0)",
      borderRadius: "6px",
      padding: "8px",
      backgroundColor: "white",
    },
    preview: {
      backgroundColor: "var(--preview-bg, #f8fafc)",
      padding: "20px",
      borderRadius: "8px",
      border: "1px solid var(--border-color, #e2e8f0)",
      marginTop: "16px",
    },
    previewTitle: {
      fontSize: "16px",
      fontWeight: "600",
      marginBottom: "12px",
      color: "var(--text-color, #374151)",
    },
    currentTheme: {
      padding: "8px 12px",
      backgroundColor: "var(--primary-color, #3b82f6)",
      color: "white",
      borderRadius: "4px",
      fontSize: "12px",
      fontWeight: "600",
      display: "inline-block",
      marginLeft: "12px",
    },
  };
  const themeStyles =
    themeContext.theme === "dark"
      ? {
          "--bg-color": "#1f2937",
          "--text-color": "#f9fafb",
          "--text-muted": "#d1d5db",
          "--card-bg": "#374151",
          "--border-color": "#4b5563",
          "--input-bg": "#4b5563",
          "--sidebar-bg": "#374151",
          "--preview-bg": "#4b5563",
          "--primary-color": "#60a5fa",
        }
      : {
          "--bg-color": "#f8fafc",
          "--text-color": "#1f2937",
          "--text-muted": "#64748b",
          "--card-bg": "white",
          "--border-color": "#e2e8f0",
          "--input-bg": "white",
          "--sidebar-bg": "white",
          "--preview-bg": "#f8fafc",
          "--primary-color": "#3b82f6",
        };


  return (
    <div style={{ ...styles.container, ...themeStyles }}>
      <Header
        user={user}
        onLoginClick={() => setShowAuthModal(true)}
        onLogout={handleLogout}
      />

      <div style={styles.mainContainer}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <div style={styles.logoSidebar}>
            <div style={styles.logoText}>Research Dashboard</div>
          </div>
          <div style={styles.menu}>
            {menuItems.map((item) => (
              <div
                key={item.id}
                style={{
                  ...styles.menuItem,
                  ...(activeMenu === item.id ? styles.menuItemActive : {}),
                }}
                onClick={() => {
                  setActiveMenu(item.id);
                  item.onClick();
                }}
              >
                {/* [IMPROVEMENT] Thêm role và aria-label cho emoji */}
                <span style={styles.menuIcon} role="img" aria-label={`${item.label} icon`}>{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div style={styles.mainContent}>
          <div style={styles.headerSection}>
            <h1 style={styles.title}>Settings</h1>
            <p style={styles.subtitle}>Customize your ResearchHub experience</p>
          </div>

          <div style={styles.settingsGrid}>
            {/* Theme Settings */}
            <div style={styles.settingCard}>
              <h3 style={styles.settingTitle}>
                Appearance
                <span style={styles.currentTheme}>
                  {themeContext.theme === "dark" ? "Dark Mode" : "Light Mode"}
                </span>
              </h3>

              <div style={styles.settingGroup}>
                <label style={styles.settingLabel}>Theme</label>
                <div style={styles.radioGroup}>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="theme"
                      value="light"
                      checked={themeContext.theme === "light"}
                      // [FIX] 3.1: Xóa tham số 'e' không sử dụng
                      onChange={() => themeContext.updateTheme("light")}
                    />
                    Light Mode
                  </label>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="theme"
                      value="dark"
                      checked={themeContext.theme === "dark"}
                      // [FIX] 3.2: Xóa tham số 'e' không sử dụng
                      onChange={() => themeContext.updateTheme("dark")}
                    />
                    Dark Mode
                  </label>
                </div>
              </div>
            </div>

            {/* Site Identity */}
            <div style={styles.settingCard}>
              <h3 style={styles.settingTitle}>Site Identity</h3>

              <div style={styles.settingGroup}>
                <label style={styles.settingLabel}>Site Title</label>
                <input
                  type="text"
                  value={themeContext.siteSettings.siteTitle}
                  onChange={(e) =>
                    themeContext.updateSiteSettings({
                      siteTitle: e.target.value,
                    })
                  }
                  style={styles.input}
                  placeholder="Enter site title"
                />
              </div>

              <div style={styles.settingGroup}>
                <label style={styles.settingLabel}>
                  Favicon (Browser Icon)
                </label>
                <input
                  type="text"
                  value={themeContext.siteSettings.favicon}
                  onChange={(e) =>
                    themeContext.updateSiteSettings({ favicon: e.target.value })
                  }
                  style={styles.input}
                  placeholder="Enter emoji for favicon"
                  maxLength={2}
                />
              </div>

              <div style={styles.settingGroup}>
                <label style={styles.settingLabel}>Logo Text</label>
                <input
                  type="text"
                  value={themeContext.siteSettings.logo}
                  onChange={(e) =>
                    themeContext.updateSiteSettings({ logo: e.target.value })
                  }
                  style={styles.input}
                  placeholder="Enter logo text"
                />
              </div>

              <div style={styles.settingGroup}>
                <label style={styles.settingLabel}>Logo Image</label>
                <div
                  style={styles.fileUpload}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {logoPreview ? "Change Logo Image" : "Upload Logo Image"}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  style={{ display: "none" }}
                />

                {logoPreview && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      marginTop: "12px",
                    }}
                  >
                    {/* [FIX] 4.2: Thay <img> bằng <Image> */}
                    <Image
                      src={logoPreview}
                      alt="Logo preview"
                      width={120}
                      height={60}
                      style={styles.logoPreview}
                    />
                    <button
                      style={{
                        ...styles.button,
                        backgroundColor: "#dc2626",
                        padding: "8px 16px",
                      }}
                      onClick={removeLogo}
                    >
                      Remove Logo
                    </button>
                  </div>
                )}
              </div>

              <div style={styles.preview}>
                <div style={styles.previewTitle}>Live Preview:</div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "12px",
                  }}
                >
                  {logoPreview ? (
                    // [FIX] 4.3: Thay <img> bằng <Image>
                    <Image
                      src={logoPreview}
                      alt="Logo"
                      width={80} // Cần width và height
                      height={30}
                      style={{ objectFit: "contain" }}
                    />
                  ) : (
                    <span style={{ fontSize: "24px" }} role="img" aria-label="favicon preview">
                      {themeContext.siteSettings.favicon}
                    </span>
                  )}
                  <span
                    style={{
                      fontWeight: "bold",
                      color: "var(--primary-color, #3b82f6)",
                      fontSize: "18px",
                    }}
                  >
                    {themeContext.siteSettings.logo}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "var(--text-muted, #64748b)",
                  }}
                >
                  {/* [FIX] 2.1: Thay thế " bằng &quot; */}
                  Site Title: &quot;{themeContext.siteSettings.siteTitle}&quot;
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "var(--text-muted, #64748b)",
                  }}
                >
                  {/* [FIX] 2.2: Thay thế " bằng &quot; */}
                  Favicon: {themeContext.siteSettings.favicon} (appears in &quot;browser tab&quot;)
                </div>
              </div>
            </div>

            <div style={styles.settingCard}>
              <button style={styles.button} onClick={handleSaveSettings}>
                Save Settings
              </button>
              <button
                style={{ ...styles.button, backgroundColor: "#6b7280" }}
                onClick={handleResetSettings}
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}