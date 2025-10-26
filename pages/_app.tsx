import React from 'react';
import Head from 'next/head';
import '../styles/globals.css';
import { LanguageProvider } from '../contexts/LanguageContext';

interface AppProps {
  Component: React.ComponentType<any>;
  pageProps: any;
}

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LanguageProvider>
      <Head>
        <title>NCS Research Platform - Q1-Q2 International Standards</title>
        <meta name="description" content="Complete research platform for Q1-Q2 international scientific papers in Economics, Business Administration, and Marketing. Advanced statistical analysis with R integration, AI-powered literature review, and automated proposal generation." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="research platform, Q1 Q2 journals, statistical analysis, R integration, literature review, proposal generation, thesis writing, academic research" />
        <meta name="author" content="NCS Research Platform" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="NCS Research Platform" />
        <meta property="og:description" content="Complete research platform for Q1-Q2 international scientific papers" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ncs-research.org" />
        <meta property="og:image" content="/og-image.png" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="NCS Research Platform" />
        <meta name="twitter:description" content="Complete research platform for Q1-Q2 international scientific papers" />
        <meta name="twitter:image" content="/twitter-image.png" />
        
        {/* Favicon */}
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔬</text></svg>" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Google Fonts */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        
        {/* Theme Color */}
        <meta name="theme-color" content="#667eea" />
        
        {/* Additional Meta Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        
        {/* Security Headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        
        {/* Performance Optimization */}
        <link rel="dns-prefetch" href="//localhost:8000" />
        <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </Head>
      
      <Component {...pageProps} />
      
      {/* Global Styles */}
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }
        
        html {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        body {
          margin: 0;
          padding: 0;
          background-color: #f8fafc;
          color: #1f2937;
          line-height: 1.6;
        }
        
        /* Scrollbar Styling */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        
        /* Selection Styling */
        ::selection {
          background-color: #667eea;
          color: white;
        }
        
        ::-moz-selection {
          background-color: #667eea;
          color: white;
        }
        
        /* Focus Styling */
        *:focus {
          outline: 2px solid #667eea;
          outline-offset: 2px;
        }
        
        /* Button Reset */
        button {
          font-family: inherit;
        }
        
        /* Link Styling */
        a {
          color: #667eea;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        
        a:hover {
          color: #5a67d8;
        }
        
        /* Form Elements */
        input, textarea, select {
          font-family: inherit;
        }
        
        /* Loading Animation */
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        
        /* Utility Classes */
        .fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        
        .slide-in {
          animation: slideIn 0.3s ease-out;
        }
        
        .pulse {
          animation: pulse 2s infinite;
        }
        
        .spin {
          animation: spin 1s linear infinite;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
          body {
            font-size: 14px;
          }
        }
        
        @media (max-width: 480px) {
          body {
            font-size: 13px;
          }
        }
        
        /* Print Styles */
        @media print {
          * {
            background: transparent !important;
            color: black !important;
            box-shadow: none !important;
            text-shadow: none !important;
          }
          
          a, a:visited {
            text-decoration: underline;
          }
          
          a[href]:after {
            content: " (" attr(href) ")";
          }
          
          abbr[title]:after {
            content: " (" attr(title) ")";
          }
          
          .no-print {
            display: none !important;
          }
        }
        
        /* High Contrast Mode */
        @media (prefers-contrast: high) {
          * {
            border-color: currentColor !important;
          }
        }
        
        /* Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
        
        /* Dark Mode Support */
        @media (prefers-color-scheme: dark) {
          body {
            background-color: #111827;
            color: #f9fafb;
          }
          
          ::-webkit-scrollbar-track {
            background: #1f2937;
          }
          
          ::-webkit-scrollbar-thumb {
            background: #4b5563;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: #6b7280;
          }
        }
      `}</style>
    </LanguageProvider>
  );
}