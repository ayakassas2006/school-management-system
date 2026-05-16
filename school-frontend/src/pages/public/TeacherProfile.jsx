import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Calendar, BookOpen } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function TeacherProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh', padding: '6rem 5% 8rem' }}>
      <button 
        onClick={() => navigate('/teachers')}
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontWeight: '500', marginBottom: '3rem', cursor: 'pointer', background: 'none', border: 'none' }}
      >
        <ArrowLeft size={20} /> Back to Faculty
      </button>

      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: '350px 1fr', gap: '4rem' }}>
        {/* Left Col - Photo & Quick Info */}
        <div>
            <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop" 
                alt="Teacher" 
                style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)', marginBottom: '2rem' }} 
            />
            <div style={{ background: '#F8FAFC', padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
                <h4 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Contact Information</h4>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem', color: 'var(--color-text-muted)' }}>
                    <Mail size={18} />
                    <span>s.jenkins@edusaas.com</span>
                </div>
                <Button variant="primary" style={{ width: '100%', marginTop: '1rem' }}>Message Teacher</Button>
            </div>
        </div>

        {/* Right Col - Bio & Details */}
        <div>
            <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>Dr. Sarah Jenkins</h1>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', fontWeight: '600', marginBottom: '2rem' }}>Head of Sciences</h2>
            
            <div style={{ marginBottom: '3rem' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Biography</h3>
                <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8', fontSize: '1.1rem' }}>
                    Dr. Jenkins brings over 15 years of experience in scientific research and education. She holds a Ph.D. in Biological Sciences and is passionate about making complex scientific concepts accessible to young minds. Under her leadership, our science department has won several national innovation awards.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                <div style={{ background: 'var(--color-primary-light)', padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
                        <BookOpen size={24} />
                        <h4 style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Subjects Taught</h4>
                    </div>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--color-text-main)' }}>
                        <li>AP Biology</li>
                        <li>Advanced Chemistry</li>
                        <li>Environmental Science</li>
                    </ul>
                </div>
                <div style={{ background: '#ECFEFF', padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', color: 'var(--color-secondary)' }}>
                        <Calendar size={24} />
                        <h4 style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Office Hours</h4>
                    </div>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--color-text-main)' }}>
                        <li>Monday: 3:30 PM - 5:00 PM</li>
                        <li>Wednesday: 3:30 PM - 5:00 PM</li>
                    </ul>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}
