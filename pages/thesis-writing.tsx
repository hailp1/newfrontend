import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { apiService } from '../services/api';

interface ThesisSection {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'review' | 'final';
  wordCount: number;
  lastModified: string;
  aiSuggestions: string[];
}

interface ThesisDocument {
  id: string;
  title: string;
  sections: ThesisSection[];
  totalWordCount: number;
  completionPercentage: number;
  lastModified: string;
}

const ThesisWriting: React.FC = () => {
  const [thesisDocument, setThesisDocument] = useState<ThesisDocument | null>(null);
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState('');

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const [newThesis, setNewThesis] = useState({
    title: '',
    description: ''
  });

  const [sectionContent, setSectionContent] = useState('');

  const thesisSections = [
    {
      id: 'abstract',
      title: 'Abstract',
      description: 'Brief summary of the entire thesis',
      icon: '📝',
      wordLimit: 300,
      template: 'This study examines... The research methodology involves... The findings indicate...'
    },
    {
      id: 'introduction',
      title: 'Introduction',
      description: 'Background, problem statement, and research objectives',
      icon: '🎯',
      wordLimit: 1500,
      template: 'The field of [research area] has witnessed significant developments... This research addresses the gap in...'
    },
    {
      id: 'literature-review',
      title: 'Literature Review',
      description: 'Comprehensive review of existing research',
      icon: '📚',
      wordLimit: 3000,
      template: 'Previous research has shown that... However, there is limited understanding of...'
    },
    {
      id: 'methodology',
      title: 'Methodology',
      description: 'Research design, data collection, and analysis methods',
      icon: '🔬',
      wordLimit: 2000,
      template: 'This study employs a [methodology] approach... Data was collected through...'
    },
    {
      id: 'results',
      title: 'Results',
      description: 'Presentation and analysis of findings',
      icon: '📊',
      wordLimit: 2500,
      template: 'The analysis reveals... Table 1 shows... The results indicate...'
    },
    {
      id: 'discussion',
      title: 'Discussion',
      description: 'Interpretation of results and implications',
      icon: '💭',
      wordLimit: 2000,
      template: 'The findings suggest that... This is consistent with... However, the results contradict...'
    },
    {
      id: 'conclusion',
      title: 'Conclusion',
      description: 'Summary of contributions and future research',
      icon: '✅',
      wordLimit: 1000,
      template: 'This study contributes to... The main findings are... Future research should...'
    },
    {
      id: 'references',
      title: 'References',
      description: 'List of cited sources',
      icon: '📖',
      wordLimit: 0,
      template: 'APA/MLA format references...'
    }
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
        loadThesisDocument();
      }
    }
  }, []);

  const loadThesisDocument = async () => {
    try {
      // Mock data for demonstration
      const mockThesis: ThesisDocument = {
        id: '1',
        title: 'My Research Thesis',
        sections: thesisSections.map(section => ({
          id: section.id,
          title: section.title,
          content: section.template,
          status: 'draft' as const,
          wordCount: section.template.split(' ').length,
          lastModified: new Date().toISOString(),
          aiSuggestions: [
            'Consider adding more specific examples',
            'Strengthen the theoretical framework',
            'Include recent studies from 2023-2024'
          ]
        })),
        totalWordCount: thesisSections.reduce((sum, section) => sum + section.template.split(' ').length, 0),
        completionPercentage: 25,
        lastModified: new Date().toISOString()
      };
      setThesisDocument(mockThesis);
    } catch (error) {
      console.error('Failed to load thesis document:', error);
    }
  };

  const createThesis = async () => {
    if (!newThesis.title.trim()) return;

    setLoading(true);
    try {
      const newDoc: ThesisDocument = {
        id: Date.now().toString(),
        title: newThesis.title,
        sections: thesisSections.map(section => ({
          id: section.id,
          title: section.title,
          content: section.template,
          status: 'draft' as const,
          wordCount: section.template.split(' ').length,
          lastModified: new Date().toISOString(),
          aiSuggestions: []
        })),
        totalWordCount: thesisSections.reduce((sum, section) => sum + section.template.split(' ').length, 0),
        completionPercentage: 0,
        lastModified: new Date().toISOString()
      };

      setThesisDocument(newDoc);
      setShowCreateModal(false);
      setNewThesis({ title: '', description: '' });
    } catch (error) {
      console.error('Failed to create thesis:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSectionContent = async (sectionId: string, content: string) => {
    if (!thesisDocument) return;

    setLoading(true);
    try {
      const updatedSections = thesisDocument.sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              content,
              wordCount: content.split(' ').length,
              lastModified: new Date().toISOString()
            }
          : section
      );

      const updatedDoc = {
        ...thesisDocument,
        sections: updatedSections,
        totalWordCount: updatedSections.reduce((sum, section) => sum + section.wordCount, 0),
        lastModified: new Date().toISOString()
      };

      setThesisDocument(updatedDoc);
    } catch (error) {
      console.error('Failed to update section:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAIContent = async (sectionId: string) => {
    if (!thesisDocument) return;

    setLoading(true);
    try {
      const response = await apiService.generateThesisSection({
        section_type: sectionId,
        existing_content: thesisDocument.sections.find(s => s.id === sectionId)?.content || '',
        research_context: {
          title: thesisDocument.title,
          methodology: thesisDocument.sections.find(s => s.id === 'methodology')?.content || '',
          objectives: thesisDocument.sections.find(s => s.id === 'introduction')?.content || ''
        }
      });

      if (response.success && response.data) {
        const updatedSections = thesisDocument.sections.map(section =>
          section.id === sectionId
            ? {
                ...section,
                content: response.data.content,
                wordCount: response.data.content.split(' ').length,
                lastModified: new Date().toISOString(),
                aiSuggestions: response.data.suggestions || []
              }
            : section
        );

        const updatedDoc = {
          ...thesisDocument,
          sections: updatedSections,
          totalWordCount: updatedSections.reduce((sum, section) => sum + section.wordCount, 0),
          lastModified: new Date().toISOString()
        };

        setThesisDocument(updatedDoc);
      }
    } catch (error) {
      console.error('Failed to generate AI content:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportThesis = () => {
    if (!thesisDocument) return;

    const exportData = {
      thesis: thesisDocument,
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `thesis-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return '#f59e0b';
      case 'review': return '#3b82f6';
      case 'final': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 80) return '#10b981';
    if (percentage >= 60) return '#f59e0b';
    if (percentage >= 40) return '#3b82f6';
    return '#ef4444';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '2rem' }}>
      <Head>
        <title>Thesis Writing - NCS Research Platform</title>
        <meta name="description" content="AI-powered thesis writing assistant for Q1-Q2 research standards" />
      </Head>
      
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
                📝 Thesis Writing
              </h1>
              <p style={{ fontSize: '1.2rem', color: '#6b7280' }}>
                AI-powered thesis writing assistant
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {thesisDocument && (
                <button
                  onClick={exportThesis}
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
                  📥 Export Thesis
                </button>
              )}
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

        {!thesisDocument ? (
          /* Create Thesis Modal */
          <div style={{ 
            background: 'white', 
            padding: '4rem 2rem', 
            borderRadius: '0.75rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📝</div>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
              Start Your Thesis
            </h2>
            <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '2rem' }}>
              Create a new thesis document with AI-powered writing assistance
            </p>
            
            <div style={{ maxWidth: '500px', margin: '0 auto' }}>
              <div style={{ marginBottom: '1rem' }}>
                <input
                  type="text"
                  value={newThesis.title}
                  onChange={(e) => setNewThesis({ ...newThesis, title: e.target.value })}
                  placeholder="Enter your thesis title"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '1rem'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '2rem' }}>
                <textarea
                  value={newThesis.description}
                  onChange={(e) => setNewThesis({ ...newThesis, description: e.target.value })}
                  placeholder="Brief description of your research"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
              </div>
              
              <button
                onClick={createThesis}
                disabled={!newThesis.title.trim() || loading}
                style={{
                  padding: '0.75rem 2rem',
                  background: (!newThesis.title.trim() || loading) ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: (!newThesis.title.trim() || loading) ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {loading ? 'Creating...' : 'Create Thesis Document'}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
            {/* Left Column - Sections */}
            <div>
              <div style={{ 
                background: 'white', 
                padding: '2rem', 
                borderRadius: '0.75rem', 
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                marginBottom: '2rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                    {thesisDocument.title}
                  </h2>
                  <div style={{
                    padding: '0.5rem 1rem',
                    background: getCompletionColor(thesisDocument.completionPercentage),
                    color: 'white',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}>
                    {thesisDocument.completionPercentage}% Complete
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ textAlign: 'center', padding: '1rem', background: '#f0f9ff', borderRadius: '0.5rem', border: '1px solid #0ea5e9' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0369a1', marginBottom: '0.25rem' }}>
                      {thesisDocument.totalWordCount.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#0369a1' }}>Total Words</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '1rem', background: '#f0fdf4', borderRadius: '0.5rem', border: '1px solid #22c55e' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#15803d', marginBottom: '0.25rem' }}>
                      {thesisDocument.sections.length}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#15803d' }}>Sections</div>
                  </div>
                </div>
                
                <div style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{
                    width: `${thesisDocument.completionPercentage}%`,
                    height: '100%',
                    backgroundColor: getCompletionColor(thesisDocument.completionPercentage),
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>

              <div style={{ 
                background: 'white', 
                padding: '2rem', 
                borderRadius: '0.75rem', 
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
                  📋 Sections
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {thesisSections.map((section) => {
                    const sectionData = thesisDocument.sections.find(s => s.id === section.id);
                    return (
                      <div
                        key={section.id}
                        onClick={() => setSelectedSection(section.id)}
                        style={{
                          padding: '1rem',
                          border: selectedSection === section.id ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                          borderRadius: '0.5rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          backgroundColor: selectedSection === section.id ? '#f0f9ff' : 'white'
                        }}
                        onMouseOver={(e) => {
                          if (selectedSection !== section.id) {
                            e.currentTarget.style.borderColor = '#3b82f6';
                            e.currentTarget.style.backgroundColor = '#f8fafc';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (selectedSection !== section.id) {
                            e.currentTarget.style.borderColor = '#e5e7eb';
                            e.currentTarget.style.backgroundColor = 'white';
                          }
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span style={{ fontSize: '1.25rem' }}>{section.icon}</span>
                            <div>
                              <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                                {section.title}
                              </h3>
                              <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
                                {section.description}
                              </p>
                            </div>
                          </div>
                          <span style={{
                            fontSize: '0.75rem',
                            padding: '0.25rem 0.5rem',
                            backgroundColor: getStatusColor(sectionData?.status || 'draft'),
                            color: 'white',
                            borderRadius: '0.25rem',
                            textTransform: 'capitalize'
                          }}>
                            {sectionData?.status || 'draft'}
                          </span>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6b7280' }}>
                          <span>📝 {sectionData?.wordCount || 0} words</span>
                          {section.wordLimit > 0 && (
                            <span>🎯 {section.wordLimit} limit</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column - Editor */}
            <div>
              {selectedSection ? (
                <div style={{ 
                  background: 'white', 
                  padding: '2rem', 
                  borderRadius: '0.75rem', 
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  marginBottom: '2rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <div>
                      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
                        {thesisSections.find(s => s.id === selectedSection)?.title}
                      </h2>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                        {thesisSections.find(s => s.id === selectedSection)?.description}
                      </p>
                    </div>
                    <button
                      onClick={() => generateAIContent(selectedSection)}
                      disabled={loading}
                      style={{
                        padding: '0.75rem 1rem',
                        background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {loading ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{
                            width: '12px',
                            height: '12px',
                            border: '2px solid transparent',
                            borderTop: '2px solid white',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                          }} />
                          Generating...
                        </div>
                      ) : (
                        '🤖 AI Assist'
                      )}
                    </button>
                  </div>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <textarea
                      value={thesisDocument.sections.find(s => s.id === selectedSection)?.content || ''}
                      onChange={(e) => {
                        setSectionContent(e.target.value);
                        updateSectionContent(selectedSection, e.target.value);
                      }}
                      placeholder="Start writing your section content..."
                      rows={20}
                      style={{
                        width: '100%',
                        padding: '1rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        lineHeight: '1.6',
                        resize: 'vertical',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6b7280' }}>
                    <span>
                      📝 {(thesisDocument.sections.find(s => s.id === selectedSection)?.content || '').split(' ').length} words
                    </span>
                    <span>
                      📅 Last modified: {formatDate(thesisDocument.sections.find(s => s.id === selectedSection)?.lastModified || '')}
                    </span>
                  </div>
                </div>
              ) : (
                <div style={{ 
                  background: 'white', 
                  padding: '4rem 2rem', 
                  borderRadius: '0.75rem', 
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📝</div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                    Select a Section
                  </h3>
                  <p style={{ fontSize: '1rem', color: '#6b7280', margin: 0 }}>
                    Choose a section from the list to start writing
                  </p>
                </div>
              )}

              {/* AI Suggestions */}
              {selectedSection && thesisDocument.sections.find(s => s.id === selectedSection)?.aiSuggestions.length > 0 && (
                <div style={{ 
                  background: 'white', 
                  padding: '2rem', 
                  borderRadius: '0.75rem', 
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>
                    🤖 AI Suggestions
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {thesisDocument.sections.find(s => s.id === selectedSection)?.aiSuggestions.map((suggestion, index) => (
                      <div key={index} style={{
                        padding: '1rem',
                        background: '#f0f9ff',
                        border: '1px solid #0ea5e9',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        color: '#0369a1',
                        lineHeight: '1.4'
                      }}>
                        💡 {suggestion}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
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

export default ThesisWriting;