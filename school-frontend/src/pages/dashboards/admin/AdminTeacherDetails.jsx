import React from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { Mail, Phone, BookOpen, Star, Edit } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export default function AdminTeacherDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <button style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', marginBottom: '0.5rem', fontWeight: '500' }} onClick={() => navigate('/dashboard/admin/directory')}>
            ← Back to Directory
          </button>
          <h1 style={{ fontSize: '2rem' }}>Teacher Profile</h1>
        </div>
        <Button variant="primary">
          <Edit size={18} style={{ marginRight: 8 }} /> Edit Profile
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
              SJ
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Dr. Sarah Jenkins</h2>
            <div style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>{id || 'TCH-2993'} • Science Department</div>
            <span style={{ background: 'var(--color-primary)20', color: 'var(--color-primary)', padding: '0.25rem 1rem', borderRadius: '1rem', fontSize: '0.875rem', fontWeight: '600' }}>Senior Faculty</span>
          </Card>

          <Card>
            <h3 style={{ marginBottom: '1.25rem', fontSize: '1.1rem' }}>Contact Info</h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', listStyle: 'none', padding: 0 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Mail size={18} color="var(--color-text-muted)" />
                <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>s.jenkins@edusaas.com</div>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Phone size={18} color="var(--color-text-muted)" />
                <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>+1 234-567-8901</div>
              </li>
            </ul>
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <Card style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Assigned Classes</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-text-main)' }}>4</div>
            </Card>
            <Card style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Total Students</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-text-main)' }}>142</div>
            </Card>
            <Card style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Rating</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-warning)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                4.8 <Star size={24} fill="currentColor" />
              </div>
            </Card>
          </div>

          <Card style={{ padding: 0 }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
              <h3 style={{ margin: 0 }}>Current Schedule</h3>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--color-bg)', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Class</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Time</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Room</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Students</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Physics 101', time: 'Mon, Wed 09:00 AM', room: 'Lab 2', students: 35 },
                  { name: 'Advanced Physics', time: 'Tue, Thu 11:00 AM', room: 'Lab 2', students: 28 },
                  { name: 'General Science', time: 'Mon, Fri 01:00 PM', room: 'Room 304', students: 40 }
                ].map((c, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><BookOpen size={16} color="var(--color-primary)"/> {c.name}</td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-muted)' }}>{c.time}</td>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>{c.room}</td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-muted)' }}>{c.students}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </div>
  );
}
