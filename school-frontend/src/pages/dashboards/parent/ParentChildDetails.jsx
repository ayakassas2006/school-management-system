import React from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { Activity, FileText, BookOpen, TrendingUp, MessageSquare, CheckCircle, Star } from 'lucide-react';

export default function ParentChildDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const academicData = {
    name: id === 'STD-1005' ? 'Mia Johnson' : 'Alex Johnson',
    grade: id === 'STD-1005' ? '7th Grade' : '10th Grade',
    section: id === 'STD-1005' ? 'C' : 'A',
    gpa: '3.85',
    attendance: '94%',
    courses: [
      { name: 'Physics 101', teacher: 'Dr. Sarah Jenkins', grade: 'A', percent: 92, comment: 'Excellent problem solving skills. Participates actively in lab sessions.' },
      { name: 'Mathematics 10A', teacher: 'Prof. Mark Davis', grade: 'B+', percent: 88, comment: 'Strong grasp of algebraic concepts. Needs more practice in geometry.' },
      { name: 'World History', teacher: 'Ms. Elena Rodríguez', grade: 'A', percent: 95, comment: 'Exceptional analytical writing. One of the top performers in class.' },
      { name: 'English Literature', teacher: 'Mr. James Wilson', grade: 'A-', percent: 90, comment: 'Great interpretation of classical texts. Homework is always on time.' },
    ]
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button 
            onClick={() => navigate('/dashboard/parent/children')} 
            style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-main)', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--color-primary-light)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--color-bg)'}
          >
            ←
          </button>
          <div>
              <h1 style={{ fontSize: '1.75rem', margin: 0 }}>Academic Report: {academicData.name}</h1>
              <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>Detailed performance breakdown for Semester 1, 2026</p>
          </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 3fr', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2.5rem 1.5rem' }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', marginBottom: '1.5rem', border: '4px solid var(--color-primary-light)', boxShadow: 'var(--shadow-lg)' }}>
              <img 
                src={academicData.name === 'Mia Johnson' ? "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" : "https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"} 
                alt="Child" style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem', fontWeight: '700' }}>{academicData.name}</h2>
            <p style={{ color: 'var(--color-text-muted)', margin: 0, fontWeight: '500' }}>{id || 'STD-1002'} • {academicData.grade}, Sec {academicData.section}</p>
            
            <div style={{ width: '100%', height: '1px', background: 'var(--color-border)', margin: '1.5rem 0' }}></div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', width: '100%' }}>
                <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.25rem' }}>Rank</div>
                    <div style={{ fontWeight: '700', color: 'var(--color-text-main)' }}>4th / 32</div>
                </div>
                <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.25rem' }}>Credits</div>
                    <div style={{ fontWeight: '700', color: 'var(--color-text-main)' }}>16.0</div>
                </div>
            </div>
          </Card>

          <Card>
            <h3 style={{ marginBottom: '1.25rem', fontSize: '1.1rem', fontWeight: '600' }}>Direct Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Button variant="primary" style={{ width: '100%', justifyContent: 'center', gap: '0.5rem' }} onClick={() => navigate('/dashboard/parent/messages')}>
                    <MessageSquare size={18}/> Contact Teachers
                </Button>
                <Button variant="outline" style={{ width: '100%', justifyContent: 'center', gap: '0.5rem' }} onClick={() => navigate('/dashboard/parent/reports')}>
                    <FileText size={18}/> Full History
                </Button>
            </div>
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
            {[
              { label: 'Cumulative GPA', value: academicData.gpa, icon: <TrendingUp size={22}/>, color: 'var(--color-primary)' },
              { label: 'Overall Attendance', value: academicData.attendance, icon: <Activity size={22}/>, color: 'var(--color-success)' },
              { label: 'Enrolled Courses', value: academicData.courses.length, icon: <BookOpen size={22}/>, color: 'var(--color-secondary)' },
              { label: 'Behavior Score', value: 'Excellent', icon: <CheckCircle size={22}/>, color: 'var(--color-warning)' },
            ].map((stat, i) => (
              <Card key={i} style={{ textAlign: 'center', border: `1px solid ${stat.color}20` }}>
                <div style={{ color: stat.color, marginBottom: '0.75rem', display: 'flex', justifyContent: 'center' }}>{stat.icon}</div>
                <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--color-text-main)' }}>{stat.value}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>{stat.label}</div>
              </Card>
            ))}
          </div>

          <Card style={{ padding: 0 }}>
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Detailed Performance</h3>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>Semester 1 • Finalized</span>
            </div>
            <div style={{ padding: '1.5rem 2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {academicData.courses.map((course, i) => (
                        <div key={i} style={{ padding: '1.5rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div>
                                    <h4 style={{ fontSize: '1.1rem', margin: '0 0 0.25rem 0', fontWeight: '700' }}>{course.name}</h4>
                                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>Teacher: {course.teacher}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '800', color: course.grade === 'A' ? 'var(--color-success)' : 'var(--color-primary)' }}>{course.grade}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: '600' }}>{course.percent}% Score</div>
                                </div>
                            </div>
                            <div style={{ background: 'var(--color-surface)', padding: '1rem', borderRadius: 'var(--radius-lg)', display: 'flex', gap: '0.75rem', border: '1px solid var(--color-border)' }}>
                                <Star size={18} color="var(--color-warning)" style={{ flexShrink: 0, marginTop: '2px' }}/>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Teacher's Comment</div>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-main)', fontStyle: 'italic', lineHeight: '1.5' }}>"{course.comment}"</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
