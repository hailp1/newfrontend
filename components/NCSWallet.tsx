// FILE: frontend/components/NCSWallet.tsx
// NCS Token Wallet Component

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface NCSWalletProps {
  user: {
    id: string;
    name: string;
    level: string;
    ncs_tokens: number;
    total_earned_tokens: number;
    total_spent_tokens: number;
    referral_code: string;
    referral_count: number;
  };
  onTokenUpdate: (newTokens: number) => void;
}

interface TokenTransaction {
  id: string;
  amount: number;
  transaction_type: string;
  source: string;
  description: string;
  created_at: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  task_type: string;
  token_reward: number;
  requirements: any;
}

export default function NCSWallet({ user, onTokenUpdate }: NCSWalletProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'wallet' | 'tasks' | 'referral' | 'history'>('wallet');
  const [transactions, setTransactions] = useState<TokenTransaction[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [referralEmail, setReferralEmail] = useState('');
  const [referralName, setReferralName] = useState('');

  useEffect(() => {
    fetchTokenHistory();
    fetchAvailableTasks();
  }, []);

  const fetchTokenHistory = async () => {
    try {
      const response = await fetch('/api/user/tokens', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching token history:', error);
    }
  };

  const fetchAvailableTasks = async () => {
    try {
      const response = await fetch('/api/tasks', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const completeTask = async (taskId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/tasks/${taskId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          completion_data: {
            completed_at: new Date().toISOString(),
            user_id: user.id
          }
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        fetchTokenHistory();
        onTokenUpdate(user.ncs_tokens + tasks.find(t => t.id === taskId)?.token_reward || 0);
      }
    } catch (error) {
      console.error('Error completing task:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendReferral = async () => {
    if (!referralEmail || !referralName) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/referral/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          referred_email: referralEmail,
          referred_name: referralName
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        setReferralEmail('');
        setReferralName('');
      }
    } catch (error) {
      console.error('Error sending referral:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level: string) => {
    const colors = {
      'Researcher': '#3b82f6',
      'Scholar': '#10b981',
      'Mentor': '#f59e0b',
      'Editor': '#8b5cf6',
      'Founder': '#ef4444'
    };
    return colors[level as keyof typeof colors] || '#6b7280';
  };

  const getLevelBenefits = (level: string) => {
    const benefits = {
      'Researcher': ['Basic analysis tools', 'Create projects', 'Earn tokens'],
      'Scholar': ['Advanced analysis tools', 'Review projects', 'Higher token rewards'],
      'Mentor': ['Mentor projects', 'Priority support', 'Exclusive features'],
      'Editor': ['Editorial access', 'Quality control', 'Premium features'],
      'Founder': ['All features', 'Platform governance', 'Special recognition']
    };
    return benefits[level as keyof typeof benefits] || [];
  };

  const styles = {
    container: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '12px',
      padding: '24px',
      color: 'white',
      marginBottom: '24px'
    },
    walletHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    },
    tokenDisplay: {
      textAlign: 'center' as const
    },
    tokenAmount: {
      fontSize: '48px',
      fontWeight: 'bold',
      marginBottom: '8px'
    },
    tokenLabel: {
      fontSize: '16px',
      opacity: 0.9
    },
    levelBadge: {
      background: 'rgba(255, 255, 255, 0.2)',
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: '600'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '16px',
      marginTop: '20px'
    },
    statItem: {
      textAlign: 'center' as const,
      background: 'rgba(255, 255, 255, 0.1)',
      padding: '16px',
      borderRadius: '8px'
    },
    statValue: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '4px'
    },
    statLabel: {
      fontSize: '12px',
      opacity: 0.8
    },
    tabs: {
      display: 'flex',
      background: '#f8fafc',
      borderRadius: '8px',
      padding: '4px',
      marginBottom: '20px'
    },
    tab: {
      flex: 1,
      padding: '12px',
      textAlign: 'center' as const,
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.2s'
    },
    activeTab: {
      background: 'white',
      color: '#3b82f6',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    taskCard: {
      background: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '12px'
    },
    taskHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '8px'
    },
    taskTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1f2937'
    },
    tokenReward: {
      background: '#10b981',
      color: 'white',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: '600'
    },
    taskDescription: {
      fontSize: '14px',
      color: '#6b7280',
      marginBottom: '12px'
    },
    completeButton: {
      background: '#3b82f6',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      width: '100%'
    },
    referralForm: {
      background: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '20px'
    },
    inputGroup: {
      marginBottom: '16px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '6px'
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px'
    },
    referralCode: {
      background: '#f3f4f6',
      padding: '12px',
      borderRadius: '6px',
      fontSize: '14px',
      fontFamily: 'monospace',
      textAlign: 'center' as const,
      marginBottom: '16px'
    }
  };

  return (
    <div>
      {/* Wallet Header */}
      <div style={styles.container}>
        <div style={styles.walletHeader}>
          <div>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
              NCS Wallet
            </h2>
            <p style={{ margin: '4px 0 0 0', opacity: 0.9 }}>
              Welcome back, {user.name}
            </p>
          </div>
          <div style={{
            ...styles.levelBadge,
            background: getLevelColor(user.level)
          }}>
            {user.level}
          </div>
        </div>

        <div style={styles.tokenDisplay}>
          <div style={styles.tokenAmount}>
            {user.ncs_tokens.toLocaleString()}
          </div>
          <div style={styles.tokenLabel}>NCS Tokens</div>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statItem}>
            <div style={styles.statValue}>{user.total_earned_tokens.toLocaleString()}</div>
            <div style={styles.statLabel}>Total Earned</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statValue}>{user.total_spent_tokens.toLocaleString()}</div>
            <div style={styles.statLabel}>Total Spent</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statValue}>{user.referral_count}</div>
            <div style={styles.statLabel}>Referrals</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <div
          style={{
            ...styles.tab,
            ...(activeTab === 'wallet' ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab('wallet')}
        >
          💰 Wallet
        </div>
        <div
          style={{
            ...styles.tab,
            ...(activeTab === 'tasks' ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab('tasks')}
        >
          ✅ Tasks
        </div>
        <div
          style={{
            ...styles.tab,
            ...(activeTab === 'referral' ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab('referral')}
        >
          👥 Referral
        </div>
        <div
          style={{
            ...styles.tab,
            ...(activeTab === 'history' ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab('history')}
        >
          📊 History
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'wallet' && (
        <div>
          <div style={styles.taskCard}>
            <h3 style={{ margin: '0 0 12px 0', color: '#1f2937' }}>
              Level Benefits
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {getLevelBenefits(user.level).map((benefit, index) => (
                <span
                  key={index}
                  style={{
                    background: '#e0e7ff',
                    color: '#3730a3',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                >
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div>
          <h3 style={{ marginBottom: '16px', color: '#1f2937' }}>
            Available Tasks
          </h3>
          {tasks.map((task) => (
            <div key={task.id} style={styles.taskCard}>
              <div style={styles.taskHeader}>
                <div style={styles.taskTitle}>{task.title}</div>
                <div style={styles.tokenReward}>+{task.token_reward} tokens</div>
              </div>
              <div style={styles.taskDescription}>
                {task.description}
              </div>
              <button
                style={styles.completeButton}
                onClick={() => completeTask(task.id)}
                disabled={loading}
              >
                {loading ? 'Completing...' : 'Complete Task'}
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'referral' && (
        <div style={styles.referralForm}>
          <h3 style={{ margin: '0 0 20px 0', color: '#1f2937' }}>
            Refer Friends & Earn Tokens
          </h3>
          
          <div style={styles.referralCode}>
            Your Referral Code: {user.referral_code}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Friend's Email</label>
            <input
              type="email"
              style={styles.input}
              value={referralEmail}
              onChange={(e) => setReferralEmail(e.target.value)}
              placeholder="Enter friend's email address"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Friend's Name</label>
            <input
              type="text"
              style={styles.input}
              value={referralName}
              onChange={(e) => setReferralName(e.target.value)}
              placeholder="Enter friend's name"
            />
          </div>

          <button
            style={styles.completeButton}
            onClick={sendReferral}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Referral (+100 tokens)'}
          </button>
        </div>
      )}

      {activeTab === 'history' && (
        <div>
          <h3 style={{ marginBottom: '16px', color: '#1f2937' }}>
            Token History
          </h3>
          {transactions.map((transaction) => (
            <div key={transaction.id} style={styles.taskCard}>
              <div style={styles.taskHeader}>
                <div>
                  <div style={styles.taskTitle}>{transaction.description}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div style={{
                  ...styles.tokenReward,
                  background: transaction.amount > 0 ? '#10b981' : '#ef4444'
                }}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
