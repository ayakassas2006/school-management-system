import React from 'react';
import { BookOpen, MonitorPlay, Users, Award, ChevronRight } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export default function Programs() {
  const navigate = useNavigate();

  const programs = [
    { id: 'early-childhood', title: 'Early Childhood', ageGroup: 'Ages 3-5', desc: 'Fostering curiosity and social skills in a nurturing environment.', icon: <Users size={32} color="#10B981" />, bg: '#ECFDF5', image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?q=80&w=800&auto=format&fit=crop' },
    { id: 'elementary', title: 'Elementary School', ageGroup: 'Ages 6-10', desc: 'Building strong foundations in core subjects with project-based learning.', icon: <BookOpen size={32} color="#3B82F6" />, bg: '#eff6ff', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop' },
    { id: 'middle-school', title: 'Middle School', ageGroup: 'Ages 11-13', desc: 'Discovering passions through specialized electives and advanced curriculum.', icon: <MonitorPlay size={32} color="#8B5CF6" />, bg: '#f5f3ff', image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=800&auto=format&fit=crop' },
    { id: 'high-school', title: 'High School', ageGroup: 'Ages 14-18', desc: 'College prep, AP courses, and leadership development programs.', icon: <Award size={32} color="#F59E0B" />, bg: '#fffbeb', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop' },
  ];

  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh', padding: '6rem 5% 8rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '5rem', maxWidth: '800px', margin: '0 auto 5rem' }}>
        <h4 style={{ color: 'var(--color-primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Academics</h4>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>Our Programs</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.2rem', lineHeight: '1.8' }}>
          We offer a comprehensive educational journey designed to challenge, inspire, and empower students at every stage of their development.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
        {programs.map((prog) => (
          <Card 
            key={prog.id} 
            hoverEffect={true} 
            style={{ padding: 0, overflow: 'hidden', cursor: 'pointer', border: '1px solid var(--color-border)' }}
            onClick={() => navigate(`/programs/${prog.id}`)}
          >
            <div style={{ height: '220px', position: 'relative' }}>
                <img src={prog.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={prog.title} />
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,255,255,0.9)', padding: '0.4rem 1rem', borderRadius: '2rem', fontWeight: 'bold', fontSize: '0.85rem' }}>
                    {prog.ageGroup}
                </div>
            </div>
            <div style={{ padding: '2.5rem' }}>
              <div style={{ background: prog.bg, width: '60px', height: '60px', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                {prog.icon}
              </div>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>{prog.title}</h3>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6', marginBottom: '1.5rem', fontSize: '1.05rem' }}>{prog.desc}</p>
              
              <div style={{ display: 'flex', alignItems: 'center', color: 'var(--color-primary)', fontWeight: '600', gap: '0.5rem' }}>
                  Explore Program <ChevronRight size={18} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
