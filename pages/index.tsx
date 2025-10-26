import { useState } from "react";
import { useRouter } from "next/router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AuthModal from "../components/AuthModal";

interface Task {
  id: number;
  text: string;
  due: string;
  completed: boolean;
}

export default function ThesisDashboard() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: "Review Model Output", due: "Today", completed: false },
    { id: 2, text: "Draft Introduction", due: "Fri", completed: false },
    { id: 3, text: "Find 3 More Papers", due: "Next Week", completed: false },
  ]);

  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const [showAuthModal, setShowAuthModal] = useState(false);

  const toggleTaskCompletion = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊", onClick: () => {} },
    {
      id: "project",
      label: "Project Management",
      icon: "📁",
      onClick: () => router.push("/project-management"),
    },
    {
      id: "literature",
      label: "Literature Review",
      icon: "📚",
      onClick: () => router.push("/literature-review"),
    },
    {
      id: "data",
      label: "Data Management",
      icon: "💾",
      onClick: () => router.push("/data-analysis"),
    },
    {
      id: "analysis",
      label: "Analysis Tools",
      icon: "📈",
      onClick: () => router.push("/analysis-tools"),
    },
    {
      id: "writing",
      label: "Thesis Writing",
      icon: "✍️",
      onClick: () => router.push("/thesis-writing"),
    },
    {
      id: "setting",
      label: "Settings",
      icon: "⚙️",
      onClick: () => router.push("/settings"),
    },
  ];

  const handleLogin = (userData: { name: string; email: string }) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column" as const,
      minHeight: "100vh",
      backgroundColor: "#f8fafc",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    mainContainer: {
      display: "flex",
      flex: 1,
      minHeight: 0,
    },
    sidebar: {
      width: "280px",
      backgroundColor: "white",
      borderRight: "1px solid #e2e8f0",
      padding: "24px 0",
      boxShadow: "0 0 20px rgba(0, 0, 0, 0.05)",
      overflowY: "auto" as const,
    },
    logoSidebar: {
      padding: "0 24px 24px",
      borderBottom: "1px solid #e2e8f0",
      marginBottom: "24px",
    },
    logoText: {
      fontSize: "20px",
      fontWeight: "bold",
      color: "#1e293b",
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
      color: "#64748b",
      textDecoration: "none",
    },
    menuItemActive: {
      backgroundColor: "#3b82f6",
      color: "white",
    },
    menuIcon: {
      width: "20px",
      height: "20px",
      marginRight: "12px",
    },
    mainContent: {
      flex: 1,
      padding: "32px",
      backgroundColor: "#f8fafc",
      overflowY: "auto" as const,
    },
    headerSection: {
      marginBottom: "32px",
    },
    title: {
      fontSize: "28px",
      fontWeight: "bold",
      color: "#1e293b",
      marginBottom: "8px",
    },
    subtitle: {
      fontSize: "16px",
      color: "#64748b",
    },
    contentGrid: {
      display: "grid",
      gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)",
      gap: "32px",
      alignItems: "start",
    },
    progressSection: {
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "32px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
    },
    progressHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "24px",
      flexWrap: "wrap" as const,
      gap: "16px",
    },
    progressTitle: {
      fontSize: "20px",
      fontWeight: "600",
      color: "#1e293b",
    },
    progressPercentage: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#3b82f6",
    },
    progressBar: {
      width: "100%",
      height: "12px",
      backgroundColor: "#e2e8f0",
      borderRadius: "6px",
      marginBottom: "32px",
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: "#3b82f6",
      borderRadius: "6px",
      width: "65%",
    },
    progressIndicators: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
      gap: "20px",
      marginBottom: "32px",
    },
    progressIndicator: {
      textAlign: "center" as const,
    },
    indicatorPercent: {
      fontSize: "18px",
      fontWeight: "bold",
      color: "#1e293b",
      marginBottom: "8px",
    },
    indicatorBar: {
      width: "100%",
      height: "6px",
      backgroundColor: "#e2e8f0",
      borderRadius: "3px",
      overflow: "hidden",
    },
    projectSection: {
      marginTop: "32px",
    },
    projectTitle: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#1e293b",
      marginBottom: "20px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse" as const,
      backgroundColor: "white",
      borderRadius: "8px",
      overflow: "hidden",
      minWidth: "600px",
    },
    tableContainer: {
      overflowX: "auto" as const,
      marginBottom: "16px",
    },
    tableHeader: {
      backgroundColor: "#f8fafc",
      borderBottom: "1px solid #e2e8f0",
    },
    tableHeaderCell: {
      padding: "16px",
      textAlign: "left" as const,
      fontSize: "14px",
      fontWeight: "600",
      color: "#475569",
      whiteSpace: "nowrap" as const,
    },
    tableCell: {
      padding: "16px",
      borderBottom: "1px solid #e2e8f0",
      whiteSpace: "nowrap" as const,
    },
    badge: {
      display: "inline-block",
      padding: "6px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "600",
      whiteSpace: "nowrap" as const,
    },
    badgeCompleted: {
      backgroundColor: "#dcfce7",
      color: "#166534",
    },
    badgeProgress: {
      backgroundColor: "#fef3c7",
      color: "#92400e",
    },
    badgeModel: {
      backgroundColor: "#dbeafe",
      color: "#1e40af",
    },
    badgeDraft: {
      backgroundColor: "#f3e8ff",
      color: "#7c3aed",
    },
    badgeSubmission: {
      backgroundColor: "#f1f5f9",
      color: "#475569",
    },
    tasksSection: {
      marginTop: "32px",
    },
    taskItem: {
      display: "flex",
      alignItems: "center",
      padding: "16px",
      borderBottom: "1px solid #e2e8f0",
      transition: "background-color 0.2s ease",
      flexWrap: "wrap" as const,
      gap: "12px",
    },
    taskCheckbox: {
      width: "18px",
      height: "18px",
      cursor: "pointer",
      flexShrink: 0,
    },
    taskText: {
      flex: 1,
      fontSize: "14px",
      color: "#374151",
      minWidth: "200px",
    },
    taskDue: {
      fontSize: "12px",
      fontWeight: "600",
      padding: "4px 8px",
      borderRadius: "12px",
      backgroundColor: "#f1f5f9",
      color: "#475569",
      flexShrink: 0,
    },
    insightSection: {
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "24px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
    },
    insightHeader: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#1e293b",
      marginBottom: "20px",
    },
    insightCard: {
      backgroundColor: "#f0f9ff",
      border: "1px solid #bae6fd",
      borderRadius: "8px",
      padding: "20px",
      marginBottom: "20px",
    },
    insightTitle: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#0369a1",
      marginBottom: "8px",
    },
    insightText: {
      fontSize: "14px",
      color: "#0c4a6e",
      lineHeight: "1.5",
      fontStyle: "italic",
    },
    nextStepCard: {
      backgroundColor: "#fef7cd",
      border: "1px solid #fde68a",
      borderRadius: "8px",
      padding: "20px",
    },
    nextStepTitle: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#92400e",
      marginBottom: "8px",
    },
    nextStepText: {
      fontSize: "14px",
      color: "#78350f",
      lineHeight: "1.5",
    },
    recentFiles: {
      marginTop: "24px",
    },
    fileItem: {
      display: "flex",
      alignItems: "center",
      padding: "12px",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "background-color 0.2s ease",
      marginBottom: "8px",
    },
    fileIcon: {
      width: "16px",
      height: "16px",
      marginRight: "12px",
      color: "#64748b",
      flexShrink: 0,
    },
    fileName: {
      fontSize: "14px",
      color: "#475569",
    },
  };

  return (
    <div style={styles.container}>
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
                <span style={styles.menuIcon}>{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div style={styles.mainContent}>
          <div style={styles.headerSection}>
            <h1 style={styles.title}>Deverall Thesis Progress</h1>
            <p style={styles.subtitle}>
              Track your research progress and get insights
            </p>
          </div>

          <div style={styles.contentGrid}>
            {/* Left Column - Main Content */}
            <div>
              {/* Overall Progress */}
              <div style={styles.progressSection}>
                <div style={styles.progressHeader}>
                  <h2 style={styles.progressTitle}>Overall Thesis Progress</h2>
                  <span style={styles.progressPercentage}>65% Complete</span>
                </div>

                <div style={styles.progressBar}>
                  <div style={styles.progressFill}></div>
                </div>

                {/* Progress Indicators */}
                <div style={styles.progressIndicators}>
                  {[
                    { label: "Research", percent: 80 },
                    { label: "Writing", percent: 95 },
                    { label: "Analysis", percent: 50 },
                    { label: "Review", percent: 40 },
                    { label: "Final", percent: 10 },
                  ].map((item, index) => (
                    <div key={index} style={styles.progressIndicator}>
                      <div style={styles.indicatorPercent}>{item.percent}%</div>
                      <div style={styles.indicatorBar}>
                        <div
                          style={{
                            height: "100%",
                            width: `${item.percent}%`,
                            backgroundColor:
                              item.percent > 70
                                ? "#10b981"
                                : item.percent > 40
                                ? "#f59e0b"
                                : "#ef4444",
                            borderRadius: "3px",
                          }}
                        ></div>
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#64748b",
                          marginTop: "4px",
                        }}
                      >
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Current Project */}
                <div style={styles.projectSection}>
                  <h3 style={styles.projectTitle}>
                    Current Project: Impact of Minimum Wage on Local Employment
                    (2020-2023)
                  </h3>
                  <div style={styles.tableContainer}>
                    <table style={styles.table}>
                      <thead style={styles.tableHeader}>
                        <tr>
                          <th style={styles.tableHeaderCell}>Proposal</th>
                          <th style={styles.tableHeaderCell}>Data Gathering</th>
                          <th style={styles.tableHeaderCell}>In Progress</th>
                          <th style={styles.tableHeaderCell}>Analysis</th>
                          <th style={styles.tableHeaderCell}>Revisions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={styles.tableCell}>
                            <span
                              style={{
                                ...styles.badge,
                                ...styles.badgeCompleted,
                              }}
                            >
                              Completed
                            </span>
                          </td>
                          <td style={styles.tableCell}>
                            <span
                              style={{
                                ...styles.badge,
                                ...styles.badgeProgress,
                              }}
                            >
                              In Progress
                            </span>
                          </td>
                          <td style={styles.tableCell}>
                            <span
                              style={{ ...styles.badge, ...styles.badgeModel }}
                            >
                              Economic Model
                            </span>
                          </td>
                          <td style={styles.tableCell}>
                            <span
                              style={{ ...styles.badge, ...styles.badgeDraft }}
                            >
                              First Draft
                            </span>
                          </td>
                          <td style={styles.tableCell}>
                            <span
                              style={{
                                ...styles.badge,
                                ...styles.badgeSubmission,
                              }}
                            >
                              Submission
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Tasks */}
                <div style={styles.tasksSection}>
                  <h3 style={styles.projectTitle}>Tasks</h3>
                  <div
                    style={{
                      backgroundColor: "white",
                      borderRadius: "8px",
                      overflow: "hidden",
                    }}
                  >
                    {tasks.map((task) => (
                      <div key={task.id} style={styles.taskItem}>
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTaskCompletion(task.id)}
                          style={styles.taskCheckbox}
                        />
                        <span
                          style={{
                            ...styles.taskText,
                            ...(task.completed
                              ? {
                                  textDecoration: "line-through",
                                  color: "#9ca3af",
                                }
                              : {}),
                          }}
                        >
                          {task.text}
                        </span>
                        <span style={styles.taskDue}>{task.due}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Insights */}
            <div>
              <div style={styles.insightSection}>
                <h3 style={styles.insightHeader}>ASSISTANT & INSIGHTS</h3>

                <div style={styles.insightCard}>
                  <div style={styles.insightTitle}>Insight:</div>
                  <p style={styles.insightText}>
                    &quot;Economic modeling is taking longer to execute. Consider
                    breaking down to smaller sub-tasks?&quot;
                  </p>
                </div>

                <div style={styles.nextStepCard}>
                  <div style={styles.nextStepTitle}>Next Step:</div>
                  <p style={styles.nextStepText}>
                    Start drafting &quot;Methodology&quot; section based on compiled
                    analysis
                  </p>
                </div>

                {/* Recent Files */}
                <div style={styles.recentFiles}>
                  <h4
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#1e293b",
                      marginBottom: "12px",
                    }}
                  >
                    Recent Files
                  </h4>
                  <div>
                    {[
                      "model_results.pdf",
                      "literature_review.notes.docx",
                      "data_cleaning_script.R",
                    ].map((file, index) => (
                      <div
                        key={index}
                        style={styles.fileItem}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#f8fafc";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                      >
                        <svg
                          style={styles.fileIcon}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span style={styles.fileName}>{file}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
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
