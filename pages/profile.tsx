import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { apiService } from '../services/api';
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
  level: string;
  referral_code?: string;
  referral_count?: number;
  referral_earnings?: number;
}

interface TransferFee {
  percentage: number;
  minimum_fee: number;
  maximum_fee: number;
}

const Profile: React.FC = () => {
  const { t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Transfer form
  const [transferForm, setTransferForm] = useState({
    recipientEmail: '',
    amount: '',
    message: ''
  });
  
  // Level upgrade form
  const [upgradeForm, setUpgradeForm] = useState({
    targetRole: 'Scholar',
    qualifications: '',
    experience: '',
    publications: '',
    motivation: ''
  });
  
  const [transferFee, setTransferFee] = useState<TransferFee>({
    percentage: 5,
    minimum_fee: 1,
    maximum_fee: 50
  });

  useEffect(() => {
    // Check authentication
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      fetchUserProfile();
      fetchTransferFee();
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await apiService.getProfile(token);
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const fetchTransferFee = async () => {
    try {
      const response = await apiService.getTransferFee();
      if (response.success && response.data) {
        setTransferFee(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch transfer fee:', error);
    }
  };

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

  const generateReferralCode = async () => {
    setLoading(true);
    try {
      const response = await apiService.generateReferralCode();
      if (response.success) {
        setSuccess('Mã giới thiệu đã được tạo thành công!');
        fetchUserProfile(); // Refresh profile
      }
    } catch (error) {
      setError('Không thể tạo mã giới thiệu');
    } finally {
      setLoading(false);
    }
  };

  const handleTokenTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const amount = parseFloat(transferForm.amount);
    const fee = Math.max(
      transferFee.minimum_fee,
      Math.min(transferFee.maximum_fee, amount * transferFee.percentage / 100)
    );
    const totalCost = amount + fee;

    if (totalCost > (user?.tokens || 0)) {
      setError(`Không đủ token. Cần ${totalCost} tokens (${amount} + ${fee} phí)`);
      setLoading(false);
      return;
    }

    try {
      const response = await apiService.transferTokens({
        recipient_email: transferForm.recipientEmail,
        amount: amount,
        message: transferForm.message
      });

      if (response.success) {
        setSuccess(`Chuyển ${amount} tokens thành công! Phí: ${fee} tokens`);
        setTransferForm({ recipientEmail: '', amount: '', message: '' });
        fetchUserProfile(); // Refresh profile
      }
    } catch (error) {
      setError('Chuyển token thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleLevelUpgrade = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await apiService.submitLevelUpgrade(upgradeForm);
      if (response.success) {
        setSuccess('Đơn xin nâng cấp đã được gửi! Admin sẽ xem xét trong vòng 24-48h');
        setUpgradeForm({
          targetRole: 'Scholar',
          qualifications: '',
          experience: '',
          publications: '',
          motivation: ''
        });
      }
    } catch (error) {
      setError('Gửi đơn xin nâng cấp thất bại');
    } finally {
      setLoading(false);
    }
  };

  const copyReferralCode = () => {
    if (user?.referral_code) {
      navigator.clipboard.writeText(user.referral_code);
      setSuccess('Đã copy mã giới thiệu!');
    }
  };

  if (!user) {
    return (
      <>
        <Head>
          <title>Profile - NCS Research Platform</title>
        </Head>
        
        <Header user={user} token={token} onLogin={handleLogin} onLogout={handleLogout} />
        
        <div style={{ paddingTop: '80px', padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔒</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
            Cần đăng nhập để xem hồ sơ
          </h1>
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

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Researcher': return '🔬';
      case 'Scholar': return '🎓';
      case 'Mentor': return '👨‍🏫';
      case 'Editor': return '✏️';
      case 'Founder': return '👑';
      default: return '👤';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Bronze': return '#cd7f32';
      case 'Silver': return '#c0c0c0';
      case 'Gold': return '#ffd700';
      case 'Platinum': return '#e5e4e2';
      case 'Diamond': return '#b9f2ff';
      default: return '#6b7280';
    }
  };

  return (
    <>
      <Head>
        <title>Profile - NCS Research Platform</title>
      </Head>
      
      <Header user={user} token={token} onLogin={handleLogin} onLogout={handleLogout} />
      
      <div style={{ paddingTop: '80px', padding: '2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Profile Header */}
          <div style={{ 
            background: 'white', 
            padding: '2rem', 
            borderRadius: '0.75rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                color: 'white'
              }}>
                {getRoleIcon(user.role)}
              </div>
              <div>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
                  {user.full_name}
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    backgroundColor: '#dbeafe',
                    color: '#1e40af',
                    borderRadius: '1rem'
                  }}>
                    {getRoleIcon(user.role)} {user.role}
                  </span>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    borderRadius: '1rem'
                  }}>
                    Level: {String(user.level || 'Bronze')}
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  {user.email} • @{user.username}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
              <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '0.5rem' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0369a1' }}>{user.tokens}</div>
                <div style={{ fontSize: '0.875rem', color: '#0284c7' }}>NCS Tokens</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '0.5rem' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>{user.referral_count || 0}</div>
                <div style={{ fontSize: '0.875rem', color: '#047857' }}>Người giới thiệu</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '0.5rem' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#d97706' }}>{user.referral_earnings || 0}</div>
                <div style={{ fontSize: '0.875rem', color: '#92400e' }}>Token từ giới thiệu</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* Left Column */}
            <div>
              {/* Referral Code */}
              <div style={{ 
                background: 'white', 
                padding: '1.5rem', 
                borderRadius: '0.75rem', 
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                marginBottom: '2rem'
              }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                  🎯 Mã giới thiệu
                </h3>
                
                {user.referral_code ? (
                  <div>
                    <div style={{
                      padding: '1rem',
                      backgroundColor: '#f0f9ff',
                      border: '1px solid #bae6fd',
                      borderRadius: '0.5rem',
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <code style={{ fontSize: '1rem', fontWeight: '600', color: '#1e40af' }}>
                        {user.referral_code}
                      </code>
                      <button
                        onClick={copyReferralCode}
                        style={{
                          padding: '0.5rem 1rem',
                          background: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          cursor: 'pointer'
                        }}
                      >
                        Copy
                      </button>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      Chia sẻ mã này để nhận 100 tokens khi có người đăng ký mới
                    </p>
                  </div>
                ) : (
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
                      Tạo mã giới thiệu để kiếm thêm tokens
                    </p>
                    <button
                      onClick={generateReferralCode}
                      disabled={loading}
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: loading ? '#9ca3af' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: loading ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {loading ? 'Đang tạo...' : 'Tạo mã giới thiệu'}
                    </button>
                  </div>
                )}
              </div>

              {/* Token Transfer */}
              <div style={{ 
                background: 'white', 
                padding: '1.5rem', 
                borderRadius: '0.75rem', 
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                marginBottom: '2rem'
              }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                  💸 Chuyển Token
                </h3>
                
                <form onSubmit={handleTokenTransfer} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem', display: 'block' }}>
                      Email người nhận
                    </label>
                    <input
                      type="email"
                      value={transferForm.recipientEmail}
                      onChange={(e) => setTransferForm({...transferForm, recipientEmail: e.target.value})}
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem', display: 'block' }}>
                      Số lượng token
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={user.tokens}
                      value={transferForm.amount}
                      onChange={(e) => setTransferForm({...transferForm, amount: e.target.value})}
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem', display: 'block' }}>
                      Lời nhắn (tùy chọn)
                    </label>
                    <textarea
                      value={transferForm.message}
                      onChange={(e) => setTransferForm({...transferForm, message: e.target.value})}
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                  
                  {transferForm.amount && (
                    <div style={{
                      padding: '0.75rem',
                      backgroundColor: '#fef3c7',
                      border: '1px solid #fde68a',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      color: '#92400e'
                    }}>
                      <div><strong>Phí chuyển:</strong> {transferFee.percentage}% (tối thiểu {transferFee.minimum_fee}, tối đa {transferFee.maximum_fee} tokens)</div>
                      <div><strong>Tổng chi phí:</strong> {parseFloat(transferForm.amount || '0') + Math.max(transferFee.minimum_fee, Math.min(transferFee.maximum_fee, parseFloat(transferForm.amount || '0') * transferFee.percentage / 100))} tokens</div>
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={loading || !transferForm.recipientEmail || !transferForm.amount}
                    style={{
                      padding: '0.75rem',
                      background: loading ? '#9ca3af' : 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {loading ? 'Đang chuyển...' : 'Chuyển Token'}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column */}
            <div>
              {/* Level Upgrade */}
              <div style={{ 
                background: 'white', 
                padding: '1.5rem', 
                borderRadius: '0.75rem', 
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                marginBottom: '2rem'
              }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                  ⬆️ Xin nâng cấp quyền
                </h3>
                
                <form onSubmit={handleLevelUpgrade} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem', display: 'block' }}>
                      Quyền muốn nâng cấp
                    </label>
                    <select
                      value={upgradeForm.targetRole}
                      onChange={(e) => setUpgradeForm({...upgradeForm, targetRole: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem'
                      }}
                    >
                      <option value="Scholar">🎓 Scholar - Nhà nghiên cứu có kinh nghiệm</option>
                      <option value="Mentor">👨‍🏫 Mentor - Hướng dẫn nghiên cứu</option>
                      <option value="Editor">✏️ Editor - Biên tập nội dung</option>
                    </select>
                  </div>
                  
                  <div>
                    <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem', display: 'block' }}>
                      Bằng cấp/Học vấn
                    </label>
                    <textarea
                      value={upgradeForm.qualifications}
                      onChange={(e) => setUpgradeForm({...upgradeForm, qualifications: e.target.value})}
                      rows={2}
                      placeholder="Mô tả bằng cấp, chứng chỉ liên quan..."
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem', display: 'block' }}>
                      Kinh nghiệm nghiên cứu
                    </label>
                    <textarea
                      value={upgradeForm.experience}
                      onChange={(e) => setUpgradeForm({...upgradeForm, experience: e.target.value})}
                      rows={2}
                      placeholder="Mô tả kinh nghiệm nghiên cứu, dự án đã tham gia..."
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem', display: 'block' }}>
                      Công bố khoa học
                    </label>
                    <textarea
                      value={upgradeForm.publications}
                      onChange={(e) => setUpgradeForm({...upgradeForm, publications: e.target.value})}
                      rows={2}
                      placeholder="Liệt kê các bài báo, công bố khoa học..."
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem', display: 'block' }}>
                      Lý do xin nâng cấp
                    </label>
                    <textarea
                      value={upgradeForm.motivation}
                      onChange={(e) => setUpgradeForm({...upgradeForm, motivation: e.target.value})}
                      rows={3}
                      placeholder="Giải thích tại sao bạn xứng đáng được nâng cấp quyền..."
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: '0.75rem',
                      background: loading ? '#9ca3af' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {loading ? 'Đang gửi...' : 'Gửi đơn xin nâng cấp'}
                  </button>
                </form>
              </div>

              {/* Account Settings */}
              <div style={{ 
                background: 'white', 
                padding: '1.5rem', 
                borderRadius: '0.75rem', 
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                  ⚙️ Cài đặt tài khoản
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <Link href="/settings" style={{
                    padding: '0.75rem',
                    background: '#f8fafc',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    textDecoration: 'none',
                    color: '#374151',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  >
                    🔧 Cài đặt chung
                  </Link>
                  
                  <Link href="/privacy" style={{
                    padding: '0.75rem',
                    background: '#f8fafc',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    textDecoration: 'none',
                    color: '#374151',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  >
                    🔒 Bảo mật & Quyền riêng tư
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div style={{
              position: 'fixed',
              top: '100px',
              right: '2rem',
              padding: '1rem',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '0.5rem',
              color: '#dc2626',
              fontSize: '0.875rem',
              zIndex: 1000,
              maxWidth: '400px'
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              position: 'fixed',
              top: '100px',
              right: '2rem',
              padding: '1rem',
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '0.5rem',
              color: '#059669',
              fontSize: '0.875rem',
              zIndex: 1000,
              maxWidth: '400px'
            }}>
              {success}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default Profile;