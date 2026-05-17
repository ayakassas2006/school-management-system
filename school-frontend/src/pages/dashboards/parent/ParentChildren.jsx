import React from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { Activity, FileText, ChevronRight, MessageSquare, ShieldAlert } from 'lucide-react';

export default function ParentChildren() {
  const navigate = useNavigate();
  const children = [
    { id: 'STD-1002', name: 'Alex Johnson', grade: '10th Grade', section: 'A', avatar: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', attendance: 92, lastGrade: 'A-' },
    { id: 'STD-1005', name: 'Mia Johnson', grade: '7th Grade', section: 'C', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', attendance: 98, lastGrade: 'A' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem' }}>My Children</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        {children.map((child) => (
          <Card key={child.id} style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
            <div style={{ background: 'var(--gradient-primary)', padding: '2.5rem 2rem', color: 'white', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', transform: 'translate(30%, -30%)' }}></div>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{ width: '90px', height: '90px', borderRadius: '50%', border: '4px solid rgba(255,255,255,0.25)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
                    <img src={child.avatar} alt={child.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem', fontWeight: '700' }}>{child.name}</h2>
                  <p style={{ opacity: 0.9, fontSize: '1rem' }}>{child.grade} • Section {child.section}</p>
                </div>
              </div>
            </div>

            <div style={{ padding: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2.5rem' }}>
                <div style={{ background: 'var(--color-bg)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                      <Activity size={16} color="var(--color-primary)"/> Attendance
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--color-text-main)' }}>{child.attendance}%</div>
                </div>
                <div style={{ background: 'var(--color-bg)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                      <FileText size={16} color="var(--color-success)"/> Recent Grade
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--color-success)' }}>{child.lastGrade}</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button 
                  onClick={() => navigate(`/dashboard/parent/children/${child.id}`)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.125rem 1.5rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', transition: 'all 0.2s', fontWeight: '600', color: 'var(--color-text-main)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.background = 'var(--color-bg)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.background = 'var(--color-surface)'; }}
                >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><FileText size={18} color="var(--color-primary)"/> View Academic Report</span>
                    <ChevronRight size={18} color="var(--color-text-muted)" />
                </button>
                <button 
                  onClick={() => navigate(`/dashboard/parent/behavior/${child.id}`)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.125rem 1.5rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', transition: 'all 0.2s', fontWeight: '600', color: 'var(--color-text-main)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-warning)'; e.currentTarget.style.background = 'var(--color-bg)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.background = 'var(--color-surface)'; }}
                >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><ShieldAlert size={18} color="var(--color-warning)"/> View Behavioral Records</span>
                    <ChevronRight size={18} color="var(--color-text-muted)" />
                </button>
                <button 
                  onClick={() => navigate('/dashboard/parent/messages')}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.125rem 1.5rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', transition: 'all 0.2s', fontWeight: '600', color: 'var(--color-text-main)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-secondary)'; e.currentTarget.style.background = 'var(--color-bg)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.background = 'var(--color-surface)'; }}
                >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><MessageSquare size={18} color="var(--color-secondary)"/> Contact Teachers</span>
                    <ChevronRight size={18} color="var(--color-text-muted)" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
