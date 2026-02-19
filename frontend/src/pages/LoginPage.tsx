import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import LoginForm from '@/components/auth/LoginForm';

// To use a real photo: add your image to frontend/src/assets/login-bg.jpg
// then replace the gradient below with: backgroundImage: `url(${loginBg})`
// import loginBg from '@/assets/login-bg.jpg';

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#dfe3e8',
    }}>
      {/* Outer frame */}
      <div style={{
        background: '#f4f4f4',
        borderRadius: 16,
        padding: 18,
        boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
      }}>
        {/* Inner card — split layout */}
        <div style={{
          display: 'flex',
          width: 860,
          minHeight: 460,
          borderRadius: 10,
          overflow: 'hidden',
        }}>
          {/* Left: photo panel — replace background with your image:
              import loginBg from '@/assets/login-bg.jpg'
              then set backgroundImage: `url(${loginBg})` */}
          <div style={{
            flex: 1,
            background: 'linear-gradient(145deg, #3DBE9A 0%, #2a9d8f 60%, #1f7f72 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: 460,
          }} />

          {/* Right: form panel */}
          <div style={{
            width: 340,
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 32px',
          }}>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
