import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const TermsOfService: React.FC = () => {
  const sections = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      content: `By accessing and using NCS Research Platform ("Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.

These Terms of Service ("Terms") govern your use of our research platform and services. By creating an account or using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms.

We reserve the right to modify these Terms at any time. We will notify users of any material changes via email or through the Platform. Your continued use of the Platform after such modifications constitutes acceptance of the updated Terms.`
    },
    {
      id: 'description',
      title: 'Description of Service',
      content: `NCS Research Platform is a comprehensive research management and collaboration platform designed for academic researchers, particularly in Economics, Business Administration, and Marketing.

Our services include:
- Advanced statistical analysis tools with R integration
- AI-powered literature review and writing assistance
- Research proposal generation and management
- Thesis writing support and guidance
- Project management and collaboration tools
- Research workflow guidance and quality checklists
- Impact tracking and academic networking
- NCS Token reward system for research activities

The Platform is designed to help researchers achieve Q1-Q2 international publication standards through comprehensive research support tools and AI assistance.

We reserve the right to modify, suspend, or discontinue any aspect of the Platform at any time without notice.`
    },
    {
      id: 'user-accounts',
      title: 'User Accounts and Registration',
      content: `To access certain features of the Platform, you must create an account. You agree to:

Account Creation:
- Provide accurate, current, and complete information during registration
- Maintain and update your account information to keep it accurate
- Use only one account per person
- Not share your account credentials with others

Account Security:
- Maintain the confidentiality of your password and account
- Notify us immediately of any unauthorized use of your account
- Accept responsibility for all activities under your account
- Use strong passwords and enable two-factor authentication when available

Account Types:
- Researcher: Basic access to research tools and features
- Scholar: Enhanced access with additional analysis capabilities
- Mentor: Ability to guide and review other researchers' work
- Editor: Editorial and review capabilities for platform content
- Founder: Full administrative access and platform management

We reserve the right to refuse service, terminate accounts, or remove content at our sole discretion.`
    },
    {
      id: 'acceptable-use',
      title: 'Acceptable Use Policy',
      content: `You agree to use the Platform only for lawful purposes and in accordance with these Terms. You agree not to:

Prohibited Activities:
- Use the Platform for any illegal or unauthorized purpose
- Violate any laws or regulations in your jurisdiction
- Infringe on intellectual property rights of others
- Transmit harmful, threatening, or offensive content
- Attempt to gain unauthorized access to the Platform
- Interfere with or disrupt the Platform's operation
- Use automated systems to access the Platform without permission

Research Integrity:
- Conduct research in accordance with academic integrity standards
- Properly cite sources and give credit to original authors
- Not plagiarize or misrepresent others' work
- Follow ethical guidelines for research and publication
- Respect intellectual property rights and copyright laws

Professional Conduct:
- Treat other users with respect and professionalism
- Not engage in harassment, discrimination, or inappropriate behavior
- Maintain confidentiality of sensitive research data
- Report any violations of these Terms to our support team

We reserve the right to investigate and take appropriate action against users who violate these terms.`
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property Rights',
      content: `The Platform and its original content, features, and functionality are owned by NCS Research Platform and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.

Platform Content:
- All software, algorithms, and technical components are proprietary
- User interface design and user experience elements are protected
- Documentation, tutorials, and educational content are copyrighted
- Trademarks, logos, and branding elements are protected

User Content:
- You retain ownership of your research data and content
- You grant us a license to use your content to provide our services
- You are responsible for ensuring you have rights to any content you upload
- We do not claim ownership of your research or intellectual property

Third-Party Content:
- Some content may be licensed from third parties
- Users must respect third-party intellectual property rights
- Proper attribution must be given to third-party sources
- Users are responsible for compliance with third-party licenses

Research Data:
- Your research data remains your property
- We provide secure storage and backup services
- Data is protected by our security measures and privacy policy
- You can export your data at any time`
    },
    {
      id: 'ncs-tokens',
      title: 'NCS Token System',
      content: `The Platform uses a token-based reward system called NCS Tokens to incentivize research activities and platform engagement.

Token Earning:
- Complete profile setup and verification
- Link academic accounts (ORCID, Google Scholar, etc.)
- Participate in research activities and collaborations
- Contribute to platform content and discussions
- Achieve research milestones and publications
- Refer other researchers to the platform

Token Usage:
- Access premium research tools and features
- Request AI assistance and analysis services
- Collaborate with other researchers
- Access advanced statistical analysis capabilities
- Participate in exclusive research programs
- Purchase additional platform services

Token Management:
- Tokens are non-transferable and non-refundable
- Token balances are displayed in your account dashboard
- Transaction history is available for review
- Tokens may expire after a specified period of inactivity
- We reserve the right to modify token earning and usage rules

Token Purchases:
- Additional tokens can be purchased through the platform
- Payment processing is handled by secure third-party providers
- Refunds are subject to our refund policy
- Token prices may change with advance notice`
    },
    {
      id: 'privacy-data',
      title: 'Privacy and Data Protection',
      content: `Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.

Data Collection:
- We collect information necessary to provide our services
- Research data is stored securely and confidentially
- Usage analytics help us improve the platform
- Personal information is protected according to applicable laws

Data Usage:
- Data is used to provide and improve our services
- Research data may be used for platform analytics (anonymized)
- Personal information is not sold to third parties
- Data sharing occurs only with your explicit consent

Data Security:
- We implement industry-standard security measures
- Data is encrypted in transit and at rest
- Regular security audits and assessments are conducted
- Incident response procedures are in place

Your Rights:
- You can access, update, or delete your personal information
- You can export your research data at any time
- You can opt out of certain data collection activities
- You can request data portability and deletion`
    },
    {
      id: 'payment-billing',
      title: 'Payment and Billing',
      content: `Some features of the Platform may require payment. Payment terms are as follows:

Subscription Plans:
- Free tier with basic research tools and features
- Premium plans with advanced capabilities and AI assistance
- Enterprise plans for institutions and large research teams
- Custom pricing for specialized research needs

Payment Terms:
- Payments are processed securely through third-party providers
- Subscription fees are billed in advance on a recurring basis
- All fees are non-refundable except as required by law
- Prices may change with 30 days' advance notice

Billing Information:
- You must provide accurate billing information
- Payment methods must be valid and current
- Failed payments may result in service suspension
- You are responsible for all applicable taxes and fees

Refunds:
- Refunds are generally not provided for digital services
- Refunds may be available for technical issues or service failures
- Refund requests must be submitted within 30 days of payment
- Refunds are processed to the original payment method

Cancellation:
- You can cancel your subscription at any time
- Cancellation takes effect at the end of the current billing period
- No partial refunds for unused subscription time
- Cancellation does not affect your access to free features`
    },
    {
      id: 'service-availability',
      title: 'Service Availability and Support',
      content: `We strive to provide reliable service, but cannot guarantee uninterrupted access to the Platform.

Service Availability:
- We aim for 99.9% uptime but cannot guarantee continuous availability
- Scheduled maintenance may temporarily interrupt service
- Emergency maintenance may occur without advance notice
- Service interruptions do not entitle users to refunds

Technical Support:
- Support is available through our help center and email
- Response times vary based on issue complexity and user tier
- Premium users receive priority support
- We provide documentation and tutorials for self-service

Service Modifications:
- We may modify or discontinue features with advance notice
- Critical changes will be communicated via email
- Users will be given reasonable time to adapt to changes
- Discontinued features may be replaced with alternatives

Limitations:
- We are not responsible for third-party service interruptions
- Users are responsible for their internet connection and devices
- Some features may not be available in all regions
- Service availability may be affected by external factors`
    },
    {
      id: 'disclaimers',
      title: 'Disclaimers and Limitations',
      content: `The Platform is provided "as is" without warranties of any kind.

Service Disclaimers:
- We do not guarantee the accuracy or completeness of research tools
- AI assistance is provided for guidance only, not as definitive advice
- Users are responsible for verifying research results and conclusions
- We are not liable for research outcomes or publication success

Limitation of Liability:
- Our liability is limited to the amount paid for the service
- We are not liable for indirect, incidental, or consequential damages
- We are not responsible for third-party actions or content
- Users assume all risks associated with using the Platform

Research Disclaimer:
- The Platform provides tools and assistance, not research validation
- Users are responsible for their research methodology and ethics
- We do not guarantee publication success or academic recognition
- Research results should be independently verified and peer-reviewed

Force Majeure:
- We are not liable for delays or failures due to circumstances beyond our control
- This includes natural disasters, government actions, and technical failures
- Service interruptions due to force majeure do not constitute breach of contract`
    },
    {
      id: 'termination',
      title: 'Termination and Suspension',
      content: `Either party may terminate this agreement at any time.

User Termination:
- You can terminate your account at any time through account settings
- Termination takes effect immediately upon request
- You can export your data before termination
- Some data may be retained for legal compliance purposes

Platform Termination:
- We may suspend or terminate accounts for Terms violations
- Immediate termination may occur for serious violations
- We will provide notice and opportunity to cure when possible
- Termination does not affect accrued rights or obligations

Effect of Termination:
- Access to the Platform will be revoked upon termination
- Your data will be deleted according to our data retention policy
- Outstanding payments remain due and payable
- Confidentiality obligations survive termination

Account Suspension:
- Accounts may be suspended pending investigation of violations
- Suspended users cannot access Platform features
- Suspension may be lifted if violations are resolved
- Permanent suspension may result from repeated violations`
    },
    {
      id: 'governing-law',
      title: 'Governing Law and Disputes',
      content: `These Terms are governed by the laws of the jurisdiction where NCS Research Platform is incorporated.

Governing Law:
- These Terms are governed by [Jurisdiction] law
- Any disputes will be resolved in [Jurisdiction] courts
- International users agree to submit to [Jurisdiction] jurisdiction
- Local laws may provide additional protections

Dispute Resolution:
- We encourage users to contact us first to resolve disputes
- Mediation may be used to resolve disputes before litigation
- Arbitration may be required for certain types of disputes
- Class action waivers may apply to some disputes

Legal Compliance:
- Users must comply with applicable local laws and regulations
- Export control laws may restrict certain research activities
- Academic institutions may have additional compliance requirements
- We cooperate with law enforcement when legally required

Severability:
- If any provision of these Terms is found invalid, the remainder remains in effect
- Invalid provisions will be replaced with valid ones that achieve the same purpose
- These Terms constitute the entire agreement between the parties`
    },
    {
      id: 'contact',
      title: 'Contact Information',
      content: `If you have questions about these Terms of Service, please contact us:

Legal Department:
Email: legal@ncsresearch.org
Phone: +1 (555) 123-4567
Address: NCS Research Platform
         Legal Department
         123 Research Avenue
         Science City, SC 12345

General Support:
Email: support@ncsresearch.org
Phone: +1 (555) 123-4568
Help Center: https://help.ncsresearch.org

Response Times:
- General inquiries: Within 48 hours
- Legal matters: Within 5 business days
- Urgent issues: Within 24 hours
- Emergency contact: Available 24/7 for critical issues

Updates and Notifications:
- We will notify users of material changes to these Terms
- Notifications will be sent via email and platform announcements
- Users should keep their contact information current
- Continued use constitutes acceptance of updated Terms`
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '2rem' }}>
      <Head>
        <title>Terms of Service - NCS Research Platform</title>
        <meta name="description" content="NCS Research Platform Terms of Service - User agreement and platform rules" />
      </Head>
      
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
                📋 Terms of Service
              </h1>
              <p style={{ fontSize: '1.2rem', color: '#6b7280' }}>
                User agreement and platform rules for NCS Research Platform
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

        {/* Last Updated */}
        <div style={{ 
          background: 'white', 
          padding: '1.5rem', 
          borderRadius: '0.75rem', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '2rem',
          borderLeft: '4px solid #10b981'
        }}>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
            <strong>Last Updated:</strong> October 26, 2024 | <strong>Effective Date:</strong> October 26, 2024
          </p>
        </div>

        {/* Table of Contents */}
        <div style={{ 
          background: 'white', 
          padding: '2rem', 
          borderRadius: '0.75rem', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
            📋 Table of Contents
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.5rem' }}>
            {sections.map((section, index) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                style={{
                  display: 'block',
                  padding: '0.75rem',
                  color: '#3b82f6',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f9ff';
                  e.currentTarget.style.borderColor = '#3b82f6';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                {index + 1}. {section.title}
              </a>
            ))}
          </div>
        </div>

        {/* Terms Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {sections.map((section, index) => (
            <div
              key={section.id}
              id={section.id}
              style={{ 
                background: 'white', 
                padding: '2rem', 
                borderRadius: '0.75rem', 
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              <h2 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                color: '#1f2937', 
                marginBottom: '1rem',
                paddingBottom: '0.5rem',
                borderBottom: '2px solid #e5e7eb'
              }}>
                {index + 1}. {section.title}
              </h2>
              <div style={{ 
                fontSize: '0.875rem', 
                color: '#374151', 
                lineHeight: '1.7',
                whiteSpace: 'pre-line'
              }}>
                {section.content}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div style={{ 
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
          padding: '2rem', 
          borderRadius: '0.75rem', 
          marginTop: '2rem',
          color: 'white',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            📞 Questions About Terms?
          </h2>
          <p style={{ fontSize: '1rem', marginBottom: '1.5rem', opacity: 0.9 }}>
            Our legal team is here to help clarify any questions about these Terms of Service.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="mailto:legal@ncsresearch.org" style={{
              padding: '0.75rem 1.5rem',
              background: 'white',
              color: '#059669',
              textDecoration: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255,255,255,0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              📧 Contact Legal Team
            </a>
            <Link href="/contact" style={{
              padding: '0.75rem 1.5rem',
              background: 'transparent',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
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
              📋 General Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
