import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { motion } from 'framer-motion';

export default function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)' }}>
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
         {/* Decorative background circles */}
         <div style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', top: '-10%', right: '-10%' }}></div>
        <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', bottom: '-10%', left: '-10%' }}></div>
        
        <div style={{ maxWidth: '400px', position: 'relative', zIndex: 10, padding: '2rem' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', lineHeight: 1.2 }}>Account Recovery.</h1>
          <p style={{ fontSize: '1.125rem', opacity: 0.9 }}>
            Securely reset your password to regain access to your dashboard.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ maxWidth: '450px', width: '100%' }}>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ background: 'white', padding: '3rem', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)' }}>
              
              {!submitted ? (
                  <>
                      <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Reset Password</h2>
                      <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Enter your email address and we'll send you a link to reset your password.</p>
                      
                      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Email Address</label>
                          <input type="email" required placeholder="name@example.com" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none', fontSize: '1rem' }} />
                        </div>
                        
                        <Button variant="primary" size="lg" style={{ width: '100%', marginTop: '1rem' }}>Send Reset Link</Button>
                      </form>
                      
                      <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem' }}>
                         <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: '600', textDecoration: 'none' }}>← Back to Sign In</Link>
                      </div>
                  </>
              ) : (
                  <div style={{ textAlign: 'center' }}>
                      <div style={{ width: '60px', height: '60px', background: 'var(--color-success)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '2rem' }}>✓</div>
                      <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Check your email</h2>
                      <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', lineHeight: '1.6' }}>
                          We have sent a password reset link to your email address. Please check your inbox and spam folder.
                      </p>
                      <Link to="/login" style={{ display: 'inline-block', color: 'var(--color-primary)', fontWeight: '600', textDecoration: 'none' }}>Return to Sign In</Link>
                  </div>
              )}

            </motion.div>
        </div>
      </div>
    </div>
  );
}
