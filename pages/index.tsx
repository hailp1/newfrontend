import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { apiService } from '../services/api';
import AuthModal from '../components/AuthModal';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';

interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: string;
  tokens: number;
  level: number;
}

interface ResearchPhase {
  id: number;
  name: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  progress: number;
  tasks: string[];
}

interface CurrentProject {
  title: string;
  description: string;
  status: string;
  progress: number;
  nextMilestone: string;
}

interface Activity {
  id: number;
  title: string;
  description: string;
  time: string;
  icon: string;
  unread: boolean;
}

interface AIInsight {
  id: number;
  title: string;
  message: string;
  action: string;
  icon: string;
}

const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>('');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Research phases data
  const [researchPhases] = useState<ResearchPhase[]>([
    {
      id: 1,
      name: 'Literature Review',
      description: 'Comprehensive review of existing literature and gap analysis',
      status: 'in-progress',
      progress: 75,
      tasks: ['Search databases', 'Analyze papers', 'Identify gaps', 'Write review']
    },
    {
      id: 2,
      name: 'Research Design',
      description: 'Design methodology and research framework',
      status: 'pending',
      progress: 25,
      tasks: ['Define variables', 'Choose methods', 'Design framework', 'Validate approach']
    },
    {
      id: 3,
      name: 'Data Collection',
      description: 'Collect and validate research data',
      status: 'pending',
      progress: 0,
      tasks: ['Prepare instruments', 'Collect data', 'Validate data', 'Clean dataset']
    },
    {
      id: 4,
      name: 'Data Analysis',
      description: 'Perform statistical analysis using R integration',
      status: 'pending',
      progress: 0,
      tasks: ['Descriptive analysis', 'Inferential tests', 'Model building', 'Validation']
    },
    {
      id: 5,
      name: 'Results Interpretation',
      description: 'Interpret findings and validate results',
      status: 'pending',
      progress: 0,
      tasks: ['Analyze results', 'Interpret findings', 'Validate conclusions', 'Document insights']
    },
    {
      id: 6,
      name: 'Manuscript Writing',
      description: 'Write research manuscript following Q1-Q2 standards',
      status: 'pending',
      progress: 0,
      tasks: ['Write sections', 'Format paper', 'Cite sources', 'Review content']
    },
    {
      id: 7,
      name: 'Peer Review',
      description: 'Submit for peer review and address feedback',
      status: 'pending',
      progress: 0,
      tasks: ['Submit paper', 'Address reviews', 'Revise manuscript', 'Resubmit']
    },
    {
      id: 8,
      name: 'Publication',
      description: 'Final publication and dissemination',
      status: 'pending',
      progress: 0,
      tasks: ['Final review', 'Publish paper', 'Promote research', 'Track impact']
    }
  ]);

  // Current project data
  const [currentProject] = useState<CurrentProject>({
    title: 'Digital Marketing Impact on Consumer Behavior',
    description: 'Investigating the effects of digital marketing strategies on consumer decision-making processes in e-commerce environments.',
    status: 'Active',
    progress: 35,
    nextMilestone: 'Complete data collection phase'
  });

  // Recent activities data
  const [recentActivities] = useState<Activity[]>([
    {
      id: 1,
      title: 'Literature Review Updated',
      description: 'Added 15 new papers to your literature review',
      time: '2 hours ago',
      icon: '📚',
      unread: true
    },
    {
      id: 2,
      title: 'SEM Analysis Completed',
      description: 'Structural Equation Modeling analysis finished successfully',
      time: '1 day ago',
      icon: '📊',
      unread: true
    },
    {
      id: 3,
      title: 'Proposal Review',
      description: 'Research proposal submitted for review',
      time: '3 days ago',
      icon: '📝',
      unread: false
    },
    {
      id: 4,
      title: 'Data Collection Started',
      description: 'Began collecting survey responses',
      time: '1 week ago',
      icon: '📋',
      unread: false
    }
  ]);

  // AI insights data
  const [aiInsights] = useState<AIInsight[]>([
    {
      id: 1,
      title: 'Research Gap Identified',
      message: 'Based on your literature review, there\'s a significant gap in cross-cultural digital marketing studies.',
      action: 'Explore this gap',
      icon: '🔍'
    },
    {
      id: 2,
      title: 'Methodology Suggestion',
      message: 'Consider using PLS-SEM for your analysis given the exploratory nature of your research.',
      action: 'Learn more',
      icon: '💡'
    },
    {
      id: 3,
      title: 'Journal Recommendation',
      message: 'Based on your research focus, consider submitting to Journal of Business Research or Technovation.',
      action: 'Review journal requirements',
      icon: '📄'
    }
  ]);

  useEffect(() => {
    // Check for stored authentication
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      const onboardingCompleted = localStorage.getItem('onboarding_completed');
      
      if (storedToken && storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setToken(storedToken);
        loadDashboardData(storedToken);
      } else {
        setLoading(false);
      }
      
      // Set onboarding as completed if not set (for demo purposes)
      if (!onboardingCompleted) {
        localStorage.setItem('onboarding_completed', 'true');
      }
    }
  }, []);

  const loadDashboardData = async (authToken: string) => {
    try {
      setLoading(true);
      const response = await apiService.getDashboardData();
      if (response.success) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    setShowAuthModal(false);
    
    // Store in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken('');
    setShowAuthModal(false);
    
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  const handleFeatureClick = (feature: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    // Navigate to feature page
    window.location.href = `/${feature}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'in-progress': return '#3b82f6';
      case 'pending': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'in-progress': return '🔄';
      case 'pending': return '⏳';
      default: return '⏳';
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Head>
        <title>NCS Research Platform - Dashboard</title>
        <meta name="description" content="Complete research platform for Q1-Q2 international papers" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Header user={user} token={token} onLogin={handleLogin} onLogout={handleLogout} />

      <div style={{ paddingTop: '80px', padding: '2rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Welcome Section */}
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
              {t('dashboard.welcome', { name: user ? user.full_name : 'Researcher' })}
            </h1>
            <p style={{ fontSize: '1.2rem', color: '#6b7280' }}>
              {t('dashboard.subtitle')}
            </p>
          </div>

          {/* Stats Cards */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1.5rem', 
            marginBottom: '2rem' 
          }}>
            <div style={{ 
              background: 'white', 
              padding: '1.5rem', 
              borderRadius: '0.75rem', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              borderLeft: '4px solid #3b82f6'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{t('dashboard.ncsTokens')}</p>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>
                    {user ? user.tokens : 0}
                  </p>
                </div>
                <div style={{ fontSize: '2rem' }}>🪙</div>
              </div>
            </div>

            <div style={{ 
              background: 'white', 
              padding: '1.5rem', 
              borderRadius: '0.75rem', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              borderLeft: '4px solid #10b981'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{t('dashboard.researchProgress')}</p>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>
                    {currentProject.progress}%
                  </p>
                </div>
                <div style={{ fontSize: '2rem' }}>📊</div>
              </div>
            </div>

            <div style={{ 
              background: 'white', 
              padding: '1.5rem', 
              borderRadius: '0.75rem', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              borderLeft: '4px solid #f59e0b'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{t('dashboard.currentPhase')}</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>
                    {t('phases.literatureReview')}
                  </p>
                </div>
                <div style={{ fontSize: '2rem' }}>📚</div>
              </div>
            </div>

            <div style={{ 
              background: 'white', 
              padding: '1.5rem', 
              borderRadius: '0.75rem', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              borderLeft: '4px solid #8b5cf6'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{t('dashboard.userLevel')}</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>
                    {user ? t(`role.${String(user.level || 'researcher').toLowerCase()}`) : t('role.researcher')}
                  </p>
                </div>
                <div style={{ fontSize: '2rem' }}>🎓</div>
              </div>
            </div>
          </div>

          {/* Quick Actions - Moved to top for better visibility */}
          <div style={{ 
            background: 'white', 
            padding: '2rem', 
            borderRadius: '0.75rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: '2rem'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
              ⚡ {t('dashboard.quickActions')}
            </h2>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '1rem' 
            }}>
              <button
                onClick={() => handleFeatureClick('data-analysis')}
                style={{
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'transform 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📊</div>
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{t('dashboard.dataAnalysis')}</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>{t('dashboard.dataAnalysisDesc')}</div>
              </button>

              <button
                onClick={() => handleFeatureClick('literature-review')}
                style={{
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'transform 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📚</div>
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{t('dashboard.literatureReview')}</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>{t('dashboard.literatureReviewDesc')}</div>
              </button>

              <button
                onClick={() => handleFeatureClick('proposal-generator')}
                style={{
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'transform 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📝</div>
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{t('dashboard.proposalGenerator')}</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>{t('dashboard.proposalGeneratorDesc')}</div>
              </button>

              <button
                onClick={() => handleFeatureClick('thesis-writing')}
                style={{
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'transform 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>✍️</div>
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{t('dashboard.thesisWriting')}</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>{t('dashboard.thesisWritingDesc')}</div>
              </button>

              <button
                onClick={() => handleFeatureClick('project-management')}
                style={{
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'transform 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📋</div>
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{t('dashboard.projectManagement')}</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>{t('dashboard.projectManagementDesc')}</div>
              </button>

              <button
                onClick={() => handleFeatureClick('analysis-tools')}
                style={{
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'transform 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔬</div>
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{t('dashboard.analysisTools')}</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>{t('dashboard.analysisToolsDesc')}</div>
              </button>
              </div>
          </div>

          {user ? (
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
              {/* Left Column - Research Phases */}
              <div>
                <div style={{ 
                  background: 'white', 
                  padding: '2rem', 
                  borderRadius: '0.75rem', 
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  marginBottom: '2rem'
                }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
                    Research Workflow Progress
                  </h2>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {loading ? (
                      <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                        Loading workflow progress...
                      </div>
                    ) : dashboardData?.workflowProgress ? (
                      Object.entries(dashboardData.workflowProgress).map(([key, phase]: [string, any]) => (
                        <div key={key} style={{
                          padding: '1rem',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.5rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.borderColor = '#3b82f6';
                          e.currentTarget.style.backgroundColor = '#f8fafc';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.borderColor = '#e5e7eb';
                          e.currentTarget.style.backgroundColor = 'white';
                        }}
                        onClick={() => handleFeatureClick('research-workflow')}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <span style={{ fontSize: '1.25rem' }}>
                                {phase.completed ? '✅' : phase.progress > 0 ? '🔄' : '⏳'}
                              </span>
                              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>
                                {key === 'dataCollection' ? 'Data Collection' :
                                 key === 'dataAnalysis' ? 'Data Analysis' :
                                 key === 'modelBuilding' ? 'Model Building' :
                                 key === 'validation' ? 'Validation' :
                                 key === 'publication' ? 'Publication' : key}
                              </h3>
                            </div>
                            <span style={{ 
                              fontSize: '0.875rem', 
                              fontWeight: '500', 
                              color: phase.completed ? '#10b981' : phase.progress > 0 ? '#f59e0b' : '#6b7280',
                              textTransform: 'uppercase'
                            }}>
                              {phase.completed ? 'completed' : phase.progress > 0 ? 'in progress' : 'pending'}
                            </span>
                          </div>

                          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                            {phase.lastActivity ? 
                              `Last activity: ${new Date(phase.lastActivity).toLocaleDateString()}` : 
                              'No activity yet'
                            }
                          </p>
                          
                          <div style={{ marginBottom: '0.75rem' }}>
                            <div style={{ 
                              width: '100%', 
                              height: '6px', 
                              backgroundColor: '#e5e7eb', 
                              borderRadius: '3px',
                              overflow: 'hidden'
                            }}>
                              <div style={{
                                width: `${phase.progress}%`,
                                height: '100%',
                                backgroundColor: phase.completed ? '#10b981' : '#3b82f6',
                                transition: 'width 0.3s ease'
                              }} />
                            </div>
                            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                              {phase.progress}% Complete
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                        No workflow data available
                      </div>
                    )}
                  </div>
                </div>

                {/* Current Project */}
                <div style={{ 
                  background: 'white', 
                  padding: '2rem', 
                  borderRadius: '0.75rem', 
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
                }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
                    Current Project
                  </h2>
                  
                  <div style={{
                    padding: '1.5rem',
                    border: '2px solid #3b82f6',
                    borderRadius: '0.75rem',
                    backgroundColor: '#f8fafc'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>
                        {currentProject.title}
                      </h3>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        {currentProject.status}
                      </span>
                    </div>
                    
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
                      {currentProject.description}
                    </p>
                    
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937' }}>
                          Progress
                        </span>
                        <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#3b82f6' }}>
                          {currentProject.progress}%
                        </span>
                      </div>
                      <div style={{ 
                        width: '100%', 
                        height: '8px', 
                        backgroundColor: '#e5e7eb', 
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${currentProject.progress}%`,
                          height: '100%',
                          backgroundColor: '#3b82f6',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        Next milestone: {currentProject.nextMilestone}
                      </div>
                      <button
                        onClick={() => handleFeatureClick('project-management')}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.375rem',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Recent Activities & AI Insights */}
              <div>
                {/* Recent Activities */}
                <div style={{ 
                  background: 'white', 
                  padding: '2rem', 
                  borderRadius: '0.75rem', 
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  marginBottom: '2rem'
                }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
                    Recent Activities
                  </h2>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {loading ? (
                      <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                        Loading activities...
                      </div>
                    ) : dashboardData?.recentActivities ? (
                      dashboardData.recentActivities.map((activity: any) => (
                        <div key={activity.id} style={{
                          padding: '1rem',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.5rem',
                          backgroundColor: 'white'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                            <div style={{ fontSize: '1.25rem', marginTop: '0.125rem' }}>
                              {activity.type === 'data_upload' ? '📊' : 
                               activity.type === 'analysis' ? '🔬' : 
                               activity.type === 'survey' ? '📋' : '📄'}
                            </div>
                            <div style={{ flex: 1 }}>
                              <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937', marginBottom: '0.25rem' }}>
                                {activity.title}
                              </p>
                              <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                                {activity.description}
                              </p>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                                  {new Date(activity.timestamp).toLocaleDateString()}
                                </span>
                                <span style={{
                                  padding: '0.25rem 0.5rem',
                                  fontSize: '0.75rem',
                                  backgroundColor: activity.status === 'completed' ? '#10b981' : '#f59e0b',
                                  color: 'white',
                                  borderRadius: '0.25rem'
                                }}>
                                  {activity.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                        No recent activities
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Insights */}
                <div style={{ 
                  background: 'white', 
                  padding: '2rem', 
                  borderRadius: '0.75rem', 
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
                }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
                    AI Insights
                  </h2>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {aiInsights.map((insight) => (
                      <div key={insight.id} style={{
                        padding: '1rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        backgroundColor: '#f8fafc'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                          <div style={{ fontSize: '1.25rem', marginTop: '0.125rem' }}>
                            {insight.icon}
                          </div>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937', marginBottom: '0.25rem' }}>
                              {insight.title}
                            </p>
                            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                              {insight.message}
                            </p>
                            <button style={{
                              fontSize: '0.75rem',
                              color: '#3b82f6',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              textDecoration: 'underline'
                            }}>
                              {insight.action}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Guest/Landing Page Content */
            <div style={{ 
              background: 'white', 
              padding: '3rem', 
              borderRadius: '1rem', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🔬</div>
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
                {t('landing.welcome')}
              </h2>
              <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                {t('landing.subtitle')}
              </p>
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/login" style={{
                  padding: '1rem 2rem',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '500',
                  transition: 'transform 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  🔑 {t('landing.signIn')}
                </Link>
                
                <Link href="/register" style={{
                  padding: '1rem 2rem',
                  background: 'transparent',
                  color: '#3b82f6',
                  textDecoration: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '500',
                  border: '2px solid #3b82f6',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#3b82f6';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#3b82f6';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                >
                  ✨ {t('landing.createAccount')}
                </Link>
              </div>
              
              <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                  🎁 {t('landing.welcomeBonus')}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', maxWidth: '800px', margin: '0 auto' }}>
                  <div style={{ padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '0.5rem', border: '1px solid #bbf7d0' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🪙</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#059669' }}>{t('landing.tokens')}</div>
                    <div style={{ fontSize: '0.75rem', color: '#047857' }}>{t('landing.tokensDesc')}</div>
                  </div>
                  <div style={{ padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '0.5rem', border: '1px solid #fde68a' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📊</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#d97706' }}>{t('landing.aiTools')}</div>
                    <div style={{ fontSize: '0.75rem', color: '#92400e' }}>{t('landing.aiToolsDesc')}</div>
                  </div>
                  <div style={{ padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '0.5rem', border: '1px solid #dbeafe' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📚</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e40af' }}>{t('landing.literature')}</div>
                    <div style={{ fontSize: '0.75rem', color: '#1e3a8a' }}>{t('landing.literatureDesc')}</div>
                      </div>
                  <div style={{ padding: '1rem', backgroundColor: '#f3e8ff', borderRadius: '0.5rem', border: '1px solid #e9d5ff' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>✍️</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#7c3aed' }}>{t('landing.writing')}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b21a8' }}>{t('landing.writingDesc')}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      <Footer />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default Dashboard;