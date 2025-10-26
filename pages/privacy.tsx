import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const PrivacyPolicy: React.FC = () => {
  const sections = [
    {
      id: 'introduction',
      title: 'Introduction',
      content: `NCS Research Platform ("we," "our," or "us") is committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our research platform and services.

By using our platform, you consent to the data practices described in this policy. If you do not agree with the terms of this Privacy Policy, please do not access or use our services.`
    },
    {
      id: 'information-collection',
      title: 'Information We Collect',
      content: `We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.

Personal Information:
- Name, email address, and contact information
- Academic credentials and institutional affiliation
- Research interests and areas of expertise
- Profile information and academic accounts (ORCID, Google Scholar)
- Payment information (processed securely through third-party providers)

Research Data:
- Research projects, papers, and analysis results
- Literature reviews and bibliographic data
- Statistical analysis outputs and research methodologies
- Collaboration data and team information

Usage Information:
- Platform usage patterns and feature interactions
- Device information and browser type
- IP address and location data
- Cookies and similar tracking technologies`
    },
    {
      id: 'information-use',
      title: 'How We Use Your Information',
      content: `We use the information we collect to provide, maintain, and improve our services:

Service Provision:
- Provide access to research tools and AI assistance
- Process transactions and manage your account
- Deliver personalized research recommendations
- Enable collaboration and networking features

Communication:
- Send important updates about your account and our services
- Provide customer support and respond to inquiries
- Send research-related notifications and alerts
- Share platform updates and new feature announcements

Research and Development:
- Improve our platform functionality and user experience
- Develop new research tools and features
- Conduct analytics and performance monitoring
- Ensure platform security and prevent fraud

Legal Compliance:
- Comply with applicable laws and regulations
- Respond to legal requests and court orders
- Protect our rights and the rights of our users
- Enforce our terms of service and policies`
    },
    {
      id: 'information-sharing',
      title: 'Information Sharing and Disclosure',
      content: `We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:

Service Providers:
- Third-party vendors who assist in platform operations
- Cloud storage and data processing services
- Payment processors and financial institutions
- Analytics and monitoring service providers

Academic Collaboration:
- With other researchers when you choose to collaborate
- With institutions for verification and validation purposes
- With academic journals and publishers (with your consent)
- With funding agencies and research organizations

Legal Requirements:
- When required by law or legal process
- To protect our rights, property, or safety
- To prevent fraud or illegal activities
- In connection with a business transfer or acquisition

Consent:
- When you explicitly consent to sharing your information
- For research purposes with your permission
- For marketing communications (opt-in only)
- For academic networking and collaboration`
    },
    {
      id: 'data-security',
      title: 'Data Security',
      content: `We implement appropriate technical and organizational measures to protect your personal information:

Security Measures:
- Encryption of data in transit and at rest
- Regular security audits and vulnerability assessments
- Access controls and authentication mechanisms
- Secure data centers with physical security measures

Data Protection:
- Regular backups and disaster recovery procedures
- Incident response and breach notification protocols
- Staff training on data protection and privacy
- Compliance with international security standards

Your Responsibilities:
- Use strong passwords and enable two-factor authentication
- Keep your account credentials secure and confidential
- Report any suspicious activity or security concerns
- Regularly review and update your account information`
    },
    {
      id: 'data-retention',
      title: 'Data Retention',
      content: `We retain your information for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy:

Account Information:
- Retained for the duration of your account plus 2 years
- Deleted upon account closure or termination
- Archived for legal compliance and dispute resolution

Research Data:
- Retained for 7 years from last activity
- Archived for historical research purposes
- Deleted upon explicit request (subject to legal requirements)

Usage Data:
- Retained for 2 years for analytics and improvement
- Aggregated and anonymized for long-term analysis
- Deleted when no longer needed for business purposes

Legal Requirements:
- Some data may be retained longer for legal compliance
- Court orders and legal proceedings may require extended retention
- Regulatory requirements may mandate specific retention periods`
    },
    {
      id: 'your-rights',
      title: 'Your Rights and Choices',
      content: `You have certain rights regarding your personal information:

Access and Portability:
- Request access to your personal information
- Receive a copy of your data in a portable format
- Review and verify the accuracy of your information
- Download your research data and analysis results

Correction and Updates:
- Correct inaccurate or incomplete information
- Update your profile and account details
- Modify your research preferences and settings
- Change your communication preferences

Deletion and Restriction:
- Request deletion of your personal information
- Restrict processing of your data
- Object to certain uses of your information
- Withdraw consent for data processing

Opt-out Options:
- Unsubscribe from marketing communications
- Disable certain tracking and analytics
- Control cookie preferences
- Manage notification settings

To exercise these rights, please contact us at privacy@ncsresearch.org or through your account settings.`
    },
    {
      id: 'cookies',
      title: 'Cookies and Tracking Technologies',
      content: `We use cookies and similar technologies to enhance your experience:

Essential Cookies:
- Required for platform functionality and security
- Enable user authentication and session management
- Ensure proper platform operation and performance
- Cannot be disabled without affecting functionality

Analytics Cookies:
- Help us understand how you use our platform
- Provide insights for platform improvement
- Track usage patterns and feature adoption
- Can be disabled through your browser settings

Preference Cookies:
- Remember your settings and preferences
- Personalize your research experience
- Store your research interests and configurations
- Can be managed through account settings

Third-party Cookies:
- Used by integrated services and partners
- Subject to third-party privacy policies
- Can be controlled through browser settings
- Include social media and collaboration tools

You can manage cookie preferences through your browser settings or our cookie consent tool.`
    },
    {
      id: 'international-transfers',
      title: 'International Data Transfers',
      content: `Your information may be transferred to and processed in countries other than your own:

Global Operations:
- Our platform operates globally with users worldwide
- Data may be processed in multiple countries
- We ensure appropriate safeguards for international transfers
- Compliance with applicable data protection laws

Adequacy Decisions:
- Transfers to countries with adequate data protection
- European Commission adequacy decisions
- Appropriate safeguards and contractual protections
- Standard contractual clauses and binding corporate rules

Your Consent:
- By using our platform, you consent to international transfers
- Transfers are necessary for service provision
- We implement appropriate security measures
- You can withdraw consent by closing your account

Safeguards:
- Encryption and secure transmission protocols
- Regular security assessments and audits
- Compliance with international standards
- Data protection impact assessments`
    },
    {
      id: 'children-privacy',
      title: 'Children\'s Privacy',
      content: `Our platform is not intended for children under 16 years of age:

Age Restrictions:
- Users must be at least 16 years old to use our platform
- We do not knowingly collect information from children
- Parental consent required for users under 18
- Educational institutions may have additional requirements

Protection Measures:
- Age verification during account creation
- Monitoring for underage users
- Immediate deletion of child data if discovered
- Cooperation with parents and guardians

Educational Use:
- Special provisions for educational institutions
- Appropriate safeguards for student data
- Compliance with educational privacy laws
- Parental notification and consent requirements

If you believe we have collected information from a child, please contact us immediately at privacy@ncsresearch.org.`
    },
    {
      id: 'changes',
      title: 'Changes to This Privacy Policy',
      content: `We may update this Privacy Policy from time to time:

Notification of Changes:
- We will notify you of material changes via email
- Updates will be posted on our platform
- Changes will be effective upon posting
- Continued use constitutes acceptance of changes

Review Process:
- Regular review and updates of our privacy practices
- Consideration of user feedback and concerns
- Compliance with evolving legal requirements
- Industry best practices and standards

Your Rights:
- You can review changes before they take effect
- You can object to changes that affect your rights
- You can close your account if you disagree with changes
- You can contact us with questions or concerns

Version Control:
- We maintain a history of privacy policy changes
- Previous versions are available upon request
- Clear indication of what has changed
- Effective dates for all policy versions`
    },
    {
      id: 'contact',
      title: 'Contact Information',
      content: `If you have questions about this Privacy Policy or our data practices, please contact us:

Privacy Officer:
Email: privacy@ncsresearch.org
Phone: +1 (555) 123-4567
Address: NCS Research Platform
         Privacy Department
         123 Research Avenue
         Science City, SC 12345

Data Protection Officer (EU):
Email: dpo@ncsresearch.org
Phone: +44 20 7946 0958
Address: NCS Research Platform EU
         Data Protection Office
         456 Innovation Street
         London, UK EC1A 4HD

Response Times:
- General inquiries: Within 48 hours
- Privacy requests: Within 30 days
- Data breach notifications: Within 72 hours
- Urgent matters: Within 24 hours

Complaints:
- You can file a complaint with us directly
- You have the right to contact supervisory authorities
- We will cooperate with regulatory investigations
- We are committed to resolving privacy concerns`
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '2rem' }}>
      <Head>
        <title>Privacy Policy - NCS Research Platform</title>
        <meta name="description" content="NCS Research Platform Privacy Policy - How we protect your data and privacy" />
      </Head>
      
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
                🔒 Privacy Policy
              </h1>
              <p style={{ fontSize: '1.2rem', color: '#6b7280' }}>
                How we protect your data and privacy on NCS Research Platform
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
          borderLeft: '4px solid #3b82f6'
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

        {/* Privacy Policy Sections */}
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
          background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)', 
          padding: '2rem', 
          borderRadius: '0.75rem', 
          marginTop: '2rem',
          color: 'white',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            📞 Questions About Privacy?
          </h2>
          <p style={{ fontSize: '1rem', marginBottom: '1.5rem', opacity: 0.9 }}>
            We're here to help with any privacy questions or concerns you may have.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="mailto:privacy@ncsresearch.org" style={{
              padding: '0.75rem 1.5rem',
              background: 'white',
              color: '#1e40af',
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
              📧 Contact Privacy Team
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
              e.currentTarget.style.color = '#1e40af';
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

export default PrivacyPolicy;
