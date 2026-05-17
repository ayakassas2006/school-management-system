import React from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { motion } from 'framer-motion';
import { Users, FileText, CheckCircle, PieChart, TrendingUp, Clock, Calendar, MessageSquare, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const attendanceActivity = [
  { day: 'Mon', rate: 95 },
  { day: 'Tue', rate: 92 },
  { day: 'Wed', rate: 88 },
  { day: 'Thu', rate: 96 },
  { day: 'Fri', rate: 94 },
];

export default function TeacherDashboard() {
  const navigate = useNavigate();

  const classes = [
    { name: 'Mathematics 10A', students: 32, time: '09:00 AM', status: 'In Session', color: 'var(--color-primary)' },
    { name: 'Physics 11B', students: 28, time: '11:15 AM', status: 'Next', color: 'var(--color-secondary)' },
    { name: 'Advanced Calculus', students: 24, time: '02:00 PM', status: 'Afternoon', color: 'var(--color-accent)' },
  ];

  const stats = [
    { label: 'Total Managed Students', value: '84', icon: <Users size={22} />, color: 'var(--color-primary)' },
    { label: 'Pending Evaluations', value: '12', icon: <FileText size={22} />, color: 'var(--color-warning)' },
    { label: 'Latest Class Avg', value: '78%', icon: <TrendingUp size={22} />, color: 'var(--color-success)' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.03em' }}>Faculty Hub</h1>
          <p style={{ color: 'var(--color-text-muted)', margin: 0, fontWeight: '600' }}>Logged in as Dr. Sarah Jenkins • Head of Science Dept.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
            <Button variant="outline" onClick={() => navigate('/dashboard/teacher/calendar')} style={{ background: 'var(--color-surface)', fontWeight: '700' }}>
               <Calendar size={18} style={{ marginRight: 8 }} /> Master Schedule
            </Button>
            <Button variant="primary" onClick={() => navigate('/dashboard/teacher/students/add')} style={{ gap: '0.6rem', fontWeight: '800' }}>
               <Users size={18} /> Enroll Student
            </Button>
        </div>
      </div>

      {/* Modern KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {stats.map((stat, idx) => (
          <Card key={idx} hoverEffect={true} style={{ padding: '1.75rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', background: `${stat.color}08`, borderRadius: '0 0 0 100%' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ background: `${stat.color}15`, color: stat.color, padding: '1rem', borderRadius: '1.25rem' }}>{stat.icon}</div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--color-text-main)' }}>{stat.value}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Classes with Attendance Visualization */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Card style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Session Real-time Participation</h3>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '30px' }}>
                        {attendanceActivity.map((d, i) => (
                            <motion.div 
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${d.rate / 3}px` }}
                                transition={{ delay: 0.5 + (i * 0.1) }}
                                style={{ width: '8px', background: 'var(--color-success)', opacity: d.rate / 100, borderRadius: '2px' }}
                            />
                        ))}
                    </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {classes.map((cls, idx) => (
                    <div key={idx} style={{ 
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '1.25rem 1.5rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-xl)',
                        border: '1px solid var(--color-border)', position: 'relative', transition: 'transform 0.2s', cursor: 'pointer'
                    }} onClick={() => navigate('/dashboard/teacher/attendance')}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                            <div style={{ width: '10px', height: '40px', background: cls.color, borderRadius: '4px' }}></div>
                            <div>
                                <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--color-text-main)' }}>{cls.name}</h4>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.2rem' }}>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                        <Clock size={14} /> {cls.time}
                                    </span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                        <Users size={14} /> {cls.students} Enrolled
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: cls.status === 'In Session' ? 'var(--color-success)' : 'var(--color-text-muted)', background: cls.status === 'In Session' ? 'var(--color-success)15' : 'var(--color-bg)', padding: '0.4rem 0.8rem', borderRadius: '2rem', textTransform: 'uppercase' }}>{cls.status}</span>
                            <ChevronRight size={20} color="var(--color-text-subtle)" />
                        </div>
                    </div>
                    ))}
                </div>
                <Button variant="outline" style={{ border: 'none', background: 'none', color: 'var(--color-primary)', fontWeight: '800', marginTop: '1.5rem', alignSelf: 'flex-start' }}>Explore All Course Materials →</Button>
            </Card>

            <Card style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '2rem' }}>System Performance Index</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                    {[
                        { label: 'Response Rate', value: '98%', trend: '+2%' },
                        { label: 'Avg Submission', value: '2.4 days', trend: '-10%' },
                        { label: 'Resource Reach', value: '4.8x', trend: '+0.5' },
                        { label: 'Task Efficiency', value: '92%', trend: '+4%' },
                    ].map((m, i) => (
                        <div key={i} style={{ padding: '1.25rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                            <div style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{m.label}</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--color-text-main)' }}>{m.value}</div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>

        {/* Sidebar Widgets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Card style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Evaluation Backlog</h3>
                    <PieChart size={18} color="var(--color-primary)" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {[
                        { title: 'Algebra Quiz #4', count: 8, priority: 'High', color: 'var(--color-accent)' },
                        { title: 'Physics Lab Report', count: 4, priority: 'Medium', color: 'var(--color-info)' },
                    ].map((back, i) => (
                        <div key={i} style={{ padding: '1.25rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-lg)', border: i === 0 ? '1.5px solid var(--color-border)' : '1px solid var(--color-border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.7rem', fontWeight: '900', color: back.color, textTransform: 'uppercase' }}>{back.priority} Priority</span>
                            <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--color-text-muted)' }}>{back.count} Pending</span>
                        </div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '800', margin: 0 }}>{back.title}</h4>
                        </div>
                    ))}
                </div>
                <Button variant="primary" onClick={() => navigate('/dashboard/teacher/assignments')} style={{ width: '100%', marginTop: '1.5rem', fontWeight: '800' }}>Access Grading Hub</Button>
            </Card>

            <Card style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <MessageSquare size={18} color="var(--color-secondary)" /> Collaboration Inbox
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {[1, 2].map((msg) => (
                    <div key={msg} style={{ display: 'flex', gap: '1rem', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/dashboard/teacher/messages')}>
                        <div style={{ width: '40px', height: '40px', background: 'var(--color-secondary-light)', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-secondary)', fontWeight: 'bold' }}>
                            {msg === 1 ? 'A' : 'M'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.1rem' }}>
                                <div style={{ fontSize: '0.85rem', fontWeight: '800' }}>{msg === 1 ? 'Alex Johnson (Parent)' : 'Michael Smith'}</div>
                                <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', fontWeight: '700' }}>4m ago</div>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: '500' }}>
                                {msg === 1 ? 'Thank you for the update on Alex...' : "Hey Sarah, about the department..."}
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
}
