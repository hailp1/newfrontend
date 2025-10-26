import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'vi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation data
const translations = {
  en: {
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.submit': 'Submit',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.refresh': 'Refresh',
    'common.download': 'Download',
    'common.upload': 'Upload',
    'common.view': 'View',
    'common.details': 'Details',
    'common.more': 'More',
    'common.less': 'Less',
    'common.all': 'All',
    'common.none': 'None',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.ok': 'OK',
    'common.confirm': 'Confirm',
    'common.warning': 'Warning',
    'common.info': 'Information',
    'common.required': 'Required',
    'common.optional': 'Optional',
    
    // Navigation
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.dataAnalysis': 'Data Analysis',
    'nav.literatureReview': 'Literature Review',
    'nav.proposalGenerator': 'Proposal Generator',
    'nav.thesisWriting': 'Thesis Writing',
    'nav.projectManagement': 'Project Management',
    'nav.analysisTools': 'Analysis Tools',
    'nav.researchWorkflow': 'Research Workflow',
    'nav.qualityChecklist': 'Quality Checklist',
    'nav.impactTracker': 'Impact Tracker',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',
    'nav.admin': 'Admin',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.logout': 'Logout',
    'nav.about': 'About',
    'nav.privacy': 'Privacy Policy',
    'nav.terms': 'Terms of Service',
    'nav.contact': 'Contact',
    
    // Dashboard
    'dashboard.welcome': 'Welcome back, {name}! 👋',
    'dashboard.subtitle': 'Ready to advance your research towards Q1-Q2 publication standards',
    'dashboard.ncsTokens': 'NCS Tokens',
    'dashboard.researchProgress': 'Research Progress',
    'dashboard.currentPhase': 'Current Phase',
    'dashboard.userLevel': 'User Level',
    'dashboard.quickActions': 'Quick Actions - Start Your Research',
    'dashboard.dataAnalysis': 'Data Analysis',
    'dashboard.dataAnalysisDesc': 'Statistical analysis & R integration',
    'dashboard.literatureReview': 'Literature Review',
    'dashboard.literatureReviewDesc': 'AI-powered paper analysis',
    'dashboard.proposalGenerator': 'Proposal Generator',
    'dashboard.proposalGeneratorDesc': 'Research proposal creation',
    'dashboard.thesisWriting': 'Thesis Writing',
    'dashboard.thesisWritingDesc': 'AI-assisted manuscript writing',
    'dashboard.projectManagement': 'Project Management',
    'dashboard.projectManagementDesc': 'Track research progress',
    'dashboard.analysisTools': 'Analysis Tools',
    'dashboard.analysisToolsDesc': 'Advanced statistical tools',
    'dashboard.researchWorkflowProgress': 'Research Workflow Progress',
    'dashboard.currentProject': 'Current Project',
    'dashboard.recentActivities': 'Recent Activities',
    'dashboard.aiInsights': 'AI Insights',
    'dashboard.viewDetails': 'View Details',
    'dashboard.nextMilestone': 'Next milestone: {milestone}',
    'dashboard.progress': 'Progress',
    'dashboard.complete': 'Complete',
    'dashboard.more': 'more',
    
    // Guest Landing
    'landing.welcome': 'Welcome to NCS Research Platform',
    'landing.subtitle': 'The complete research platform for Q1-Q2 international papers in economics, business administration, and marketing. Start your research journey with AI-powered tools and expert guidance.',
    'landing.signIn': 'Sign In',
    'landing.createAccount': 'Create Account',
    'landing.welcomeBonus': 'Get Started with Welcome Bonus',
    'landing.tokens': 'NCS Tokens',
    'landing.tokensDesc': 'Upon registration',
    'landing.aiTools': 'AI Analysis Tools',
    'landing.aiToolsDesc': 'R integration included',
    'landing.literature': 'Literature Review',
    'landing.literatureDesc': 'AI-powered research',
    'landing.writing': 'Writing Assistant',
    'landing.writingDesc': 'Q1-Q2 standards',
    
    // Research Phases
    'phases.literatureReview': 'Literature Review',
    'phases.literatureReviewDesc': 'Comprehensive review of existing literature and gap analysis',
    'phases.researchDesign': 'Research Design',
    'phases.researchDesignDesc': 'Design methodology and research framework',
    'phases.dataCollection': 'Data Collection',
    'phases.dataCollectionDesc': 'Collect and validate research data',
    'phases.dataAnalysis': 'Data Analysis',
    'phases.dataAnalysisDesc': 'Perform statistical analysis using R integration',
    'phases.resultsInterpretation': 'Results Interpretation',
    'phases.resultsInterpretationDesc': 'Interpret findings and validate results',
    'phases.manuscriptWriting': 'Manuscript Writing',
    'phases.manuscriptWritingDesc': 'Write research manuscript following Q1-Q2 standards',
    'phases.peerReview': 'Peer Review',
    'phases.peerReviewDesc': 'Submit for peer review and address feedback',
    'phases.publication': 'Publication',
    'phases.publicationDesc': 'Final publication and dissemination',
    
    // Status
    'status.completed': 'Completed',
    'status.inProgress': 'In Progress',
    'status.pending': 'Pending',
    'status.active': 'Active',
    'status.inactive': 'Inactive',
    
    // User Roles
    'role.researcher': 'Researcher',
    'role.scholar': 'Scholar',
    'role.mentor': 'Mentor',
    'role.editor': 'Editor',
    'role.founder': 'Founder',
    
    // Authentication
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.username': 'Username',
    'auth.fullName': 'Full Name',
    'auth.role': 'Research Role',
    'auth.referralCode': 'Referral Code (Optional)',
    'auth.agreeTerms': 'I agree to the Terms of Service and Privacy Policy',
    'auth.createAccount': 'Create Account',
    'auth.signIn': 'Sign In',
    'auth.alreadyHaveAccount': 'Already have an account?',
    'auth.dontHaveAccount': 'Don\'t have an account?',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.rememberMe': 'Remember Me',
    'auth.welcomeBonus': 'Welcome Bonus',
    'auth.tokensOnRegistration': '100 NCS Tokens upon registration',
    'auth.tokensForProfile': '+50 Tokens for completing profile',
    'auth.tokensForReferral': '+100 Tokens if you have a referral code',
    
    // Quick Login
    'quickLogin.admin': 'Admin Account (admin@ncsresearch.org / admin)',
    'quickLogin.demo': 'Demo Account (demo@ncsresearch.org / demo)',
    'quickLogin.test': 'Test Account (test@example.com / password123)',
    'quickLogin.orQuickLogin': 'Or quick login with:',
    
    // Footer
    'footer.platformFeatures': 'Platform Features',
    'footer.researchTools': 'Research Tools',
    'footer.aiIntegration': 'AI Integration',
    'footer.q1Q2Standards': 'Q1-Q2 Standards',
    'footer.rIntegration': 'R Integration',
    'footer.support': 'Support',
    'footer.documentation': 'Documentation',
    'footer.helpCenter': 'Help Center',
    'footer.community': 'Community',
    'footer.followUs': 'Follow Us',
    'footer.security': 'Security & Performance',
    'footer.sslEncrypted': 'SSL Encrypted',
    'footer.fastLoading': 'Fast Loading',
    'footer.mobileOptimized': 'Mobile Optimized',
    'footer.version': 'Version 2.1.0',
    'footer.lastUpdated': 'Last updated: {date}',
    'footer.backend': 'Backend: http://localhost:8000',
    'footer.copyright': '© {year} NCS Research Platform. All rights reserved.',
    
    // Language
    'language.english': 'English',
    'language.vietnamese': 'Tiếng Việt',
    'language.selectLanguage': 'Select Language',
  },
  vi: {
    // Common
    'common.loading': 'Đang tải...',
    'common.error': 'Lỗi',
    'common.success': 'Thành công',
    'common.cancel': 'Hủy',
    'common.save': 'Lưu',
    'common.delete': 'Xóa',
    'common.edit': 'Chỉnh sửa',
    'common.close': 'Đóng',
    'common.back': 'Quay lại',
    'common.next': 'Tiếp theo',
    'common.previous': 'Trước đó',
    'common.submit': 'Gửi',
    'common.search': 'Tìm kiếm',
    'common.filter': 'Lọc',
    'common.sort': 'Sắp xếp',
    'common.refresh': 'Làm mới',
    'common.download': 'Tải xuống',
    'common.upload': 'Tải lên',
    'common.view': 'Xem',
    'common.details': 'Chi tiết',
    'common.more': 'Thêm',
    'common.less': 'Ít hơn',
    'common.all': 'Tất cả',
    'common.none': 'Không có',
    'common.yes': 'Có',
    'common.no': 'Không',
    'common.ok': 'OK',
    'common.confirm': 'Xác nhận',
    'common.warning': 'Cảnh báo',
    'common.info': 'Thông tin',
    'common.required': 'Bắt buộc',
    'common.optional': 'Tùy chọn',
    
    // Navigation
    'nav.home': 'Trang chủ',
    'nav.dashboard': 'Bảng điều khiển',
    'nav.dataAnalysis': 'Phân tích dữ liệu',
    'nav.literatureReview': 'Tổng quan tài liệu',
    'nav.proposalGenerator': 'Tạo đề xuất',
    'nav.thesisWriting': 'Viết luận văn',
    'nav.projectManagement': 'Quản lý dự án',
    'nav.analysisTools': 'Công cụ phân tích',
    'nav.researchWorkflow': 'Quy trình nghiên cứu',
    'nav.qualityChecklist': 'Danh sách kiểm tra chất lượng',
    'nav.impactTracker': 'Theo dõi tác động',
    'nav.profile': 'Hồ sơ',
    'nav.settings': 'Cài đặt',
    'nav.admin': 'Quản trị',
    'nav.login': 'Đăng nhập',
    'nav.register': 'Đăng ký',
    'nav.logout': 'Đăng xuất',
    'nav.about': 'Giới thiệu',
    'nav.privacy': 'Chính sách bảo mật',
    'nav.terms': 'Điều khoản dịch vụ',
    'nav.contact': 'Liên hệ',
    
    // Dashboard
    'dashboard.welcome': 'Chào mừng trở lại, {name}! 👋',
    'dashboard.subtitle': 'Sẵn sàng nâng cao nghiên cứu của bạn hướng tới tiêu chuẩn xuất bản Q1-Q2',
    'dashboard.ncsTokens': 'NCS Tokens',
    'dashboard.researchProgress': 'Tiến độ nghiên cứu',
    'dashboard.currentPhase': 'Giai đoạn hiện tại',
    'dashboard.userLevel': 'Cấp độ người dùng',
    'dashboard.quickActions': 'Hành động nhanh - Bắt đầu nghiên cứu',
    'dashboard.dataAnalysis': 'Phân tích dữ liệu',
    'dashboard.dataAnalysisDesc': 'Phân tích thống kê & tích hợp R',
    'dashboard.literatureReview': 'Tổng quan tài liệu',
    'dashboard.literatureReviewDesc': 'Phân tích bài báo bằng AI',
    'dashboard.proposalGenerator': 'Tạo đề xuất',
    'dashboard.proposalGeneratorDesc': 'Tạo đề xuất nghiên cứu',
    'dashboard.thesisWriting': 'Viết luận văn',
    'dashboard.thesisWritingDesc': 'Viết bản thảo với hỗ trợ AI',
    'dashboard.projectManagement': 'Quản lý dự án',
    'dashboard.projectManagementDesc': 'Theo dõi tiến độ nghiên cứu',
    'dashboard.analysisTools': 'Công cụ phân tích',
    'dashboard.analysisToolsDesc': 'Công cụ thống kê nâng cao',
    'dashboard.researchWorkflowProgress': 'Tiến độ quy trình nghiên cứu',
    'dashboard.currentProject': 'Dự án hiện tại',
    'dashboard.recentActivities': 'Hoạt động gần đây',
    'dashboard.aiInsights': 'Thông tin AI',
    'dashboard.viewDetails': 'Xem chi tiết',
    'dashboard.nextMilestone': 'Cột mốc tiếp theo: {milestone}',
    'dashboard.progress': 'Tiến độ',
    'dashboard.complete': 'Hoàn thành',
    'dashboard.more': 'thêm',
    
    // Guest Landing
    'landing.welcome': 'Chào mừng đến với NCS Research Platform',
    'landing.subtitle': 'Nền tảng nghiên cứu hoàn chỉnh cho các bài báo quốc tế Q1-Q2 trong kinh tế, quản trị kinh doanh và marketing. Bắt đầu hành trình nghiên cứu của bạn với các công cụ AI và hướng dẫn chuyên gia.',
    'landing.signIn': 'Đăng nhập',
    'landing.createAccount': 'Tạo tài khoản',
    'landing.welcomeBonus': 'Bắt đầu với phần thưởng chào mừng',
    'landing.tokens': 'NCS Tokens',
    'landing.tokensDesc': 'Khi đăng ký',
    'landing.aiTools': 'Công cụ phân tích AI',
    'landing.aiToolsDesc': 'Bao gồm tích hợp R',
    'landing.literature': 'Tổng quan tài liệu',
    'landing.literatureDesc': 'Nghiên cứu bằng AI',
    'landing.writing': 'Trợ lý viết',
    'landing.writingDesc': 'Tiêu chuẩn Q1-Q2',
    
    // Research Phases
    'phases.literatureReview': 'Tổng quan tài liệu',
    'phases.literatureReviewDesc': 'Tổng quan toàn diện về tài liệu hiện có và phân tích khoảng trống',
    'phases.researchDesign': 'Thiết kế nghiên cứu',
    'phases.researchDesignDesc': 'Thiết kế phương pháp và khung nghiên cứu',
    'phases.dataCollection': 'Thu thập dữ liệu',
    'phases.dataCollectionDesc': 'Thu thập và xác thực dữ liệu nghiên cứu',
    'phases.dataAnalysis': 'Phân tích dữ liệu',
    'phases.dataAnalysisDesc': 'Thực hiện phân tích thống kê sử dụng tích hợp R',
    'phases.resultsInterpretation': 'Giải thích kết quả',
    'phases.resultsInterpretationDesc': 'Giải thích phát hiện và xác thực kết quả',
    'phases.manuscriptWriting': 'Viết bản thảo',
    'phases.manuscriptWritingDesc': 'Viết bản thảo nghiên cứu theo tiêu chuẩn Q1-Q2',
    'phases.peerReview': 'Đánh giá đồng nghiệp',
    'phases.peerReviewDesc': 'Gửi để đánh giá đồng nghiệp và giải quyết phản hồi',
    'phases.publication': 'Xuất bản',
    'phases.publicationDesc': 'Xuất bản cuối cùng và phổ biến',
    
    // Status
    'status.completed': 'Hoàn thành',
    'status.inProgress': 'Đang thực hiện',
    'status.pending': 'Chờ xử lý',
    'status.active': 'Hoạt động',
    'status.inactive': 'Không hoạt động',
    
    // User Roles
    'role.researcher': 'Nhà nghiên cứu',
    'role.scholar': 'Học giả',
    'role.mentor': 'Người hướng dẫn',
    'role.editor': 'Biên tập viên',
    'role.founder': 'Người sáng lập',
    
    // Authentication
    'auth.login': 'Đăng nhập',
    'auth.register': 'Đăng ký',
    'auth.email': 'Email',
    'auth.password': 'Mật khẩu',
    'auth.confirmPassword': 'Xác nhận mật khẩu',
    'auth.username': 'Tên người dùng',
    'auth.fullName': 'Họ và tên',
    'auth.role': 'Vai trò nghiên cứu',
    'auth.referralCode': 'Mã giới thiệu (Tùy chọn)',
    'auth.agreeTerms': 'Tôi đồng ý với Điều khoản dịch vụ và Chính sách bảo mật',
    'auth.createAccount': 'Tạo tài khoản',
    'auth.signIn': 'Đăng nhập',
    'auth.alreadyHaveAccount': 'Đã có tài khoản?',
    'auth.dontHaveAccount': 'Chưa có tài khoản?',
    'auth.forgotPassword': 'Quên mật khẩu?',
    'auth.rememberMe': 'Ghi nhớ đăng nhập',
    'auth.welcomeBonus': 'Phần thưởng chào mừng',
    'auth.tokensOnRegistration': '100 NCS Tokens khi đăng ký',
    'auth.tokensForProfile': '+50 Tokens khi hoàn thành hồ sơ',
    'auth.tokensForReferral': '+100 Tokens nếu có mã giới thiệu',
    
    // Quick Login
    'quickLogin.admin': 'Tài khoản Admin (admin@ncsresearch.org / admin)',
    'quickLogin.demo': 'Tài khoản Demo (demo@ncsresearch.org / demo)',
    'quickLogin.test': 'Tài khoản Test (test@example.com / password123)',
    'quickLogin.orQuickLogin': 'Hoặc đăng nhập nhanh với:',
    
    // Footer
    'footer.platformFeatures': 'Tính năng nền tảng',
    'footer.researchTools': 'Công cụ nghiên cứu',
    'footer.aiIntegration': 'Tích hợp AI',
    'footer.q1Q2Standards': 'Tiêu chuẩn Q1-Q2',
    'footer.rIntegration': 'Tích hợp R',
    'footer.support': 'Hỗ trợ',
    'footer.documentation': 'Tài liệu',
    'footer.helpCenter': 'Trung tâm trợ giúp',
    'footer.community': 'Cộng đồng',
    'footer.followUs': 'Theo dõi chúng tôi',
    'footer.security': 'Bảo mật & Hiệu suất',
    'footer.sslEncrypted': 'Mã hóa SSL',
    'footer.fastLoading': 'Tải nhanh',
    'footer.mobileOptimized': 'Tối ưu di động',
    'footer.version': 'Phiên bản 2.1.0',
    'footer.lastUpdated': 'Cập nhật lần cuối: {date}',
    'footer.backend': 'Backend: http://localhost:8000',
    'footer.copyright': '© {year} NCS Research Platform. Tất cả quyền được bảo lưu.',
    
    // Language
    'language.english': 'English',
    'language.vietnamese': 'Tiếng Việt',
    'language.selectLanguage': 'Chọn ngôn ngữ',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // Load saved language from localStorage
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') as Language;
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'vi')) {
        setLanguage(savedLanguage);
      }
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    let translation = translations[language][key as keyof typeof translations[typeof language]] || key;
    
    // Replace parameters in translation
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translation = translation.replace(`{${paramKey}}`, String(paramValue));
      });
    }
    
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
