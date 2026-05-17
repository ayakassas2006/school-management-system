import React from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { Mail, Phone, MapPin, Edit, CheckCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export default function AdminStudentDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <button style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', marginBottom: '0.5rem', fontWeight: '500' }} onClick={() => navigate('/dashboard/admin/directory')}>
            ← Back to Directory
          </button>
          <h1 style={{ fontSize: '2rem' }}>Student Profile</h1>
        </div>
        <Button variant="primary">
          <Edit size={18} style={{ marginRight: 8 }} /> Edit Profile
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Left Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', marginBottom: '1.5rem', border: '4px solid var(--color-primary-light)' }}>
              <img src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Student" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Alex Johnson</h2>
            <div style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>{id || 'STD-1002'} • 10th Grade, Sec A</div>
            <span style={{ background: 'var(--color-success)20', color: 'var(--color-success)', padding: '0.25rem 1rem', borderRadius: '1rem', fontSize: '0.875rem', fontWeight: '600' }}>Active Student</span>
          </Card>

          <Card>
            <h3 style={{ marginBottom: '1.25rem', fontSize: '1.1rem' }}>Contact & Personal</h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', listStyle: 'none', padding: 0 }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <Mail size={18} color="var(--color-text-muted)" style={{ marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Email</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>a.johnson@student.com</div>
                </div>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <Phone size={18} color="var(--color-text-muted)" style={{ marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Phone</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>+1 234-567-8902</div>
                </div>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <MapPin size={18} color="var(--color-text-muted)" style={{ marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Address</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: '500', lineHeight: 1.4 }}>123 Education Lane, <br/>Apt 4B, Academiacity</div>
                </div>
              </li>
            </ul>
          </Card>
        </div>

        {/* Right Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <Card style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Academic GPA</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-text-main)' }}>3.8</div>
            </Card>
            <Card style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Attendance</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-success)' }}>92%</div>
            </Card>
            <Card style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Conduct</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>A+</div>
            </Card>
          </div>

          <Card style={{ padding: 0 }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
              <h3 style={{ margin: 0 }}>Enrolled Courses</h3>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--color-bg)', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Subject</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Instructor</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Grade</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Mathematics 10A', inst: 'Mark Davis', grade: '92%', status: 'Pass' },
                  { name: 'Physics 11B', inst: 'Sarah Jenkins', grade: '85%', status: 'Pass' },
                  { name: 'World History', inst: 'Elena Rodríguez', grade: '90%', status: 'Pass' }
                ].map((c, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>{c.name}</td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-muted)' }}>{c.inst}</td>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>{c.grade}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-success)', fontSize: '0.875rem', fontWeight: '500' }}>
                        <CheckCircle size={16}/> {c.status}
                      </span>
                    </td>
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
