import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';

export default function PublicTeachers() {
  const navigate = useNavigate();

  const teachers = [
    { id: '1', name: 'Dr. Sarah Jenkins', role: 'Head of Sciences', exp: '15 Years', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop' },
    { id: '2', name: 'Prof. Mark Davis', role: 'Mathematics Lead', exp: '12 Years', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop' },
    { id: '3', name: 'Elena Rodríguez', role: 'Arts & Humanities', exp: '8 Years', img: 'https://images.unsplash.com/photo-1580894732444-8ecded790047?q=80&w=600&auto=format&fit=crop' },
    { id: '4', name: 'James Wilson', role: 'Physical Education', exp: '10 Years', img: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=600&auto=format&fit=crop' },
    { id: '5', name: 'Dr. Emily Chen', role: 'Computer Science', exp: '9 Years', img: 'https://images.unsplash.com/photo-1594824432248-c8bc7339794e?q=80&w=600&auto=format&fit=crop' },
    { id: '6', name: 'Michael Brown', role: 'History Teacher', exp: '20 Years', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop' },
  ];

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', padding: '6rem 5% 8rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '5rem', maxWidth: '800px', margin: '0 auto 5rem' }}>
        <h4 style={{ color: 'var(--color-primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Faculty</h4>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>Meet Our Exceptional Educators</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.2rem', lineHeight: '1.8' }}>
          Our teachers are passionate experts dedicated to fostering a supportive and engaging learning environment for every student.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
        {teachers.map((teacher) => (
          <div 
            key={teacher.id} 
            style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', background: 'white', boxShadow: 'var(--shadow-md)', transition: 'transform 0.3s, box-shadow 0.3s', cursor: 'pointer' }} 
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = 'var(--shadow-xl)'; }} 
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
            onClick={() => navigate(`/teachers/${teacher.id}`)}
          >
            <img src={teacher.img} alt={teacher.name} style={{ width: '100%', height: '350px', objectFit: 'cover' }} />
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: 'var(--color-text-main)' }}>{teacher.name}</h3>
              <p style={{ color: 'var(--color-primary)', fontWeight: '600', marginBottom: '0.5rem' }}>{teacher.role}</p>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{teacher.exp} Experience</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
