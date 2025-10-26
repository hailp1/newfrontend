import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const [currentYear, setCurrentYear] = useState(2024);
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
    setLastUpdated(new Date().toLocaleDateString());
  }, []);

  const footerLinks = {
    'Research Tools': [
      { name: 'Data Analysis', href: '/data-analysis' },
      { name: 'Literature Review', href: '/literature-review' },
      { name: 'Proposal Generator', href: '/proposal-generator' },
      { name: 'Thesis Writing', href: '/thesis-writing' },
      { name: 'Analysis Tools', href: '/analysis-tools' }
    ],
    'Workflow': [
      { name: 'Research Workflow', href: '/research-workflow' },
      { name: 'Quality Checklist', href: '/quality-checklist' },
      { name: 'Impact Tracker', href: '/impact-tracker' },
      { name: 'Project Management', href: '/project-management' }
    ],
    'Support': [
      { name: 'Documentation', href: '/docs' },
      { name: 'API Reference', href: '/api-docs' },
      { name: 'Tutorials', href: '/tutorials' },
      { name: 'Community', href: '/community' },
      { name: 'Contact Support', href: '/support' }
    ],
    'Platform': [
      { name: 'About NCS', href: '/about' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Blog', href: '/blog' }
    ]
  };

  return (
    <footer style={{
      background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
      color: 'white',
      padding: '3rem 0 1rem 0',
      marginTop: '4rem'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
        {/* Main Footer Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          {/* Brand Section */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ 
                fontSize: '2rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold'
              }}>
                🔬
              </div>
              <div>
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold', 
                  margin: 0,
                  lineHeight: 1
                }}>
                  NCS Research Platform
                </h3>
                <p style={{ 
                  fontSize: '0.75rem', 
                  color: '#9ca3af', 
                  margin: 0,
                  lineHeight: 1
                }}>
                  Q1-Q2 International Standards
                </p>
              </div>
            </div>
            
            <p style={{
              fontSize: '0.875rem',
              color: '#d1d5db',
              lineHeight: '1.6',
              marginBottom: '1.5rem'
            }}>
              Empowering researchers with advanced tools for Q1-Q2 international scientific papers 
              in Economics, Business Administration, and Marketing.
            </p>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="https://github.com/ncs-research" target="_blank" rel="noopener noreferrer" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                backgroundColor: '#374151',
                borderRadius: '0.5rem',
                color: 'white',
                textDecoration: 'none',
                transition: 'background-color 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4b5563'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#374151'}
              >
                <span style={{ fontSize: '1.25rem' }}>📱</span>
              </a>
              
              <a href="https://twitter.com/ncsresearch" target="_blank" rel="noopener noreferrer" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                backgroundColor: '#374151',
                borderRadius: '0.5rem',
                color: 'white',
                textDecoration: 'none',
                transition: 'background-color 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4b5563'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#374151'}
              >
                <span style={{ fontSize: '1.25rem' }}>🐦</span>
              </a>
              
              <a href="https://linkedin.com/company/ncs-research" target="_blank" rel="noopener noreferrer" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                backgroundColor: '#374151',
                borderRadius: '0.5rem',
                color: 'white',
                textDecoration: 'none',
                transition: 'background-color 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4b5563'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#374151'}
              >
                <span style={{ fontSize: '1.25rem' }}>💼</span>
              </a>
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 style={{
                fontSize: '1rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: 'white'
              }}>
                {category}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {links.map((link) => (
                  <li key={link.name} style={{ marginBottom: '0.5rem' }}>
                    <Link href={link.href} style={{
                      fontSize: '0.875rem',
                      color: '#d1d5db',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.color = '#667eea'}
                    onMouseOut={(e) => e.currentTarget.style.color = '#d1d5db'}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Features Highlight */}
        <div style={{
          background: 'rgba(102, 126, 234, 0.1)',
          border: '1px solid rgba(102, 126, 234, 0.2)',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            marginBottom: '1rem',
            color: 'white'
          }}>
            🚀 Platform Features
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1rem' }}>📊</span>
              <span style={{ fontSize: '0.875rem', color: '#d1d5db' }}>
                Advanced Statistical Analysis with R
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1rem' }}>🤖</span>
              <span style={{ fontSize: '0.875rem', color: '#d1d5db' }}>
                AI-Powered Literature Review
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1rem' }}>📝</span>
              <span style={{ fontSize: '0.875rem', color: '#d1d5db' }}>
                Automated Proposal Generation
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1rem' }}>🎯</span>
              <span style={{ fontSize: '0.875rem', color: '#d1d5db' }}>
                Q1-Q2 Publication Standards
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1rem' }}>🪙</span>
              <span style={{ fontSize: '0.875rem', color: '#d1d5db' }}>
                NCS Token Reward System
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1rem' }}>👥</span>
              <span style={{ fontSize: '0.875rem', color: '#d1d5db' }}>
                Collaborative Research Tools
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div style={{
          borderTop: '1px solid #374151',
          paddingTop: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2rem',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem' }}>🔒</span>
              <span style={{ fontSize: '0.875rem', color: '#d1d5db' }}>
                Secure & Encrypted
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem' }}>⚡</span>
              <span style={{ fontSize: '0.875rem', color: '#d1d5db' }}>
                High Performance
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem' }}>🌍</span>
              <span style={{ fontSize: '0.875rem', color: '#d1d5db' }}>
                Global Access
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem' }}>📈</span>
              <span style={{ fontSize: '0.875rem', color: '#d1d5db' }}>
                Research Impact Tracking
              </span>
            </div>
          </div>

          <p style={{
            fontSize: '0.875rem',
            color: '#9ca3af',
            margin: 0
          }}>
            {t('footer.copyright', { year: currentYear })} 
            Empowering researchers worldwide with cutting-edge tools for international publication success.
          </p>

          <div style={{
            display: 'flex',
            gap: '1rem',
            fontSize: '0.75rem',
            color: '#9ca3af'
          }}>
            <span>Version 2.1.0</span>
            <span>•</span>
            <span>Last updated: {lastUpdated}</span>
            <span>•</span>
            <span>Backend: http://localhost:8000</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;