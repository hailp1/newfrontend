import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

interface ResearchPhase {
  id: string;
  name: string;
  description: string;
  order: number;
  tasks: string[];
  tools: string[];
  deliverables: string[];
  estimatedTime: string;
  tips: string[];
}

const ResearchWorkflow: React.FC = () => {
  const [phases, setPhases] = useState<ResearchPhase[]>([]);
  const [selectedPhase, setSelectedPhase] = useState<string>('');

  useEffect(() => {
    const researchPhases: ResearchPhase[] = [
      {
        id: 'planning',
        name: 'Research Planning',
        description: 'Define research objectives, methodology, and timeline',
        order: 1,
        tasks: [
          'Define research questions',
          'Conduct preliminary literature review',
          'Choose research methodology',
          'Develop research timeline',
          'Identify required resources'
        ],
        tools: [
          'Literature Review Tool',
          'Proposal Generator',
          'Project Management',
          'Research Planning Templates'
        ],
        deliverables: [
          'Research proposal',
          'Methodology framework',
          'Timeline and milestones',
          'Resource requirements'
        ],
        estimatedTime: '2-4 weeks',
        tips: [
          'Start with broad research questions and narrow them down',
          'Consider both theoretical and practical implications',
          'Ensure your research contributes to existing knowledge',
          'Plan for potential challenges and contingencies'
        ]
      },
      {
        id: 'literature',
        name: 'Literature Review',
        description: 'Comprehensive review of existing research and theoretical framework',
        order: 2,
        tasks: [
          'Search academic databases',
          'Analyze relevant papers',
          'Identify research gaps',
          'Develop theoretical framework',
          'Synthesize findings'
        ],
        tools: [
          'Literature Review Tool',
          'Citation Manager',
          'AI Paper Analysis',
          'Reference Generator'
        ],
        deliverables: [
          'Literature review document',
          'Theoretical framework',
          'Research gap analysis',
          'Reference database'
        ],
        estimatedTime: '4-8 weeks',
        tips: [
          'Use multiple databases and search strategies',
          'Focus on recent publications (last 5 years)',
          'Include both seminal and current works',
          'Critically evaluate each source'
        ]
      },
      {
        id: 'methodology',
        name: 'Methodology Design',
        description: 'Design research methodology and data collection procedures',
        order: 3,
        tasks: [
          'Select research design',
          'Define sampling strategy',
          'Develop data collection instruments',
          'Plan data analysis methods',
          'Address ethical considerations'
        ],
        tools: [
          'Methodology Templates',
          'Survey Design Tool',
          'Statistical Analysis Planner',
          'Ethics Review Forms'
        ],
        deliverables: [
          'Methodology chapter',
          'Data collection instruments',
          'Sampling plan',
          'Ethics approval documents'
        ],
        estimatedTime: '3-6 weeks',
        tips: [
          'Choose methodology that best answers your research questions',
          'Ensure methodology is feasible within your constraints',
          'Consider mixed-methods approaches',
          'Plan for data quality and validity'
        ]
      },
      {
        id: 'data-collection',
        name: 'Data Collection',
        description: 'Execute data collection according to methodology',
        order: 4,
        tasks: [
          'Recruit participants',
          'Conduct surveys/interviews',
          'Collect secondary data',
          'Monitor data quality',
          'Manage data storage'
        ],
        tools: [
          'Survey Platform',
          'Interview Scheduler',
          'Data Management System',
          'Quality Control Tools'
        ],
        deliverables: [
          'Raw dataset',
          'Data collection logs',
          'Participant information',
          'Quality control reports'
        ],
        estimatedTime: '6-12 weeks',
        tips: [
          'Maintain detailed records of all activities',
          'Monitor response rates and data quality',
          'Be prepared to adapt if needed',
          'Ensure participant confidentiality'
        ]
      },
      {
        id: 'analysis',
        name: 'Data Analysis',
        description: 'Analyze collected data using appropriate statistical methods',
        order: 5,
        tasks: [
          'Clean and prepare data',
          'Conduct descriptive analysis',
          'Perform inferential analysis',
          'Test hypotheses',
          'Interpret results'
        ],
        tools: [
          'Analysis Tools',
          'Statistical Software',
          'R Integration',
          'Visualization Tools'
        ],
        deliverables: [
          'Analysis results',
          'Statistical outputs',
          'Data visualizations',
          'Interpretation notes'
        ],
        estimatedTime: '4-8 weeks',
        tips: [
          'Start with descriptive statistics',
          'Check assumptions before analysis',
          'Use appropriate statistical tests',
          'Document all analysis steps'
        ]
      },
      {
        id: 'writing',
        name: 'Thesis Writing',
        description: 'Write comprehensive thesis document',
        order: 6,
        tasks: [
          'Write introduction',
          'Complete literature review',
          'Document methodology',
          'Present results',
          'Write discussion and conclusion'
        ],
        tools: [
          'Thesis Writing Assistant',
          'AI Writing Tools',
          'Citation Manager',
          'Formatting Tools'
        ],
        deliverables: [
          'Draft thesis chapters',
          'Complete thesis document',
          'Reference list',
          'Appendices'
        ],
        estimatedTime: '8-12 weeks',
        tips: [
          'Write regularly and consistently',
          'Start with easier sections',
          'Use AI tools for assistance',
          'Seek feedback regularly'
        ]
      },
      {
        id: 'review',
        name: 'Review & Revision',
        description: 'Review, revise, and polish thesis for submission',
        order: 7,
        tasks: [
          'Self-review thesis',
          'Get peer feedback',
          'Revise based on feedback',
          'Proofread and edit',
          'Format for submission'
        ],
        tools: [
          'Quality Checklist',
          'Peer Review System',
          'Editing Tools',
          'Formatting Software'
        ],
        deliverables: [
          'Revised thesis',
          'Feedback reports',
          'Final formatted document',
          'Submission package'
        ],
        estimatedTime: '3-6 weeks',
        tips: [
          'Allow time for multiple revisions',
          'Get feedback from multiple sources',
          'Focus on clarity and coherence',
          'Check formatting requirements'
        ]
      },
      {
        id: 'submission',
        name: 'Submission & Defense',
        description: 'Submit thesis and prepare for defense',
        order: 8,
        tasks: [
          'Submit final thesis',
          'Prepare defense presentation',
          'Practice presentation',
          'Defend thesis',
          'Address committee feedback'
        ],
        tools: [
          'Presentation Tools',
          'Defense Preparation',
          'Submission Portal',
          'Feedback Management'
        ],
        deliverables: [
          'Final thesis submission',
          'Defense presentation',
          'Committee feedback',
          'Final revisions'
        ],
        estimatedTime: '2-4 weeks',
        tips: [
          'Practice presentation multiple times',
          'Anticipate committee questions',
          'Be prepared to defend your work',
          'Stay calm and confident'
        ]
      }
    ];

    setPhases(researchPhases);
  }, []);

  const getPhaseIcon = (phaseId: string) => {
    const icons: { [key: string]: string } = {
      'planning': '🎯',
      'literature': '📚',
      'methodology': '🔬',
      'data-collection': '📊',
      'analysis': '📈',
      'writing': '📝',
      'review': '🔍',
      'submission': '🎓'
    };
    return icons[phaseId] || '📋';
  };

  const getPhaseColor = (order: number) => {
    const colors = ['#ef4444', '#f59e0b', '#eab308', '#22c55e', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6'];
    return colors[(order - 1) % colors.length];
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '2rem' }}>
      <Head>
        <title>Research Workflow Guide - NCS Research Platform</title>
        <meta name="description" content="Complete guide to Q1-Q2 research workflow with 8 phases" />
      </Head>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
                🗺️ Research Workflow Guide
              </h1>
              <p style={{ fontSize: '1.2rem', color: '#6b7280' }}>
                Complete 8-phase guide for Q1-Q2 international research standards
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

        {/* Overview */}
        <div style={{ 
          background: 'white', 
          padding: '2rem', 
          borderRadius: '0.75rem', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
            📋 Research Process Overview
          </h2>
          <p style={{ fontSize: '1rem', color: '#6b7280', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            This comprehensive workflow guides you through the complete research process from initial planning to final submission. 
            Each phase includes specific tasks, recommended tools, expected deliverables, and expert tips to ensure your research 
            meets Q1-Q2 international publication standards.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#f0f9ff', borderRadius: '0.5rem', border: '1px solid #0ea5e9' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0369a1', marginBottom: '0.25rem' }}>8</div>
              <div style={{ fontSize: '0.875rem', color: '#0369a1' }}>Research Phases</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#f0fdf4', borderRadius: '0.5rem', border: '1px solid #22c55e' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#15803d', marginBottom: '0.25rem' }}>32-60</div>
              <div style={{ fontSize: '0.875rem', color: '#15803d' }}>Weeks Total</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#fef3c7', borderRadius: '0.5rem', border: '1px solid #f59e0b' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#d97706', marginBottom: '0.25rem' }}>Q1-Q2</div>
              <div style={{ fontSize: '0.875rem', color: '#d97706' }}>Standards</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#f3f4f6', borderRadius: '0.5rem', border: '1px solid #6b7280' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#374151', marginBottom: '0.25rem' }}>AI</div>
              <div style={{ fontSize: '0.875rem', color: '#374151' }}>Powered Tools</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
          {/* Left Column - Phase List */}
          <div>
            <div style={{ 
              background: 'white', 
              padding: '2rem', 
              borderRadius: '0.75rem', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
                📋 Research Phases
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {phases.map((phase) => (
                  <div
                    key={phase.id}
                    onClick={() => setSelectedPhase(phase.id)}
                    style={{
                      padding: '1rem',
                      border: selectedPhase === phase.id ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      backgroundColor: selectedPhase === phase.id ? '#f0f9ff' : 'white'
                    }}
                    onMouseOver={(e) => {
                      if (selectedPhase !== phase.id) {
                        e.currentTarget.style.borderColor = '#3b82f6';
                        e.currentTarget.style.backgroundColor = '#f8fafc';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (selectedPhase !== phase.id) {
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.backgroundColor = 'white';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: getPhaseColor(phase.order),
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                        fontWeight: 'bold'
                      }}>
                        {phase.order}
                      </div>
                      <span style={{ fontSize: '1.25rem' }}>{getPhaseIcon(phase.id)}</span>
                      <div>
                        <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                          {phase.name}
                        </h3>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
                          {phase.estimatedTime}
                        </p>
                      </div>
                    </div>
                    
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0, lineHeight: '1.4' }}>
                      {phase.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Phase Details */}
          <div>
            {selectedPhase ? (
              <div style={{ 
                background: 'white', 
                padding: '2rem', 
                borderRadius: '0.75rem', 
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                marginBottom: '2rem'
              }}>
                {(() => {
                  const phase = phases.find(p => p.id === selectedPhase);
                  if (!phase) return null;

                  return (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          backgroundColor: getPhaseColor(phase.order),
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.5rem',
                          fontWeight: 'bold'
                        }}>
                          {phase.order}
                        </div>
                        <div>
                          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
                            {phase.name}
                          </h2>
                          <p style={{ fontSize: '1rem', color: '#6b7280', margin: 0 }}>
                            {phase.description}
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                        <div>
                          <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>
                            📋 Tasks
                          </h3>
                          <ul style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0, paddingLeft: '1rem' }}>
                            {phase.tasks.map((task, index) => (
                              <li key={index} style={{ marginBottom: '0.25rem' }}>
                                {task}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>
                            🛠️ Recommended Tools
                          </h3>
                          <ul style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0, paddingLeft: '1rem' }}>
                            {phase.tools.map((tool, index) => (
                              <li key={index} style={{ marginBottom: '0.25rem' }}>
                                {tool}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>
                          📄 Expected Deliverables
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                          {phase.deliverables.map((deliverable, index) => (
                            <div key={index} style={{
                              padding: '0.75rem',
                              background: '#f0f9ff',
                              border: '1px solid #0ea5e9',
                              borderRadius: '0.375rem',
                              fontSize: '0.875rem',
                              color: '#0369a1',
                              textAlign: 'center'
                            }}>
                              {deliverable}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>
                          💡 Expert Tips
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {phase.tips.map((tip, index) => (
                            <div key={index} style={{
                              padding: '1rem',
                              background: '#f0fdf4',
                              border: '1px solid #22c55e',
                              borderRadius: '0.5rem',
                              fontSize: '0.875rem',
                              color: '#15803d',
                              lineHeight: '1.4'
                            }}>
                              💡 {tip}
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            ) : (
              <div style={{ 
                background: 'white', 
                padding: '4rem 2rem', 
                borderRadius: '0.75rem', 
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🗺️</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Select a Phase
                </h3>
                <p style={{ fontSize: '1rem', color: '#6b7280', margin: 0 }}>
                  Choose a research phase to view detailed information, tasks, and tips
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Best Practices */}
        <div style={{ 
          background: 'white', 
          padding: '2rem', 
          borderRadius: '0.75rem', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginTop: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
            🏆 Best Practices for Q1-Q2 Research
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: '#f0f9ff', borderRadius: '0.5rem', border: '1px solid #0ea5e9' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0369a1', marginBottom: '0.5rem' }}>
                🎯 Research Quality
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#0369a1', margin: 0 }}>
                Focus on rigorous methodology, clear contribution, and high-quality data analysis
              </p>
            </div>
            
            <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '0.5rem', border: '1px solid #22c55e' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#15803d', marginBottom: '0.5rem' }}>
                📚 Literature Review
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#15803d', margin: 0 }}>
                Comprehensive review of recent literature with clear gap identification
              </p>
            </div>
            
            <div style={{ padding: '1rem', background: '#fef3c7', borderRadius: '0.5rem', border: '1px solid #f59e0b' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#d97706', marginBottom: '0.5rem' }}>
                🔬 Methodology
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#d97706', margin: 0 }}>
                Robust research design with appropriate statistical methods and validation
              </p>
            </div>
            
            <div style={{ padding: '1rem', background: '#f3f4f6', borderRadius: '0.5rem', border: '1px solid #6b7280' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                📝 Writing Quality
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#374151', margin: 0 }}>
                Clear, concise writing with proper structure and academic language
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchWorkflow;