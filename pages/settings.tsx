import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    researchUpdates: boolean;
    collaborationInvites: boolean;
    tokenRewards: boolean;
    systemUpdates: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'researchers-only';
    showEmail: boolean;
    showInstitution: boolean;
    allowDirectMessages: boolean;
    showResearchInterests: boolean;
  };
  research: {
    defaultAnalysisType: string;
    preferredCitationStyle: string;
    autoSave: boolean;
    backupFrequency: string;
    exportFormat: string;
  };
  appearance: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    timezone: string;
    dateFormat: string;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    loginNotifications: boolean;
    passwordChangeRequired: boolean;
  };
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings>({
    notifications: {
      email: true,
      push: true,
      researchUpdates: true,
      collaborationInvites: true,
      tokenRewards: true,
      systemUpdates: false
    },
    privacy: {
      profileVisibility: 'researchers-only',
      showEmail: false,
      showInstitution: true,
      allowDirectMessages: true,
      showResearchInterests: true
    },
    research: {
      defaultAnalysisType: 'descriptive',
      preferredCitationStyle: 'APA',
      autoSave: true,
      backupFrequency: 'daily',
      exportFormat: 'PDF'
    },
    appearance: {
      theme: 'auto',
      language: 'en',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY'
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      loginNotifications: true,
      passwordChangeRequired: false
    }
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('notifications');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'research', label: 'Research', icon: '🔬' },
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
    { id: 'security', label: 'Security', icon: '🛡️' },
    { id: 'account', label: 'Account', icon: '👤' }
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // In real app, load from API
      setLoading(false);
    } catch (error) {
      console.error('Error loading settings:', error);
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // In real app, save to API
      console.log('Saving settings:', settings);
      setTimeout(() => {
        setSaving(false);
        // Show success message
      }, 1000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    try {
      // In real app, change password via API
      console.log('Changing password:', passwordForm);
      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  const handleExportData = async () => {
    try {
      // In real app, export user data
      console.log('Exporting user data...');
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        // In real app, delete account via API
        console.log('Deleting account...');
      } catch (error) {
        console.error('Error deleting account:', error);
      }
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '2rem' }}>
      <Head>
        <title>Settings - NCS Research Platform</title>
        <meta name="description" content="Manage your account settings and preferences" />
      </Head>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
                ⚙️ Settings
              </h1>
              <p style={{ fontSize: '1rem', color: '#6b7280' }}>
                Manage your account preferences and security settings
              </p>
            </div>
            <Link href="/" style={{ 
              color: '#3b82f6', 
              textDecoration: 'none',
              fontSize: '1rem',
              fontWeight: '500',
              padding: '0.75rem 1.5rem',
              border: '1px solid #3b82f6',
              borderRadius: '0.5rem',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#3b82f6';
              e.currentTarget.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#3b82f6';
            }}
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
          {/* Sidebar */}
          <div style={{ 
            background: 'white', 
            padding: '1.5rem', 
            borderRadius: '1rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            height: 'fit-content'
          }}>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    background: activeTab === tab.id ? '#f0f9ff' : 'transparent',
                    color: activeTab === tab.id ? '#1e40af' : '#6b7280',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: activeTab === tab.id ? '500' : '400',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left',
                    width: '100%'
                  }}
                  onMouseOver={(e) => {
                    if (activeTab !== tab.id) {
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (activeTab !== tab.id) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <span style={{ fontSize: '1rem' }}>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div style={{ 
            background: 'white', 
            padding: '2rem', 
            borderRadius: '1rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
          }}>
            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
                  🔔 Notification Settings
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                      Email Notifications
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {[
                        { key: 'email', label: 'Email notifications', description: 'Receive notifications via email' },
                        { key: 'researchUpdates', label: 'Research updates', description: 'Get notified about research progress and milestones' },
                        { key: 'collaborationInvites', label: 'Collaboration invites', description: 'Receive notifications for collaboration requests' },
                        { key: 'tokenRewards', label: 'Token rewards', description: 'Get notified when you earn NCS Tokens' },
                        { key: 'systemUpdates', label: 'System updates', description: 'Receive platform updates and announcements' }
                      ].map((item) => (
                        <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div>
                            <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937' }}>
                              {item.label}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                              {item.description}
                            </div>
                          </div>
                          <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px' }}>
                            <input
                              type="checkbox"
                              checked={settings.notifications[item.key as keyof typeof settings.notifications]}
                              onChange={(e) => setSettings({
                                ...settings,
                                notifications: {
                                  ...settings.notifications,
                                  [item.key]: e.target.checked
                                }
                              })}
                              style={{ opacity: 0, width: 0, height: 0 }}
                            />
                            <span style={{
                              position: 'absolute',
                              cursor: 'pointer',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              backgroundColor: settings.notifications[item.key as keyof typeof settings.notifications] ? '#3b82f6' : '#d1d5db',
                              borderRadius: '24px',
                              transition: '0.3s'
                            }}>
                              <span style={{
                                position: 'absolute',
                                content: '""',
                                height: '18px',
                                width: '18px',
                                left: settings.notifications[item.key as keyof typeof settings.notifications] ? '26px' : '3px',
                                bottom: '3px',
                                backgroundColor: 'white',
                                borderRadius: '50%',
                                transition: '0.3s'
                              }} />
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                      Push Notifications
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937' }}>
                          Browser notifications
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          Receive notifications in your browser
                        </div>
                      </div>
                      <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px' }}>
                        <input
                          type="checkbox"
                          checked={settings.notifications.push}
                          onChange={(e) => setSettings({
                            ...settings,
                            notifications: { ...settings.notifications, push: e.target.checked }
                          })}
                          style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span style={{
                          position: 'absolute',
                          cursor: 'pointer',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: settings.notifications.push ? '#3b82f6' : '#d1d5db',
                          borderRadius: '24px',
                          transition: '0.3s'
                        }}>
                          <span style={{
                            position: 'absolute',
                            content: '""',
                            height: '18px',
                            width: '18px',
                            left: settings.notifications.push ? '26px' : '3px',
                            bottom: '3px',
                            backgroundColor: 'white',
                            borderRadius: '50%',
                            transition: '0.3s'
                          }} />
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
                  🔒 Privacy Settings
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                      Profile Visibility
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {[
                        { value: 'public', label: 'Public', description: 'Anyone can view your profile' },
                        { value: 'researchers-only', label: 'Researchers Only', description: 'Only registered researchers can view your profile' },
                        { value: 'private', label: 'Private', description: 'Only you can view your profile' }
                      ].map((option) => (
                        <label key={option.value} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name="profileVisibility"
                            value={option.value}
                            checked={settings.privacy.profileVisibility === option.value}
                            onChange={(e) => setSettings({
                              ...settings,
                              privacy: { ...settings.privacy, profileVisibility: e.target.value as any }
                            })}
                            style={{ margin: 0 }}
                          />
                          <div>
                            <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937' }}>
                              {option.label}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                              {option.description}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                      Information Sharing
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {[
                        { key: 'showEmail', label: 'Show email address', description: 'Display your email on your profile' },
                        { key: 'showInstitution', label: 'Show institution', description: 'Display your institution on your profile' },
                        { key: 'allowDirectMessages', label: 'Allow direct messages', description: 'Let other researchers send you messages' },
                        { key: 'showResearchInterests', label: 'Show research interests', description: 'Display your research interests on your profile' }
                      ].map((item) => (
                        <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div>
                            <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937' }}>
                              {item.label}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                              {item.description}
                            </div>
                          </div>
                          <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px' }}>
                            <input
                              type="checkbox"
                              checked={settings.privacy[item.key as keyof typeof settings.privacy] as boolean}
                              onChange={(e) => setSettings({
                                ...settings,
                                privacy: {
                                  ...settings.privacy,
                                  [item.key]: e.target.checked
                                }
                              })}
                              style={{ opacity: 0, width: 0, height: 0 }}
                            />
                            <span style={{
                              position: 'absolute',
                              cursor: 'pointer',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              backgroundColor: settings.privacy[item.key as keyof typeof settings.privacy] ? '#3b82f6' : '#d1d5db',
                              borderRadius: '24px',
                              transition: '0.3s'
                            }}>
                              <span style={{
                                position: 'absolute',
                                content: '""',
                                height: '18px',
                                width: '18px',
                                left: settings.privacy[item.key as keyof typeof settings.privacy] ? '26px' : '3px',
                                bottom: '3px',
                                backgroundColor: 'white',
                                borderRadius: '50%',
                                transition: '0.3s'
                              }} />
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Research Tab */}
            {activeTab === 'research' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
                  🔬 Research Preferences
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>
                      Default Analysis Type
                    </label>
                    <select
                      value={settings.research.defaultAnalysisType}
                      onChange={(e) => setSettings({
                        ...settings,
                        research: { ...settings.research, defaultAnalysisType: e.target.value }
                      })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem'
                      }}
                    >
                      <option value="descriptive">Descriptive Statistics</option>
                      <option value="correlation">Correlation Analysis</option>
                      <option value="regression">Regression Analysis</option>
                      <option value="sem">Structural Equation Modeling</option>
                      <option value="pls-sem">PLS-SEM</option>
                      <option value="factor">Factor Analysis</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>
                      Preferred Citation Style
                    </label>
                    <select
                      value={settings.research.preferredCitationStyle}
                      onChange={(e) => setSettings({
                        ...settings,
                        research: { ...settings.research, preferredCitationStyle: e.target.value }
                      })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem'
                      }}
                    >
                      <option value="APA">APA (American Psychological Association)</option>
                      <option value="MLA">MLA (Modern Language Association)</option>
                      <option value="Chicago">Chicago</option>
                      <option value="Harvard">Harvard</option>
                      <option value="IEEE">IEEE</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>
                      Backup Frequency
                    </label>
                    <select
                      value={settings.research.backupFrequency}
                      onChange={(e) => setSettings({
                        ...settings,
                        research: { ...settings.research, backupFrequency: e.target.value }
                      })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem'
                      }}
                    >
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>
                      Default Export Format
                    </label>
                    <select
                      value={settings.research.exportFormat}
                      onChange={(e) => setSettings({
                        ...settings,
                        research: { ...settings.research, exportFormat: e.target.value }
                      })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem'
                      }}
                    >
                      <option value="PDF">PDF</option>
                      <option value="Word">Word Document</option>
                      <option value="Excel">Excel Spreadsheet</option>
                      <option value="CSV">CSV</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937' }}>
                        Auto-save work
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        Automatically save your work every few minutes
                      </div>
                    </div>
                    <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px' }}>
                      <input
                        type="checkbox"
                        checked={settings.research.autoSave}
                        onChange={(e) => setSettings({
                          ...settings,
                          research: { ...settings.research, autoSave: e.target.checked }
                        })}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span style={{
                        position: 'absolute',
                        cursor: 'pointer',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: settings.research.autoSave ? '#3b82f6' : '#d1d5db',
                        borderRadius: '24px',
                        transition: '0.3s'
                      }}>
                        <span style={{
                          position: 'absolute',
                          content: '""',
                          height: '18px',
                          width: '18px',
                          left: settings.research.autoSave ? '26px' : '3px',
                          bottom: '3px',
                          backgroundColor: 'white',
                          borderRadius: '50%',
                          transition: '0.3s'
                        }} />
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
                  🎨 Appearance Settings
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>
                      Theme
                    </label>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      {[
                        { value: 'light', label: 'Light', icon: '☀️' },
                        { value: 'dark', label: 'Dark', icon: '🌙' },
                        { value: 'auto', label: 'Auto', icon: '🔄' }
                      ].map((theme) => (
                        <label key={theme.value} style={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center', 
                          gap: '0.5rem',
                          padding: '1rem',
                          border: settings.appearance.theme === theme.value ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                          borderRadius: '0.5rem',
                          cursor: 'pointer',
                          backgroundColor: settings.appearance.theme === theme.value ? '#f0f9ff' : 'white'
                        }}>
                          <input
                            type="radio"
                            name="theme"
                            value={theme.value}
                            checked={settings.appearance.theme === theme.value}
                            onChange={(e) => setSettings({
                              ...settings,
                              appearance: { ...settings.appearance, theme: e.target.value as any }
                            })}
                            style={{ margin: 0 }}
                          />
                          <span style={{ fontSize: '1.5rem' }}>{theme.icon}</span>
                          <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#1f2937' }}>{theme.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>
                      Language
                    </label>
                    <select
                      value={settings.appearance.language}
                      onChange={(e) => setSettings({
                        ...settings,
                        appearance: { ...settings.appearance, language: e.target.value }
                      })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem'
                      }}
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                      <option value="zh">中文</option>
                      <option value="ja">日本語</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>
                      Timezone
                    </label>
                    <select
                      value={settings.appearance.timezone}
                      onChange={(e) => setSettings({
                        ...settings,
                        appearance: { ...settings.appearance, timezone: e.target.value }
                      })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem'
                      }}
                    >
                      <option value="UTC">UTC (Coordinated Universal Time)</option>
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="Europe/London">London (GMT)</option>
                      <option value="Europe/Paris">Paris (CET)</option>
                      <option value="Asia/Tokyo">Tokyo (JST)</option>
                      <option value="Asia/Shanghai">Shanghai (CST)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>
                      Date Format
                    </label>
                    <select
                      value={settings.appearance.dateFormat}
                      onChange={(e) => setSettings({
                        ...settings,
                        appearance: { ...settings.appearance, dateFormat: e.target.value }
                      })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem'
                      }}
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY (EU)</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
                      <option value="DD MMM YYYY">DD MMM YYYY</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
                  🛡️ Security Settings
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                      Authentication
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937' }}>
                            Two-Factor Authentication
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                            Add an extra layer of security to your account
                          </div>
                        </div>
                        <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px' }}>
                          <input
                            type="checkbox"
                            checked={settings.security.twoFactorAuth}
                            onChange={(e) => setSettings({
                              ...settings,
                              security: { ...settings.security, twoFactorAuth: e.target.checked }
                            })}
                            style={{ opacity: 0, width: 0, height: 0 }}
                          />
                          <span style={{
                            position: 'absolute',
                            cursor: 'pointer',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: settings.security.twoFactorAuth ? '#3b82f6' : '#d1d5db',
                            borderRadius: '24px',
                            transition: '0.3s'
                          }}>
                            <span style={{
                              position: 'absolute',
                              content: '""',
                              height: '18px',
                              width: '18px',
                              left: settings.security.twoFactorAuth ? '26px' : '3px',
                              bottom: '3px',
                              backgroundColor: 'white',
                              borderRadius: '50%',
                              transition: '0.3s'
                            }} />
                          </span>
                        </label>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937' }}>
                            Login Notifications
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                            Get notified when someone logs into your account
                          </div>
                        </div>
                        <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px' }}>
                          <input
                            type="checkbox"
                            checked={settings.security.loginNotifications}
                            onChange={(e) => setSettings({
                              ...settings,
                              security: { ...settings.security, loginNotifications: e.target.checked }
                            })}
                            style={{ opacity: 0, width: 0, height: 0 }}
                          />
                          <span style={{
                            position: 'absolute',
                            cursor: 'pointer',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: settings.security.loginNotifications ? '#3b82f6' : '#d1d5db',
                            borderRadius: '24px',
                            transition: '0.3s'
                          }}>
                            <span style={{
                              position: 'absolute',
                              content: '""',
                              height: '18px',
                              width: '18px',
                              left: settings.security.loginNotifications ? '26px' : '3px',
                              bottom: '3px',
                              backgroundColor: 'white',
                              borderRadius: '50%',
                              transition: '0.3s'
                            }} />
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                      Session Management
                    </h3>
                    <div>
                      <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>
                        Session Timeout (minutes)
                      </label>
                      <input
                        type="number"
                        min="5"
                        max="480"
                        value={settings.security.sessionTimeout}
                        onChange={(e) => setSettings({
                          ...settings,
                          security: { ...settings.security, sessionTimeout: parseInt(e.target.value) }
                        })}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                      Password
                    </h3>
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Account Tab */}
            {activeTab === 'account' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
                  👤 Account Management
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                      Data Management
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <button
                        onClick={handleExportData}
                        style={{
                          padding: '0.75rem 1.5rem',
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        📥 Export My Data
                      </button>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
                        Download a copy of all your data including research projects, analysis results, and profile information.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                      Danger Zone
                    </h3>
                    <div style={{ 
                      padding: '1.5rem', 
                      border: '2px solid #ef4444', 
                      borderRadius: '0.5rem',
                      backgroundColor: '#fef2f2'
                    }}>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#dc2626', marginBottom: '0.5rem' }}>
                        Delete Account
                      </h4>
                      <p style={{ fontSize: '0.75rem', color: '#991b1b', marginBottom: '1rem' }}>
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                      <button
                        onClick={handleDeleteAccount}
                        style={{
                          padding: '0.75rem 1.5rem',
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div style={{ 
              marginTop: '2rem', 
              paddingTop: '2rem', 
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '1rem'
            }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Reset
              </button>
              <button
                onClick={handleSaveSettings}
                disabled={saving}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: saving ? '#9ca3af' : 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: saving ? 'not-allowed' : 'pointer'
                }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            width: '90%',
            maxWidth: '400px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>
                🔐 Change Password
              </h2>
              <button
                onClick={() => setShowPasswordModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
              <button
                onClick={() => setShowPasswordModal(false)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;