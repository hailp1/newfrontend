import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { apiService } from '../services/api';

interface Question {
  id: string;
  type: 'single' | 'multiple' | 'scale' | 'text' | 'demographic';
  text: string;
  options?: string[];
  required: boolean;
  scaleMin?: number;
  scaleMax?: number;
  scaleLabels?: { min: string; max: string };
}

interface SurveySettings {
  baseFee: number;
  participantFeeRate: number;
  minRewardPerResponse: number;
  maxRewardPerResponse: number;
  maxParticipants: number;
  surveyExpiryDays: number;
}

const SurveyCreation: React.FC = () => {
  const { t } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [surveySettings, setSurveySettings] = useState<SurveySettings | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Survey form state
  const [surveyTitle, setSurveyTitle] = useState('');
  const [surveyDescription, setSurveyDescription] = useState('');
  const [targetParticipants, setTargetParticipants] = useState(100);
  const [rewardPerResponse, setRewardPerResponse] = useState(10);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    loadSurveySettings();
  }, []);

  const loadSurveySettings = async () => {
    try {
      const response = await apiService.getSurveySettings();
      if (response.success) {
        setSurveySettings(response.data);
      }
    } catch (error) {
      console.error('Failed to load survey settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = (type: Question['type']) => {
    const newQuestion: Question = {
      id: `q_${Date.now()}`,
      type,
      text: '',
      required: true,
      options: type === 'single' || type === 'multiple' ? ['Option 1', 'Option 2'] : undefined,
      scaleMin: type === 'scale' ? 1 : undefined,
      scaleMax: type === 'scale' ? 5 : undefined,
      scaleLabels: type === 'scale' ? { min: 'Strongly Disagree', max: 'Strongly Agree' } : undefined
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const calculateFees = () => {
    if (!surveySettings) return { baseFee: 0, participantFee: 0, totalFee: 0 };
    
    const baseFee = surveySettings.baseFee;
    const participantFee = targetParticipants * surveySettings.participantFeeRate;
    const totalFee = baseFee + participantFee;
    
    return { baseFee, participantFee, totalFee };
  };

  const calculateTotalReward = () => {
    return targetParticipants * rewardPerResponse;
  };

  const handleCreateSurvey = async () => {
    if (!surveyTitle.trim() || questions.length === 0) {
      alert('Please fill in survey title and add at least one question');
      return;
    }

    setIsCreating(true);
    try {
      const surveyData = {
        title: surveyTitle,
        description: surveyDescription,
        questions: questions.map(q => ({
          type: q.type,
          text: q.text,
          required: q.required,
          options: q.options,
          scaleMin: q.scaleMin,
          scaleMax: q.scaleMax,
          scaleLabels: q.scaleLabels
        })),
        targetParticipants,
        rewardPerResponse
      };

      const response = await apiService.createSurvey(surveyData);
      if (response.success) {
        alert('Survey created successfully!');
        // Reset form
        setSurveyTitle('');
        setSurveyDescription('');
        setQuestions([]);
        setTargetParticipants(100);
        setRewardPerResponse(10);
      } else {
        alert(response.error || 'Failed to create survey');
      }
    } catch (error) {
      console.error('Survey creation error:', error);
      alert('Failed to create survey');
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '1.5rem', color: '#6b7280' }}>Loading...</div>
      </div>
    );
  }

  const fees = calculateFees();
  const totalReward = calculateTotalReward();

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          background: 'white', 
          padding: '2rem', 
          borderRadius: '0.75rem', 
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
            📋 Create Survey
          </h1>
          <p style={{ fontSize: '1rem', color: '#6b7280' }}>
            Create a professional survey and distribute it to participants with token rewards
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          {/* Main Form */}
          <div>
            {/* Survey Basic Info */}
            <div style={{ 
              background: 'white', 
              padding: '2rem', 
              borderRadius: '0.75rem', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              marginBottom: '2rem'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
                Survey Information
              </h2>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Survey Title *
                </label>
                <input
                  type="text"
                  value={surveyTitle}
                  onChange={(e) => setSurveyTitle(e.target.value)}
                  placeholder="Enter survey title"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    backgroundColor: 'white'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Description
                </label>
                <textarea
                  value={surveyDescription}
                  onChange={(e) => setSurveyDescription(e.target.value)}
                  placeholder="Describe the purpose and scope of your survey"
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    backgroundColor: 'white',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Target Participants
                  </label>
                  <input
                    type="number"
                    value={targetParticipants}
                    onChange={(e) => setTargetParticipants(parseInt(e.target.value) || 100)}
                    min={1}
                    max={surveySettings?.maxParticipants || 1000}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      backgroundColor: 'white'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Reward per Response (Tokens)
                  </label>
                  <input
                    type="number"
                    value={rewardPerResponse}
                    onChange={(e) => setRewardPerResponse(parseInt(e.target.value) || 10)}
                    min={surveySettings?.minRewardPerResponse || 5}
                    max={surveySettings?.maxRewardPerResponse || 50}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      backgroundColor: 'white'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Questions */}
            <div style={{ 
              background: 'white', 
              padding: '2rem', 
              borderRadius: '0.75rem', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              marginBottom: '2rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
                  Questions ({questions.length})
                </h2>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => addQuestion('single')}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}
                  >
                    + Single Choice
                  </button>
                  <button
                    onClick={() => addQuestion('multiple')}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}
                  >
                    + Multiple Choice
                  </button>
                  <button
                    onClick={() => addQuestion('scale')}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#f59e0b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}
                  >
                    + Scale
                  </button>
                  <button
                    onClick={() => addQuestion('text')}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#8b5cf6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}
                  >
                    + Text
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {questions.map((question, index) => (
                  <div key={question.id} style={{
                    padding: '1.5rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    backgroundColor: '#f9fafb'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151' }}>
                        Question {index + 1} - {question.type}
                      </h3>
                      <button
                        onClick={() => removeQuestion(question.id)}
                        style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          cursor: 'pointer'
                        }}
                      >
                        Remove
                      </button>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                        Question Text *
                      </label>
                      <input
                        type="text"
                        value={question.text}
                        onChange={(e) => updateQuestion(question.id, { text: e.target.value })}
                        placeholder="Enter your question"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.5rem',
                          fontSize: '1rem',
                          backgroundColor: 'white'
                        }}
                      />
                    </div>

                    {(question.type === 'single' || question.type === 'multiple') && (
                      <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                          Options
                        </label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {question.options?.map((option, optionIndex) => (
                            <div key={optionIndex} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...(question.options || [])];
                                  newOptions[optionIndex] = e.target.value;
                                  updateQuestion(question.id, { options: newOptions });
                                }}
                                style={{
                                  flex: 1,
                                  padding: '0.5rem',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '0.375rem',
                                  fontSize: '0.875rem',
                                  backgroundColor: 'white'
                                }}
                              />
                              <button
                                onClick={() => {
                                  const newOptions = question.options?.filter((_, i) => i !== optionIndex);
                                  updateQuestion(question.id, { options: newOptions });
                                }}
                                style={{
                                  padding: '0.25rem',
                                  backgroundColor: '#ef4444',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '0.25rem',
                                  cursor: 'pointer'
                                }}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => {
                              const newOptions = [...(question.options || []), 'New Option'];
                              updateQuestion(question.id, { options: newOptions });
                            }}
                            style={{
                              padding: '0.5rem',
                              backgroundColor: '#6b7280',
                              color: 'white',
                              border: 'none',
                              borderRadius: '0.375rem',
                              fontSize: '0.875rem',
                              cursor: 'pointer',
                              alignSelf: 'flex-start'
                            }}
                          >
                            + Add Option
                          </button>
                        </div>
                      </div>
                    )}

                    {question.type === 'scale' && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                            Min Value
                          </label>
                          <input
                            type="number"
                            value={question.scaleMin || 1}
                            onChange={(e) => updateQuestion(question.id, { scaleMin: parseInt(e.target.value) || 1 })}
                            style={{
                              width: '100%',
                              padding: '0.5rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '0.375rem',
                              fontSize: '0.875rem',
                              backgroundColor: 'white'
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                            Max Value
                          </label>
                          <input
                            type="number"
                            value={question.scaleMax || 5}
                            onChange={(e) => updateQuestion(question.id, { scaleMax: parseInt(e.target.value) || 5 })}
                            style={{
                              width: '100%',
                              padding: '0.5rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '0.375rem',
                              fontSize: '0.875rem',
                              backgroundColor: 'white'
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="checkbox"
                        checked={question.required}
                        onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
                      />
                      <label style={{ fontSize: '0.875rem', color: '#374151' }}>
                        Required question
                      </label>
                    </div>
                  </div>
                ))}

                {questions.length === 0 && (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '3rem', 
                    color: '#6b7280',
                    border: '2px dashed #d1d5db',
                    borderRadius: '0.5rem'
                  }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📝</div>
                    <div style={{ fontSize: '1rem', fontWeight: '500' }}>No questions added yet</div>
                    <div style={{ fontSize: '0.875rem' }}>Click the buttons above to add questions</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Cost Summary */}
            <div style={{ 
              background: 'white', 
              padding: '2rem', 
              borderRadius: '0.75rem', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              marginBottom: '2rem'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
                💰 Cost Summary
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Base Fee</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                    {fees.baseFee} tokens
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Participant Fee</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                    {fees.participantFee.toFixed(1)} tokens
                  </span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '0.75rem',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '0.375rem',
                  border: '1px solid #e5e7eb'
                }}>
                  <span style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937' }}>Total Cost</span>
                  <span style={{ fontSize: '1rem', fontWeight: '600', color: '#dc2626' }}>
                    {fees.totalFee.toFixed(1)} tokens
                  </span>
                </div>
              </div>
            </div>

            {/* Reward Summary */}
            <div style={{ 
              background: 'white', 
              padding: '2rem', 
              borderRadius: '0.75rem', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              marginBottom: '2rem'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
                🎁 Reward Summary
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Per Response</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                    {rewardPerResponse} tokens
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Target Participants</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                    {targetParticipants}
                  </span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '0.75rem',
                  backgroundColor: '#f0fdf4',
                  borderRadius: '0.375rem',
                  border: '1px solid #bbf7d0'
                }}>
                  <span style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937' }}>Total Reward</span>
                  <span style={{ fontSize: '1rem', fontWeight: '600', color: '#059669' }}>
                    {totalReward} tokens
                  </span>
                </div>
              </div>
            </div>

            {/* Create Button */}
            <button
              onClick={handleCreateSurvey}
              disabled={isCreating || !surveyTitle.trim() || questions.length === 0}
              style={{
                width: '100%',
                padding: '1rem',
                backgroundColor: isCreating || !surveyTitle.trim() || questions.length === 0 ? '#9ca3af' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isCreating || !surveyTitle.trim() || questions.length === 0 ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {isCreating ? 'Creating Survey...' : 'Create Survey'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyCreation;
