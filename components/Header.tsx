import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiService } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: string;
  tokens: number;
  level: string;
}

interface HeaderProps {
  user: User | null;
  token: string;
  onLogin: (token: string, user: User) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, token, onLogin, onLogout }) => {
  const { t } = useLanguage();
  const [userTokens, setUserTokens] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New paper added to your literature review', time: '2 hours ago', unread: true },
    { id: 2, message: 'SEM analysis completed successfully', time: '1 day ago', unread: true },
    { id: 3, message: 'Research proposal submitted for review', time: '3 days ago', unread: false }
  ]);

  useEffect(() => {
    if (user && token) {
      fetchUserTokens();
    }
  }, [user, token]);

  const fetchUserTokens = async () => {
    try {
      const response = await apiService.getTokens();
      if (response.success && response.data) {
        setUserTokens(response.data.tokens);
      }
    } catch (error) {
      console.error('Failed to fetch user tokens:', error);
    }
  };

  const handleLogout = () => {
    onLogout();
    setUserTokens(0);
    setShowUserMenu(false);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Researcher': return '🔬';
      case 'Scholar': return '🎓';
      case 'Mentor': return '👨‍🏫';
      case 'Editor': return '✏️';
      case 'Founder': return '👑';
      default: return '👤';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Bronze': return '#cd7f32';
      case 'Silver': return '#c0c0c0';
      case 'Gold': return '#ffd700';
      case 'Platinum': return '#e5e4e2';
      case 'Diamond': return '#b9f2ff';
      default: return '#6b7280';
    }
  };

  return (
    <header style={{ 
      background: 'white', 
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
      borderBottom: '1px solid #e5e7eb',
      padding: '1rem 0',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ fontSize: '2rem' }}>🔬</div>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                NCS Research
              </h1>
              <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
                Q1-Q2 Standards
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <Link href="/" style={{ 
              textDecoration: 'none', 
              color: '#374151',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'color 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#3b82f6'}
            onMouseOut={(e) => e.currentTarget.style.color = '#374151'}
            >
              {t('nav.home')}
            </Link>
            
            <Link href="/data-analysis" style={{ 
              textDecoration: 'none', 
              color: '#374151',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'color 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#3b82f6'}
            onMouseOut={(e) => e.currentTarget.style.color = '#374151'}
            >
              {t('nav.dataAnalysis')}
            </Link>
            
            <Link href="/literature-review" style={{ 
              textDecoration: 'none', 
              color: '#374151',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'color 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#3b82f6'}
            onMouseOut={(e) => e.currentTarget.style.color = '#374151'}
            >
              {t('nav.literatureReview')}
            </Link>
            
            <Link href="/proposal-generator" style={{ 
              textDecoration: 'none', 
              color: '#374151',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'color 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#3b82f6'}
            onMouseOut={(e) => e.currentTarget.style.color = '#374151'}
            >
              {t('nav.proposalGenerator')}
            </Link>
          </nav>

          {/* User Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {user ? (
              <>
                {/* User Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {/* Tokens Display */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    background: '#f0f9ff',
                    borderRadius: '0.5rem',
                    border: '1px solid #bae6fd'
                  }}>
                    <span style={{ fontSize: '1rem' }}>🪙</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0369a1' }}>
                      {userTokens}
                    </span>
                  </div>

                  {/* User Menu */}
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 0.75rem',
                        background: 'white',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = '#3b82f6';
                        e.currentTarget.style.backgroundColor = '#f8fafc';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = '#d1d5db';
                        e.currentTarget.style.backgroundColor = 'white';
                      }}
                    >
                      <div style={{ fontSize: '1.25rem' }}>
                        {getRoleIcon(user.role)}
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937' }}>
                          {user.full_name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          {t(`role.${user.role.toLowerCase()}`)}
                        </div>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        ▼
                      </div>
                    </button>

                    {showUserMenu && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        marginTop: '0.5rem',
                        background: 'white',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        minWidth: '200px',
                        zIndex: 50
                      }}>
                        {/* Notifications */}
                        <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                          <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.75rem' }}>
                            Notifications
                          </h3>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {notifications.slice(0, 2).map((notification) => (
                              <div key={notification.id} style={{
                                padding: '0.5rem',
                                background: notification.unread ? '#f0f9ff' : 'white',
                                borderRadius: '0.25rem',
                                border: '1px solid #e5e7eb'
                              }}>
                                <p style={{ fontSize: '0.75rem', color: '#374151', marginBottom: '0.25rem' }}>
                                  {notification.message}
                                </p>
                                <p style={{ fontSize: '0.625rem', color: '#9ca3af' }}>
                                  {notification.time}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* User Actions */}
                        <div style={{ padding: '0.5rem' }}>
                          <Link href="/profile" style={{ textDecoration: 'none' }}>
                            <button
                              style={{
                                width: '100%',
                                padding: '0.5rem',
                                background: 'none',
                                border: 'none',
                                textAlign: 'left',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                color: '#374151',
                                borderRadius: '0.25rem',
                                transition: 'background-color 0.2s ease'
                              }}
                              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                              👤 {t('nav.profile')}
                            </button>
                          </Link>
                          
                          <Link href="/settings" style={{ textDecoration: 'none' }}>
                            <button
                              style={{
                                width: '100%',
                                padding: '0.5rem',
                                background: 'none',
                                border: 'none',
                                textAlign: 'left',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                color: '#374151',
                                borderRadius: '0.25rem',
                                transition: 'background-color 0.2s ease'
                              }}
                              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                              ⚙️ {t('nav.settings')}
                            </button>
                          </Link>
                          
                          {user?.role === 'Founder' && (
                            <Link href="/admin" style={{ textDecoration: 'none' }}>
                              <button
                                style={{
                                  width: '100%',
                                  padding: '0.5rem',
                                  background: 'none',
                                  border: 'none',
                                  textAlign: 'left',
                                  cursor: 'pointer',
                                  fontSize: '0.875rem',
                                  color: '#ef4444',
                                  borderRadius: '0.25rem',
                                  transition: 'background-color 0.2s ease'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                🛡️ {t('nav.admin')}
                              </button>
                            </Link>
                          )}
                          
                          <button
                            onClick={handleLogout}
                            style={{
                              width: '100%',
                              padding: '0.5rem',
                              background: 'none',
                              border: 'none',
                              textAlign: 'left',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                              color: '#ef4444',
                              borderRadius: '0.25rem',
                              transition: 'background-color 0.2s ease'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            🚪 {t('nav.logout')}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link href="/login" style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'transform 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  🔑 {t('nav.login')}
                </Link>
                
                <Link href="/register" style={{
                  background: 'transparent',
                  color: '#3b82f6',
                  textDecoration: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  border: '1px solid #3b82f6',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#3b82f6';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#3b82f6';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                >
                  ✨ {t('nav.register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 40
          }}
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
};

export default Header;