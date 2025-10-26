import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { apiService } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackendStatus from '../components/BackendStatus';
import { useLanguage } from '../contexts/LanguageContext';

interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: string;
  tokens: number;
  level: string;
}

interface DataHealthCheck {
  totalRows: number;
  totalColumns: number;
  missingValues: number;
  duplicateRows: number;
  dataQualityScore: number;
  issues: string[];
  recommendations: string[];
}

interface Variable {
  id: string;
  name: string;
  type: 'continuous' | 'categorical' | 'ordinal' | 'demographic';
  isDemographic: boolean;
  categories?: string[];
  ranges?: { min: number; max: number; label: string }[];
  description?: string;
}

interface VariableGroup {
  name: string;
  variables: Variable[];
  isDemographic: boolean;
}

interface DemographicMapping {
  key: string;
  label: string;
  selectedColumn?: string;
  ranks?: { name: string; value: string }[];
}

interface ResearchModel {
  variables: Variable[];
  relationships: {
    from: string;
    to: string;
    type: 'direct' | 'moderating' | 'mediating';
    hypothesis: string;
  }[];
}

interface AnalysisResult {
  id: string;
  type: string;
  name: string;
  data: any;
  rLibrary: string;
  interpretation: string;
  significance: boolean;
}

const DataAnalysis: React.FC = () => {
  const { t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<'upload' | 'healthcheck' | 'variables' | 'model' | 'analysis' | 'results'>('upload');
  
  // Data states
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [dataHealthCheck, setDataHealthCheck] = useState<DataHealthCheck | null>(null);
  const [variables, setVariables] = useState<Variable[]>([]);
  const [researchModel, setResearchModel] = useState<ResearchModel>({ variables: [], relationships: [] });
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [selectedAnalyses, setSelectedAnalyses] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Variable grouping states
  const [variableGroups, setVariableGroups] = useState<VariableGroup[]>([]);
  const [demographicMappings, setDemographicMappings] = useState<DemographicMapping[]>([]);

  // Common demographic variables
  const commonDemographics = [
    { name: 'gender', label: 'Giới tính', categories: ['Nam', 'Nữ', 'Khác'] },
    { name: 'age', label: 'Độ tuổi', ranges: [
      { min: 18, max: 25, label: '18-25' },
      { min: 26, max: 35, label: '26-35' },
      { min: 36, max: 45, label: '36-45' },
      { min: 46, max: 55, label: '46-55' },
      { min: 56, max: 65, label: '56-65' }
    ]},
    { name: 'income', label: 'Thu nhập', ranges: [
      { min: 0, max: 10000000, label: 'Dưới 10 triệu' },
      { min: 10000000, max: 20000000, label: '10-20 triệu' },
      { min: 20000000, max: 30000000, label: '20-30 triệu' },
      { min: 30000000, max: 50000000, label: '30-50 triệu' },
      { min: 50000000, max: 999999999, label: 'Trên 50 triệu' }
    ]},
    { name: 'education', label: 'Trình độ học vấn', categories: ['Trung học', 'Cao đẳng', 'Đại học', 'Thạc sĩ', 'Tiến sĩ'] },
    { name: 'occupation', label: 'Nghề nghiệp', categories: ['Sinh viên', 'Nhân viên', 'Quản lý', 'Tự do', 'Khác'] }
  ];

  // Available analyses
  const availableAnalyses = [
    { id: 'descriptive', name: 'Thống kê mô tả', description: 'Mean, SD, Frequency, Percentage', rLibrary: 'psych, summarytools' },
    { id: 'reliability', name: 'Độ tin cậy Cronbach Alpha', description: 'Kiểm tra độ tin cậy thang đo', rLibrary: 'psych' },
    { id: 'correlation', name: 'Tương quan Pearson', description: 'Mối quan hệ tuyến tính giữa các biến', rLibrary: 'corrplot, Hmisc' },
    { id: 'regression', name: 'Hồi quy tuyến tính', description: 'Dự đoán biến phụ thuộc', rLibrary: 'lm, car' },
    { id: 'anova', name: 'Phân tích phương sai ANOVA', description: 'So sánh nhóm', rLibrary: 'aov, car' },
    { id: 't_test', name: 'Kiểm định T-test', description: 'So sánh trung bình', rLibrary: 't.test' },
    { id: 'factor', name: 'Phân tích nhân tố EFA', description: 'Khám phá cấu trúc dữ liệu', rLibrary: 'psych, factanal' },
    { id: 'sem', name: 'Mô hình cấu trúc SEM', description: 'Kiểm định mô hình nghiên cứu', rLibrary: 'lavaan, sem' },
    { id: 'pls_sem', name: 'PLS-SEM', description: 'Mô hình cấu trúc bán phần', rLibrary: 'plspm, semPLS' }
  ];

  useEffect(() => {
    // Check authentication
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Initialize demographic mappings
  useEffect(() => {
    if (demographicMappings.length === 0) {
      setDemographicMappings([
        { key: 'gender', label: 'Giới tính' },
        { key: 'age', label: 'Độ tuổi' },
        { key: 'income', label: 'Thu nhập' },
        { key: 'education', label: 'Trình độ học vấn' },
        { key: 'occupation', label: 'Nghề nghiệp' },
        { key: 'marital_status', label: 'Tình trạng hôn nhân' }
      ]);
    }
  }, []);

  // Auto-group variables when variables change
  useEffect(() => {
    if (variables.length > 0) {
      const groups = getVariableGroups();
      setVariableGroups(groups);
    }
  }, [variables]);

  // Helper function to auto-group variables
  const getVariableGroups = (): VariableGroup[] => {
    const groups: { [key: string]: Variable[] } = {};
    
    variables.forEach(variable => {
      // Extract prefix from variable name (e.g., EM1, EM2 -> EM)
      const match = variable.name.match(/^([A-Za-z]+)\d*$/);
      if (match) {
        const prefix = match[1];
        if (!groups[prefix]) {
          groups[prefix] = [];
        }
        groups[prefix].push(variable);
      } else {
        // Single variables go into individual groups
        if (!groups[variable.name]) {
          groups[variable.name] = [];
        }
        groups[variable.name].push(variable);
      }
    });

    return Object.entries(groups).map(([name, vars]) => ({
      name,
      variables: vars,
      isDemographic: vars.some(v => v.isDemographic)
    }));
  };

  // Variable group management functions
  const handleRenameGroup = (oldName: string, newName: string) => {
    setVariableGroups(prev => prev.map(group => 
      group.name === oldName ? { ...group, name: newName } : group
    ));
  };

  const handleSetGroupAsDemographic = (groupName: string) => {
    setVariableGroups(prev => prev.map(group => 
      group.name === groupName ? { ...group, isDemographic: !group.isDemographic } : group
    ));
    
    // Update variables in the group
    setVariables(prev => prev.map(variable => {
      const group = variableGroups.find(g => g.name === groupName);
      if (group && group.variables.some(v => v.id === variable.id)) {
        return { ...variable, isDemographic: !variable.isDemographic };
      }
      return variable;
    }));
  };

  const handleDeleteGroup = (groupName: string) => {
    const group = variableGroups.find(g => g.name === groupName);
    if (group) {
      // Remove all variables in the group
      setVariables(prev => prev.filter(variable => 
        !group.variables.some(v => v.id === variable.id)
      ));
    }
  };

  const handleRemoveVariableFromGroup = (variableId: string, groupName: string) => {
    setVariables(prev => prev.filter(variable => variable.id !== variableId));
  };

  // Demographic mapping functions
  const handleMapDemographicColumn = (demographicKey: string, columnName: string) => {
    setDemographicMappings(prev => prev.map(mapping => 
      mapping.key === demographicKey ? { ...mapping, selectedColumn: columnName } : mapping
    ));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setIsProcessing(true);

    try {
      // Upload file and get health check
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiService.uploadDataFile(formData);
      
      if (response.success) {
        setDataHealthCheck(response.data.healthCheck);
        setVariables(response.data.variables);
        
        // Initialize variable groups from backend
        if (response.data.groups) {
          const groups: VariableGroup[] = response.data.groups.map((group: any) => ({
            name: group.name,
            variables: group.variables.map((varId: string) => 
              response.data.variables.find((v: Variable) => v.id === varId)
            ).filter(Boolean),
            isDemographic: group.isDemographic
          }));
          setVariableGroups(groups);
        }
        
        setCurrentStep('healthcheck');
      }
    } catch (error) {
      console.error('File upload error:', error);
      
      // Show specific error message based on error type
      if (error instanceof Error) {
        if (error.message.includes('Không thể kết nối đến server backend')) {
          setError('Backend server không chạy. Vui lòng khởi động backend trước khi upload file.');
        } else {
          setError(`Lỗi upload file: ${error.message}`);
        }
      } else {
        setError('Có lỗi xảy ra khi upload file. Vui lòng thử lại.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVariableUpdate = (variableId: string, updates: Partial<Variable>) => {
    setVariables(prev => prev.map(v => 
      v.id === variableId ? { ...v, ...updates } : v
    ));
  };

  const handleAddDemographicVariable = (demographic: any) => {
    const newVariable: Variable = {
      id: `demo_${Date.now()}`,
      name: demographic.name,
      type: 'demographic',
      isDemographic: true,
      categories: demographic.categories,
      ranges: demographic.ranges,
      description: demographic.label
    };
    
    setVariables(prev => [...prev, newVariable]);
  };

  const handleAddCustomVariable = () => {
    const newVariable: Variable = {
      id: `custom_${Date.now()}`,
      name: 'Biến mới',
      type: 'continuous',
      isDemographic: false,
      description: 'Biến tùy chỉnh'
    };
    
    setVariables(prev => [...prev, newVariable]);
  };

  const handleAddRelationship = (from: string, to: string, type: 'direct' | 'moderating' | 'mediating') => {
    const newRelationship = {
      from,
      to,
      type,
      hypothesis: `${from} ảnh hưởng đến ${to}`
    };
    
    setResearchModel(prev => ({
      ...prev,
      relationships: [...prev.relationships, newRelationship]
    }));
  };

  const handleRunAnalysis = async () => {
    if (selectedAnalyses.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      const response = await apiService.runQuantitativeAnalysis({
        variables,
        model: researchModel,
        analyses: selectedAnalyses
      });
      
      if (response.success) {
        setAnalysisResults(response.data.results);
        setCurrentStep('results');
      }
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExportResults = async () => {
    try {
      const response = await apiService.exportAnalysisResults(analysisResults);
      
      if (response.success) {
        // Download file
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'analysis_results.xlsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const renderUploadStep = () => (
    <div style={{ 
      background: 'white', 
      padding: '3rem', 
      borderRadius: '1rem', 
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>📊</div>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
        Tải lên dữ liệu nghiên cứu
      </h2>
      <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '2rem' }}>
        Hệ thống sẽ tự động kiểm tra chất lượng dữ liệu và gợi ý phân tích phù hợp
      </p>
      
      {/* Backend Status Warning */}
      <div style={{
        background: '#fef3c7',
        border: '1px solid #fde68a',
        borderRadius: '0.5rem',
        padding: '1rem',
        marginBottom: '2rem',
        fontSize: '0.875rem',
        color: '#92400e'
      }}>
        <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
          ⚠️ Lưu ý quan trọng
        </div>
        <div>
          Để upload file thành công, Backend Server phải đang chạy. Nếu gặp lỗi "Failed to fetch":
        </div>
        <div style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
          <strong>Cách 1 - Docker (Khuyến nghị):</strong><br/>
          1. Cài đặt Docker Desktop<br/>
          2. Double-click: <code style={{ background: '#f3f4f6', padding: '0.125rem 0.25rem', borderRadius: '0.25rem' }}>start-backend-docker.bat</code><br/>
          <br/>
          <strong>Cách 2 - Python:</strong><br/>
          1. Mở PowerShell/Command Prompt<br/>
          2. Chạy: <code style={{ background: '#f3f4f6', padding: '0.125rem 0.25rem', borderRadius: '0.25rem' }}>cd backend</code><br/>
          3. Chạy: <code style={{ background: '#f3f4f6', padding: '0.125rem 0.25rem', borderRadius: '0.25rem' }}>python main.py</code>
        </div>
      </div>
      
      <div style={{
        border: '2px dashed #d1d5db',
        borderRadius: '0.75rem',
        padding: '3rem',
        marginBottom: '2rem',
        transition: 'all 0.2s ease'
      }}>
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          style={{
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          <div style={{ fontSize: '3rem' }}>📁</div>
          <div style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151' }}>
            Chọn file dữ liệu
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Hỗ trợ: Excel (.xlsx, .xls), CSV (.csv)
          </div>
        </label>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '0.5rem', border: '1px solid #bae6fd' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔍</div>
          <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0369a1' }}>Data Health Check</div>
          <div style={{ fontSize: '0.75rem', color: '#0284c7' }}>Kiểm tra chất lượng tự động</div>
        </div>
        <div style={{ padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '0.5rem', border: '1px solid #bbf7d0' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📋</div>
          <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#059669' }}>Gom nhóm biến</div>
          <div style={{ fontSize: '0.75rem', color: '#047857' }}>Tự động phân loại biến</div>
        </div>
        <div style={{ padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '0.5rem', border: '1px solid #fde68a' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🧮</div>
          <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#d97706' }}>Phân tích định lượng</div>
          <div style={{ fontSize: '0.75rem', color: '#92400e' }}>R integration</div>
        </div>
      </div>
    </div>
  );

  const renderHealthCheckStep = () => (
    <div style={{ 
      background: 'white', 
      padding: '2rem', 
      borderRadius: '0.75rem', 
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      marginBottom: '2rem'
    }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
        🔍 Data Health Check
      </h2>
      
      {dataHealthCheck && (
        <div>
          {/* Quality Score */}
          <div style={{
            background: dataHealthCheck.dataQualityScore >= 80 ? '#f0fdf4' : dataHealthCheck.dataQualityScore >= 60 ? '#fef3c7' : '#fef2f2',
            border: `1px solid ${dataHealthCheck.dataQualityScore >= 80 ? '#bbf7d0' : dataHealthCheck.dataQualityScore >= 60 ? '#fde68a' : '#fecaca'}`,
            borderRadius: '0.5rem',
            padding: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: '600', color: '#1f2937' }}>Chất lượng dữ liệu</span>
              <span style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold',
                color: dataHealthCheck.dataQualityScore >= 80 ? '#059669' : dataHealthCheck.dataQualityScore >= 60 ? '#d97706' : '#dc2626'
              }}>
                {dataHealthCheck.dataQualityScore}%
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
                width: `${dataHealthCheck.dataQualityScore}%`,
                height: '100%',
                backgroundColor: dataHealthCheck.dataQualityScore >= 80 ? '#10b981' : dataHealthCheck.dataQualityScore >= 60 ? '#f59e0b' : '#ef4444',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>

          {/* Data Overview */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>{dataHealthCheck.totalRows}</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Số dòng</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>{dataHealthCheck.totalColumns}</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Số cột</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>{dataHealthCheck.missingValues}</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Giá trị thiếu</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>{dataHealthCheck.duplicateRows}</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Dòng trùng</div>
            </div>
          </div>

          {/* Issues and Recommendations */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#dc2626', marginBottom: '0.5rem' }}>
                ⚠️ Vấn đề cần chú ý
              </h3>
              <ul style={{ fontSize: '0.875rem', color: '#6b7280', paddingLeft: '1rem' }}>
                {dataHealthCheck.issues.map((issue, index) => (
                  <li key={index} style={{ marginBottom: '0.25rem' }}>{issue}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#059669', marginBottom: '0.5rem' }}>
                💡 Khuyến nghị
              </h3>
              <ul style={{ fontSize: '0.875rem', color: '#6b7280', paddingLeft: '1rem' }}>
                {dataHealthCheck.recommendations.map((rec, index) => (
                  <li key={index} style={{ marginBottom: '0.25rem' }}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button
          onClick={() => setCurrentStep('variables')}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          Tiếp tục → Quản lý biến
        </button>
      </div>
    </div>
  );

  const renderVariablesStep = () => (
    <div style={{ 
      background: 'white', 
      padding: '2rem', 
      borderRadius: '0.75rem', 
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      marginBottom: '2rem'
    }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
        📋 Quản lý biến nghiên cứu
      </h2>

      {/* Auto Grouping Section */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>
          🤖 Tự động nhóm biến
        </h3>
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#f0fdf4', 
          border: '1px solid #bbf7d0', 
          borderRadius: '0.5rem',
          marginBottom: '1rem'
        }}>
          <p style={{ fontSize: '0.875rem', color: '#047857', marginBottom: '0.5rem' }}>
            Hệ thống đã tự động nhóm các biến tương tự:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {variableGroups.map((group) => (
              <div key={group.name} style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#dcfce7',
                border: '1px solid #86efac',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#166534'
              }}>
                {group.name} ({group.variables.length} biến)
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Variable Groups Management */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>
          📊 Quản lý nhóm biến
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {variableGroups.map((group) => (
            <div key={group.name} style={{
              padding: '1rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              backgroundColor: '#f9fafb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input
                    type="text"
                    value={group.name}
                    onChange={(e) => handleRenameGroup(group.name, e.target.value)}
                    style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#1f2937',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.25rem',
                      padding: '0.25rem 0.5rem',
                      backgroundColor: 'white'
                    }}
                  />
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    ({group.variables.length} biến)
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleSetGroupAsDemographic(group.name)}
                    style={{
                      padding: '0.25rem 0.75rem',
                      fontSize: '0.75rem',
                      backgroundColor: group.isDemographic ? '#10b981' : '#6b7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.25rem',
                      cursor: 'pointer'
                    }}
                  >
                    {group.isDemographic ? '✓ Nhân khẩu học' : 'Đặt nhân khẩu học'}
                  </button>
                  <button
                    onClick={() => handleDeleteGroup(group.name)}
                    style={{
                      padding: '0.25rem 0.75rem',
                      fontSize: '0.75rem',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.25rem',
                      cursor: 'pointer'
                    }}
                  >
                    Xóa nhóm
                  </button>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {group.variables.map((variable) => (
                  <div key={variable.id} style={{
                    padding: '0.5rem',
                    backgroundColor: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.25rem',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span>{variable.name}</span>
                    <button
                      onClick={() => handleRemoveVariableFromGroup(variable.id, group.name)}
                      style={{
                        padding: '0.125rem',
                        fontSize: '0.75rem',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.125rem',
                        cursor: 'pointer',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Demographics Management */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>
          👥 Quản lý biến nhân khẩu học
        </h3>
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#f0f9ff', 
          border: '1px solid #bae6fd', 
          borderRadius: '0.5rem',
          marginBottom: '1rem'
        }}>
          <p style={{ fontSize: '0.875rem', color: '#0369a1', marginBottom: '1rem' }}>
            Chọn cột tương ứng với từng yếu tố nhân khẩu học:
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            {demographicMappings.map((demo) => (
              <div key={demo.key} style={{
                padding: '0.75rem',
                backgroundColor: 'white',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem'
              }}>
                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  {demo.label}
                </div>
                <select
                  value={demo.selectedColumn || ''}
                  onChange={(e) => handleMapDemographicColumn(demo.key, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.25rem',
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="">-- Chọn cột --</option>
                  {variables.map((variable) => (
                    <option key={variable.id} value={variable.name}>
                      {variable.name}
                    </option>
                  ))}
                </select>
                
                {demo.selectedColumn && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <label style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      Tạo rank/phân loại:
                    </label>
                    <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.25rem' }}>
                      <input
                        type="text"
                        placeholder="Tên rank"
                        style={{
                          flex: 1,
                          padding: '0.25rem',
                          fontSize: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.25rem'
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Giá trị"
                        style={{
                          flex: 1,
                          padding: '0.25rem',
                          fontSize: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.25rem'
                        }}
                      />
                      <button
                        style={{
                          padding: '0.25rem 0.5rem',
                          fontSize: '0.75rem',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.25rem',
                          cursor: 'pointer'
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Variables List */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151' }}>
            Danh sách biến ({variables.length})
          </h3>
          <button
            onClick={handleAddCustomVariable}
            style={{
              padding: '0.5rem 1rem',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'transform 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            + Thêm biến tùy chỉnh
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {variables.map((variable) => (
            <div
              key={variable.id}
              style={{
                padding: '1rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                backgroundColor: variable.isDemographic ? '#f0f9ff' : '#f9fafb'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input
                      type="text"
                      value={variable.name}
                      onChange={(e) => handleVariableUpdate(variable.id, { name: e.target.value })}
                      style={{
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: '#1f2937',
                        border: 'none',
                        background: 'transparent',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        border: '1px solid transparent'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                      onBlur={(e) => e.target.style.borderColor = 'transparent'}
                    />
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      backgroundColor: variable.isDemographic ? '#dbeafe' : '#e5e7eb',
                      color: variable.isDemographic ? '#1e40af' : '#374151',
                      borderRadius: '0.25rem'
                    }}>
                      {variable.isDemographic ? 'Demographic' : variable.type}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <select
                      value={variable.type}
                      onChange={(e) => handleVariableUpdate(variable.id, { type: e.target.value as any })}
                      style={{
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.875rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.25rem',
                        backgroundColor: 'white'
                      }}
                    >
                      <option value="continuous">Liên tục</option>
                      <option value="categorical">Phân loại</option>
                      <option value="ordinal">Thứ bậc</option>
                      <option value="demographic">Nhân khẩu học</option>
                    </select>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                      <input
                        type="checkbox"
                        checked={variable.isDemographic}
                        onChange={(e) => handleVariableUpdate(variable.id, { isDemographic: e.target.checked })}
                      />
                      Biến nhân khẩu học
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button
          onClick={() => setCurrentStep('healthcheck')}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          ← Quay lại
        </button>
        <button
          onClick={() => setCurrentStep('model')}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          Tiếp tục → Mô hình nghiên cứu
        </button>
      </div>
    </div>
  );

  const renderModelStep = () => (
    <div style={{ 
      background: 'white', 
      padding: '2rem', 
      borderRadius: '0.75rem', 
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      marginBottom: '2rem'
    }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
        🧩 Xây dựng mô hình nghiên cứu
      </h2>

      {/* Model Builder */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>
          Mô hình nghiên cứu
        </h3>
        
        {/* Simple model visualization */}
        <div style={{
          padding: '2rem',
          border: '2px dashed #d1d5db',
          borderRadius: '0.75rem',
          textAlign: 'center',
          backgroundColor: '#f9fafb'
        }}>
          <div style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '1rem' }}>
            Mô hình nghiên cứu sẽ được hiển thị ở đây
          </div>
          <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
            Kéo thả các biến để tạo mối quan hệ
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button
          onClick={() => setCurrentStep('variables')}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          ← Quay lại
        </button>
        <button
          onClick={() => setCurrentStep('analysis')}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          Tiếp tục → Phân tích định lượng
        </button>
      </div>
    </div>
  );

  const renderAnalysisStep = () => (
    <div style={{ 
      background: 'white', 
      padding: '2rem', 
      borderRadius: '0.75rem', 
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      marginBottom: '2rem'
    }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
        🧮 Phân tích định lượng
      </h2>

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>
          Chọn các phép phân tích
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {availableAnalyses.map((analysis) => (
            <div
              key={analysis.id}
              style={{
                padding: '1rem',
                border: selectedAnalyses.includes(analysis.id) ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                backgroundColor: selectedAnalyses.includes(analysis.id) ? '#f0f9ff' : 'white',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onClick={() => {
                if (selectedAnalyses.includes(analysis.id)) {
                  setSelectedAnalyses(prev => prev.filter(id => id !== analysis.id));
                } else {
                  setSelectedAnalyses(prev => [...prev, analysis.id]);
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={selectedAnalyses.includes(analysis.id)}
                  onChange={() => {}}
                  style={{ margin: 0 }}
                />
                <div style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937' }}>
                  {analysis.name}
                </div>
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                {analysis.description}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                R Library: {analysis.rLibrary}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button
          onClick={() => setCurrentStep('model')}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          ← Quay lại
        </button>
        <button
          onClick={handleRunAnalysis}
          disabled={selectedAnalyses.length === 0 || isProcessing}
          style={{
            padding: '0.75rem 1.5rem',
            background: selectedAnalyses.length === 0 ? '#9ca3af' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: selectedAnalyses.length === 0 ? 'not-allowed' : 'pointer',
            transition: 'transform 0.2s ease',
            opacity: selectedAnalyses.length === 0 ? 0.6 : 1
          }}
          onMouseOver={(e) => {
            if (selectedAnalyses.length > 0) {
              e.currentTarget.style.transform = 'translateY(-1px)';
            }
          }}
          onMouseOut={(e) => {
            if (selectedAnalyses.length > 0) {
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
        >
          {isProcessing ? 'Đang xử lý...' : `Chạy phân tích (${selectedAnalyses.length})`}
        </button>
      </div>
    </div>
  );

  const renderResultsStep = () => (
    <div style={{ 
      background: 'white', 
      padding: '2rem', 
      borderRadius: '0.75rem', 
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      marginBottom: '2rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
          📈 Kết quả phân tích
        </h2>
        <button
          onClick={handleExportResults}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          📊 Export Excel
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {analysisResults.map((result) => (
          <div
            key={result.id}
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              overflow: 'hidden'
            }}
          >
            <div style={{
              padding: '1rem',
              backgroundColor: '#f8fafc',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>
                  {result.name}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    backgroundColor: result.significance ? '#dcfce7' : '#fef3c7',
                    color: result.significance ? '#166534' : '#92400e',
                    borderRadius: '0.25rem'
                  }}>
                    {result.significance ? 'Có ý nghĩa' : 'Không có ý nghĩa'}
                  </span>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    backgroundColor: '#dbeafe',
                    color: '#1e40af',
                    borderRadius: '0.25rem'
                  }}>
                    R: {result.rLibrary}
                  </span>
                </div>
              </div>
            </div>
            
            <div style={{ padding: '1rem' }}>
              {/* Results table would go here */}
              <div style={{
                padding: '2rem',
                backgroundColor: '#f9fafb',
                borderRadius: '0.5rem',
                textAlign: 'center',
                color: '#6b7280'
              }}>
                Bảng kết quả {result.name} sẽ được hiển thị ở đây
              </div>
              
              <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '0.5rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e40af', marginBottom: '0.5rem' }}>
                  Giải thích kết quả:
                </h4>
                <p style={{ fontSize: '0.875rem', color: '#374151' }}>
                  {result.interpretation}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
        <button
          onClick={() => setCurrentStep('analysis')}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          ← Quay lại
        </button>
        <button
          onClick={() => setCurrentStep('upload')}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          Phân tích mới
        </button>
      </div>
    </div>
  );

  if (!user) {
    return (
      <>
        <Head>
          <title>Data Analysis - NCS Research Platform</title>
          <meta name="description" content="Advanced statistical analysis with R integration for Q1-Q2 research standards" />
        </Head>
        
        <Header user={user} token={token} onLogin={handleLogin} onLogout={handleLogout} />
        
        <div style={{ paddingTop: '80px', padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔒</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
            Cần đăng nhập để sử dụng
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '2rem' }}>
            Vui lòng đăng nhập để truy cập các công cụ phân tích dữ liệu
          </p>
          <Link href="/login" style={{
            padding: '1rem 2rem',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: '500'
          }}>
            Đăng nhập
          </Link>
        </div>
        
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Data Analysis - NCS Research Platform</title>
        <meta name="description" content="Advanced statistical analysis with R integration for Q1-Q2 research standards" />
      </Head>
      
      <Header user={user} token={token} onLogin={handleLogin} onLogout={handleLogout} />
      
      <div style={{ paddingTop: '80px', padding: '2rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Progress Steps */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              {['upload', 'healthcheck', 'variables', 'model', 'analysis', 'results'].map((step, index) => (
                <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '50%',
                    backgroundColor: currentStep === step ? '#3b82f6' : 
                                     ['upload', 'healthcheck', 'variables', 'model', 'analysis', 'results'].indexOf(currentStep) > index ? '#10b981' : '#e5e7eb',
                    color: currentStep === step || ['upload', 'healthcheck', 'variables', 'model', 'analysis', 'results'].indexOf(currentStep) > index ? 'white' : '#9ca3af',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}>
                    {['upload', 'healthcheck', 'variables', 'model', 'analysis', 'results'].indexOf(currentStep) > index ? '✓' : index + 1}
                  </div>
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: currentStep === step ? '#3b82f6' : '#6b7280'
                  }}>
                    {step === 'upload' ? 'Tải dữ liệu' :
                     step === 'healthcheck' ? 'Kiểm tra chất lượng' :
                     step === 'variables' ? 'Quản lý biến' :
                     step === 'model' ? 'Mô hình nghiên cứu' :
                     step === 'analysis' ? 'Phân tích định lượng' :
                     'Kết quả'}
                  </span>
                  {index < 5 && (
                    <div style={{
                      width: '2rem',
                      height: '1px',
                      backgroundColor: ['upload', 'healthcheck', 'variables', 'model', 'analysis', 'results'].indexOf(currentStep) > index ? '#10b981' : '#e5e7eb'
                    }} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          {currentStep === 'upload' && renderUploadStep()}
          {currentStep === 'healthcheck' && renderHealthCheckStep()}
          {currentStep === 'variables' && renderVariablesStep()}
          {currentStep === 'model' && renderModelStep()}
          {currentStep === 'analysis' && renderAnalysisStep()}
          {currentStep === 'results' && renderResultsStep()}
        </div>
      </div>
      
      <BackendStatus onRetry={() => {
        if (currentStep === 'upload' && uploadedFile) {
          handleFileUpload(uploadedFile);
        }
      }} />
      
      <Footer />
    </>
  );
};

export default DataAnalysis;