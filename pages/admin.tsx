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
  created_at: string;
  last_login?: string;
  is_active: boolean;
}

interface UpgradeRequest {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  current_role: string;
  target_role: string;
  qualifications: string;
  experience: string;
  publications: string;
  motivation: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
}

interface SystemSettings {
  transfer_fee_percentage: number;
  transfer_fee_minimum: number;
  transfer_fee_maximum: number;
  welcome_tokens: number;
  referral_tokens: number;
  profile_completion_tokens: number;
}

interface AdminStats {
  total_users: number;
  active_users: number;
  total_tokens: number;
  pending_upgrades: number;
  total_referrals: number;
  revenue_today: number;
}

const AdminDashboard: React.FC = () => {
  const { t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Data states
  const [users, setUsers] = useState<User[]>([]);
  const [upgradeRequests, setUpgradeRequests] = useState<UpgradeRequest[]>([]);
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    transfer_fee_percentage: 5,
    transfer_fee_minimum: 1,
    transfer_fee_maximum: 50,
    welcome_tokens: 100,
    referral_tokens: 100,
    profile_completion_tokens: 50
  });
  const [adminStats, setAdminStats] = useState<AdminStats>({
    total_users: 0,
    active_users: 0,
    total_tokens: 0,
    pending_upgrades: 0,
    total_referrals: 0,
    revenue_today: 0
  });
  
  // UI states
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'upgrades' | 'settings' | 'transactions'>('overview');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Check authentication
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      const userData = JSON.parse(savedUser);
      if (userData.role === 'Founder') {
        setToken(savedToken);
        setUser(userData);
        fetchAdminData();
      } else {
        // Redirect non-admin users
        window.location.href = '/';
      }
    } else {
      window.location.href = '/login';
    }
  }, []);

  const fetchAdminData = async () => {
    try {
      const [usersRes, upgradesRes, statsRes, settingsRes] = await Promise.all([
        apiService.getAdminUsers(),
        apiService.getUpgradeRequests(),
        apiService.getAdminStats(),
        apiService.getSystemSettings()
      ]);

      if (usersRes.success) setUsers(usersRes.data);
      if (upgradesRes.success) setUpgradeRequests(upgradesRes.data);
      if (statsRes.success) setAdminStats(statsRes.data);
      if (settingsRes.success) setSystemSettings(settingsRes.data);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
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

  const handleApproveUpgrade = async (requestId: number) => {
    setLoading(true);
    try {
      const response = await apiService.approveUpgrade(requestId);
      if (response.success) {
        setSuccess('Đã phê duyệt nâng cấp thành công!');
        fetchAdminData();
      }
    } catch (error) {
      setError('Không thể phê duyệt nâng cấp');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectUpgrade = async (requestId: number, reason: string) => {
    setLoading(true);
    try {
      const response = await apiService.rejectUpgrade(requestId, reason);
      if (response.success) {
        setSuccess('Đã từ chối nâng cấp');
        fetchAdminData();
      }
    } catch (error) {
      setError('Không thể từ chối nâng cấp');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserRole = async (userId: number, newRole: string) => {
    setLoading(true);
    try {
      const response = await apiService.updateUserRole(userId, newRole);
      if (response.success) {
        setSuccess('Đã cập nhật quyền người dùng!');
        fetchAdminData();
      }
    } catch (error) {
      setError('Không thể cập nhật quyền');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSystemSettings = async () => {
    setLoading(true);
    try {
      const response = await apiService.updateSystemSettings(systemSettings);
      if (response.success) {
        setSuccess('Đã cập nhật cài đặt hệ thống!');
      }
    } catch (error) {
      setError('Không thể cập nhật cài đặt');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const renderOverviewTab = () => (
    <div>
      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Tổng người dùng</span>
            <span style={{ fontSize: '1.5rem' }}>👥</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>{adminStats.total_users}</div>
        </div>

        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Người dùng hoạt động</span>
            <span style={{ fontSize: '1.5rem' }}>✅</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>{adminStats.active_users}</div>
        </div>

        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Tổng tokens</span>
            <span style={{ fontSize: '1.5rem' }}>🪙</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>{adminStats.total_tokens.toLocaleString()}</div>
        </div>

        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Chờ nâng cấp</span>
            <span style={{ fontSize: '1.5rem' }}>⏳</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>{adminStats.pending_upgrades}</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ background: 'white', padding: '2rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1.5rem' }}>
          Hoạt động gần đây
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {upgradeRequests.slice(0, 5).map((request) => (
            <div key={request.id} style={{
              padding: '1rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              backgroundColor: '#f9fafb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: '600', color: '#1f2937' }}>{request.user_name}</span>
                <span style={{
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  backgroundColor: getStatusColor(request.status) === '#f59e0b' ? '#fef3c7' : 
                                  getStatusColor(request.status) === '#10b981' ? '#dcfce7' : '#fef2f2',
                  color: getStatusColor(request.status),
                  borderRadius: '0.25rem'
                }}>
                  {request.status === 'pending' ? 'Chờ duyệt' : 
                   request.status === 'approved' ? 'Đã duyệt' : 'Từ chối'}
                </span>
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Xin nâng cấp từ {request.current_role} lên {request.target_role}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                {new Date(request.submitted_at).toLocaleString('vi-VN')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUsersTab = () => (
    <div>
      {/* Search and Filters */}
      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '0.875rem'
            }}
          />
          <button
            onClick={() => setSearchTerm('')}
            style={{
              padding: '0.75rem 1rem',
              background: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
          >
            Xóa bộ lọc
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div style={{ background: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>
            Danh sách người dùng ({filteredUsers.length})
          </h3>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f9fafb' }}>
              <tr>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Người dùng</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Quyền</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Tokens</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Trạng thái</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '1rem' }}>
                    <div>
                      <div style={{ fontWeight: '600', color: '#1f2937' }}>{user.full_name}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{user.email}</div>
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>@{user.username}</div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      backgroundColor: '#dbeafe',
                      color: '#1e40af',
                      borderRadius: '0.25rem'
                    }}>
                      {getRoleIcon(user.role)} {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: '600', color: '#1f2937' }}>{user.tokens}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      backgroundColor: user.is_active ? '#dcfce7' : '#fef2f2',
                      color: user.is_active ? '#166534' : '#dc2626',
                      borderRadius: '0.25rem'
                    }}>
                      {user.is_active ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <select
                        value={user.role}
                        onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                        style={{
                          padding: '0.25rem 0.5rem',
                          fontSize: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.25rem',
                          backgroundColor: 'white'
                        }}
                      >
                        <option value="Researcher">Researcher</option>
                        <option value="Scholar">Scholar</option>
                        <option value="Mentor">Mentor</option>
                        <option value="Editor">Editor</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderUpgradesTab = () => (
    <div>
      <div style={{ background: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>
            Yêu cầu nâng cấp quyền ({upgradeRequests.filter(r => r.status === 'pending').length} chờ duyệt)
          </h3>
        </div>
        
        <div style={{ padding: '1.5rem' }}>
          {upgradeRequests.map((request) => (
            <div key={request.id} style={{
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              marginBottom: '1rem',
              backgroundColor: '#f9fafb'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                    {request.user_name}
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{request.user_email}</p>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Xin nâng cấp từ <strong>{request.current_role}</strong> lên <strong>{request.target_role}</strong>
                  </p>
                </div>
                <span style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  backgroundColor: getStatusColor(request.status) === '#f59e0b' ? '#fef3c7' : 
                                  getStatusColor(request.status) === '#10b981' ? '#dcfce7' : '#fef2f2',
                  color: getStatusColor(request.status),
                  borderRadius: '0.375rem'
                }}>
                  {request.status === 'pending' ? 'Chờ duyệt' : 
                   request.status === 'approved' ? 'Đã duyệt' : 'Từ chối'}
                </span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <h5 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Bằng cấp</h5>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{request.qualifications}</p>
                </div>
                <div>
                  <h5 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Kinh nghiệm</h5>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{request.experience}</p>
                </div>
                <div>
                  <h5 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Công bố</h5>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{request.publications}</p>
                </div>
                <div>
                  <h5 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Lý do</h5>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{request.motivation}</p>
                </div>
              </div>
              
              {request.status === 'pending' && (
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    onClick={() => handleApproveUpgrade(request.id)}
                    disabled={loading}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Phê duyệt
                  </button>
                  <button
                    onClick={() => {
                      const reason = prompt('Lý do từ chối:');
                      if (reason) handleRejectUpgrade(request.id, reason);
                    }}
                    disabled={loading}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Từ chối
                  </button>
                </div>
              )}
              
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '1rem' }}>
                Gửi lúc: {new Date(request.submitted_at).toLocaleString('vi-VN')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div>
      <div style={{ background: 'white', padding: '2rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1.5rem' }}>
          Cài đặt hệ thống
        </h3>
        
        <form onSubmit={(e) => { e.preventDefault(); handleUpdateSystemSettings(); }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem', display: 'block' }}>
                Phí chuyển token (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={systemSettings.transfer_fee_percentage}
                onChange={(e) => setSystemSettings({...systemSettings, transfer_fee_percentage: parseFloat(e.target.value)})}
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
                Phí chuyển tối thiểu
              </label>
              <input
                type="number"
                min="0"
                value={systemSettings.transfer_fee_minimum}
                onChange={(e) => setSystemSettings({...systemSettings, transfer_fee_minimum: parseInt(e.target.value)})}
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
                Phí chuyển tối đa
              </label>
              <input
                type="number"
                min="0"
                value={systemSettings.transfer_fee_maximum}
                onChange={(e) => setSystemSettings({...systemSettings, transfer_fee_maximum: parseInt(e.target.value)})}
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
                Token chào mừng
              </label>
              <input
                type="number"
                min="0"
                value={systemSettings.welcome_tokens}
                onChange={(e) => setSystemSettings({...systemSettings, welcome_tokens: parseInt(e.target.value)})}
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
                Token giới thiệu
              </label>
              <input
                type="number"
                min="0"
                value={systemSettings.referral_tokens}
                onChange={(e) => setSystemSettings({...systemSettings, referral_tokens: parseInt(e.target.value)})}
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
                Token hoàn thành hồ sơ
              </label>
              <input
                type="number"
                min="0"
                value={systemSettings.profile_completion_tokens}
                onChange={(e) => setSystemSettings({...systemSettings, profile_completion_tokens: parseInt(e.target.value)})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem'
                }}
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.75rem 1.5rem',
              background: loading ? '#9ca3af' : 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              alignSelf: 'flex-start'
            }}
          >
            {loading ? 'Đang cập nhật...' : 'Cập nhật cài đặt'}
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>Admin Dashboard - NCS Research Platform</title>
      </Head>
      
      <Header user={user} token={token} onLogin={handleLogin} onLogout={handleLogout} />
      
      <div style={{ paddingTop: '80px', padding: '2rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Admin Header */}
          <div style={{ 
            background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)', 
            padding: '2rem', 
            borderRadius: '0.75rem', 
            marginBottom: '2rem',
            color: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: '2rem' }}>👑</div>
              <div>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  Admin Dashboard
                </h1>
                <p style={{ fontSize: '1rem', opacity: 0.9 }}>
                  Quản lý hệ thống và người dùng
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ 
            background: 'white', 
            borderRadius: '0.75rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: '2rem',
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
              {[
                { id: 'overview', label: 'Tổng quan', icon: '📊' },
                { id: 'users', label: 'Người dùng', icon: '👥' },
                { id: 'upgrades', label: 'Nâng cấp', icon: '⬆️' },
                { id: 'settings', label: 'Cài đặt', icon: '⚙️' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    padding: '1rem 1.5rem',
                    background: activeTab === tab.id ? '#f0f9ff' : 'transparent',
                    border: 'none',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: activeTab === tab.id ? '#1e40af' : '#6b7280',
                    cursor: 'pointer',
                    borderBottom: activeTab === tab.id ? '2px solid #3b82f6' : '2px solid transparent',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'users' && renderUsersTab()}
          {activeTab === 'upgrades' && renderUpgradesTab()}
          {activeTab === 'settings' && renderSettingsTab()}

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

export default AdminDashboard;