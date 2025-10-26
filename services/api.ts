const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      console.log('Making request to:', url);
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('token') && {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }),
          ...options.headers,
        },
        ...options,
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      
      // Handle network errors specifically
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        return {
          success: false,
          error: 'Không thể kết nối đến server backend. Vui lòng kiểm tra xem backend có đang chạy không (http://localhost:8000)',
        };
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Authentication
  async register(userData: {
    username: string;
    email: string;
    password: string;
    full_name: string;
    role: string;
    referral_code?: string;
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: { email: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getProfile(token: string) {
    return this.request('/user/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async getTokens(token: string) {
    return this.request('/user/tokens', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // Tasks
  async getTasks(token: string) {
    return this.request('/tasks', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async completeTask(taskId: string, token: string) {
    return this.request(`/tasks/${taskId}/complete`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // Analysis
  async performAnalysis(data: any) {
    return this.request('/analysis', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Data Analysis methods
  async performDataAnalysis(data: any) {
    return this.request('/analysis/data', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Literature Review methods
  async searchPapers(query: string) {
    return this.request('/literature/search', {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
  }

  async analyzePapers(data: any) {
    return this.request('/literature/analyze', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async generateReview(data: any) {
    return this.request('/literature/generate-review', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Proposal Generator methods
  async generateProposal(data: any) {
    return this.request('/proposal/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Thesis Writing methods
  async generateThesisSection(data: any) {
    return this.request('/thesis/generate-section', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Project Management methods
  async createProject(data: any) {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getProjects() {
    return this.request('/projects', {
      method: 'GET',
    });
  }

  async updateProject(id: string, data: any) {
    return this.request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // R Integration methods
  async performSemAnalysis(data: any) {
    return this.request('/r/sem', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async performPlsSem(data: any) {
    return this.request('/r/pls-sem', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async performAdvancedRegression(data: any) {
    return this.request('/r/advanced-regression', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async performFactorAnalysis(data: any) {
    return this.request('/r/factor-analysis', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async performMediationModeration(data: any) {
    return this.request('/r/mediation-moderation', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Data Analysis specific methods
  async uploadDataFile(formData: FormData) {
    try {
      const url = `${this.baseURL}/data-analysis/upload`;
      console.log('Uploading file to:', url);
      
      // Check if backend is reachable first
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
        
        const healthCheck = await fetch(`${this.baseURL.replace('/api', '')}/api/health`, {
          method: 'GET',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        if (!healthCheck.ok) {
          throw new Error('Backend server is not responding');
        }
      } catch (healthError) {
        console.error('Backend health check failed:', healthError);
        throw new Error('Không thể kết nối đến server backend. Vui lòng kiểm tra xem backend có đang chạy không (http://localhost:8000)');
      }
      
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('File upload failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  async runQuantitativeAnalysis(data: {
    variables: any[];
    model: any;
    analyses: string[];
  }) {
    return this.request('/data-analysis/run-analysis', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async exportAnalysisResults(results: any[]) {
    try {
      const url = `${this.baseURL}/data-analysis/export`;
      console.log('Exporting results to:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ results }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Export error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const blob = await response.blob();
      return {
        success: true,
        data: blob,
      };
    } catch (error) {
      console.error('Export failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Export failed',
      };
    }
  }

  // User Management
  async generateReferralCode() {
    return this.request('/user/generate-referral-code', {
      method: 'POST',
    });
  }

  async transferTokens(data: {
    recipient_email: string;
    amount: number;
    message?: string;
  }) {
    return this.request('/user/transfer-tokens', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async submitLevelUpgrade(data: {
    target_role: string;
    qualifications: string;
    experience: string;
    publications: string;
    motivation: string;
  }) {
    return this.request('/user/submit-upgrade', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getTransferFee() {
    return this.request('/user/transfer-fee');
  }

  // Admin endpoints
  async getAdminUsers() {
    return this.request('/admin/users');
  }

  async getUpgradeRequests() {
    return this.request('/admin/upgrade-requests');
  }

  async getAdminStats() {
    return this.request('/admin/stats');
  }

  async getSystemSettings() {
    return this.request('/admin/settings');
  }

  async updateSystemSettings(settings: any) {
    return this.request('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  async approveUpgrade(requestId: number) {
    return this.request(`/admin/upgrade-requests/${requestId}/approve`, {
      method: 'POST',
    });
  }

  async rejectUpgrade(requestId: number, reason: string) {
    return this.request(`/admin/upgrade-requests/${requestId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async updateUserRole(userId: number, newRole: string) {
    return this.request(`/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role: newRole }),
    });
  }

  // Dashboard data
  async getDashboardData(): Promise<ApiResponse<any>> {
    return this.request('/user/dashboard-data');
  }

  // Survey management
  async getUserSurveys(): Promise<ApiResponse<any>> {
    return this.request('/user/surveys');
  }

  async createSurvey(surveyData: any): Promise<ApiResponse<any>> {
    return this.request('/surveys/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(surveyData),
    });
  }

  // Admin survey settings
  async getSurveySettings(): Promise<ApiResponse<any>> {
    return this.request('/admin/survey-settings');
  }

  async updateSurveySettings(settings: any): Promise<ApiResponse<any>> {
    return this.request('/admin/survey-settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });
  }

  // AI settings
  async getAISettings(): Promise<ApiResponse<any>> {
    return this.request('/ai/settings');
  }

  async updateAISettings(settings: any): Promise<ApiResponse<any>> {
    return this.request('/ai/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export const apiService = new ApiService();
export default apiService;