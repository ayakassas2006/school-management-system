import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../store/authSlice';
import { authApi } from '../../services/api';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { motion } from 'framer-motion';
import { Shield, BookOpen, GraduationCap, Users, AlertCircle, ArrowLeft } from 'lucide-react';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roles = [
    {
      id: 'admin',
      label: 'Admin',
      icon: <Shield size={32} />,
      color: 'var(--color-primary)',
      demo: 'admin@edusaas.com',
    },
    {
      id: 'teacher',
      label: 'Teacher',
      icon: <BookOpen size={32} />,
      color: 'var(--color-secondary)',
      demo: 'teacher@edusaas.com',
    },
    {
      id: 'student',
      label: 'Student',
      icon: <GraduationCap size={32} />,
      color: 'var(--color-accent)',
      demo: 'student@edusaas.com',
    },
    {
      id: 'parent',
      label: 'Parent',
      icon: <Users size={32} />,
      color: 'var(--color-success)',
      demo: 'parent@edusaas.com',
    },
  ];

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setEmail(role.demo);
    setPassword('123456');
    setError('');
    localStorage.setItem('selectedRole', role.id);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!selectedRole) {
      setError('Please select a role first.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authApi.login(email, password, selectedRole.id);

      localStorage.setItem('auth_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      dispatch(
        login({
          user: response.data.user,
          access_token: response.data.access_token,
        })
      );

      navigate(`/dashboard/${response.data.user.role}`);
    } catch (err) {
      setError(err?.message || 'Invalid email, password, or role.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)', position: 'relative' }}>
      {/* Back to Home button */}
      <a
        href="/"
        style={{
          position: 'absolute',
          top: '1.25rem',
          left: '1.25rem',
          zIndex: 100,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          borderRadius: '2rem',
          background: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(8px)',
          color: 'white',
          fontWeight: '600',
          fontSize: '0.875rem',
          textDecoration: 'none',
          border: '1px solid rgba(255,255,255,0.3)',
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.35)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
      >
        <ArrowLeft size={16} /> Back to Home
      </a>
      <div
        style={{
          flex: 1,
          background: 'var(--gradient-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          color: 'white',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            top: '-10%',
            right: '-10%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            bottom: '-10%',
            left: '-10%',
          }}
        />
        <div style={{ maxWidth: '400px', position: 'relative', zIndex: 10, padding: '2rem' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', lineHeight: 1.2 }}>
            Welcome back to EduSaaS.
          </h1>
          <p style={{ fontSize: '1.125rem', opacity: 0.9 }}>
            Sign in to access your personalized educational dashboard and stay connected with your institution.
          </p>

        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}
      >
        <div style={{ maxWidth: '450px', width: '100%' }}>
          {!selectedRole ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Select your role</h2>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '2.5rem' }}>
                Choose how you want to log in to the system
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {roles.map((role) => (
                  <Card
                    key={role.id}
                    hoverEffect={true}
                    onClick={() => handleRoleSelect(role)}
                    style={{
                      cursor: 'pointer',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '2rem 1.5rem',
                    }}
                  >
                    <div style={{ color: role.color }}>{role.icon}</div>
                    <span style={{ fontWeight: '600' }}>{role.label}</span>
                  </Card>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                background: 'white',
                padding: '3rem',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              <button
                onClick={() => {
                  setSelectedRole(null);
                  setEmail('');
                  setPassword('');
                  setError('');
                  localStorage.removeItem('selectedRole');
                }}
                style={{
                  color: 'var(--color-text-muted)',
                  marginBottom: '1.5rem',
                  fontSize: '0.875rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                ← Back to roles
              </button>

              <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Sign In</h2>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                Continue as <strong>{selectedRole.label}</strong>
              </p>

              {error && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    background: 'rgba(239,68,68,0.1)',
                    borderRadius: 'var(--radius-md)',
                    color: '#dc2626',
                    marginBottom: '1.5rem',
                    fontSize: '0.875rem',
                  }}
                >
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      outline: 'none',
                      fontSize: '1rem',
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      outline: 'none',
                      fontSize: '1rem',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    marginTop: '1rem',
                    padding: '1rem 1.5rem',
                    background: 'linear-gradient(to right, #6366f1, #06b6d4)',
                    color: '#ffffff',
                    fontWeight: '700',
                    fontSize: '1.1rem',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.3), 0 2px 4px -1px rgba(99, 102, 241, 0.15)',
                    opacity: loading ? 0.7 : 1,
                  }}
                  onMouseOver={(e) => {
                    if (!loading) {
                      e.currentTarget.style.background = 'linear-gradient(to right, #818cf8, #22d3ee)';
                      e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(99, 102, 241, 0.4), 0 4px 6px -2px rgba(99, 102, 241, 0.2)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!loading) {
                      e.currentTarget.style.background = 'linear-gradient(to right, #6366f1, #06b6d4)';
                      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(99, 102, 241, 0.3), 0 2px 4px -1px rgba(99, 102, 241, 0.15)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {loading ? 'Authenticating...' : 'Sign In'}
                </button>

              </form>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}