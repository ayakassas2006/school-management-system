import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { LogIn, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

export default function RoleSelection() {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Left side */}
      <div style={{
        flex: 1,
        background: 'var(--gradient-primary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        color: 'white',
        padding: '2rem'
      }}>
        {/* Decorative background circles */}
        <div style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', top: '-10%', right: '-10%' }}></div>
        <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', bottom: '-10%', left: '-10%' }}></div>
        
        <div style={{ maxWidth: '450px', position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', background: 'white', padding: '1rem', borderRadius: '50%', color: 'var(--color-primary)', marginBottom: '2rem' }}>
              <GraduationCap size={48} />
          </div>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', lineHeight: 1.2 }}>EduSaaS Portal</h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, lineHeight: 1.6 }}>
            The all-in-one educational platform connecting students, teachers, and parents in one seamless ecosystem.
          </p>
        </div>
      </div>

      {/* Right side - Action Selection */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ maxWidth: '400px', width: '100%' }}>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Welcome!</h2>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '3rem', fontSize: '1.1rem' }}>How would you like to proceed today?</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <button
                    onClick={() => navigate('/login')}
                    style={{ 
                        display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem', 
                        background: 'white', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', 
                        cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)', width: '100%', textAlign: 'left'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.borderColor = 'var(--color-primary)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.borderColor = 'var(--color-border)'; }}
                >
                    <div style={{ background: 'var(--color-primary)', color: 'white', padding: '1rem', borderRadius: '50%' }}>
                        <LogIn size={24} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '0.25rem', color: 'var(--color-text-main)' }}>Sign In</h3>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Access your existing dashboard</p>
                    </div>
                </button>

              </div>

              <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                  <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontWeight: '500', fontSize: '1rem' }}>
                     ← Return to Public Website
                  </button>
              </div>
            </motion.div>
        </div>
      </div>
    </div>
  );
}
