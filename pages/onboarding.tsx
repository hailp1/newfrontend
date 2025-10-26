import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { apiService } from '../services/api';

interface OnboardingData {
  step: number;
  personalInfo: {
    fullName: string;
    email: string;
    username: string;
    role: string;
    institution: string;
    department: string;
    country: string;
    timezone: string;
  };
  researchProfile: {
    researchArea: string[];
    experience: string;
    currentProjects: string;
    interests: string[];
    methodologies: string[];
  };
  preferences: {
    notifications: boolean;
    emailUpdates: boolean;
    researchAlerts: boolean;
    collaborationRequests: boolean;
    language: string;
    theme: string;
  };
  goals: {
    primaryGoal: string;
    targetJournals: string[];
    timeline: string;
    funding: string;
    collaboration: boolean;
  };
}

const Onboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    step: 1,
    personalInfo: {
      fullName: '',
      email: '',
      username: '',
      role: 'Researcher',
      institution: '',
      department: '',
      country: '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    researchProfile: {
      researchArea: [],
      experience: '',
      currentProjects: '',
      interests: [],
      methodologies: []
    },
    preferences: {
      notifications: true,
      emailUpdates: true,
      researchAlerts: true,
      collaborationRequests: true,
      language: 'en',
      theme: 'light'
    },
    goals: {
      primaryGoal: '',
      targetJournals: [],
      timeline: '',
      funding: '',
      collaboration: true
    }
  });

  const steps = [
    {
      id: 1,
      title: 'Personal Information',
      description: 'Tell us about yourself and your academic background',
      icon: '👤'
    },
    {
      id: 2,
      title: 'Research Profile',
      description: 'Define your research areas and expertise',
      icon: '🔬'
    },
    {
      id: 3,
      title: 'Preferences',
      description: 'Customize your platform experience',
      icon: '⚙️'
    },
    {
      id: 4,
      title: 'Research Goals',
      description: 'Set your research objectives and targets',
      icon: '🎯'
    },
    {
      id: 5,
      title: 'Complete Setup',
      description: 'Review and finalize your profile',
      icon: '✅'
    }
  ];

  const roles = [
    { value: 'Researcher', label: 'Researcher', description: 'Conduct research and analysis', icon: '🔬', tokens: 100 },
    { value: 'Scholar', label: 'Scholar', description: 'Advanced research with mentoring', icon: '🎓', tokens: 150 },
    { value: 'Mentor', label: 'Mentor', description: 'Guide and supervise research', icon: '👨‍🏫', tokens: 200 },
    { value: 'Editor', label: 'Editor', description: 'Review and edit research papers', icon: '✏️', tokens: 250 },
    { value: 'Founder', label: 'Founder', description: 'Platform founder and administrator', icon: '👑', tokens: 500 }
  ];

  const researchAreas = [
    'Economics', 'Business Administration', 'Marketing', 'Finance', 'Management',
    'International Business', 'Consumer Behavior', 'Strategic Management',
    'Organizational Behavior', 'Human Resource Management', 'Operations Research',
    'Information Systems', 'Entrepreneurship', 'Public Policy', 'Social Sciences'
  ];

  const methodologies = [
    'Quantitative Research', 'Qualitative Research', 'Mixed Methods', 'Experimental Design',
    'Survey Research', 'Case Study', 'Longitudinal Study', 'Cross-sectional Study',
    'Meta-analysis', 'Systematic Review', 'Content Analysis', 'Statistical Modeling',
    'Machine Learning', 'Big Data Analytics', 'Network Analysis'
  ];

  const targetJournals = [
    'Journal of Business Research (Q1)', 'Journal of Marketing (Q1)', 'Strategic Management Journal (Q1)',
    'Academy of Management Journal (Q1)', 'Journal of International Business Studies (Q1)',
    'Marketing Science (Q1)', 'Management Science (Q1)', 'Organization Science (Q1)',
    'Journal of Consumer Research (Q1)', 'Journal of Marketing Research (Q1)',
    'Journal of Business Ethics (Q1)', 'International Journal of Research in Marketing (Q1)',
    'Journal of Economic Psychology (Q1)', 'Journal of Business Venturing (Q1)',
    'Technovation (Q1)', 'Research Policy (Q1)', 'Journal of Product Innovation Management (Q1)'
  ];

  const handleInputChange = (section: keyof OnboardingData, field: string, value: any) => {
    setOnboardingData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayToggle = (section: keyof OnboardingData, field: string, value: string) => {
    setOnboardingData(prev => {
      const currentArray = (prev[section] as any)[field] || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item: string) => item !== value)
        : [...currentArray, value];
      
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: newArray
        }
      };
    });
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = async () => {
    setLoading(true);
    try {
      // Register user with onboarding data
      const registrationData = {
        username: onboardingData.personalInfo.username,
        email: onboardingData.personalInfo.email,
        password: 'temp_password_123', // This should be handled properly
        full_name: onboardingData.personalInfo.fullName,
        role: onboardingData.personalInfo.role,
        institution: onboardingData.personalInfo.institution,
        department: onboardingData.personalInfo.department,
        country: onboardingData.personalInfo.country,
        timezone: onboardingData.personalInfo.timezone,
        research_profile: onboardingData.researchProfile,
        preferences: onboardingData.preferences,
        goals: onboardingData.goals
      };

      const response = await apiService.register(registrationData);
      
      if (response.success) {
        // Auto login after registration
        const loginResponse = await apiService.login({
          email: onboardingData.personalInfo.email,
          password: 'temp_password_123'
        });

        if (loginResponse.success) {
          // Store user data and complete onboarding
          localStorage.setItem('token', loginResponse.data.access_token);
          localStorage.setItem('user', JSON.stringify(loginResponse.data.user));
          localStorage.setItem('onboarding_completed', 'true');
          localStorage.setItem('onboarding_data', JSON.stringify(onboardingData));
          
          // Redirect to dashboard
          window.location.href = '/';
        }
      }
    } catch (error) {
      console.error('Onboarding completion failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
          Personal Information
        </h3>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          Let's start by getting to know you better
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Full Name *
          </label>
          <input
            type="text"
            value={onboardingData.personalInfo.fullName}
            onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Email Address *
          </label>
          <input
            type="email"
            value={onboardingData.personalInfo.email}
            onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Username *
          </label>
          <input
            type="text"
            value={onboardingData.personalInfo.username}
            onChange={(e) => handleInputChange('personalInfo', 'username', e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Country *
          </label>
          <select
            value={onboardingData.personalInfo.country}
            onChange={(e) => handleInputChange('personalInfo', 'country', e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              backgroundColor: 'white'
            }}
          >
            <option value="">Select Country</option>
            <option value="US">United States</option>
            <option value="UK">United Kingdom</option>
            <option value="CA">Canada</option>
            <option value="AU">Australia</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
            <option value="JP">Japan</option>
            <option value="KR">South Korea</option>
            <option value="SG">Singapore</option>
            <option value="VN">Vietnam</option>
            <option value="TH">Thailand</option>
            <option value="MY">Malaysia</option>
            <option value="ID">Indonesia</option>
            <option value="PH">Philippines</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Institution *
          </label>
          <input
            type="text"
            value={onboardingData.personalInfo.institution}
            onChange={(e) => handleInputChange('personalInfo', 'institution', e.target.value)}
            required
            placeholder="University, Research Institute, Company"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Department *
          </label>
          <input
            type="text"
            value={onboardingData.personalInfo.department}
            onChange={(e) => handleInputChange('personalInfo', 'department', e.target.value)}
            required
            placeholder="Business School, Economics, Marketing"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem'
            }}
          />
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '1rem' }}>
          Research Role *
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {roles.map((role) => (
            <div
              key={role.value}
              onClick={() => handleInputChange('personalInfo', 'role', role.value)}
              style={{
                padding: '1rem',
                border: onboardingData.personalInfo.role === role.value ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: onboardingData.personalInfo.role === role.value ? '#f0f9ff' : 'white'
              }}
              onMouseOver={(e) => {
                if (onboardingData.personalInfo.role !== role.value) {
                  e.currentTarget.style.borderColor = '#3b82f6';
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                }
              }}
              onMouseOut={(e) => {
                if (onboardingData.personalInfo.role !== role.value) {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.backgroundColor = 'white';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{role.icon}</span>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                    {role.label}
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
                    🪙 {role.tokens} tokens
                  </p>
                </div>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
                {role.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
          Research Profile
        </h3>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          Define your research areas and expertise
        </p>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '1rem' }}>
          Research Areas * (Select up to 5)
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem' }}>
          {researchAreas.map((area) => (
            <div
              key={area}
              onClick={() => handleArrayToggle('researchProfile', 'researchArea', area)}
              style={{
                padding: '0.75rem',
                border: onboardingData.researchProfile.researchArea.includes(area) ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: onboardingData.researchProfile.researchArea.includes(area) ? '#f0f9ff' : 'white',
                textAlign: 'center',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: onboardingData.researchProfile.researchArea.includes(area) ? '#1e40af' : '#374151'
              }}
              onMouseOver={(e) => {
                if (!onboardingData.researchProfile.researchArea.includes(area)) {
                  e.currentTarget.style.borderColor = '#3b82f6';
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                }
              }}
              onMouseOut={(e) => {
                if (!onboardingData.researchProfile.researchArea.includes(area)) {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.backgroundColor = 'white';
                }
              }}
            >
              {area}
            </div>
          ))}
        </div>
        <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
          Selected: {onboardingData.researchProfile.researchArea.length}/5
        </p>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '1rem' }}>
          Research Methodologies * (Select up to 5)
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem' }}>
          {methodologies.map((method) => (
            <div
              key={method}
              onClick={() => handleArrayToggle('researchProfile', 'methodologies', method)}
              style={{
                padding: '0.75rem',
                border: onboardingData.researchProfile.methodologies.includes(method) ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: onboardingData.researchProfile.methodologies.includes(method) ? '#f0f9ff' : 'white',
                textAlign: 'center',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: onboardingData.researchProfile.methodologies.includes(method) ? '#1e40af' : '#374151'
              }}
              onMouseOver={(e) => {
                if (!onboardingData.researchProfile.methodologies.includes(method)) {
                  e.currentTarget.style.borderColor = '#3b82f6';
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                }
              }}
              onMouseOut={(e) => {
                if (!onboardingData.researchProfile.methodologies.includes(method)) {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.backgroundColor = 'white';
                }
              }}
            >
              {method}
            </div>
          ))}
        </div>
        <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
          Selected: {onboardingData.researchProfile.methodologies.length}/5
        </p>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
          Research Experience *
        </label>
        <select
          value={onboardingData.researchProfile.experience}
          onChange={(e) => handleInputChange('researchProfile', 'experience', e.target.value)}
          required
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            backgroundColor: 'white'
          }}
        >
          <option value="">Select Experience Level</option>
          <option value="Undergraduate">Undergraduate Student</option>
          <option value="Graduate">Graduate Student</option>
          <option value="PhD">PhD Student</option>
          <option value="Postdoc">Postdoctoral Researcher</option>
          <option value="Assistant">Assistant Professor</option>
          <option value="Associate">Associate Professor</option>
          <option value="Full">Full Professor</option>
          <option value="Industry">Industry Researcher</option>
          <option value="Independent">Independent Researcher</option>
        </select>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
          Current Research Projects
        </label>
        <textarea
          value={onboardingData.researchProfile.currentProjects}
          onChange={(e) => handleInputChange('researchProfile', 'currentProjects', e.target.value)}
          placeholder="Describe your current research projects, collaborations, and ongoing work..."
          rows={4}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            resize: 'vertical'
          }}
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
          Platform Preferences
        </h3>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          Customize your platform experience
        </p>
      </div>

      <div>
        <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>
          Notification Settings
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { key: 'notifications', label: 'Platform Notifications', description: 'Receive notifications about platform updates and features' },
            { key: 'emailUpdates', label: 'Email Updates', description: 'Receive email updates about your research progress' },
            { key: 'researchAlerts', label: 'Research Alerts', description: 'Get alerts about new papers in your research areas' },
            { key: 'collaborationRequests', label: 'Collaboration Requests', description: 'Receive notifications about collaboration opportunities' }
          ].map((setting) => (
            <div key={setting.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}>
              <div>
                <h5 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', margin: '0 0 0.25rem 0' }}>
                  {setting.label}
                </h5>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
                  {setting.description}
                </p>
              </div>
              <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px' }}>
                <input
                  type="checkbox"
                  checked={(onboardingData.preferences as any)[setting.key]}
                  onChange={(e) => handleInputChange('preferences', setting.key, e.target.checked)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: (onboardingData.preferences as any)[setting.key] ? '#3b82f6' : '#ccc',
                  transition: '0.4s',
                  borderRadius: '24px'
                }}>
                  <span style={{
                    position: 'absolute',
                    content: '""',
                    height: '18px',
                    width: '18px',
                    left: '3px',
                    bottom: '3px',
                    backgroundColor: 'white',
                    transition: '0.4s',
                    borderRadius: '50%',
                    transform: (onboardingData.preferences as any)[setting.key] ? 'translateX(24px)' : 'translateX(0)'
                  }} />
                </span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Language
          </label>
          <select
            value={onboardingData.preferences.language}
            onChange={(e) => handleInputChange('preferences', 'language', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              backgroundColor: 'white'
            }}
          >
            <option value="en">English</option>
            <option value="vi">Tiếng Việt</option>
            <option value="zh">中文</option>
            <option value="ja">日本語</option>
            <option value="ko">한국어</option>
            <option value="th">ไทย</option>
            <option value="ms">Bahasa Malaysia</option>
            <option value="id">Bahasa Indonesia</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Theme
          </label>
          <select
            value={onboardingData.preferences.theme}
            onChange={(e) => handleInputChange('preferences', 'theme', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              backgroundColor: 'white'
            }}
          >
            <option value="light">Light Mode</option>
            <option value="dark">Dark Mode</option>
            <option value="auto">Auto (System)</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
          Research Goals
        </h3>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          Set your research objectives and targets
        </p>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
          Primary Research Goal *
        </label>
        <select
          value={onboardingData.goals.primaryGoal}
          onChange={(e) => handleInputChange('goals', 'primaryGoal', e.target.value)}
          required
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            backgroundColor: 'white'
          }}
        >
          <option value="">Select Primary Goal</option>
          <option value="PhD Thesis">Complete PhD Thesis</option>
          <option value="Q1 Publication">Publish in Q1 Journal</option>
          <option value="Q2 Publication">Publish in Q2 Journal</option>
          <option value="Research Grant">Secure Research Funding</option>
          <option value="Collaboration">Build Research Network</option>
          <option value="Career Advancement">Academic Career Advancement</option>
          <option value="Industry Research">Industry Research Project</option>
          <option value="Policy Impact">Policy Impact Research</option>
          <option value="Teaching Enhancement">Enhance Teaching Methods</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '1rem' }}>
          Target Journals * (Select up to 3)
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
          {targetJournals.map((journal) => (
            <div
              key={journal}
              onClick={() => handleArrayToggle('goals', 'targetJournals', journal)}
              style={{
                padding: '0.75rem',
                border: onboardingData.goals.targetJournals.includes(journal) ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: onboardingData.goals.targetJournals.includes(journal) ? '#f0f9ff' : 'white',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: onboardingData.goals.targetJournals.includes(journal) ? '#1e40af' : '#374151'
              }}
              onMouseOver={(e) => {
                if (!onboardingData.goals.targetJournals.includes(journal)) {
                  e.currentTarget.style.borderColor = '#3b82f6';
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                }
              }}
              onMouseOut={(e) => {
                if (!onboardingData.goals.targetJournals.includes(journal)) {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.backgroundColor = 'white';
                }
              }}
            >
              {journal}
            </div>
          ))}
        </div>
        <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
          Selected: {onboardingData.goals.targetJournals.length}/3
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Timeline *
          </label>
          <select
            value={onboardingData.goals.timeline}
            onChange={(e) => handleInputChange('goals', 'timeline', e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              backgroundColor: 'white'
            }}
          >
            <option value="">Select Timeline</option>
            <option value="6 months">6 months</option>
            <option value="1 year">1 year</option>
            <option value="2 years">2 years</option>
            <option value="3 years">3 years</option>
            <option value="5 years">5 years</option>
            <option value="Long-term">Long-term (5+ years)</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Funding Status
          </label>
          <select
            value={onboardingData.goals.funding}
            onChange={(e) => handleInputChange('goals', 'funding', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              backgroundColor: 'white'
            }}
          >
            <option value="">Select Funding Status</option>
            <option value="Self-funded">Self-funded</option>
            <option value="University">University Funding</option>
            <option value="Government">Government Grant</option>
            <option value="Private">Private Foundation</option>
            <option value="Industry">Industry Partnership</option>
            <option value="International">International Funding</option>
            <option value="Seeking">Seeking Funding</option>
          </select>
        </div>
      </div>

      <div style={{ padding: '1rem', background: '#f0f9ff', borderRadius: '0.5rem', border: '1px solid #0ea5e9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <input
            type="checkbox"
            checked={onboardingData.goals.collaboration}
            onChange={(e) => handleInputChange('goals', 'collaboration', e.target.checked)}
            style={{ margin: 0 }}
          />
          <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#0369a1', margin: 0 }}>
            Open to Research Collaboration
          </label>
        </div>
        <p style={{ fontSize: '0.75rem', color: '#0369a1', margin: 0 }}>
          Allow other researchers to contact you for collaboration opportunities
        </p>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
          Review & Complete Setup
        </h3>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          Review your information and complete your profile setup
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>
            Personal Information
          </h4>
          <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
            <p style={{ fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>
              <strong>Name:</strong> {onboardingData.personalInfo.fullName}
            </p>
            <p style={{ fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>
              <strong>Email:</strong> {onboardingData.personalInfo.email}
            </p>
            <p style={{ fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>
              <strong>Role:</strong> {onboardingData.personalInfo.role}
            </p>
            <p style={{ fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>
              <strong>Institution:</strong> {onboardingData.personalInfo.institution}
            </p>
            <p style={{ fontSize: '0.875rem', margin: '0' }}>
              <strong>Department:</strong> {onboardingData.personalInfo.department}
            </p>
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>
            Research Profile
          </h4>
          <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
            <p style={{ fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>
              <strong>Research Areas:</strong> {onboardingData.researchProfile.researchArea.join(', ')}
            </p>
            <p style={{ fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>
              <strong>Experience:</strong> {onboardingData.researchProfile.experience}
            </p>
            <p style={{ fontSize: '0.875rem', margin: '0' }}>
              <strong>Methodologies:</strong> {onboardingData.researchProfile.methodologies.join(', ')}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>
          Research Goals
        </h4>
        <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
          <p style={{ fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>
            <strong>Primary Goal:</strong> {onboardingData.goals.primaryGoal}
          </p>
          <p style={{ fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>
            <strong>Target Journals:</strong> {onboardingData.goals.targetJournals.join(', ')}
          </p>
          <p style={{ fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>
            <strong>Timeline:</strong> {onboardingData.goals.timeline}
          </p>
          <p style={{ fontSize: '0.875rem', margin: '0' }}>
            <strong>Collaboration:</strong> {onboardingData.goals.collaboration ? 'Open to collaboration' : 'Not open to collaboration'}
          </p>
        </div>
      </div>

      <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '0.5rem', border: '1px solid #22c55e' }}>
        <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#15803d', marginBottom: '0.5rem' }}>
          🎁 Welcome Bonus
        </h4>
        <p style={{ fontSize: '0.875rem', color: '#15803d', margin: 0 }}>
          You'll receive {roles.find(r => r.value === onboardingData.personalInfo.role)?.tokens || 100} NCS Tokens to start your research journey!
        </p>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      default: return renderStep1();
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return onboardingData.personalInfo.fullName && 
               onboardingData.personalInfo.email && 
               onboardingData.personalInfo.username && 
               onboardingData.personalInfo.role && 
               onboardingData.personalInfo.institution && 
               onboardingData.personalInfo.department && 
               onboardingData.personalInfo.country;
      case 2:
        return onboardingData.researchProfile.researchArea.length > 0 && 
               onboardingData.researchProfile.methodologies.length > 0 && 
               onboardingData.researchProfile.experience;
      case 3:
        return true; // Preferences are optional
      case 4:
        return onboardingData.goals.primaryGoal && 
               onboardingData.goals.targetJournals.length > 0 && 
               onboardingData.goals.timeline;
      case 5:
        return true;
      default:
        return false;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '2rem' }}>
      <Head>
        <title>Welcome to NCS Research Platform - Onboarding</title>
        <meta name="description" content="Complete your research profile setup for Q1-Q2 international standards" />
      </Head>
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ fontSize: '3rem' }}>🔬</div>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}>
                NCS Research Platform
              </h1>
              <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                Q1-Q2 International Standards
              </p>
            </div>
          </div>
          <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.9)', margin: 0 }}>
            Welcome! Let's set up your research profile to get started
          </p>
        </div>

        {/* Progress Steps */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            {steps.map((step, index) => (
              <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: currentStep >= step.id ? 'white' : 'rgba(255,255,255,0.3)',
                  color: currentStep >= step.id ? '#667eea' : 'rgba(255,255,255,0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}>
                  {currentStep > step.id ? '✓' : step.id}
                </div>
                {index < steps.length - 1 && (
                  <div style={{
                    width: '60px',
                    height: '2px',
                    backgroundColor: currentStep > step.id ? 'white' : 'rgba(255,255,255,0.3)',
                    transition: 'all 0.3s ease'
                  }} />
                )}
              </div>
            ))}
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white', marginBottom: '0.5rem' }}>
              {steps[currentStep - 1].title}
            </h2>
            <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.8)', margin: 0 }}>
              {steps[currentStep - 1].description}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 20px 25px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          {renderCurrentStep()}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            style={{
              padding: '0.75rem 1.5rem',
              background: currentStep === 1 ? '#9ca3af' : 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              if (currentStep !== 1) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
              }
            }}
            onMouseOut={(e) => {
              if (currentStep !== 1) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
              }
            }}
          >
            ← Previous
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)' }}>
              Step {currentStep} of {steps.length}
            </span>
            <div style={{
              width: '100px',
              height: '4px',
              backgroundColor: 'rgba(255,255,255,0.3)',
              borderRadius: '2px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${(currentStep / steps.length) * 100}%`,
                height: '100%',
                backgroundColor: 'white',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>

          {currentStep < 5 ? (
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              style={{
                padding: '0.75rem 1.5rem',
                background: !canProceed() ? '#9ca3af' : 'white',
                color: !canProceed() ? '#6b7280' : '#667eea',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: !canProceed() ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                if (canProceed()) {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(255,255,255,0.3)';
                }
              }}
              onMouseOut={(e) => {
                if (canProceed()) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              Next →
            </button>
          ) : (
            <button
              onClick={completeOnboarding}
              disabled={!canProceed() || loading}
              style={{
                padding: '0.75rem 1.5rem',
                background: (!canProceed() || loading) ? '#9ca3af' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: (!canProceed() || loading) ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                if (canProceed() && !loading) {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
                }
              }}
              onMouseOut={(e) => {
                if (canProceed() && !loading) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid transparent',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Completing...
                </div>
              ) : (
                'Complete Setup 🎉'
              )}
            </button>
          )}
        </div>

        {/* Skip Option */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link href="/" style={{
            color: 'rgba(255,255,255,0.8)',
            textDecoration: 'none',
            fontSize: '0.875rem',
            transition: 'color 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.color = 'white'}
          onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
          >
            Skip onboarding for now
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Onboarding;