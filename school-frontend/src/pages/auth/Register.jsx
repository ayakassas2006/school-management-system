import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { Shield, BookOpen, GraduationCap, Users, ArrowLeft } from 'lucide-react';
import Card from '../../components/ui/Card';
import { motion } from 'framer-motion';

export default function Register() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);

  const roles = [
    { id: 'teacher', label: 'Teacher', icon: <BookOpen size={32} />, color: 'var(--color-secondary)' },
    { id: 'student', label: 'Student', icon: <GraduationCap size={32} />, color: 'var(--color-accent)' },
    { id: 'parent', label: 'Parent', icon: <Users size={32} />, color: 'var(--color-success)' }
  ];

  const handleRegister = (e) => {
    e.preventDefault();
    // In a real app this creates a user, here we just route to login
    navigate('/login');
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
      {/* Left side */}
      <div style={{
        flex: 1,
        background: 'var(--gradient-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        color: 'white'
      }}>
        <div style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', top: '-10%', right: '-10%' }}></div>
        <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', bottom: '-10%', left: '-10%' }}></div>
        
        <div style={{ maxWidth: '400px', position: 'relative', zIndex: 10, padding: '2rem' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', lineHeight: 1.2 }}>Join EduSaaS.</h1>
          <p style={{ fontSize: '1.125rem', opacity: 0.9 }}>
            Create an account to gain access to our next-generation learning and management platform.
          </p>
        </div>
      </div>

      {/* Right side - Register Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', overflowY: 'auto' }}>
        <div style={{ maxWidth: '450px', width: '100%' }}>
          
          {!selectedRole ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h2 style={{ fontSize: '2rem' }}>Select Role</h2>
              </div>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '2.5rem' }}>Are you joining as a Student, Teacher, or Parent?</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {roles.map((role) => (
                  <Card 
                    key={role.id} 
                    hoverEffect={true}
                    onClick={() => setSelectedRole(role.id)}
                    style={{ 
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1.5rem',
                      padding: '1.5rem', background: 'white', border: '1px solid var(--color-border)'
                    }}
                  >
                    <div style={{ color: role.color, padding: '0.5rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)' }}>{role.icon}</div>
                    <span style={{ fontWeight: '600', fontSize: '1.2rem' }}>Join as {role.label}</span>
                  </Card>
                ))}
              </div>
              <div style={{ marginTop: '2.5rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: '600', textDecoration: 'none' }}>Sign In here</Link>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ background: 'white', padding: '3rem', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)' }}>
              <button 
                onClick={() => setSelectedRole(null)} 
                style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.875rem', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
              >
                ← Change Role
              </button>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Create Account</h2>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Registering as a <strong style={{ textTransform: 'capitalize' }}>{selectedRole}</strong></p>
              
              <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>First Name</label>
                      <input type="text" required style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none', fontSize: '1rem' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Last Name</label>
                      <input type="text" required style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none', fontSize: '1rem' }} />
                    </div>
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Email Address</label>
                  <input type="email" required style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none', fontSize: '1rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Password</label>
                  <input type="password" required style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none', fontSize: '1rem' }} />
                </div>
                
                {selectedRole === 'student' && (
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Student ID / Enrollment Code</label>
                      <input type="text" required style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none', fontSize: '1rem' }} />
                    </div>
                )}
                {selectedRole === 'parent' && (
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Student Association Code</label>
                      <input type="text" required style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none', fontSize: '1rem' }} />
                    </div>
                )}
                
                <Button variant="primary" size="lg" style={{ width: '100%', marginTop: '1rem' }}>Create Account</Button>
                <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: '600', textDecoration: 'none' }}>Sign In</Link>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
