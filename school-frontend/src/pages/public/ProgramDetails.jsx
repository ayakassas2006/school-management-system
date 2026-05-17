import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function ProgramDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data fetching based on ID
  const programData = {
    'high-school': {
        title: 'High School Program',
        subtitle: 'Preparing students for university and beyond',
        desc: 'Our High School curriculum is a rigorous, college-preparatory program designed to challenge students intellectually while supporting their emotional and social development. With a wide range of Advanced Placement (AP) courses and specialized electives, students can tailor their education to their passions.',
        subjects: ['Advanced Mathematics', 'Physics, Chemistry, Biology', 'World Literature', 'Computer Science & AI', 'Global History'],
        outcomes: ['Top-tier University Acceptances', 'Critical Thinking & Leadership', 'Global Citizenship', 'Technological Fluency']
    }
  };

  const data = programData[id] || {
      title: 'Program Details',
      subtitle: 'Comprehensive academic curriculum',
      desc: 'Our academic programs are structured to provide the best possible learning experience for students, ensuring they develop both subject matter expertise and critical soft skills.',
      subjects: ['Core Mathematics', 'Sciences', 'Language Arts', 'Physical Education'],
      outcomes: ['Academic Excellence', 'Personal Growth', 'Social Responsibility']
  };

  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh', padding: '6rem 5% 8rem' }}>
      <button 
        onClick={() => navigate('/programs')}
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontWeight: '500', marginBottom: '3rem', cursor: 'pointer', background: 'none', border: 'none' }}
      >
        <ArrowLeft size={20} /> Back to Programs
      </button>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', color: 'var(--color-text-main)' }}>{data.title}</h1>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', fontWeight: '500', marginBottom: '2.5rem' }}>{data.subtitle}</h2>
        
        <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop" style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: 'var(--radius-2xl)', marginBottom: '3rem', boxShadow: 'var(--shadow-lg)' }} alt="Program" />

        <div style={{ marginBottom: '4rem' }}>
            <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--color-text-main)' }}>Overview</h3>
            <p style={{ fontSize: '1.15rem', color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
                {data.desc}
            </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginBottom: '4rem' }}>
            <div>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Key Subjects</h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {data.subjects.map((sub, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.1rem', color: 'var(--color-text-muted)' }}>
                            <div style={{ width: '8px', height: '8px', background: 'var(--color-primary)', borderRadius: '50%' }}></div>
                            {sub}
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Learning Outcomes</h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {data.outcomes.map((out, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.1rem', color: 'var(--color-text-main)', fontWeight: '500' }}>
                            <CheckCircle color="var(--color-success)" size={20} />
                            {out}
                        </li>
                    ))}
                </ul>
            </div>
        </div>

        <div style={{ background: '#F8FAFC', padding: '3rem', borderRadius: 'var(--radius-xl)', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Ready to join this program?</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Contact our admissions office to schedule a tour or begin your application.</p>
            <Button variant="primary" size="lg">Apply Now</Button>
        </div>
      </div>
    </div>
  );
}
