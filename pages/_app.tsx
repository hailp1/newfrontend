import { useState, useEffect } from "react";
import Head from "next/head";

// Custom hook để quản lý theme
function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [siteSettings, setSiteSettings] = useState({
    siteTitle: "ResearchHub",
    favicon: "🔬",
    logo: "ResearchHub",
    logoImage: "",
  });

  useEffect(() => {
    // Chỉ chạy trên client-side
    if (typeof window !== "undefined") {
      const savedTheme =
        (localStorage.getItem("theme") as "light" | "dark") || "light";
      const savedSettings = JSON.parse(
        localStorage.getItem("siteSettings") || "{}"
      );

      setTheme(savedTheme);
      setSiteSettings((prev) => ({ ...prev, ...savedSettings }));

      // Apply theme to document
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const updateTheme = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);
    }
  };

  const updateSiteSettings = (newSettings: Record<string, unknown>) => {
    const updatedSettings = { ...siteSettings, ...newSettings };
    setSiteSettings(updatedSettings);
    if (typeof window !== "undefined") {
      localStorage.setItem("siteSettings", JSON.stringify(updatedSettings));
    }
  };

  return {
    theme,
    siteSettings,
    updateTheme,
    updateSiteSettings,
  };
}

export default function MyApp({ Component, pageProps }) {
  const theme = useTheme();

  return (
    <>
      <Head>
        <title>{theme.siteSettings.siteTitle}</title>
        <meta
          name="description"
          content="Manage your thesis research with powerful tools for data analysis, literature review, and project management"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${theme.siteSettings.favicon}</text></svg>"
        />
      </Head>
      <Component {...pageProps} themeContext={theme} />
    </>
  );
}
