import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { apiService } from '../services/api';

interface ProposalData {
  title: string;
  abstract: string;
  researchArea: string;
  methodology: string;
  objectives: string[];
  researchQuestions: string[];
  timeline: string;
  budget: string;
  team: string[];
  targetJournal: string;
  keywords: string[];
  literatureReview: string;
  expectedOutcomes: string[];
  impact: string;
  ethics: string;
}

interface GeneratedProposal {
  title: string;
  abstract: string;
  introduction: string;
  literature_review: string;
  methodology: string;
  timeline: string;
  budget: string;
  expected_outcomes: string[];
  impact_statement: string;
  references: string[];
  word_count: number;
  quality_score: number;
}

const ProposalGenerator: React.FC = () => {
  const [proposalData, setProposalData] = useState<ProposalData>({
    title: '',
    abstract: '',
    researchArea: '',
    methodology: '',
    objectives: [],
    researchQuestions: [],
    timeline: '',
    budget: '',
    team: [],
    targetJournal: '',
    keywords: [],
    literatureReview: '',
    expectedOutcomes: [],
    impact: '',
    ethics: ''
  });

  const [generatedProposal, setGeneratedProposal] = useState<GeneratedProposal | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState('');

  const researchAreas = [
    'Economics', 'Business Administration', 'Marketing', 'Finance', 'Management',
    'International Business', 'Consumer Behavior', 'Strategic Management',
    'Organizational Behavior', 'Human Resource Management', 'Operations Research',
    'Information Systems', 'Entrepreneurship', 'Public Policy', 'Social Sciences'
  ];

  const methodologies = [
    'Quantitative Research', 'Qualitative Research', 'Mixed Methods', 'Experimental Design',
    'Survey Research', 'Case Study', 'Longitudinal Study', 'Cross-sectional Study',
    'Meta-analysis', 'Systematic Review', 'Content Analysis', 'Statistical Modeling',
    'Machine Learning', 'Big Data Analytics', 'Network Analysis'
  ];

  const targetJournals = [
    'Journal of Business Research (Q1)', 'Journal of Marketing (Q1)', 'Strategic Management Journal (Q1)',
    'Academy of Management Journal (Q1)', 'Journal of International Business Studies (Q1)',
    'Marketing Science (Q1)', 'Management Science (Q1)', 'Organization Science (Q1)',
    'Journal of Consumer Research (Q1)', 'Journal of Marketing Research (Q1)',
    'Journal of Business Ethics (Q1)', 'International Journal of Research in Marketing (Q1)',
    'Journal of Economic Psychology (Q1)', 'Journal of Business Venturing (Q1)',
    'Technovation (Q1)', 'Research Policy (Q1)', 'Journal of Product Innovation Management (Q1)'
  ];

  const steps = [
    { id: 1, title: 'Basic Information', description: 'Title, abstract, and research area' },
    { id: 2, title: 'Research Design', description: 'Methodology, objectives, and questions' },
    { id: 3, title: 'Project Details', description: 'Timeline, budget, and team' },
    { id: 4, title: 'Literature & Impact', description: 'Literature review and expected outcomes' },
    { id: 5, title: 'Generate Proposal', description: 'Review and generate final proposal' }
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

  const handleInputChange = (field: keyof ProposalData, value: any) => {
    setProposalData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayAdd = (field: keyof ProposalData, value: string) => {
    if (!value.trim()) return;
    setProposalData(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[]), value.trim()]
    }));
  };

  const handleArrayRemove = (field: keyof ProposalData, index: number) => {
    setProposalData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  const handleGenerateProposal = async () => {
    setLoading(true);
    try {
      const response = await apiService.generateProposal(proposalData);

      if (response.success && response.data) {
        setGeneratedProposal(response.data);
      }
    } catch (error) {
      console.error('Proposal generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportProposal = () => {
    if (!generatedProposal) return;

    const exportData = {
      proposal_data: proposalData,
      generated_proposal: generatedProposal,
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `research-proposal-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderStep1 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
          Basic Information
        </h3>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          Provide the fundamental details of your research proposal
        </p>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
          Research Title *
        </label>
        <input
          type="text"
          value={proposalData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Enter a clear and descriptive research title"
          required
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '0.875rem'
          }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
          Abstract *
        </label>
        <textarea
          value={proposalData.abstract}
          onChange={(e) => handleInputChange('abstract', e.target.value)}
          placeholder="Provide a comprehensive abstract (150-300 words) describing your research problem, methodology, and expected outcomes"
          required
          rows={6}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            resize: 'vertical'
          }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
          Research Area *
        </label>
        <select
          value={proposalData.researchArea}
          onChange={(e) => handleInputChange('researchArea', e.target.value)}
          required
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            backgroundColor: 'white'
          }}
        >
          <option value="">Select Research Area</option>
          {researchAreas.map((area) => (
            <option key={area} value={area}>{area}</option>
          ))}
        </select>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
          Target Journal *
        </label>
        <select
          value={proposalData.targetJournal}
          onChange={(e) => handleInputChange('targetJournal', e.target.value)}
          required
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            backgroundColor: 'white'
          }}
        >
          <option value="">Select Target Journal</option>
          {targetJournals.map((journal) => (
            <option key={journal} value={journal}>{journal}</option>
          ))}
        </select>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
          Research Design
        </h3>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          Define your research methodology, objectives, and questions
        </p>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
          Research Methodology *
        </label>
        <select
          value={proposalData.methodology}
          onChange={(e) => handleInputChange('methodology', e.target.value)}
          required
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            backgroundColor: 'white'
          }}
        >
          <option value="">Select Methodology</option>
          {methodologies.map((method) => (
            <option key={method} value={method}>{method}</option>
          ))}
        </select>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
          Research Objectives *
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.5rem' }}>
          {proposalData.objectives.map((objective, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#6b7280', minWidth: '20px' }}>
                {index + 1}.
              </span>
              <input
                type="text"
                value={objective}
                onChange={(e) => {
                  const newObjectives = [...proposalData.objectives];
                  newObjectives[index] = e.target.value;
                  handleInputChange('objectives', newObjectives);
                }}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem'
                }}
              />
              <button
                onClick={() => handleArrayRemove('objectives', index)}
                style={{
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.25rem',
                  padding: '0.25rem 0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.75rem'
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            placeholder="Add new objective"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleArrayAdd('objectives', e.currentTarget.value);
                e.currentTarget.value = '';
              }
            }}
            style={{
              flex: 1,
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem'
            }}
          />
          <button
            onClick={(e) => {
              const input = e.currentTarget.previousElementSibling as HTMLInputElement;
              handleArrayAdd('objectives', input.value);
              input.value = '';
            }}
            style={{
              padding: '0.5rem 1rem',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            Add
          </button>
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
          Research Questions *
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.5rem' }}>
          {proposalData.researchQuestions.map((question, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#6b7280', minWidth: '20px' }}>
                Q{index + 1}.
              </span>
              <input
                type="text"
                value={question}
                onChange={(e) => {
                  const newQuestions = [...proposalData.researchQuestions];
                  newQuestions[index] = e.target.value;
                  handleInputChange('researchQuestions', newQuestions);
                }}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem'
                }}
              />
              <button
                onClick={() => handleArrayRemove('researchQuestions', index)}
                style={{
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.25rem',
                  padding: '0.25rem 0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.75rem'
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            placeholder="Add new research question"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleArrayAdd('researchQuestions', e.currentTarget.value);
                e.currentTarget.value = '';
              }
            }}
            style={{
              flex: 1,
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem'
            }}
          />
          <button
            onClick={(e) => {
              const input = e.currentTarget.previousElementSibling as HTMLInputElement;
              handleArrayAdd('researchQuestions', input.value);
              input.value = '';
            }}
            style={{
              padding: '0.5rem 1rem',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
          Project Details
        </h3>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          Specify timeline, budget, and team composition
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Timeline *
          </label>
          <select
            value={proposalData.timeline}
            onChange={(e) => handleInputChange('timeline', e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              backgroundColor: 'white'
            }}
          >
            <option value="">Select Timeline</option>
            <option value="6 months">6 months</option>
            <option value="1 year">1 year</option>
            <option value="18 months">18 months</option>
            <option value="2 years">2 years</option>
            <option value="3 years">3 years</option>
            <option value="5 years">5 years</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Budget
          </label>
          <input
            type="text"
            value={proposalData.budget}
            onChange={(e) => handleInputChange('budget', e.target.value)}
            placeholder="e.g., $50,000 or €40,000"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem'
            }}
          />
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
          Research Team
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.5rem' }}>
          {proposalData.team.map((member, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="text"
                value={member}
                onChange={(e) => {
                  const newTeam = [...proposalData.team];
                  newTeam[index] = e.target.value;
                  handleInputChange('team', newTeam);
                }}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem'
                }}
              />
              <button
                onClick={() => handleArrayRemove('team', index)}
                style={{
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.25rem',
                  padding: '0.25rem 0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.75rem'
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            placeholder="Add team member (Name, Role, Institution)"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleArrayAdd('team', e.currentTarget.value);
                e.currentTarget.value = '';
              }
            }}
            style={{
              flex: 1,
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem'
            }}
          />
          <button
            onClick={(e) => {
              const input = e.currentTarget.previousElementSibling as HTMLInputElement;
              handleArrayAdd('team', input.value);
              input.value = '';
            }}
            style={{
              padding: '0.5rem 1rem',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
          Literature & Impact
        </h3>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          Provide literature review summary and expected outcomes
        </p>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
          Literature Review Summary
        </label>
        <textarea
          value={proposalData.literatureReview}
          onChange={(e) => handleInputChange('literatureReview', e.target.value)}
          placeholder="Summarize key literature, identify research gaps, and position your study within existing knowledge"
          rows={6}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            resize: 'vertical'
          }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
          Expected Outcomes *
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.5rem' }}>
          {proposalData.expectedOutcomes.map((outcome, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#6b7280', minWidth: '20px' }}>
                {index + 1}.
              </span>
              <input
                type="text"
                value={outcome}
                onChange={(e) => {
                  const newOutcomes = [...proposalData.expectedOutcomes];
                  newOutcomes[index] = e.target.value;
                  handleInputChange('expectedOutcomes', newOutcomes);
                }}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem'
                }}
              />
              <button
                onClick={() => handleArrayRemove('expectedOutcomes', index)}
                style={{
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.25rem',
                  padding: '0.25rem 0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.75rem'
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            placeholder="Add expected outcome"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleArrayAdd('expectedOutcomes', e.currentTarget.value);
                e.currentTarget.value = '';
              }
            }}
            style={{
              flex: 1,
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem'
            }}
          />
          <button
            onClick={(e) => {
              const input = e.currentTarget.previousElementSibling as HTMLInputElement;
              handleArrayAdd('expectedOutcomes', input.value);
              input.value = '';
            }}
            style={{
              padding: '0.5rem 1rem',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            Add
          </button>
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
          Expected Impact *
        </label>
        <textarea
          value={proposalData.impact}
          onChange={(e) => handleInputChange('impact', e.target.value)}
          placeholder="Describe the expected impact of your research on theory, practice, policy, or society"
          required
          rows={4}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            resize: 'vertical'
          }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
          Ethical Considerations
        </label>
        <textarea
          value={proposalData.ethics}
          onChange={(e) => handleInputChange('ethics', e.target.value)}
          placeholder="Describe any ethical considerations, data protection measures, or IRB requirements"
          rows={3}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            resize: 'vertical'
          }}
        />
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
          Review & Generate
        </h3>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          Review your information and generate the final proposal
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>
            Proposal Summary
          </h4>
          <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
            <p style={{ fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>
              <strong>Title:</strong> {proposalData.title}
            </p>
            <p style={{ fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>
              <strong>Area:</strong> {proposalData.researchArea}
            </p>
            <p style={{ fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>
              <strong>Methodology:</strong> {proposalData.methodology}
            </p>
            <p style={{ fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>
              <strong>Timeline:</strong> {proposalData.timeline}
            </p>
            <p style={{ fontSize: '0.875rem', margin: '0' }}>
              <strong>Target Journal:</strong> {proposalData.targetJournal}
            </p>
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>
            Research Objectives
          </h4>
          <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
            {proposalData.objectives.map((objective, index) => (
              <p key={index} style={{ fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>
                {index + 1}. {objective}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '0.5rem', border: '1px solid #22c55e' }}>
        <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#15803d', marginBottom: '0.5rem' }}>
          🎯 AI-Powered Generation
        </h4>
        <p style={{ fontSize: '0.875rem', color: '#15803d', margin: 0 }}>
          Our AI will generate a comprehensive research proposal following Q1-Q2 journal standards, including proper structure, citations, and formatting.
        </p>
      </div>

      <button
        onClick={handleGenerateProposal}
        disabled={loading || !proposalData.title || !proposalData.abstract || !proposalData.researchArea}
        style={{
          width: '100%',
          padding: '0.75rem',
          background: (loading || !proposalData.title || !proposalData.abstract || !proposalData.researchArea) 
            ? '#9ca3af' 
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '0.5rem',
          fontSize: '1rem',
          fontWeight: '500',
          cursor: (loading || !proposalData.title || !proposalData.abstract || !proposalData.researchArea) 
            ? 'not-allowed' 
            : 'pointer',
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
            Generating Proposal...
          </div>
        ) : (
          'Generate Research Proposal'
        )}
      </button>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      default: return renderStep1();
    }
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '2rem' }}>
      <Head>
        <title>Proposal Generator - NCS Research Platform</title>
        <meta name="description" content="AI-powered research proposal generation for Q1-Q2 international standards" />
      </Head>
      
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
                📝 Proposal Generator
              </h1>
              <p style={{ fontSize: '1.2rem', color: '#6b7280' }}>
                AI-powered research proposal generation for Q1-Q2 standards
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

        {/* Progress Steps */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            {steps.map((step, index) => (
              <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: currentStep >= step.id ? '#3b82f6' : '#e5e7eb',
                  color: currentStep >= step.id ? 'white' : '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}>
                  {currentStep > step.id ? '✓' : step.id}
                </div>
                {index < steps.length - 1 && (
                  <div style={{
                    width: '60px',
                    height: '2px',
                    backgroundColor: currentStep > step.id ? '#3b82f6' : '#e5e7eb',
                    transition: 'all 0.3s ease'
                  }} />
                )}
              </div>
            ))}
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
              {steps[currentStep - 1].title}
            </h2>
            <p style={{ fontSize: '1rem', color: '#6b7280', margin: 0 }}>
              {steps[currentStep - 1].description}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          {renderCurrentStep()}
        </div>

        {/* Generated Proposal */}
        {generatedProposal && (
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                📄 Generated Proposal
              </h2>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={exportProposal}
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
                <div style={{
                  padding: '0.5rem 1rem',
                  background: '#f0f9ff',
                  color: '#0369a1',
                  border: '1px solid #0ea5e9',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  Quality: {generatedProposal.quality_score}%
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>
                  {generatedProposal.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.6', margin: 0 }}>
                  {generatedProposal.abstract}
                </p>
              </div>
              
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>
                  Introduction
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.6', margin: 0 }}>
                  {generatedProposal.introduction}
                </p>
              </div>
              
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>
                  Literature Review
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.6', margin: 0 }}>
                  {generatedProposal.literature_review}
                </p>
              </div>
              
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>
                  Methodology
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.6', margin: 0 }}>
                  {generatedProposal.methodology}
                </p>
              </div>
              
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>
                  Expected Outcomes
                </h3>
                <ul style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0, paddingLeft: '1rem' }}>
                  {generatedProposal.expected_outcomes.map((outcome, index) => (
                    <li key={index} style={{ marginBottom: '0.25rem' }}>
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>
                  Impact Statement
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.6', margin: 0 }}>
                  {generatedProposal.impact_statement}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            style={{
              padding: '0.75rem 1.5rem',
              background: currentStep === 1 ? '#9ca3af' : '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            ← Previous
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Step {currentStep} of {steps.length}
            </span>
            <div style={{
              width: '100px',
              height: '4px',
              backgroundColor: '#e5e7eb',
              borderRadius: '2px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${(currentStep / steps.length) * 100}%`,
                height: '100%',
                backgroundColor: '#3b82f6',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>

          {currentStep < 5 ? (
            <button
              onClick={nextStep}
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
              Next →
            </button>
          ) : (
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Ready to generate!
            </div>
          )}
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

export default ProposalGenerator;