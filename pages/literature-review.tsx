import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { apiService } from '../services/api';

interface Paper {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  abstract: string;
  keywords: string[];
  doi: string;
  citations: number;
  impact_factor: number;
  relevance_score: number;
}

interface AnalysisResult {
  summary: string;
  key_findings: string[];
  methodology: string;
  limitations: string[];
  gaps: string[];
  recommendations: string[];
  related_work: Paper[];
}

const LiteratureReview: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Paper[]>([]);
  const [selectedPapers, setSelectedPapers] = useState<Paper[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState('');

  const researchAreas = [
    'Economics', 'Business Administration', 'Marketing', 'Finance', 'Management',
    'International Business', 'Consumer Behavior', 'Strategic Management',
    'Organizational Behavior', 'Human Resource Management', 'Operations Research',
    'Information Systems', 'Entrepreneurship', 'Public Policy', 'Social Sciences'
  ];

  const journals = [
    'Journal of Business Research', 'Journal of Marketing', 'Strategic Management Journal',
    'Academy of Management Journal', 'Journal of International Business Studies',
    'Marketing Science', 'Management Science', 'Organization Science',
    'Journal of Consumer Research', 'Journal of Marketing Research',
    'Journal of Business Ethics', 'International Journal of Research in Marketing',
    'Journal of Economic Psychology', 'Journal of Business Venturing',
    'Technovation', 'Research Policy', 'Journal of Product Innovation Management'
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    }
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    try {
      const response = await apiService.searchPapers({
        query: searchQuery,
        area: researchAreas[0], // Default area
        limit: 20
      });

      if (response.success && response.data) {
        setSearchResults(response.data.papers || []);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handlePaperSelect = (paper: Paper) => {
    setSelectedPapers(prev => {
      const isSelected = prev.some(p => p.id === paper.id);
      if (isSelected) {
        return prev.filter(p => p.id !== paper.id);
      } else {
        return [...prev, paper];
      }
    });
  };

  const handleAnalyzePapers = async () => {
    if (selectedPapers.length === 0) return;

    setLoading(true);
    try {
      const response = await apiService.analyzePapers({
        papers: selectedPapers,
        analysis_type: 'comprehensive'
      });

      if (response.success && response.data) {
        setAnalysisResult(response.data);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReview = async () => {
    if (!analysisResult) return;

    setLoading(true);
    try {
      const response = await apiService.generateReview({
        analysis_result: analysisResult,
        review_type: 'systematic',
        target_journal: journals[0]
      });

      if (response.success && response.data) {
        // Handle review generation result
        console.log('Review generated:', response.data);
      }
    } catch (error) {
      console.error('Review generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportResults = () => {
    const exportData = {
      search_query: searchQuery,
      selected_papers: selectedPapers,
      analysis_result: analysisResult,
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `literature-review-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '2rem' }}>
      <Head>
        <title>Literature Review - NCS Research Platform</title>
        <meta name="description" content="AI-powered literature review and paper analysis for Q1-Q2 research standards" />
      </Head>
      
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
                📚 Literature Review
              </h1>
              <p style={{ fontSize: '1.2rem', color: '#6b7280' }}>
                AI-powered paper search, analysis, and review generation
              </p>
            </div>
            <Link href="/" style={{ 
              color: '#3b82f6', 
              textDecoration: 'none',
              fontSize: '1rem',
              fontWeight: '500'
            }}>
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Left Column - Search & Papers */}
          <div>
            {/* Search Section */}
            <div style={{ 
              background: 'white', 
              padding: '2rem', 
              borderRadius: '0.75rem', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              marginBottom: '2rem'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
                🔍 Search Papers
              </h2>
              
              <div style={{ marginBottom: '1rem' }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter research keywords, topics, or questions..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                    marginBottom: '1rem'
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                
                <button
                  onClick={handleSearch}
                  disabled={!searchQuery.trim() || searchLoading}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: (!searchQuery.trim() || searchLoading) ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                    fontWeight: '500',
                    cursor: (!searchQuery.trim() || searchLoading) ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {searchLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid transparent',
                        borderTop: '2px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                      Searching...
                    </div>
                  ) : (
                    'Search Papers'
                  )}
                </button>
              </div>

              <div style={{ 
                padding: '1rem', 
                background: '#f0f9ff', 
                borderRadius: '0.5rem',
                border: '1px solid #0ea5e9'
              }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0369a1', marginBottom: '0.5rem' }}>
                  💡 Search Tips
                </h3>
                <ul style={{ fontSize: '0.75rem', color: '#0369a1', margin: 0, paddingLeft: '1rem' }}>
                  <li>Use specific keywords and phrases</li>
                  <li>Include methodology terms (e.g., "survey", "experiment")</li>
                  <li>Add time constraints (e.g., "2020-2024")</li>
                  <li>Specify journals or authors if relevant</li>
                </ul>
              </div>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div style={{ 
                background: 'white', 
                padding: '2rem', 
                borderRadius: '0.75rem', 
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                marginBottom: '2rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                    📄 Search Results
                  </h2>
                  <span style={{ 
                    fontSize: '0.875rem', 
                    color: '#6b7280',
                    padding: '0.25rem 0.5rem',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '0.25rem'
                  }}>
                    {searchResults.length} papers found
                  </span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '600px', overflowY: 'auto' }}>
                  {searchResults.map((paper) => (
                    <div
                      key={paper.id}
                      onClick={() => handlePaperSelect(paper)}
                      style={{
                        padding: '1rem',
                        border: selectedPapers.some(p => p.id === paper.id) ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        backgroundColor: selectedPapers.some(p => p.id === paper.id) ? '#f0f9ff' : 'white'
                      }}
                      onMouseOver={(e) => {
                        if (!selectedPapers.some(p => p.id === paper.id)) {
                          e.currentTarget.style.borderColor = '#3b82f6';
                          e.currentTarget.style.backgroundColor = '#f8fafc';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!selectedPapers.some(p => p.id === paper.id)) {
                          e.currentTarget.style.borderColor = '#e5e7eb';
                          e.currentTarget.style.backgroundColor = 'white';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', margin: 0, flex: 1 }}>
                          {paper.title}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                            📊 {paper.relevance_score}%
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                            📈 {paper.citations}
                          </span>
                        </div>
                      </div>
                      
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                        <strong>Authors:</strong> {paper.authors.join(', ')}
                      </p>
                      
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                        <strong>Journal:</strong> {paper.journal} ({paper.year}) - IF: {paper.impact_factor}
                      </p>
                      
                      <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem', lineHeight: '1.4' }}>
                        {paper.abstract.substring(0, 200)}...
                      </p>
                      
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                        {paper.keywords.slice(0, 3).map((keyword, index) => (
                          <span key={index} style={{
                            fontSize: '0.75rem',
                            padding: '0.125rem 0.375rem',
                            backgroundColor: '#f3f4f6',
                            color: '#374151',
                            borderRadius: '0.25rem'
                          }}>
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Papers */}
            {selectedPapers.length > 0 && (
              <div style={{ 
                background: 'white', 
                padding: '2rem', 
                borderRadius: '0.75rem', 
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                    ✅ Selected Papers
                  </h2>
                  <span style={{ 
                    fontSize: '0.875rem', 
                    color: '#6b7280',
                    padding: '0.25rem 0.5rem',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '0.25rem'
                  }}>
                    {selectedPapers.length} selected
                  </span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  {selectedPapers.map((paper) => (
                    <div key={paper.id} style={{
                      padding: '0.75rem',
                      backgroundColor: '#f0f9ff',
                      border: '1px solid #0ea5e9',
                      borderRadius: '0.375rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#0369a1', margin: '0 0 0.25rem 0' }}>
                          {paper.title}
                        </h4>
                        <p style={{ fontSize: '0.75rem', color: '#0369a1', margin: 0 }}>
                          {paper.authors[0]} et al. - {paper.journal} ({paper.year})
                        </p>
                      </div>
                      <button
                        onClick={() => handlePaperSelect(paper)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          fontSize: '1rem',
                          padding: '0.25rem'
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={handleAnalyzePapers}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: loading ? '#9ca3af' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                    fontWeight: '500',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {loading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid transparent',
                        borderTop: '2px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                      Analyzing...
                    </div>
                  ) : (
                    'Analyze Selected Papers'
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Analysis Results */}
          <div>
            {analysisResult && (
              <div style={{ 
                background: 'white', 
                padding: '2rem', 
                borderRadius: '0.75rem', 
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                marginBottom: '2rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                    📊 Analysis Results
                  </h2>
                  <button
                    onClick={exportResults}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                  >
                    📥 Export
                  </button>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>
                      📝 Summary
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.6', margin: 0 }}>
                      {analysisResult.summary}
                    </p>
                  </div>
                  
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>
                      🔍 Key Findings
                    </h3>
                    <ul style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0, paddingLeft: '1rem' }}>
                      {analysisResult.key_findings.map((finding, index) => (
                        <li key={index} style={{ marginBottom: '0.25rem' }}>
                          {finding}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>
                      🔬 Methodology Analysis
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.6', margin: 0 }}>
                      {analysisResult.methodology}
                    </p>
                  </div>
                  
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>
                      ⚠️ Limitations
                    </h3>
                    <ul style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0, paddingLeft: '1rem' }}>
                      {analysisResult.limitations.map((limitation, index) => (
                        <li key={index} style={{ marginBottom: '0.25rem' }}>
                          {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>
                      🔍 Research Gaps
                    </h3>
                    <ul style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0, paddingLeft: '1rem' }}>
                      {analysisResult.gaps.map((gap, index) => (
                        <li key={index} style={{ marginBottom: '0.25rem' }}>
                          {gap}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>
                      💡 Recommendations
                    </h3>
                    <ul style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0, paddingLeft: '1rem' }}>
                      {analysisResult.recommendations.map((recommendation, index) => (
                        <li key={index} style={{ marginBottom: '0.25rem' }}>
                          {recommendation}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
                  <button
                    onClick={handleGenerateReview}
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: loading ? '#9ca3af' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.375rem',
                      fontSize: '1rem',
                      fontWeight: '500',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {loading ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <div style={{
                          width: '16px',
                          height: '16px',
                          border: '2px solid transparent',
                          borderTop: '2px solid white',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }} />
                        Generating Review...
                      </div>
                    ) : (
                      'Generate Literature Review'
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Analysis Tips */}
            <div style={{ 
              background: 'white', 
              padding: '2rem', 
              borderRadius: '0.75rem', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
                💡 Analysis Tips
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ padding: '1rem', background: '#f0f9ff', borderRadius: '0.5rem', border: '1px solid #0ea5e9' }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0369a1', marginBottom: '0.5rem' }}>
                    🔍 Search Strategy
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: '#0369a1', margin: 0 }}>
                    Use multiple search terms and synonyms to capture all relevant papers
                  </p>
                </div>
                
                <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '0.5rem', border: '1px solid #22c55e' }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#15803d', marginBottom: '0.5rem' }}>
                    📊 Quality Assessment
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: '#15803d', margin: 0 }}>
                    Focus on Q1-Q2 journals and recent publications for high-quality analysis
                  </p>
                </div>
                
                <div style={{ padding: '1rem', background: '#fef3c7', borderRadius: '0.5rem', border: '1px solid #f59e0b' }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#d97706', marginBottom: '0.5rem' }}>
                    📝 Review Generation
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: '#d97706', margin: 0 }}>
                    AI-generated reviews provide structure and insights, but require human refinement
                  </p>
                </div>
              </div>
            </div>
          </div>
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

export default LiteratureReview;