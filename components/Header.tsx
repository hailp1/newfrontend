import { useRouter } from "next/router";
import { useState, useEffect } from "react";

interface HeaderProps {
  user?: { name: string; email: string } | null;
  onLoginClick?: () => void;
  onLogout?: () => void;
}

export default function Header({ user, onLoginClick, onLogout }: HeaderProps) {
  const router = useRouter();
  const [settings, setSettings] = useState({
    logo: "ResearchHub",
    logoImage: "",
    siteTitle: "ResearchHub",
  });
  const [currentUser, setCurrentUser] = useState(user);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Load settings và user từ localStorage chỉ trên client-side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSettings = JSON.parse(
        localStorage.getItem("siteSettings") ||
          '{"logo":"ResearchHub","siteTitle":"ResearchHub"}'
      );
      const savedUser = JSON.parse(localStorage.getItem("user") || "null");

      setSettings(savedSettings);
      setCurrentUser(savedUser);

      // Apply theme từ settings
      const savedTheme = localStorage.getItem("theme") || "light";
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  // Update user khi props thay đổi
  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  const handleLoginClick = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      setShowAuthModal(true);
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      setCurrentUser(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userData = { name: "John Doe", email: "john.doe@example.com" };
    setCurrentUser(userData);
    setShowAuthModal(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(userData));
    }
  };

  const handleGoogleLogin = () => {
    const userData = { name: "Google User", email: "google.user@example.com" };
    setCurrentUser(userData);
    setShowAuthModal(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(userData));
    }
  };

  const styles = {
    header: {
      backgroundColor: "var(--header-bg, white)",
      borderBottom: "1px solid var(--border-color, #e2e8f0)",
      padding: "16px 32px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      position: "sticky" as const,
      top: 0,
      zIndex: 100,
    },
    headerContent: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      maxWidth: "1200px",
      margin: "0 auto",
    },
    logo: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "var(--primary-color, #3b82f6)",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    logoImage: {
      height: "32px",
      objectFit: "contain" as const,
    },
    nav: {
      display: "flex",
      gap: "24px",
      alignItems: "center",
    },
    navItem: {
      color: "var(--text-muted, #64748b)",
      textDecoration: "none",
      cursor: "pointer",
      fontWeight: "500",
      transition: "color 0.2s ease",
      fontSize: "14px",
    },
    authButton: {
      backgroundColor: "var(--primary-color, #3b82f6)",
      color: "white",
      border: "none",
      padding: "8px 16px",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "500",
      fontSize: "14px",
    },
    userMenu: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    userName: {
      fontSize: "14px",
      color: "var(--text-color, #374151)",
    },
    modalOverlay: {
      position: "fixed" as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "20px",
    },
    modal: {
      backgroundColor: "white",
      padding: "32px",
      borderRadius: "12px",
      width: "400px",
      maxWidth: "90vw",
      maxHeight: "90vh",
      overflow: "auto",
    },
    modalTitle: {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "24px",
      textAlign: "center" as const,
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      fontSize: "14px",
      marginBottom: "16px",
    },
    googleButton: {
      width: "100%",
      padding: "12px 16px",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      backgroundColor: "white",
      color: "#374151",
      fontSize: "14px",
      fontWeight: "500",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      marginBottom: "16px",
    },
    switchAuth: {
      textAlign: "center" as const,
      color: "#64748b",
      fontSize: "14px",
      marginTop: "16px",
    },
    switchLink: {
      color: "#3b82f6",
      cursor: "pointer",
      fontWeight: "500",
    },
  };

  return (
    <>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo} onClick={() => router.push("/")}>
            {settings.logoImage ? (
              <img
                src={settings.logoImage}
                alt="Logo"
                style={styles.logoImage}
              />
            ) : (
              <span>🔬</span>
            )}
            {settings.logo}
          </div>
          <nav style={styles.nav}>
            <a style={styles.navItem}>Features</a>
            <a style={styles.navItem}>Pricing</a>
            <a style={styles.navItem}>Documentation</a>
            {currentUser ? (
              <div style={styles.userMenu}>
                <span style={styles.userName}>Welcome, {currentUser.name}</span>
                <button style={styles.authButton} onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <button style={styles.authButton} onClick={handleLoginClick}>
                Login / Register
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Auth Modal */}
      {showAuthModal && (
        <div
          style={styles.modalOverlay}
          onClick={() => setShowAuthModal(false)}
        >
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Welcome Back</h2>

            <button style={styles.googleButton} onClick={handleGoogleLogin}>
              <span>🔗</span>
              Continue with Google
            </button>

            <div
              style={{
                textAlign: "center",
                color: "#64748b",
                margin: "16px 0",
              }}
            >
              or
            </div>

            <form onSubmit={handleAuthSubmit}>
              <input
                type="email"
                placeholder="Email Address"
                style={styles.input}
                required
              />
              <input
                type="password"
                placeholder="Password"
                style={styles.input}
                required
              />
              <button type="submit" style={styles.authButton}>
                Sign In
              </button>
            </form>

            <div style={styles.switchAuth}>
              Don't have an account?{" "}
              <span style={styles.switchLink}>Sign Up</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
