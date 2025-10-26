import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const AboutNCS: React.FC = () => {
  const features = [
    {
      icon: '🔬',
      title: 'Advanced Research Tools',
      description: 'Comprehensive suite of tools for data analysis, literature review, and statistical modeling with R integration'
    },
    {
      icon: '🤖',
      title: 'AI-Powered Assistance',
      description: 'Intelligent writing assistance, proposal generation, and research guidance powered by cutting-edge AI'
    },
    {
      icon: '📊',
      title: 'Q1-Q2 Standards',
      description: 'Designed specifically for international publication standards in Economics, Business Administration, and Marketing'
    },
    {
      icon: '🪙',
      title: 'Token Reward System',
      description: 'Earn NCS Tokens through research activities, collaborations, and platform contributions'
    },
    {
      icon: '👥',
      title: 'Collaborative Platform',
      description: 'Connect with researchers worldwide, share knowledge, and build professional networks'
    },
    {
      icon: '📈',
      title: 'Impact Tracking',
      description: 'Monitor your research impact, citations, and academic achievements in real-time'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Active Researchers', icon: '👨‍🔬' },
    { number: '50,000+', label: 'Research Projects', icon: '📚' },
    { number: '95%', label: 'Success Rate', icon: '🎯' },
    { number: '150+', label: 'Countries', icon: '🌍' }
  ];

  const team = [
    {
      name: 'Dr. Sarah Chen',
      role: 'Chief Research Officer',
      expertise: 'Quantitative Methods & Econometrics',
      avatar: '👩‍💼',
      background: 'PhD in Economics from MIT, 15+ years in research methodology'
    },
    {
      name: 'Prof. Michael Rodriguez',
      role: 'Head of AI Research',
      expertise: 'Machine Learning & Data Science',
      avatar: '👨‍💻',
      background: 'PhD in Computer Science from Stanford, AI research pioneer'
    },
    {
      name: 'Dr. Emily Watson',
      role: 'Academic Partnerships Director',
      expertise: 'International Research Collaboration',
      avatar: '👩‍🎓',
      background: 'PhD in Business Administration, former journal editor'
    },
    {
      name: 'Dr. James Kim',
      role: 'Platform Technology Lead',
      expertise: 'Software Engineering & Research Tools',
      avatar: '👨‍🔧',
      background: 'PhD in Information Systems, 20+ years in research technology'
    }
  ];

  const milestones = [
    {
      year: '2020',
      title: 'Platform Launch',
      description: 'NCS Research Platform officially launched with basic research tools'
    },
    {
      year: '2021',
      title: 'AI Integration',
      description: 'Introduced AI-powered writing assistance and literature review tools'
    },
    {
      year: '2022',
      title: 'R Integration',
      description: 'Added advanced statistical analysis with R programming language support'
    },
    {
      year: '2023',
      title: 'Global Expansion',
      description: 'Expanded to 150+ countries with multilingual support'
    },
    {
      year: '2024',
      title: 'Token System',
      description: 'Launched NCS Token reward system and collaborative features'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '2rem' }}>
      <Head>
        <title>About NCS Research Platform - Empowering Global Research</title>
        <meta name="description" content="Learn about NCS Research Platform - the leading platform for Q1-Q2 international research standards" />
      </Head>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
                🔬 About NCS Research Platform
              </h1>
              <p style={{ fontSize: '1.2rem', color: '#6b7280' }}>
                Empowering researchers worldwide with cutting-edge tools for international publication success
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

        {/* Mission Statement */}
        <div style={{ 
          background: 'white', 
          padding: '3rem', 
          borderRadius: '1rem', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '3rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🎯</div>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
            Our Mission
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#6b7280', lineHeight: '1.6', maxWidth: '800px', margin: '0 auto' }}>
            To democratize access to world-class research tools and empower researchers globally to achieve 
            Q1-Q2 international publication standards in Economics, Business Administration, and Marketing. 
            We believe that every researcher deserves access to the same advanced tools and AI assistance 
            that drive breakthrough discoveries.
          </p>
        </div>

        {/* Platform Features */}
        <div style={{ 
          background: 'white', 
          padding: '3rem', 
          borderRadius: '1rem', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '3rem'
        }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem', textAlign: 'center' }}>
            🚀 Platform Features
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
            {features.map((feature, index) => (
              <div key={index} style={{
                padding: '2rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                backgroundColor: '#f8fafc',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.backgroundColor = '#f0f9ff';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{feature.icon}</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.75rem' }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.6', margin: 0 }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          padding: '3rem', 
          borderRadius: '1rem', 
          marginBottom: '3rem',
          color: 'white'
        }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center' }}>
            📊 Platform Impact
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            {stats.map((stat, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  {stat.number}
                </div>
                <div style={{ fontSize: '1rem', opacity: 0.9 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div style={{ 
          background: 'white', 
          padding: '3rem', 
          borderRadius: '1rem', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '3rem'
        }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem', textAlign: 'center' }}>
            👥 Our Team
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {team.map((member, index) => (
              <div key={index} style={{
                padding: '2rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                backgroundColor: '#f8fafc',
                textAlign: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.backgroundColor = '#f0f9ff';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              >
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{member.avatar}</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                  {member.name}
                </h3>
                <p style={{ fontSize: '1rem', fontWeight: '500', color: '#3b82f6', marginBottom: '0.75rem' }}>
                  {member.role}
                </p>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
                  <strong>Expertise:</strong> {member.expertise}
                </p>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', lineHeight: '1.4', margin: 0 }}>
                  {member.background}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div style={{ 
          background: 'white', 
          padding: '3rem', 
          borderRadius: '1rem', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '3rem'
        }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem', textAlign: 'center' }}>
            📅 Our Journey
          </h2>
          
          <div style={{ position: 'relative' }}>
            {/* Timeline line */}
            <div style={{
              position: 'absolute',
              left: '50%',
              top: '0',
              bottom: '0',
              width: '2px',
              backgroundColor: '#3b82f6',
              transform: 'translateX(-50%)'
            }} />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {milestones.map((milestone, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2rem',
                  position: 'relative'
                }}>
                  <div style={{
                    width: '120px',
                    textAlign: 'right',
                    paddingRight: '2rem'
                  }}>
                    <div style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: '#3b82f6',
                      backgroundColor: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      border: '2px solid #3b82f6',
                      display: 'inline-block'
                    }}>
                      {milestone.year}
                    </div>
                  </div>
                  
                  <div style={{
                    flex: 1,
                    paddingLeft: '2rem',
                    padding: '1.5rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '0.75rem',
                    border: '1px solid #e5e7eb'
                  }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                      {milestone.title}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Values */}
        <div style={{ 
          background: 'white', 
          padding: '3rem', 
          borderRadius: '1rem', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '3rem'
        }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem', textAlign: 'center' }}>
            💎 Our Values
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔬</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.75rem' }}>
                Research Excellence
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.6', margin: 0 }}>
                We are committed to maintaining the highest standards of research quality and academic integrity
              </p>
            </div>
            
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌍</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.75rem' }}>
                Global Accessibility
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.6', margin: 0 }}>
                Making world-class research tools accessible to researchers worldwide, regardless of location or resources
              </p>
            </div>
            
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤝</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.75rem' }}>
                Collaboration
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.6', margin: 0 }}>
                Fostering a collaborative environment where researchers can share knowledge and work together
              </p>
            </div>
            
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.75rem' }}>
                Innovation
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.6', margin: 0 }}>
                Continuously innovating and improving our platform to meet the evolving needs of researchers
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div style={{ 
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
          padding: '3rem', 
          borderRadius: '1rem', 
          color: 'white',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            🎯 Ready to Transform Your Research?
          </h2>
          <p style={{ fontSize: '1.125rem', marginBottom: '2rem', opacity: 0.9 }}>
            Join thousands of researchers who are already achieving Q1-Q2 publication success with NCS Platform
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/onboarding" style={{
              padding: '1rem 2rem',
              background: 'white',
              color: '#059669',
              textDecoration: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255,255,255,0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              Get Started Free
            </Link>
            <Link href="/contact" style={{
              padding: '1rem 2rem',
              background: 'transparent',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '500',
              border: '2px solid white',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.color = '#059669';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'white';
            }}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutNCS;
