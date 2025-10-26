// FILE: frontend/components/UserLevelManager.tsx
// User Level Management Component

import React, { useState, useEffect } from 'react';

interface UserLevelManagerProps {
  user: {
    id: string;
    level: string;
    ncs_tokens: number;
    total_earned_tokens: number;
    referral_count: number;
  };
  onLevelUpgrade: (newLevel: string) => void;
}

interface LevelInfo {
  name: string;
  description: string;
  requirements: {
    min_tokens: number;
    min_referrals: number;
  };
  benefits: string[];
  color: string;
  icon: string;
}

export default function UserLevelManager({ user, onLevelUpgrade }: UserLevelManagerProps) {
  const [levelInfo, setLevelInfo] = useState<LevelInfo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLevelInfo();
  }, []);

  const fetchLevelInfo = async () => {
    try {
      const response = await fetch('/api/user/level-info', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      const data = await response.json();
      
      // Add visual styling to levels
      const styledLevels = data.levels.map((level: any, index: number) => ({
        ...level,
        color: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'][index],
        icon: ['🔬', '🎓', '👨‍🏫', '✏️', '👑'][index]
      }));
      
      setLevelInfo(styledLevels);
    } catch (error) {
      console.error('Error fetching level info:', error);
    }
  };

  const getCurrentLevelIndex = () => {
    return levelInfo.findIndex(level => level.name === user.level);
  };

  const getNextLevel = () => {
    const currentIndex = getCurrentLevelIndex();
    return currentIndex < levelInfo.length - 1 ? levelInfo[currentIndex + 1] : null;
  };

  const getProgressToNextLevel = () => {
    const nextLevel = getNextLevel();
    if (!nextLevel) return { tokens: 100, referrals: 100 };

    const tokenProgress = Math.min(
      (user.total_earned_tokens / nextLevel.requirements.min_tokens) * 100,
      100
    );
    const referralProgress = Math.min(
      (user.referral_count / nextLevel.requirements.min_referrals) * 100,
      100
    );

    return { tokens: tokenProgress, referrals: referralProgress };
  };

  const styles = {
    container: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      marginBottom: '24px'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '24px'
    },
    currentLevel: {
      display: 'flex',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '16px 24px',
      borderRadius: '12px',
      marginRight: '20px'
    },
    levelIcon: {
      fontSize: '32px',
      marginRight: '12px'
    },
    levelInfo: {
      flex: 1
    },
    levelName: {
      fontSize: '24px',
      fontWeight: 'bold',
      margin: '0 0 4px 0'
    },
    levelDescription: {
      fontSize: '14px',
      opacity: 0.9,
      margin: 0
    },
    progressSection: {
      flex: 1
    },
    progressTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '12px'
    },
    progressBar: {
      background: '#e5e7eb',
      borderRadius: '8px',
      height: '8px',
      marginBottom: '8px',
      overflow: 'hidden'
    },
    progressFill: {
      height: '100%',
      borderRadius: '8px',
      transition: 'width 0.3s ease'
    },
    progressLabel: {
      fontSize: '12px',
      color: '#6b7280',
      display: 'flex',
      justifyContent: 'space-between'
    },
    levelsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '16px',
      marginTop: '24px'
    },
    levelCard: {
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      padding: '20px',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },
    activeLevelCard: {
      borderColor: '#3b82f6',
      background: '#f0f9ff'
    },
    lockedLevelCard: {
      opacity: 0.6,
      background: '#f9fafb'
    },
    levelCardHeader: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '12px'
    },
    levelCardIcon: {
      fontSize: '24px',
      marginRight: '12px'
    },
    levelCardName: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1f2937',
      margin: 0
    },
    levelCardDescription: {
      fontSize: '14px',
      color: '#6b7280',
      marginBottom: '16px'
    },
    requirements: {
      marginBottom: '16px'
    },
    requirementItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 0',
      borderBottom: '1px solid #f3f4f6'
    },
    requirementLabel: {
      fontSize: '14px',
      color: '#374151'
    },
    requirementValue: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#1f2937'
    },
    benefits: {
      marginTop: '16px'
    },
    benefitsTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '8px'
    },
    benefitItem: {
      fontSize: '12px',
      color: '#6b7280',
      padding: '4px 0',
      display: 'flex',
      alignItems: 'center'
    },
    benefitIcon: {
      marginRight: '8px',
      fontSize: '12px'
    },
    upgradeButton: {
      background: '#10b981',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      width: '100%',
      marginTop: '16px'
    },
    disabledButton: {
      background: '#d1d5db',
      cursor: 'not-allowed'
    }
  };

  const progress = getProgressToNextLevel();
  const nextLevel = getNextLevel();
  const currentLevelData = levelInfo.find(level => level.name === user.level);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.currentLevel}>
          <div style={styles.levelIcon}>
            {currentLevelData?.icon || '🔬'}
          </div>
          <div style={styles.levelInfo}>
            <div style={styles.levelName}>{user.level}</div>
            <div style={styles.levelDescription}>
              {currentLevelData?.description || 'Current level'}
            </div>
          </div>
        </div>

        {nextLevel && (
          <div style={styles.progressSection}>
            <div style={styles.progressTitle}>
              Progress to {nextLevel.name}
            </div>
            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${Math.min(progress.tokens, progress.referrals)}%`,
                  background: 'linear-gradient(90deg, #3b82f6, #10b981)'
                }}
              />
            </div>
            <div style={styles.progressLabel}>
              <span>Tokens: {user.total_earned_tokens}/{nextLevel.requirements.min_tokens}</span>
              <span>Referrals: {user.referral_count}/{nextLevel.requirements.min_referrals}</span>
            </div>
          </div>
        )}
      </div>

      <div style={styles.levelsGrid}>
        {levelInfo.map((level, index) => {
          const isCurrentLevel = level.name === user.level;
          const isUnlocked = user.total_earned_tokens >= level.requirements.min_tokens &&
                           user.referral_count >= level.requirements.min_referrals;
          const isNextLevel = nextLevel?.name === level.name;

          return (
            <div
              key={level.name}
              style={{
                ...styles.levelCard,
                ...(isCurrentLevel ? styles.activeLevelCard : {}),
                ...(!isUnlocked && !isCurrentLevel ? styles.lockedLevelCard : {})
              }}
            >
              <div style={styles.levelCardHeader}>
                <div style={styles.levelCardIcon}>{level.icon}</div>
                <div style={styles.levelCardName}>{level.name}</div>
              </div>

              <div style={styles.levelCardDescription}>
                {level.description}
              </div>

              <div style={styles.requirements}>
                <div style={styles.requirementItem}>
                  <span style={styles.requirementLabel}>Minimum Tokens</span>
                  <span style={styles.requirementValue}>
                    {level.requirements.min_tokens.toLocaleString()}
                  </span>
                </div>
                <div style={styles.requirementItem}>
                  <span style={styles.requirementLabel}>Minimum Referrals</span>
                  <span style={styles.requirementValue}>
                    {level.requirements.min_referrals}
                  </span>
                </div>
              </div>

              <div style={styles.benefits}>
                <div style={styles.benefitsTitle}>Benefits:</div>
                {level.benefits.map((benefit, benefitIndex) => (
                  <div key={benefitIndex} style={styles.benefitItem}>
                    <span style={styles.benefitIcon}>✓</span>
                    {benefit}
                  </div>
                ))}
              </div>

              {isNextLevel && isUnlocked && (
                <button
                  style={styles.upgradeButton}
                  onClick={() => {
                    // In a real implementation, this would call an API to upgrade the user
                    onLevelUpgrade(level.name);
                  }}
                >
                  Upgrade to {level.name}
                </button>
              )}

              {isCurrentLevel && (
                <div style={{
                  ...styles.upgradeButton,
                  background: '#6b7280',
                  cursor: 'default'
                }}>
                  Current Level
                </div>
              )}

              {!isUnlocked && !isCurrentLevel && (
                <div style={{
                  ...styles.upgradeButton,
                  ...styles.disabledButton
                }}>
                  Locked
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
