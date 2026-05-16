import React from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { Users, FileText, CheckCircle, Clock } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export default function TeacherClassDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <button style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', marginBottom: '0.5rem', fontWeight: '500' }} onClick={() => navigate('/dashboard/teacher/classes')}>
            ← Back to My Classes
          </button>
          <h1 style={{ fontSize: '2rem' }}>Physics 101 - {id || 'Section A'}</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
            <Button variant="outline" onClick={() => navigate('/dashboard/teacher/attendance')}>Take Attendance</Button>
            <Button variant="primary" onClick={() => navigate('/dashboard/teacher/assignments')}>Manage Assignments</Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        <Card style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)', padding: '1rem', borderRadius: '50%' }}><Users size={24}/></div>
            <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>32</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Enrolled Students</div>
            </div>
        </Card>
        <Card style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'var(--color-success)20', color: 'var(--color-success)', padding: '1rem', borderRadius: '50%' }}><CheckCircle size={24}/></div>
            <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>94%</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Avg Attendance</div>
            </div>
        </Card>
        <Card style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'var(--color-warning)20', color: 'var(--color-warning)', padding: '1rem', borderRadius: '50%' }}><FileText size={24}/></div>
            <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>3/12</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Assignments Due</div>
            </div>
        </Card>
        <Card style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'var(--color-secondary)20', color: 'var(--color-secondary)', padding: '1rem', borderRadius: '50%' }}><Clock size={24}/></div>
            <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Tomorrow</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Next Lecture</div>
            </div>
        </Card>
      </div>

      <Card style={{ padding: 0 }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
            <h3 style={{ margin: 0 }}>Class Roster & Recent Performance</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
            <tr style={{ background: 'var(--color-bg)', color: 'var(--color-text-muted)', fontSize: '0.875rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '1.5rem', fontWeight: '600' }}>Student Name</th>
                <th style={{ padding: '1.5rem', fontWeight: '600' }}>Attendance</th>
                <th style={{ padding: '1.5rem', fontWeight: '600' }}>Last Quiz</th>
                <th style={{ padding: '1.5rem', fontWeight: '600' }}>Overall Grade</th>
                <th style={{ padding: '1.5rem', fontWeight: '600', textAlign: 'right' }}>Action</th>
            </tr>
            </thead>
            <tbody>
            {[
                { id: '1', name: 'Alex Johnson', att: '98%', quiz: '92/100', grade: '94% (A)' },
                { id: '2', name: 'Mia Johnson', att: '85%', quiz: '75/100', grade: '81% (B-)' },
                { id: '3', name: 'Emily Davis', att: '99%', quiz: '100/100', grade: '99% (A+)' },
            ].map((s, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '1.5rem', fontWeight: '500' }}>{s.name}</td>
                    <td style={{ padding: '1.5rem' }}>{s.att}</td>
                    <td style={{ padding: '1.5rem' }}>{s.quiz}</td>
                    <td style={{ padding: '1.5rem', fontWeight: '600', color: 'var(--color-success)' }}>{s.grade}</td>
                    <td style={{ padding: '1.5rem', textAlign: 'right' }}>
                        <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/teacher/students')}>View Profile</Button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
      </Card>
    </div>
  );
}
