import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { apiService } from '../services/api';

interface AnalysisRequest {
  type: string;
  data: any;
  parameters: any;
}

interface AnalysisResult {
  type: string;
  results: any;
  interpretation: string;
  recommendations: string[];
  quality_score: number;
  r_code?: string;
  plots?: any[];
}

const AnalysisTools: React.FC = () => {
  const [selectedAnalysis, setSelectedAnalysis] = useState<string>('');
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<any[]>([]);

  const analysisTypes = [
    {
      id: 'sem',
      name: 'Structural Equation Modeling (SEM)',
      description: 'Analyze complex relationships between latent variables',
      icon: '🔗',
      cost: 50,
      requirements: ['CSV file with variables', 'Theoretical model specification']
    },
    {
      id: 'pls-sem',
      name: 'PLS-SEM',
      description: 'Partial Least Squares Structural Equation Modeling',
      icon: '📊',
      cost: 45,
      requirements: ['CSV file with variables', 'Measurement model', 'Structural model']
    },
    {
      id: 'advanced-regression',
      name: 'Advanced Regression',
      description: 'Multiple regression with advanced diagnostics',
      icon: '📈',
      cost: 30,
      requirements: ['CSV file with variables', 'Dependent and independent variables']
    },
    {
      id: 'factor-analysis',
      name: 'Factor Analysis',
      description: 'Exploratory and Confirmatory Factor Analysis',
      icon: '🔍',
      cost: 35,
      requirements: ['CSV file with variables', 'Scale items specification']
    },
    {
      id: 'mediation-moderation',
      name: 'Mediation & Moderation',
      description: 'Test mediation and moderation effects',
      icon: '⚡',
      cost: 40,
      requirements: ['CSV file with variables', 'Variable relationships']
    },
    {
      id: 'cronbach-alpha',
      name: 'Cronbach\'s Alpha',
      description: 'Reliability analysis for scales',
      icon: '🎯',
      cost: 15,
      requirements: ['CSV file with scale items']
    },
    {
      id: 'vif',
      name: 'VIF Analysis',
      description: 'Variance Inflation Factor for multicollinearity',
      icon: '⚠️',
      cost: 20,
      requirements: ['CSV file with variables', 'Regression model variables']
    },
    {
      id: 'anova',
      name: 'ANOVA',
      description: 'Analysis of Variance',
      icon: '📋',
      cost: 25,
      requirements: ['CSV file with variables', 'Categorical and continuous variables']
    }
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setUploadedFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const headers = lines[0].split(',');
        const data = lines.slice(1).map(line => {
          const values = line.split(',');
          const row: any = {};
          headers.forEach((header, index) => {
            row[header.trim()] = values[index]?.trim() || '';
          });
          return row;
        }).filter(row => Object.values(row).some(value => value !== ''));
        
        setFileData(data);
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a CSV file');
    }
  };

  const performAnalysis = async (analysisType: string) => {
    if (!fileData.length) {
      alert('Please upload a CSV file first');
      return;
    }

    setLoading(true);
    try {
      let response;
      
      switch (analysisType) {
        case 'sem':
          response = await apiService.performSemAnalysis({
            data: fileData,
            model_specification: {
              latent_variables: ['construct1', 'construct2'],
              observed_variables: Object.keys(fileData[0]),
              relationships: []
            }
          });
          break;
        case 'pls-sem':
          response = await apiService.performPlsSem({
            data: fileData,
            measurement_model: {},
            structural_model: {}
          });
          break;
        case 'advanced-regression':
          response = await apiService.performAdvancedRegression({
            data: fileData,
            dependent_variable: Object.keys(fileData[0])[0],
            independent_variables: Object.keys(fileData[0]).slice(1)
          });
          break;
        case 'factor-analysis':
          response = await apiService.performFactorAnalysis({
            data: fileData,
            variables: Object.keys(fileData[0]),
            analysis_type: 'exploratory'
          });
          break;
        case 'mediation-moderation':
          response = await apiService.performMediationModeration({
            data: fileData,
            independent_variable: Object.keys(fileData[0])[0],
            dependent_variable: Object.keys(fileData[0])[1],
            mediator: Object.keys(fileData[0])[2],
            moderator: Object.keys(fileData[0])[3]
          });
          break;
        default:
          response = await apiService.performDataAnalysis({
            data: fileData,
            analysis_type: analysisType
          });
      }

      if (response.success && response.data) {
        setAnalysisResults(prev => [...prev, {
          type: analysisType,
          results: response.data.results,
          interpretation: response.data.interpretation,
          recommendations: response.data.recommendations || [],
          quality_score: response.data.quality_score || 85,
          r_code: response.data.r_code,
          plots: response.data.plots
        }]);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportResults = (result: AnalysisResult) => {
    const exportData = {
      analysis_type: result.type,
      results: result.results,
      interpretation: result.interpretation,
      recommendations: result.recommendations,
      quality_score: result.quality_score,
      r_code: result.r_code,
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.type}-analysis-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getAnalysisIcon = (type: string) => {
    const analysis = analysisTypes.find(a => a.id === type);
    return analysis?.icon || '📊';
  };

  const getAnalysisName = (type: string) => {
    const analysis = analysisTypes.find(a => a.id === type);
    return analysis?.name || type;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '2rem' }}>
      <Head>
        <title>Analysis Tools - NCS Research Platform</title>
        <meta name="description" content="Advanced statistical analysis tools with R integration for Q1-Q2 research standards" />
      </Head>
      
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
                🔬 Analysis Tools
              </h1>
              <p style={{ fontSize: '1.2rem', color: '#6b7280' }}>
                Advanced statistical analysis with R integration
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
          {/* Left Column - Analysis Selection */}
          <div>
            {/* File Upload */}
            <div style={{ 
              background: 'white', 
              padding: '2rem', 
              borderRadius: '0.75rem', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              marginBottom: '2rem'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
                📁 Data Upload
              </h2>
              
              <div style={{ marginBottom: '1rem' }}>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem'
                  }}
                />
              </div>
              
              {uploadedFile && (
                <div style={{ 
                  padding: '1rem', 
                  background: '#f0fdf4', 
                  borderRadius: '0.5rem',
                  border: '1px solid #22c55e',
                  marginBottom: '1rem'
                }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#15803d', marginBottom: '0.5rem' }}>
                    ✅ File Uploaded Successfully
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: '#15803d', margin: '0 0 0.5rem 0' }}>
                    <strong>File:</strong> {uploadedFile.name}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#15803d', margin: 0 }}>
                    <strong>Records:</strong> {fileData.length} rows
                  </p>
                </div>
              )}
              
              <div style={{ 
                padding: '1rem', 
                background: '#f0f9ff', 
                borderRadius: '0.5rem',
                border: '1px solid #0ea5e9'
              }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0369a1', marginBottom: '0.5rem' }}>
                  💡 File Requirements
                </h3>
                <ul style={{ fontSize: '0.75rem', color: '#0369a1', margin: 0, paddingLeft: '1rem' }}>
                  <li>CSV format with headers</li>
                  <li>Numeric data for statistical analysis</li>
                  <li>No missing values in key variables</li>
                  <li>Minimum 30 observations recommended</li>
                </ul>
              </div>
            </div>

            {/* Analysis Types */}
            <div style={{ 
              background: 'white', 
              padding: '2rem', 
              borderRadius: '0.75rem', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
                🔬 Analysis Types
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {analysisTypes.map((analysis) => (
                  <div
                    key={analysis.id}
                    onClick={() => setSelectedAnalysis(analysis.id)}
                    style={{
                      padding: '1rem',
                      border: selectedAnalysis === analysis.id ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      backgroundColor: selectedAnalysis === analysis.id ? '#f0f9ff' : 'white'
                    }}
                    onMouseOver={(e) => {
                      if (selectedAnalysis !== analysis.id) {
                        e.currentTarget.style.borderColor = '#3b82f6';
                        e.currentTarget.style.backgroundColor = '#f8fafc';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (selectedAnalysis !== analysis.id) {
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.backgroundColor = 'white';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>{analysis.icon}</span>
                        <div>
                          <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                            {analysis.name}
                          </h3>
                          <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
                            🪙 {analysis.cost} tokens
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.75rem', lineHeight: '1.4' }}>
                      {analysis.description}
                    </p>
                    
                    <div>
                      <h4 style={{ fontSize: '0.75rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                        Requirements:
                      </h4>
                      <ul style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0, paddingLeft: '1rem' }}>
                        {analysis.requirements.map((req, index) => (
                          <li key={index} style={{ marginBottom: '0.25rem' }}>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
              
              {selectedAnalysis && (
                <button
                  onClick={() => performAnalysis(selectedAnalysis)}
                  disabled={!fileData.length || loading}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: (!fileData.length || loading) ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                    fontWeight: '500',
                    cursor: (!fileData.length || loading) ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    marginTop: '1.5rem'
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
                    `Run ${analysisTypes.find(a => a.id === selectedAnalysis)?.name}`
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Right Column - Results */}
          <div>
            {analysisResults.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {analysisResults.map((result, index) => (
                  <div key={index} style={{ 
                    background: 'white', 
                    padding: '2rem', 
                    borderRadius: '0.75rem', 
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '2rem' }}>{getAnalysisIcon(result.type)}</span>
                        <div>
                          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                            {getAnalysisName(result.type)}
                          </h2>
                          <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                            Analysis completed successfully
                          </p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{
                          padding: '0.5rem 1rem',
                          background: '#f0f9ff',
                          color: '#0369a1',
                          border: '1px solid #0ea5e9',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}>
                          Quality: {result.quality_score}%
                        </div>
                        <button
                          onClick={() => exportResults(result)}
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
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>
                          📊 Results
                        </h3>
                        <div style={{ 
                          padding: '1rem', 
                          background: '#f8fafc', 
                          borderRadius: '0.5rem',
                          border: '1px solid #e5e7eb',
                          fontSize: '0.875rem',
                          color: '#374151',
                          fontFamily: 'monospace',
                          whiteSpace: 'pre-wrap',
                          overflow: 'auto',
                          maxHeight: '300px'
                        }}>
                          {JSON.stringify(result.results, null, 2)}
                        </div>
                      </div>
                      
                      <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>
                          💡 Interpretation
                        </h3>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.6', margin: 0 }}>
                          {result.interpretation}
                        </p>
                      </div>
                      
                      {result.recommendations.length > 0 && (
                        <div>
                          <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>
                            🎯 Recommendations
                          </h3>
                          <ul style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0, paddingLeft: '1rem' }}>
                            {result.recommendations.map((recommendation, recIndex) => (
                              <li key={recIndex} style={{ marginBottom: '0.25rem' }}>
                                {recommendation}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {result.r_code && (
                        <div>
                          <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>
                            🔧 R Code
                          </h3>
                          <div style={{ 
                            padding: '1rem', 
                            background: '#1f2937', 
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            color: '#f9fafb',
                            fontFamily: 'monospace',
                            whiteSpace: 'pre-wrap',
                            overflow: 'auto',
                            maxHeight: '300px'
                          }}>
                            {result.r_code}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ 
                background: 'white', 
                padding: '4rem 2rem', 
                borderRadius: '0.75rem', 
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔬</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Ready for Analysis
                </h3>
                <p style={{ fontSize: '1rem', color: '#6b7280', margin: 0 }}>
                  Upload your data and select an analysis type to get started
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Analysis Tips */}
        <div style={{ 
          background: 'white', 
          padding: '2rem', 
          borderRadius: '0.75rem', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginTop: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
            💡 Analysis Tips
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: '#f0f9ff', borderRadius: '0.5rem', border: '1px solid #0ea5e9' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0369a1', marginBottom: '0.5rem' }}>
                🔍 Data Preparation
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#0369a1', margin: 0 }}>
                Ensure your data is clean, complete, and properly formatted before analysis
              </p>
            </div>
            
            <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '0.5rem', border: '1px solid #22c55e' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#15803d', marginBottom: '0.5rem' }}>
                📊 Sample Size
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#15803d', margin: 0 }}>
                Use adequate sample sizes (n≥30) for reliable statistical results
              </p>
            </div>
            
            <div style={{ padding: '1rem', background: '#fef3c7', borderRadius: '0.5rem', border: '1px solid #f59e0b' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#d97706', marginBottom: '0.5rem' }}>
                🎯 Assumptions
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#d97706', margin: 0 }}>
                Check statistical assumptions before interpreting results
              </p>
            </div>
            
            <div style={{ padding: '1rem', background: '#f3f4f6', borderRadius: '0.5rem', border: '1px solid #6b7280' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                🔧 R Integration
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#374151', margin: 0 }}>
                All analyses use R for statistical computing and reproducibility
              </p>
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

export default AnalysisTools;