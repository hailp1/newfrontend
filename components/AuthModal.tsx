import { useState } from "react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: { name: string; email: string }) => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  onLogin,
}: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);

  const handleGoogleLogin = () => {
    onLogin({ name: "John Doe", email: "john.doe@example.com" });
    onClose();
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ name: "John Doe", email: "john.doe@example.com" });
    onClose();
  };

  const styles = {
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
    authButton: {
      backgroundColor: "#3b82f6",
      color: "white",
      border: "none",
      padding: "12px 16px",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "500",
      fontSize: "14px",
      width: "100%",
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

  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.modalTitle}>
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        <button style={styles.googleButton} onClick={handleGoogleLogin}>
          <span>🔗</span>
          Continue with Google
        </button>

        <div
          style={{ textAlign: "center", color: "#64748b", margin: "16px 0" }}
        >
          or
        </div>

        <form onSubmit={handleAuthSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              style={styles.input}
              required
            />
          )}
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
            {isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div style={styles.switchAuth}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span style={styles.switchLink} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign Up" : "Sign In"}
          </span>
        </div>
      </div>
    </div>
  );
}
