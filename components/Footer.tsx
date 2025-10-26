// FILE: components/Footer.tsx

// [FIX] Xóa bỏ 'useRouter' vì không được sử dụng.
// import { useRouter } from "next/router";

export default function Footer() {
  // [FIX] Xóa bỏ dòng này
  // const router = useRouter();

  const styles = {
    footer: {
      backgroundColor: "#1e293b",
      color: "white",
      padding: "32px",
      marginTop: "auto",
    },
    footerContent: {
      maxWidth: "1200px",
      margin: "0 auto",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "32px",
    },
    footerSection: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "12px",
    },
    footerTitle: {
      fontSize: "16px",
      fontWeight: "600",
      marginBottom: "8px",
    },
    footerLink: {
      color: "#cbd5e1",
      textDecoration: "none",
      fontSize: "14px",
      cursor: "pointer",
      transition: "color 0.2s ease",
    },
    copyright: {
      textAlign: "center" as const,
      paddingTop: "32px",
      borderTop: "1px solid #374151",
      marginTop: "32px",
      color: "#9ca3af",
      fontSize: "14px",
    },
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.footerContent}>
        <div style={styles.footerSection}>
          <div style={styles.footerTitle}>ResearchHub</div>
          <a style={styles.footerLink}>About Us</a>
          <a style={styles.footerLink}>Careers</a>
          <a style={styles.footerLink}>Contact</a>
        </div>
        <div style={styles.footerSection}>
          <div style={styles.footerTitle}>Products</div>
          <a style={styles.footerLink}>Thesis Management</a>
          <a style={styles.footerLink}>Data Analysis</a>
          <a style={styles.footerLink}>Literature Review</a>
        </div>
        <div style={styles.footerSection}>
          <div style={styles.footerTitle}>Resources</div>
          <a style={styles.footerLink}>Documentation</a>
          <a style={styles.footerLink}>Tutorials</a>
          <a style={styles.footerLink}>Blog</a>
        </div>
        <div style={styles.footerSection}>
          <div style={styles.footerTitle}>Legal</div>
          <a style={styles.footerLink}>Privacy Policy</a>
          <a style={styles.footerLink}>Terms of Service</a>
          <a style={styles.footerLink}>Cookie Policy</a>
        </div>
      </div>
      <div style={styles.copyright}>
        © 2024 ResearchHub. All rights reserved.
      </div>
    </footer>
  );
}