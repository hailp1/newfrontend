import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'Researcher',
    referralCode: '',
    agreeTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!formData.agreeTerms) {
      setError('Please agree to the terms and conditions');
      setLoading(false);
      return;
    }

    try {
      // Mock registration logic - in real app, call API
      console.log('Registration form submitted:', formData);
      
      // Simulate API call
      setTimeout(() => {
        // Create user data
        const userData = {
          id: Math.floor(Math.random() * 1000) + 100,
          username: formData.username,
          email: formData.email,
          full_name: formData.fullName,
          role: formData.role,
          level: 1,
          tokens: 100 // Welcome bonus
        };

        // Store user data and token
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', `${formData.username}_token`);
        localStorage.setItem('onboarding_completed', 'false'); // New users need onboarding

        // Redirect to onboarding
        router.push('/onboarding');
      }, 1000);
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const roles = [
    { value: 'Researcher', label: 'Researcher', description: 'Conduct research and analysis', icon: '🔬' },
    { value: 'Scholar', label: 'Scholar', description: 'Advanced researcher with publications', icon: '🎓' },
    { value: 'Mentor', label: 'Mentor', description: 'Guide and support other researchers', icon: '👨‍🏫' },
    { value: 'Editor', label: 'Editor', description: 'Review and edit research content', icon: '✏️' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <Head>
        <title>Register - NCS Research Platform</title>
        <meta name="description" content="Create your NCS Research Platform account" />
      </Head>
      
      <div style={{ 
        background: 'white', 
        padding: '3rem', 
        borderRadius: '1rem', 
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        width: '100%',
        maxWidth: '500px'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔬</div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
            Join NCS Research Platform
          </h1>
          <p style={{ fontSize: '1rem', color: '#6b7280' }}>
            Create your account to start your research journey
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>
              Username *
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>
              Research Role
            </label>
            <div style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              backgroundColor: '#f9fafb',
              color: '#6b7280',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              🔬 Researcher - Mặc định cho tất cả người dùng mới
            </div>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
              Sau khi hoàn thành hồ sơ và nộp đơn xin nâng cấp, Admin sẽ xem xét và nâng cấp quyền của bạn
            </p>
          </div>

          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>
              Confirm Password *
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>
              Referral Code (Optional)
            </label>
            <input
              type="text"
              name="referralCode"
              value={formData.referralCode}
              onChange={handleChange}
              placeholder="Enter referral code to earn bonus tokens"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              required
              style={{
                marginTop: '0.25rem',
                width: '1rem',
                height: '1rem'
              }}
            />
            <label style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.4' }}>
              I agree to the{' '}
              <Link href="/terms" style={{ color: '#3b82f6', textDecoration: 'none' }}>
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link href="/privacy" style={{ color: '#3b82f6', textDecoration: 'none' }}>
                Privacy Policy
              </Link>
            </label>
          </div>

          {error && (
            <div style={{
              padding: '0.75rem',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '0.5rem',
              color: '#dc2626',
              fontSize: '0.875rem'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: loading ? '#9ca3af' : 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Welcome Bonus */}
        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          backgroundColor: '#f0fdf4', 
          borderRadius: '0.5rem', 
          border: '1px solid #bbf7d0' 
        }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#059669', marginBottom: '0.5rem' }}>
            🎁 Welcome Bonus
          </h3>
          <div style={{ fontSize: '0.75rem', color: '#047857', lineHeight: '1.4' }}>
            <div>• <strong>100 NCS Tokens</strong> upon registration</div>
            <div>• <strong>+50 Tokens</strong> for completing profile</div>
            <div>• <strong>+100 Tokens</strong> if you have a referral code</div>
          </div>
        </div>

        {/* Login Link */}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Already have an account?{' '}
          </span>
          <Link href="/login" style={{
            color: '#3b82f6',
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}
          onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
          onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
          >
            Sign In
          </Link>
        </div>

        {/* Back to Home */}
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <Link href="/" style={{
            color: '#6b7280',
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}
          onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
          onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
