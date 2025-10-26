import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: string;
  importance: 'critical' | 'important' | 'recommended';
  completed: boolean;
  tips: string[];
}

interface ChecklistCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  items: ChecklistItem[];
}

const QualityChecklist: React.FC = () => {
  const [categories, setCategories] = useState<ChecklistCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [progress, setProgress] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const checklistData: ChecklistCategory[] = [
      {
        id: 'research-design',
        name: 'Research Design',
        description: 'Methodology and research framework quality',
        icon: '🔬',
        items: [
          {
            id: 'clear-objectives',
            title: 'Clear Research Objectives',
            description: 'Research objectives are clearly stated and measurable',
            category: 'research-design',
            importance: 'critical',
            completed: false,
            tips: [
              'Use SMART criteria (Specific, Measurable, Achievable, Relevant, Time-bound)',
              'Ensure objectives align with research questions',
              'Make objectives testable and verifiable'
            ]
          },
          {
            id: 'appropriate-methodology',
            title: 'Appropriate Methodology',
            description: 'Research methodology is suitable for the research questions',
            category: 'research-design',
            importance: 'critical',
            completed: false,
            tips: [
              'Justify methodology choice with literature',
              'Consider mixed-methods approaches when appropriate',
              'Ensure methodology matches research paradigm'
            ]
          },
          {
            id: 'sample-size',
            title: 'Adequate Sample Size',
            description: 'Sample size is sufficient for statistical power',
            category: 'research-design',
            importance: 'critical',
            completed: false,
            tips: [
              'Conduct power analysis for quantitative studies',
              'Use saturation criteria for qualitative studies',
              'Consider effect size and statistical power'
            ]
          },
          {
            id: 'sampling-strategy',
            title: 'Appropriate Sampling Strategy',
            description: 'Sampling method is appropriate and well-justified',
            category: 'research-design',
            importance: 'important',
            completed: false,
            tips: [
              'Use random sampling when possible',
              'Justify non-probability sampling methods',
              'Consider population representativeness'
            ]
          }
        ]
      },
      {
        id: 'literature-review',
        name: 'Literature Review',
        description: 'Comprehensive and critical literature analysis',
        icon: '📚',
        items: [
          {
            id: 'comprehensive-search',
            title: 'Comprehensive Literature Search',
            description: 'Systematic search across multiple databases and sources',
            category: 'literature-review',
            importance: 'critical',
            completed: false,
            tips: [
              'Use multiple academic databases',
              'Include grey literature when relevant',
              'Use appropriate search terms and strategies'
            ]
          },
          {
            id: 'recent-sources',
            title: 'Recent and Relevant Sources',
            description: 'Literature includes recent publications and seminal works',
            category: 'literature-review',
            importance: 'critical',
            completed: false,
            tips: [
              'Include sources from last 5 years',
              'Reference seminal works in the field',
              'Balance historical and current perspectives'
            ]
          },
          {
            id: 'critical-analysis',
            title: 'Critical Analysis of Literature',
            description: 'Literature is critically analyzed, not just summarized',
            category: 'literature-review',
            importance: 'critical',
            completed: false,
            tips: [
              'Identify patterns and contradictions',
              'Critique methodology and findings',
              'Synthesize rather than list studies'
            ]
          },
          {
            id: 'research-gap',
            title: 'Clear Research Gap Identification',
            description: 'Research gap is clearly identified and justified',
            category: 'literature-review',
            importance: 'critical',
            completed: false,
            tips: [
              'Explicitly state what is missing',
              'Justify why the gap is important',
              'Show how your research addresses the gap'
            ]
          }
        ]
      },
      {
        id: 'data-quality',
        name: 'Data Quality',
        description: 'Data collection, analysis, and validation standards',
        icon: '📊',
        items: [
          {
            id: 'data-validity',
            title: 'Data Validity and Reliability',
            description: 'Data collection methods ensure validity and reliability',
            category: 'data-quality',
            importance: 'critical',
            completed: false,
            tips: [
              'Use validated instruments when available',
              'Test reliability with pilot studies',
              'Ensure construct validity'
            ]
          },
          {
            id: 'data-cleaning',
            title: 'Proper Data Cleaning',
            description: 'Data is properly cleaned and prepared for analysis',
            category: 'data-quality',
            importance: 'critical',
            completed: false,
            tips: [
              'Document all data cleaning steps',
              'Handle missing data appropriately',
              'Check for outliers and errors'
            ]
          },
          {
            id: 'statistical-assumptions',
            title: 'Statistical Assumptions Checked',
            description: 'Statistical assumptions are tested and met',
            category: 'data-quality',
            importance: 'critical',
            completed: false,
            tips: [
              'Test normality, homogeneity, independence',
              'Use appropriate transformations if needed',
              'Consider non-parametric alternatives'
            ]
          },
          {
            id: 'effect-size',
            title: 'Effect Size Reporting',
            description: 'Effect sizes are calculated and reported',
            category: 'data-quality',
            importance: 'important',
            completed: false,
            tips: [
              'Report Cohen\'s d, eta-squared, or other appropriate measures',
              'Interpret effect sizes practically',
              'Consider practical significance'
            ]
          }
        ]
      },
      {
        id: 'analysis-quality',
        name: 'Analysis Quality',
        description: 'Statistical analysis rigor and appropriateness',
        icon: '📈',
        items: [
          {
            id: 'appropriate-tests',
            title: 'Appropriate Statistical Tests',
            description: 'Statistical tests are appropriate for the data and research questions',
            category: 'analysis-quality',
            importance: 'critical',
            completed: false,
            tips: [
              'Choose tests based on data type and distribution',
              'Justify test selection',
              'Consider multiple comparison corrections'
            ]
          },
          {
            id: 'significance-level',
            title: 'Appropriate Significance Level',
            description: 'Significance level is appropriate and justified',
            category: 'analysis-quality',
            importance: 'important',
            completed: false,
            tips: [
              'Use α = 0.05 unless justified otherwise',
              'Consider multiple testing corrections',
              'Report exact p-values'
            ]
          },
          {
            id: 'confidence-intervals',
            title: 'Confidence Intervals Reported',
            description: 'Confidence intervals are reported for estimates',
            category: 'analysis-quality',
            importance: 'important',
            completed: false,
            tips: [
              'Report 95% confidence intervals',
              'Interpret intervals in context',
              'Consider precision of estimates'
            ]
          },
          {
            id: 'robustness-checks',
            title: 'Robustness Checks',
            description: 'Robustness checks are performed and reported',
            category: 'analysis-quality',
            importance: 'recommended',
            completed: false,
            tips: [
              'Test sensitivity to outliers',
              'Use alternative specifications',
              'Cross-validate results'
            ]
          }
        ]
      },
      {
        id: 'writing-quality',
        name: 'Writing Quality',
        description: 'Academic writing standards and clarity',
        icon: '📝',
        items: [
          {
            id: 'clear-structure',
            title: 'Clear Structure and Organization',
            description: 'Paper has clear structure and logical flow',
            category: 'writing-quality',
            importance: 'critical',
            completed: false,
            tips: [
              'Use clear headings and subheadings',
              'Ensure logical progression of ideas',
              'Follow journal formatting guidelines'
            ]
          },
          {
            id: 'academic-language',
            title: 'Appropriate Academic Language',
            description: 'Writing uses appropriate academic language and tone',
            category: 'writing-quality',
            importance: 'critical',
            completed: false,
            tips: [
              'Use formal, objective language',
              'Avoid colloquialisms and contractions',
              'Maintain consistent terminology'
            ]
          },
          {
            id: 'grammar-spelling',
            title: 'Grammar and Spelling',
            description: 'Paper is free of grammatical and spelling errors',
            category: 'writing-quality',
            importance: 'critical',
            completed: false,
            tips: [
              'Use grammar checking software',
              'Proofread multiple times',
              'Consider professional editing'
            ]
          },
          {
            id: 'citation-style',
            title: 'Consistent Citation Style',
            description: 'Citations follow consistent style and are accurate',
            category: 'writing-quality',
            importance: 'critical',
            completed: false,
            tips: [
              'Use reference management software',
              'Follow journal citation style',
              'Verify all citations are accurate'
            ]
          }
        ]
      },
      {
        id: 'ethical-considerations',
        name: 'Ethical Considerations',
        description: 'Research ethics and compliance standards',
        icon: '⚖️',
        items: [
          {
            id: 'ethics-approval',
            title: 'Ethics Approval',
            description: 'Research has received appropriate ethics approval',
            category: 'ethical-considerations',
            importance: 'critical',
            completed: false,
            tips: [
              'Obtain IRB/ethics committee approval',
              'Follow institutional guidelines',
              'Document approval process'
            ]
          },
          {
            id: 'informed-consent',
            title: 'Informed Consent',
            description: 'Participants provided informed consent',
            category: 'ethical-considerations',
            importance: 'critical',
            completed: false,
            tips: [
              'Use clear, understandable language',
              'Document consent process',
              'Respect participant autonomy'
            ]
          },
          {
            id: 'data-privacy',
            title: 'Data Privacy and Confidentiality',
            description: 'Data privacy and confidentiality are protected',
            category: 'ethical-considerations',
            importance: 'critical',
            completed: false,
            tips: [
              'Anonymize or pseudonymize data',
              'Secure data storage and transmission',
              'Follow data protection regulations'
            ]
          },
          {
            id: 'conflict-interest',
            title: 'Conflict of Interest Disclosure',
            description: 'Potential conflicts of interest are disclosed',
            category: 'ethical-considerations',
            importance: 'important',
            completed: false,
            tips: [
              'Disclose funding sources',
              'Report any competing interests',
              'Maintain research integrity'
            ]
          }
        ]
      }
    ];

    setCategories(checklistData);
    
    // Calculate initial progress
    const initialProgress: { [key: string]: number } = {};
    checklistData.forEach(category => {
      const completedItems = category.items.filter(item => item.completed).length;
      initialProgress[category.id] = Math.round((completedItems / category.items.length) * 100);
    });
    setProgress(initialProgress);
  }, []);

  const toggleItem = (categoryId: string, itemId: string) => {
    setCategories(prev => prev.map(category => {
      if (category.id === categoryId) {
        const updatedItems = category.items.map(item => {
          if (item.id === itemId) {
            return { ...item, completed: !item.completed };
          }
          return item;
        });
        
        // Update progress
        const completedItems = updatedItems.filter(item => item.completed).length;
        setProgress(prevProgress => ({
          ...prevProgress,
          [categoryId]: Math.round((completedItems / updatedItems.length) * 100)
        }));
        
        return { ...category, items: updatedItems };
      }
      return category;
    }));
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'critical': return '#ef4444';
      case 'important': return '#f59e0b';
      case 'recommended': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return '#10b981';
    if (percentage >= 60) return '#f59e0b';
    if (percentage >= 40) return '#3b82f6';
    return '#ef4444';
  };

  const getOverallProgress = () => {
    const totalItems = categories.reduce((sum, category) => sum + category.items.length, 0);
    const completedItems = categories.reduce((sum, category) => 
      sum + category.items.filter(item => item.completed).length, 0);
    return Math.round((completedItems / totalItems) * 100);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '2rem' }}>
      <Head>
        <title>Quality Checklist - NCS Research Platform</title>
        <meta name="description" content="Comprehensive quality checklist for Q1-Q2 research standards" />
      </Head>
      
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
                ✅ Quality Checklist
              </h1>
              <p style={{ fontSize: '1.2rem', color: '#6b7280' }}>
                Comprehensive checklist for Q1-Q2 research standards
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

        {/* Overall Progress */}
        <div style={{ 
          background: 'white', 
          padding: '2rem', 
          borderRadius: '0.75rem', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
              📊 Overall Progress
            </h2>
            <div style={{
              padding: '0.5rem 1rem',
              background: getProgressColor(getOverallProgress()),
              color: 'white',
              borderRadius: '0.375rem',
              fontSize: '1rem',
              fontWeight: '500'
            }}>
              {getOverallProgress()}% Complete
            </div>
          </div>
          
          <div style={{
            width: '100%',
            height: '12px',
            backgroundColor: '#e5e7eb',
            borderRadius: '6px',
            overflow: 'hidden',
            marginBottom: '1rem'
          }}>
            <div style={{
              width: `${getOverallProgress()}%`,
              height: '100%',
              backgroundColor: getProgressColor(getOverallProgress()),
              transition: 'width 0.3s ease'
            }} />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#f0f9ff', borderRadius: '0.5rem', border: '1px solid #0ea5e9' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0369a1', marginBottom: '0.25rem' }}>
                {categories.reduce((sum, category) => sum + category.items.filter(item => item.completed).length, 0)}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#0369a1' }}>Completed</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#f0fdf4', borderRadius: '0.5rem', border: '1px solid #22c55e' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#15803d', marginBottom: '0.25rem' }}>
                {categories.reduce((sum, category) => sum + category.items.length, 0)}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#15803d' }}>Total Items</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#fef3c7', borderRadius: '0.5rem', border: '1px solid #f59e0b' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#d97706', marginBottom: '0.25rem' }}>
                {categories.reduce((sum, category) => sum + category.items.filter(item => item.importance === 'critical').length, 0)}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#d97706' }}>Critical Items</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#f3f4f6', borderRadius: '0.5rem', border: '1px solid #6b7280' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#374151', marginBottom: '0.25rem' }}>
                {categories.length}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#374151' }}>Categories</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
          {/* Left Column - Categories */}
          <div>
            <div style={{ 
              background: 'white', 
              padding: '2rem', 
              borderRadius: '0.75rem', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
                📋 Quality Categories
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {categories.map((category) => (
                  <div
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    style={{
                      padding: '1rem',
                      border: selectedCategory === category.id ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      backgroundColor: selectedCategory === category.id ? '#f0f9ff' : 'white'
                    }}
                    onMouseOver={(e) => {
                      if (selectedCategory !== category.id) {
                        e.currentTarget.style.borderColor = '#3b82f6';
                        e.currentTarget.style.backgroundColor = '#f8fafc';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (selectedCategory !== category.id) {
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.backgroundColor = 'white';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.25rem' }}>{category.icon}</span>
                        <div>
                          <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                            {category.name}
                          </h3>
                          <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
                            {category.description}
                          </p>
                        </div>
                      </div>
                      <div style={{
                        padding: '0.25rem 0.5rem',
                        background: getProgressColor(progress[category.id] || 0),
                        color: 'white',
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        {progress[category.id] || 0}%
                      </div>
                    </div>
                    
                    <div style={{
                      width: '100%',
                      height: '4px',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '2px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${progress[category.id] || 0}%`,
                        height: '100%',
                        backgroundColor: getProgressColor(progress[category.id] || 0),
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Checklist Items */}
          <div>
            {selectedCategory ? (
              <div style={{ 
                background: 'white', 
                padding: '2rem', 
                borderRadius: '0.75rem', 
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                marginBottom: '2rem'
              }}>
                {(() => {
                  const category = categories.find(c => c.id === selectedCategory);
                  if (!category) return null;

                  return (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <span style={{ fontSize: '2rem' }}>{category.icon}</span>
                        <div>
                          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
                            {category.name}
                          </h2>
                          <p style={{ fontSize: '1rem', color: '#6b7280', margin: 0 }}>
                            {category.description}
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {category.items.map((item) => (
                          <div key={item.id} style={{
                            padding: '1rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.5rem',
                            backgroundColor: item.completed ? '#f0fdf4' : 'white'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                              <input
                                type="checkbox"
                                checked={item.completed}
                                onChange={() => toggleItem(category.id, item.id)}
                                style={{ marginTop: '0.25rem' }}
                              />
                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                  <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                                    {item.title}
                                  </h3>
                                  <span style={{
                                    fontSize: '0.75rem',
                                    padding: '0.125rem 0.375rem',
                                    backgroundColor: getImportanceColor(item.importance),
                                    color: 'white',
                                    borderRadius: '0.25rem',
                                    textTransform: 'capitalize'
                                  }}>
                                    {item.importance}
                                  </span>
                                </div>
                                
                                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.75rem', lineHeight: '1.4' }}>
                                  {item.description}
                                </p>
                                
                                <div>
                                  <h4 style={{ fontSize: '0.75rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                                    💡 Tips:
                                  </h4>
                                  <ul style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0, paddingLeft: '1rem' }}>
                                    {item.tips.map((tip, index) => (
                                      <li key={index} style={{ marginBottom: '0.25rem' }}>
                                        {tip}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
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
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Select a Category
                </h3>
                <p style={{ fontSize: '1rem', color: '#6b7280', margin: 0 }}>
                  Choose a quality category to view detailed checklist items
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quality Standards */}
        <div style={{ 
          background: 'white', 
          padding: '2rem', 
          borderRadius: '0.75rem', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginTop: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
            🏆 Q1-Q2 Quality Standards
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: '#fef2f2', borderRadius: '0.5rem', border: '1px solid #ef4444' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#dc2626', marginBottom: '0.5rem' }}>
                🔴 Critical Items
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#dc2626', margin: 0 }}>
                Must be completed for Q1-Q2 publication standards
              </p>
            </div>
            
            <div style={{ padding: '1rem', background: '#fef3c7', borderRadius: '0.5rem', border: '1px solid #f59e0b' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#d97706', marginBottom: '0.5rem' }}>
                🟡 Important Items
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#d97706', margin: 0 }}>
                Strongly recommended for high-quality research
              </p>
            </div>
            
            <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '0.5rem', border: '1px solid #22c55e' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#15803d', marginBottom: '0.5rem' }}>
                🟢 Recommended Items
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#15803d', margin: 0 }}>
                Best practices for excellent research quality
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualityChecklist;