import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { apiService } from '../services/api';

interface AISettings {
  openai: {
    enabled: boolean;
    apiKey: string;
    model: string;
    maxTokens: number;
    temperature: number;
  };
  anthropic: {
    enabled: boolean;
    apiKey: string;
    model: string;
    maxTokens: number;
    temperature: number;
  };
  google: {
    enabled: boolean;
    apiKey: string;
    model: string;
    maxTokens: number;
    temperature: number;
  };
}

const AISettings: React.FC = () => {
  const { t } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [aiSettings, setAISettings] = useState<AISettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      
      // Check if user is admin
      if (userData.role !== 'admin') {
        setMessage({ type: 'error', text: 'Admin access required' });
        setLoading(false);
        return;
      }
    }
    loadAISettings();
  }, []);

  const loadAISettings = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAISettings();
      if (response.success) {
        setAISettings(response.data);
      } else {
        setMessage({ type: 'error', text: response.error || 'Failed to load AI settings' });
      }
    } catch (error) {
      console.error('Failed to load AI settings:', error);
      setMessage({ type: 'error', text: 'Failed to load AI settings' });
    } finally {
      setLoading(false);
    }
  };

  const updateAISettings = async () => {
    if (!aiSettings) return;

    try {
      setSaving(true);
      setMessage(null);
      
      const response = await apiService.updateAISettings(aiSettings);
      if (response.success) {
        setMessage({ type: 'success', text: 'AI settings updated successfully!' });
      } else {
        setMessage({ type: 'error', text: response.error || 'Failed to update AI settings' });
      }
    } catch (error) {
      console.error('Failed to update AI settings:', error);
      setMessage({ type: 'error', text: 'Failed to update AI settings' });
    } finally {
      setSaving(false);
    }
  };

  const updateProviderSettings = (provider: keyof AISettings, updates: Partial<AISettings[keyof AISettings]>) => {
    if (!aiSettings) return;
    
    setAISettings({
      ...aiSettings,
      [provider]: {
        ...aiSettings[provider],
        ...updates
      }
    });
  };

  const maskApiKey = (key: string) => {
    if (!key || key.length < 8) return key;
    return key.substring(0, 4) + '***' + key.substring(key.length - 4);
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '1.5rem', color: '#6b7280' }}>Loading AI settings...</div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{ 
          background: 'white', 
          padding: '3rem', 
          borderRadius: '0.75rem', 
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc2626', marginBottom: '1rem' }}>
            Access Denied
          </h1>
          <p style={{ fontSize: '1rem', color: '#6b7280' }}>
            Admin access is required to manage AI settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          background: 'white', 
          padding: '2rem', 
          borderRadius: '0.75rem', 
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
            🤖 AI API Settings
          </h1>
          <p style={{ fontSize: '1rem', color: '#6b7280' }}>
            Configure AI service providers for research assistance and analysis
          </p>
        </div>

        {/* Message */}
        {message && (
          <div style={{
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '2rem',
            backgroundColor: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
            border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
            color: message.type === 'success' ? '#059669' : '#dc2626'
          }}>
            {message.text}
          </div>
        )}

        {aiSettings && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* OpenAI Settings */}
            <div style={{ 
              background: 'white', 
              padding: '2rem', 
              borderRadius: '0.75rem', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ fontSize: '2rem' }}>🧠</div>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
                    OpenAI
                  </h2>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    GPT models for text generation and analysis
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={aiSettings.openai.enabled}
                      onChange={(e) => updateProviderSettings('openai', { enabled: e.target.checked })}
                    />
                    <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Enable OpenAI
                    </span>
                  </label>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    API Key
                  </label>
                  <input
                    type="password"
                    value={aiSettings.openai.apiKey}
                    onChange={(e) => updateProviderSettings('openai', { apiKey: e.target.value })}
                    placeholder="sk-..."
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      backgroundColor: 'white'
                    }}
                  />
                  {aiSettings.openai.apiKey && (
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                      Current: {maskApiKey(aiSettings.openai.apiKey)}
                    </p>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Model
                  </label>
                  <select
                    value={aiSettings.openai.model}
                    onChange={(e) => updateProviderSettings('openai', { model: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    <option value="gpt-4">GPT-4</option>
                    <option value="gpt-4-turbo">GPT-4 Turbo</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Max Tokens
                  </label>
                  <input
                    type="number"
                    value={aiSettings.openai.maxTokens}
                    onChange={(e) => updateProviderSettings('openai', { maxTokens: parseInt(e.target.value) || 2000 })}
                    min={100}
                    max={4000}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      backgroundColor: 'white'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Temperature
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={aiSettings.openai.temperature}
                    onChange={(e) => updateProviderSettings('openai', { temperature: parseFloat(e.target.value) })}
                    style={{
                      width: '100%'
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                    <span>0 (Precise)</span>
                    <span>{aiSettings.openai.temperature}</span>
                    <span>2 (Creative)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Anthropic Settings */}
            <div style={{ 
              background: 'white', 
              padding: '2rem', 
              borderRadius: '0.75rem', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ fontSize: '2rem' }}>🎭</div>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
                    Anthropic Claude
                  </h2>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Claude models for advanced reasoning and analysis
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={aiSettings.anthropic.enabled}
                      onChange={(e) => updateProviderSettings('anthropic', { enabled: e.target.checked })}
                    />
                    <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Enable Anthropic
                    </span>
                  </label>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    API Key
                  </label>
                  <input
                    type="password"
                    value={aiSettings.anthropic.apiKey}
                    onChange={(e) => updateProviderSettings('anthropic', { apiKey: e.target.value })}
                    placeholder="sk-ant-..."
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      backgroundColor: 'white'
                    }}
                  />
                  {aiSettings.anthropic.apiKey && (
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                      Current: {maskApiKey(aiSettings.anthropic.apiKey)}
                    </p>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Model
                  </label>
                  <select
                    value={aiSettings.anthropic.model}
                    onChange={(e) => updateProviderSettings('anthropic', { model: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                    <option value="claude-3-opus">Claude 3 Opus</option>
                    <option value="claude-3-haiku">Claude 3 Haiku</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Max Tokens
                  </label>
                  <input
                    type="number"
                    value={aiSettings.anthropic.maxTokens}
                    onChange={(e) => updateProviderSettings('anthropic', { maxTokens: parseInt(e.target.value) || 4000 })}
                    min={100}
                    max={8000}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      backgroundColor: 'white'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Temperature
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={aiSettings.anthropic.temperature}
                    onChange={(e) => updateProviderSettings('anthropic', { temperature: parseFloat(e.target.value) })}
                    style={{
                      width: '100%'
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                    <span>0 (Precise)</span>
                    <span>{aiSettings.anthropic.temperature}</span>
                    <span>1 (Creative)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Settings */}
            <div style={{ 
              background: 'white', 
              padding: '2rem', 
              borderRadius: '0.75rem', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ fontSize: '2rem' }}>🔍</div>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
                    Google Gemini
                  </h2>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Gemini models for multimodal analysis
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={aiSettings.google.enabled}
                      onChange={(e) => updateProviderSettings('google', { enabled: e.target.checked })}
                    />
                    <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Enable Google
                    </span>
                  </label>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    API Key
                  </label>
                  <input
                    type="password"
                    value={aiSettings.google.apiKey}
                    onChange={(e) => updateProviderSettings('google', { apiKey: e.target.value })}
                    placeholder="AIza..."
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      backgroundColor: 'white'
                    }}
                  />
                  {aiSettings.google.apiKey && (
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                      Current: {maskApiKey(aiSettings.google.apiKey)}
                    </p>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Model
                  </label>
                  <select
                    value={aiSettings.google.model}
                    onChange={(e) => updateProviderSettings('google', { model: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="gemini-pro">Gemini Pro</option>
                    <option value="gemini-pro-vision">Gemini Pro Vision</option>
                    <option value="gemini-ultra">Gemini Ultra</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Max Tokens
                  </label>
                  <input
                    type="number"
                    value={aiSettings.google.maxTokens}
                    onChange={(e) => updateProviderSettings('google', { maxTokens: parseInt(e.target.value) || 2000 })}
                    min={100}
                    max={4000}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      backgroundColor: 'white'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Temperature
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={aiSettings.google.temperature}
                    onChange={(e) => updateProviderSettings('google', { temperature: parseFloat(e.target.value) })}
                    style={{
                      width: '100%'
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                    <span>0 (Precise)</span>
                    <span>{aiSettings.google.temperature}</span>
                    <span>2 (Creative)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div style={{ 
              background: 'white', 
              padding: '2rem', 
              borderRadius: '0.75rem', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <button
                onClick={updateAISettings}
                disabled={saving}
                style={{
                  padding: '1rem 2rem',
                  backgroundColor: saving ? '#9ca3af' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {saving ? 'Saving...' : 'Save AI Settings'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AISettings;
