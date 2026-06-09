import { authService } from '@/authService';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';

export default function ResetPasswordWeb() {
  const { colors, theme } = useTheme();
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successVisible, setSuccessVisible] = useState(false);
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  const placeholderStyles = `
    input::placeholder {
      color: ${colors.secondaryText} !important;
      opacity: 0.7;
    }
  `;

  const handleResetPassword = async () => {
    setError('');

    if (!newPassword || !confirmPassword) {
      setError('Please enter and confirm your new password');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const result = await authService.updatePassword(newPassword);
      if (result.success) {
        setSuccessVisible(true);
        redirectTimerRef.current = setTimeout(() => {
          void authService.signOut().finally(() => {
            router.replace('/');
          });
        }, 5000);
      } else {
        setError(result.error || 'Failed to update password');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleResetPassword();
    }
  };

  const renderPasswordInput = (
    label: string,
    value: string,
    onChange: (value: string) => void,
    visible: boolean,
    onToggleVisible: () => void
  ) => (
    <div style={{ position: 'relative', width: '100%' }}>
      <label
        style={{
          position: 'absolute',
          top: '0',
          left: '16px',
          backgroundColor: theme === 'dark' ? 'rgba(25, 25, 91, 0.7)' : '#F9FAFB',
          padding: '0 6px',
          fontSize: '13px',
          fontWeight: 600,
          color: colors.text,
          transform: 'translateY(-50%)',
          lineHeight: '1',
          zIndex: 1,
        }}
      >
        {label}
      </label>
      <input
        type={visible ? 'text' : 'password'}
        placeholder="********"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
        style={{
          width: '100%',
          padding: '16px 42px 16px 16px',
          border: `1px solid ${colors.border}`,
          borderRadius: '10px',
          fontSize: '16px',
          outline: 'none',
          boxSizing: 'border-box',
          backgroundColor: theme === 'dark' ? 'rgba(25, 25, 91, 0.7)' : '#F9FAFB',
          color: colors.text,
        }}
      />
      <button
        type="button"
        onClick={onToggleVisible}
        disabled={loading}
        aria-label={visible ? `Hide ${label}` : `Show ${label}`}
        style={{
          position: 'absolute',
          top: '50%',
          right: '12px',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          color: colors.secondaryText,
        }}
      >
        <Ionicons name={visible ? 'eye' : 'eye-off'} size={20} color={colors.secondaryText} />
      </button>
    </div>
  );

  return (
    <>
      <style>{placeholderStyles}</style>
      <div
        style={{
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          background: theme === 'dark' ? 'linear-gradient(to right, #000017, #000074)' : '#FFFFFF',
          fontFamily: 'Geist, sans-serif',
          overflowY: 'auto',
          overflowX: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            width: '100%',
            borderBottom: `1px solid ${colors.border}`,
            padding: '20px 0',
            textAlign: 'center',
            fontWeight: 700,
            color: colors.primary,
            fontSize: '22px',
            letterSpacing: '0.5px',
            background: theme === 'dark' ? 'linear-gradient(to right, #000017, #000074)' : '#FFFFFF',
            backdropFilter: 'blur(10px)',
          }}
        >
          PALINDROME®
        </div>

        {error && (
          <div
            style={{
              marginTop: '20px',
              padding: '12px 20px',
              backgroundColor: colors.error + '20',
              border: `1px solid ${colors.error}`,
              borderRadius: '8px',
              color: colors.error,
              fontSize: '14px',
              maxWidth: '400px',
              textAlign: 'center',
              boxSizing: 'border-box',
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            flex: 1,
            width: '100%',
            maxWidth: '1100px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: windowWidth < 900 ? 'center' : 'flex-start',
            padding: windowWidth < 900 ? '28px 20px 40px' : 'clamp(32px, 6vh, 60px) 40px',
            gap: windowWidth < 900 ? '24px' : '60px',
            flexWrap: 'wrap',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              flex: 1,
              minWidth: windowWidth < 900 ? '0' : '360px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: windowWidth < 900 ? 'center' : 'flex-start',
              marginTop: windowWidth < 900 ? '0' : 'clamp(16px, 6vh, 60px)',
            }}
          >
            <div style={{ width: 'min(400px, 100%)', textAlign: windowWidth < 900 ? 'center' : 'right' }}>
              <h1
                style={{
                  fontSize: windowWidth < 520 ? '28px' : '36px',
                  fontWeight: 700,
                  marginBottom: '10px',
                  color: colors.text,
                }}
              >
                Enter New Password
              </h1>
              <p
                style={{
                  fontSize: '18px',
                  color: colors.secondaryText,
                }}
              >
                Confirm your new password to continue
              </p>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              minWidth: '0',
              maxWidth: '400px',
              width: '100%',
              marginTop: windowWidth < 900 ? '0' : 'clamp(24px, 8vh, 80px)',
            }}
          >
            <div
              style={{
                border: `1px solid ${colors.border}`,
                borderRadius: '16px',
                padding: '32px',
                boxShadow:
                  theme === 'dark'
                    ? '0 4px 20px rgba(0, 96, 255, 0.1)'
                    : '0 2px 10px rgba(0,0,0,0.04)',
                backgroundColor: theme === 'dark' ? 'rgba(25, 25, 91, 0.7)' : '#FFFFFF',
                backdropFilter: 'blur(10px)',
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  width: '100%',
                  maxWidth: '400px',
                  margin: '0 auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                }}
              >
                {renderPasswordInput(
                  'New Password',
                  newPassword,
                  setNewPassword,
                  newPasswordVisible,
                  () => setNewPasswordVisible((value) => !value)
                )}
                {renderPasswordInput(
                  'Confirm Password',
                  confirmPassword,
                  setConfirmPassword,
                  confirmPasswordVisible,
                  () => setConfirmPasswordVisible((value) => !value)
                )}
                <button
                  type="button"
                  onClick={handleResetPassword}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '50px',
                    backgroundColor: loading ? colors.secondaryText : colors.buttonPrimary,
                    color: colors.buttonText,
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '16px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 12px rgba(0, 96, 255, 0.3)',
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading ? 'Updating...' : 'Reset Password'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {successVisible && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-success-title"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.48)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: windowWidth < 520 ? '16px' : '24px',
            zIndex: 50,
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              width: 'min(420px, 100%)',
              border: `1px solid ${colors.border}`,
              borderRadius: '16px',
              backgroundColor: theme === 'dark' ? '#101543' : '#FFFFFF',
              boxShadow: '0 24px 80px rgba(0,0,0,0.28)',
              padding: windowWidth < 520 ? '24px' : '30px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '14px',
              textAlign: 'center',
            }}
          >
            <Ionicons name="checkmark-circle" size={42} color={theme === 'dark' ? '#7EA2FF' : '#007BFF'} />
            <h2
              id="reset-success-title"
              style={{
                margin: 0,
                color: colors.text,
                fontSize: '22px',
                lineHeight: 1.3,
                fontWeight: 700,
              }}
            >
              You have reset your password successfully
            </h2>
          </div>
        </div>
      )}
    </>
  );
}
