import React from 'react';
import Card from '../../../components/ui/Card';
import { useNavigate, useParams } from 'react-router-dom';
import { ShieldAlert, CheckCircle, AlertTriangle, Calendar, Award, Info } from 'lucide-react';

export default function ParentChildBehavior() {
  const navigate = useNavigate();
  const { id } = useParams();

  const behaviorData = {
    name: id === 'STD-1005' ? 'Mia Johnson' : 'Alex Johnson',
    overallStatus: 'Excellent',
    records: [
      { id: 1, type: 'positive', title: 'Exceptional Peer Support', desc: 'Alex helped a classmate with their physics project after school. Great leadership demonstrated.', presenter: 'Dr. Sarah Jenkins', date: '2026-10-12' },
      { id: 2, type: 'warning', title: 'Late Arrival', desc: 'Arrived 15 minutes late to second period without a valid note.', presenter: 'School Office', date: '2026-10-05' },
      { id: 3, type: 'positive', title: 'Outstanding Library Conduct', desc: 'Consistently maintains a quiet and productive atmosphere in the study hall.', presenter: 'Ms. Clara Bookman', date: '2026-09-28' },
      { id: 4, type: 'info', title: 'General Observation', desc: 'alex is showing great interest in the new Robotics club extracurricular activities.', presenter: 'Mr. James Wilson', date: '2026-09-20' },
    ]
  };

  const getTypeStyle = (type) => {
    switch(type) {
      case 'positive': return { icon: <Award size={20} color="var(--color-success)"/>, bg: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', label: 'Positive' };
      case 'warning': return { icon: <AlertTriangle size={20} color="var(--color-warning)"/>, bg: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-warning)', label: 'Warning' };
      case 'negative': return { icon: <ShieldAlert size={20} color="var(--color-danger)"/>, bg: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)', label: 'Violation' };
      default: return { icon: <Info size={20} color="var(--color-primary)"/>, bg: 'rgba(79, 70, 229, 0.1)', color: 'var(--color-primary)', label: 'Observation' };
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button 
            onClick={() => navigate('/dashboard/parent/children')} 
            style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-main)', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg-2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--color-bg)'}
          >
            ←
          </button>
          <div>
              <h1 style={{ fontSize: '1.75rem', margin: 0 }}>Behavioral Records: {behaviorData.name}</h1>
              <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>Conduct history and disciplinary tracking</p>
          </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2.5fr', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <CheckCircle size={40} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: '700' }}>Overall Conduct</h3>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-success)', marginBottom: '0.5rem' }}>A+</div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: '1.5' }}>alex is currently in excellent standing with no major disciplinary issues.</p>
          </Card>

          <Card>
            <h4 style={{ marginBottom: '1.25rem', fontSize: '1rem', fontWeight: '700' }}>Summary Statistics</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                    { label: 'Positive Feedback', count: 12, color: 'var(--color-success)' },
                    { label: 'Minor Warnings', count: 1, color: 'var(--color-warning)' },
                    { label: 'Disciplinary Actions', count: 0, color: 'var(--color-danger)' },
                ].map((stat, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-text-muted)' }}>{stat.label}</span>
                        <span style={{ fontWeight: '800', color: stat.color }}>{stat.count}</span>
                    </div>
                ))}
            </div>
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Card style={{ padding: 0 }}>
                <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Incident Timeline</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                        <Calendar size={16} /> Latest Record: {new Date(behaviorData.records[0].date).toLocaleDateString()}
                    </div>
                </div>
                <div style={{ padding: '1.5rem 2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
                        {/* Timeline Connector */}
                        <div style={{ position: 'absolute', left: '19px', top: '2rem', bottom: '2rem', width: '2px', background: 'var(--color-border)', zIndex: 0 }}></div>

                        {behaviorData.records.map((record) => {
                            const styles = getTypeStyle(record.type);
                            return (
                                <div key={record.id} style={{ display: 'flex', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-surface)', border: `2px solid ${styles.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: 'var(--shadow-sm)' }}>
                                        {styles.icon}
                                    </div>
                                    <div style={{ flex: 1, padding: '1.5rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                            <div>
                                                <span style={{ fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: styles.color, background: styles.bg, padding: '0.2rem 0.6rem', borderRadius: '1rem', marginBottom: '0.5rem', display: 'inline-block' }}>
                                                    {styles.label}
                                                </span>
                                                <h4 style={{ fontSize: '1.1rem', margin: 0, fontWeight: '700', color: 'var(--color-text-main)' }}>{record.title}</h4>
                                            </div>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>{new Date(record.date).toLocaleDateString()}</span>
                                        </div>
                                        <p style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', color: 'var(--color-text-main)', lineHeight: '1.6' }}>{record.desc}</p>
                                        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>
                                            Record issued by <span style={{ color: 'var(--color-text-main)', fontWeight: '600' }}>{record.presenter}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
}
