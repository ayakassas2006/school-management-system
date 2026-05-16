import React from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { BookOpen, Video, FileText, Users, Star, ChevronRight } from 'lucide-react';

export default function StudentCourseDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div>
      <button onClick={() => navigate('/dashboard/student/courses')} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', marginBottom: '0.75rem', fontWeight: '500' }}>
        ← Back to Courses
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div>
          <div style={{ background: 'var(--gradient-primary)', borderRadius: 'var(--radius-lg)', padding: '2rem', color: 'white', marginBottom: '2rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: '-20px', top: '-20px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}></div>
            <BookOpen size={40} style={{ marginBottom: '1rem', opacity: 0.9 }} />
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Physics 101 – Section A</h1>
            <p style={{ opacity: 0.85, marginBottom: '1.5rem' }}>Dr. Sarah Jenkins • Fall 2026 • Room 204</p>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <div><div style={{ opacity: 0.75, fontSize: '0.8rem' }}>Progress</div><div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>72%</div></div>
              <div><div style={{ opacity: 0.75, fontSize: '0.8rem' }}>Lectures</div><div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>18/24</div></div>
              <div><div style={{ opacity: 0.75, fontSize: '0.8rem' }}>Grade</div><div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>A-</div></div>
            </div>
          </div>

          <Card style={{ padding: 0 }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
              <h3 style={{ margin: 0 }}>Course Content</h3>
            </div>
            {[
              { title: 'Week 1: Introduction to Forces', items: 3, done: true },
              { title: 'Week 2: Newton\'s Laws', items: 4, done: true },
              { title: 'Week 3: Wave Mechanics', items: 3, done: false },
              { title: 'Week 4: Thermodynamics', items: 4, done: false },
            ].map((week, i) => (
              <div key={i} style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background='var(--color-bg)'} onMouseOut={e => e.currentTarget.style.background='transparent'}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: week.done ? 'var(--color-success)20' : 'var(--color-bg)', color: week.done ? 'var(--color-success)' : 'var(--color-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.875rem' }}>
                    {week.done ? '✓' : i+1}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600' }}>{week.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{week.items} lessons</div>
                  </div>
                </div>
                <ChevronRight size={18} color="var(--color-text-muted)" />
              </div>
            ))}
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card>
            <h3 style={{ marginBottom: '1rem' }}>Instructor</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>SJ</div>
              <div>
                <div style={{ fontWeight: '600' }}>Dr. Sarah Jenkins</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Physics Department</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-warning)', marginBottom: '1rem' }}>
              {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="currentColor" />)}
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>4.9 (320 reviews)</span>
            </div>
            <Button variant="outline" style={{ width: '100%' }}>Message Instructor</Button>
          </Card>

          <Card>
            <h3 style={{ marginBottom: '1rem' }}>Resources</h3>
            {[
              { icon: <FileText size={16}/>, name: 'Syllabus.pdf', size: '0.5 MB' },
              { icon: <Video size={16}/>, name: 'Lecture 15 Recording', size: '220 MB' },
              { icon: <FileText size={16}/>, name: 'Lab Report Template', size: '0.2 MB' },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0', borderBottom: '1px solid var(--color-border)', cursor: 'pointer' }}>
                <span style={{ color: 'var(--color-primary)' }}>{r.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>{r.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{r.size}</div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
