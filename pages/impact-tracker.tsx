import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

interface ResearchImpact {
  id: string;
  title: string;
  type: 'publication' | 'citation' | 'download' | 'award' | 'media' | 'policy' | 'collaboration';
  value: number;
  unit: string;
  date: string;
  source: string;
  description: string;
}

interface ImpactMetrics {
  totalCitations: number;
  totalDownloads: number;
  hIndex: number;
  i10Index: number;
  altmetricScore: number;
  socialMediaMentions: number;
  policyReferences: number;
  mediaCoverage: number;
}

interface ResearchProject {
  id: string;
  title: string;
  status: 'published' | 'submitted' | 'under-review' | 'in-progress';
  journal: string;
  impactFactor: number;
  publicationDate: string;
  citations: number;
  downloads: number;
  altmetricScore: number;
  socialMentions: number;
}

const ImpactTracker: React.FC = () => {
  const [impacts, setImpacts] = useState<ResearchImpact[]>([]);
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [metrics, setMetrics] = useState<ImpactMetrics>({
    totalCitations: 0,
    totalDownloads: 0,
    hIndex: 0,
    i10Index: 0,
    altmetricScore: 0,
    socialMediaMentions: 0,
    policyReferences: 0,
    mediaCoverage: 0
  });
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');
  const [user, setUser] = useState<any>(null);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        loadImpactData();
      }
    }
  }, []);

  const loadImpactData = () => {
    // Mock data for demonstration
    const mockImpacts: ResearchImpact[] = [
      {
        id: '1',
        title: 'Journal of Business Research Publication',
        type: 'publication',
        value: 1,
        unit: 'publication',
        date: '2024-01-15',
        source: 'Journal of Business Research',
        description: 'Q1 journal publication on consumer behavior'
      },
      {
        id: '2',
        title: 'Google Scholar Citations',
        type: 'citation',
        value: 45,
        unit: 'citations',
        date: '2024-02-20',
        source: 'Google Scholar',
        description: 'Citations from academic papers'
      },
      {
        id: '3',
        title: 'ResearchGate Downloads',
        type: 'download',
        value: 234,
        unit: 'downloads',
        date: '2024-03-10',
        source: 'ResearchGate',
        description: 'Paper downloads from ResearchGate'
      },
      {
        id: '4',
        title: 'Altmetric Score',
        type: 'media',
        value: 78,
        unit: 'score',
        date: '2024-03-15',
        source: 'Altmetric',
        description: 'Social media and news mentions'
      },
      {
        id: '5',
        title: 'Policy Reference',
        type: 'policy',
        value: 1,
        unit: 'reference',
        date: '2024-04-01',
        source: 'Government Report',
        description: 'Cited in government policy document'
      }
    ];

    const mockProjects: ResearchProject[] = [
      {
        id: '1',
        title: 'Consumer Behavior in Digital Markets',
        status: 'published',
        journal: 'Journal of Business Research',
        impactFactor: 7.1,
        publicationDate: '2024-01-15',
        citations: 45,
        downloads: 234,
        altmetricScore: 78,
        socialMentions: 12
      },
      {
        id: '2',
        title: 'AI Impact on Marketing Strategies',
        status: 'under-review',
        journal: 'Journal of Marketing',
        impactFactor: 8.9,
        publicationDate: '2024-06-01',
        citations: 0,
        downloads: 0,
        altmetricScore: 0,
        socialMentions: 0
      },
      {
        id: '3',
        title: 'Sustainable Business Models',
        status: 'submitted',
        journal: 'Strategic Management Journal',
        impactFactor: 9.2,
        publicationDate: '2024-08-01',
        citations: 0,
        downloads: 0,
        altmetricScore: 0,
        socialMentions: 0
      }
    ];

    const mockMetrics: ImpactMetrics = {
      totalCitations: 45,
      totalDownloads: 234,
      hIndex: 2,
      i10Index: 1,
      altmetricScore: 78,
      socialMediaMentions: 12,
      policyReferences: 1,
      mediaCoverage: 3
    };

    setImpacts(mockImpacts);
    setProjects(mockProjects);
    setMetrics(mockMetrics);
  };

  const getImpactIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      'publication': '📄',
      'citation': '📚',
      'download': '⬇️',
      'award': '🏆',
      'media': '📺',
      'policy': '⚖️',
      'collaboration': '🤝'
    };
    return icons[type] || '📊';
  };

  const getImpactColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'publication': '#3b82f6',
      'citation': '#10b981',
      'download': '#f59e0b',
      'award': '#8b5cf6',
      'media': '#ef4444',
      'policy': '#06b6d4',
      'collaboration': '#84cc16'
    };
    return colors[type] || '#6b7280';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return '#10b981';
      case 'submitted': return '#3b82f6';
      case 'under-review': return '#f59e0b';
      case 'in-progress': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const exportImpactReport = () => {
    const reportData = {
      metrics,
      projects,
      impacts,
      timeframe: selectedTimeframe,
      generatedAt: new Date().toISOString(),
      user: user?.full_name || 'Researcher'
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `impact-report-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '2rem' }}>
      <Head>
        <title>Impact Tracker - NCS Research Platform</title>
        <meta name="description" content="Track and measure your research impact and metrics" />
      </Head>
      
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
                📈 Impact Tracker
              </h1>
              <p style={{ fontSize: '1.2rem', color: '#6b7280' }}>
                Track and measure your research impact and metrics
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={exportImpactReport}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                📥 Export Report
              </button>
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
                ← Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Timeframe Filter */}
        <div style={{ 
          background: 'white', 
          padding: '1rem 2rem', 
          borderRadius: '0.75rem', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Timeframe:</span>
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              style={{
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                backgroundColor: 'white'
              }}
            >
              <option value="all">All Time</option>
              <option value="year">This Year</option>
              <option value="6months">Last 6 Months</option>
              <option value="3months">Last 3 Months</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div style={{ 
          background: 'white', 
          padding: '2rem', 
          borderRadius: '0.75rem', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
            📊 Key Impact Metrics
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ textAlign: 'center', padding: '1.5rem', background: '#f0f9ff', borderRadius: '0.5rem', border: '1px solid #0ea5e9' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0369a1', marginBottom: '0.5rem' }}>
                {metrics.totalCitations}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#0369a1', fontWeight: '500' }}>Total Citations</div>
            </div>
            
            <div style={{ textAlign: 'center', padding: '1.5rem', background: '#f0fdf4', borderRadius: '0.5rem', border: '1px solid #22c55e' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#15803d', marginBottom: '0.5rem' }}>
                {metrics.totalDownloads}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#15803d', fontWeight: '500' }}>Total Downloads</div>
            </div>
            
            <div style={{ textAlign: 'center', padding: '1.5rem', background: '#fef3c7', borderRadius: '0.5rem', border: '1px solid #f59e0b' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#d97706', marginBottom: '0.5rem' }}>
                {metrics.hIndex}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#d97706', fontWeight: '500' }}>H-Index</div>
            </div>
            
            <div style={{ textAlign: 'center', padding: '1.5rem', background: '#f3f4f6', borderRadius: '0.5rem', border: '1px solid #6b7280' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#374151', marginBottom: '0.5rem' }}>
                {metrics.i10Index}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#374151', fontWeight: '500' }}>i10-Index</div>
            </div>
            
            <div style={{ textAlign: 'center', padding: '1.5rem', background: '#fef2f2', borderRadius: '0.5rem', border: '1px solid #ef4444' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc2626', marginBottom: '0.5rem' }}>
                {metrics.altmetricScore}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#dc2626', fontWeight: '500' }}>Altmetric Score</div>
            </div>
            
            <div style={{ textAlign: 'center', padding: '1.5rem', background: '#f0f9ff', borderRadius: '0.5rem', border: '1px solid #3b82f6' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e40af', marginBottom: '0.5rem' }}>
                {metrics.socialMediaMentions}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#1e40af', fontWeight: '500' }}>Social Mentions</div>
            </div>
            
            <div style={{ textAlign: 'center', padding: '1.5rem', background: '#f0fdf4', borderRadius: '0.5rem', border: '1px solid #10b981' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669', marginBottom: '0.5rem' }}>
                {metrics.policyReferences}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#059669', fontWeight: '500' }}>Policy References</div>
            </div>
            
            <div style={{ textAlign: 'center', padding: '1.5rem', background: '#fef3c7', borderRadius: '0.5rem', border: '1px solid #f59e0b' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#d97706', marginBottom: '0.5rem' }}>
                {metrics.mediaCoverage}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#d97706', fontWeight: '500' }}>Media Coverage</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Research Projects */}
          <div>
            <div style={{ 
              background: 'white', 
              padding: '2rem', 
              borderRadius: '0.75rem', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              marginBottom: '2rem'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
                📄 Research Projects
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {projects.map((project) => (
                  <div key={project.id} style={{
                    padding: '1rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    backgroundColor: 'white'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                        {project.title}
                      </h3>
                      <span style={{
                        fontSize: '0.75rem',
                        padding: '0.25rem 0.5rem',
                        backgroundColor: getStatusColor(project.status),
                        color: 'white',
                        borderRadius: '0.25rem',
                        textTransform: 'capitalize'
                      }}>
                        {project.status.replace('-', ' ')}
                      </span>
                    </div>
                    
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.75rem' }}>
                      <strong>Journal:</strong> {project.journal} (IF: {project.impactFactor})
                    </p>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', fontSize: '0.75rem', color: '#6b7280' }}>
                      <div>📚 Citations: {project.citations}</div>
                      <div>⬇️ Downloads: {project.downloads}</div>
                      <div>📊 Altmetric: {project.altmetricScore}</div>
                      <div>📱 Social: {project.socialMentions}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Impact Events */}
          <div>
            <div style={{ 
              background: 'white', 
              padding: '2rem', 
              borderRadius: '0.75rem', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              marginBottom: '2rem'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
                📈 Recent Impact Events
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {impacts.map((impact) => (
                  <div key={impact.id} style={{
                    padding: '1rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    backgroundColor: 'white'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '1.25rem' }}>{getImpactIcon(impact.type)}</span>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                          {impact.title}
                        </h3>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
                          {impact.source} • {formatDate(impact.date)}
                        </p>
                      </div>
                      <div style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: getImpactColor(impact.type),
                        color: 'white',
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        {impact.value} {impact.unit}
                      </div>
                    </div>
                    
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0, lineHeight: '1.4' }}>
                      {impact.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Impact Tips */}
        <div style={{ 
          background: 'white', 
          padding: '2rem', 
          borderRadius: '0.75rem', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
            💡 Tips to Increase Research Impact
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: '#f0f9ff', borderRadius: '0.5rem', border: '1px solid #0ea5e9' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0369a1', marginBottom: '0.5rem' }}>
                📚 Publishing Strategy
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#0369a1', margin: 0 }}>
                Target high-impact journals, collaborate with established researchers, and publish in open access venues
              </p>
            </div>
            
            <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '0.5rem', border: '1px solid #22c55e' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#15803d', marginBottom: '0.5rem' }}>
                📱 Social Media
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#15803d', margin: 0 }}>
                Share your research on Twitter, LinkedIn, and academic networks to increase visibility
              </p>
            </div>
            
            <div style={{ padding: '1rem', background: '#fef3c7', borderRadius: '0.5rem', border: '1px solid #f59e0b' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#d97706', marginBottom: '0.5rem' }}>
                🤝 Collaboration
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#d97706', margin: 0 }}>
                Build networks, collaborate internationally, and engage with industry partners
              </p>
            </div>
            
            <div style={{ padding: '1rem', background: '#f3f4f6', borderRadius: '0.5rem', border: '1px solid #6b7280' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                📊 Data Sharing
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#374151', margin: 0 }}>
                Share datasets, code, and supplementary materials to increase reproducibility and citations
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactTracker;