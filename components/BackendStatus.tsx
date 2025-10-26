import React, { useState, useEffect } from 'react';

interface BackendStatusProps {
  onRetry?: () => void;
}

const BackendStatus: React.FC<BackendStatusProps> = ({ onRetry }) => {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkBackendStatus = async () => {
    setIsChecking(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
      
      const response = await fetch('http://localhost:8000/api/health', {
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      setIsOnline(response.ok);
    } catch (error) {
      console.log('Backend check failed:', error);
      setIsOnline(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkBackendStatus();
    // Check every 30 seconds
    const interval = setInterval(checkBackendStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isOnline === null || isChecking) {
    return (
      <div style={{
        position: 'fixed',
        top: '100px',
        right: '2rem',
        padding: '1rem',
        backgroundColor: '#fef3c7',
        border: '1px solid #fde68a',
        borderRadius: '0.5rem',
        color: '#92400e',
        fontSize: '0.875rem',
        zIndex: 1000,
        maxWidth: '400px'
      }}>
        🔍 Đang kiểm tra kết nối backend...
      </div>
    );
  }

  if (!isOnline) {
    return (
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
        <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
          ⚠️ Backend Server Offline
        </div>
        <div style={{ marginBottom: '0.75rem' }}>
          Không thể kết nối đến server backend (http://localhost:8000)
        </div>
        <div style={{ marginBottom: '0.75rem', fontSize: '0.75rem' }}>
          <strong>Để khởi động backend:</strong>
          <br />
          <strong>Cách 1 - Docker (Khuyến nghị):</strong>
          <br />1. Cài đặt Docker Desktop
          <br />2. Double-click: <code style={{ background: '#f3f4f6', padding: '0.125rem 0.25rem', borderRadius: '0.25rem' }}>start-backend-docker.bat</code>
          <br />
          <strong>Cách 2 - Python:</strong>
          <br />1. Mở PowerShell/Command Prompt
          <br />2. Chạy: <code style={{ background: '#f3f4f6', padding: '0.125rem 0.25rem', borderRadius: '0.25rem' }}>cd backend</code>
          <br />3. Chạy: <code style={{ background: '#f3f4f6', padding: '0.125rem 0.25rem', borderRadius: '0.25rem' }}>python main.py</code>
        </div>
        <button
          onClick={checkBackendStatus}
          disabled={isChecking}
          style={{
            padding: '0.5rem 1rem',
            background: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            fontSize: '0.75rem',
            cursor: isChecking ? 'not-allowed' : 'pointer',
            marginRight: '0.5rem'
          }}
        >
          {isChecking ? 'Đang kiểm tra...' : 'Thử lại'}
        </button>
        {onRetry && (
          <button
            onClick={onRetry}
            style={{
              padding: '0.5rem 1rem',
              background: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            Thử lại chức năng
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: '100px',
      right: '2rem',
      padding: '0.75rem',
      backgroundColor: '#f0fdf4',
      border: '1px solid #bbf7d0',
      borderRadius: '0.5rem',
      color: '#059669',
      fontSize: '0.75rem',
      zIndex: 1000,
      maxWidth: '200px'
    }}>
      ✅ Backend Online
    </div>
  );
};

export default BackendStatus;
