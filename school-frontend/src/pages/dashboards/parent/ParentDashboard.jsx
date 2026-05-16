import React from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { motion } from 'framer-motion';
import { CreditCard, MessageSquare, TrendingUp, AlertCircle, Users, ExternalLink, Calendar, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ParentDashboard() {
  const navigate = useNavigate();

  const children = [
    { id: 'alex', name: 'Alex Johnson', grade: '10th Grade', section: 'A', attendance: 92, gpa: 'A-', img: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.03em' }}>Parental Oversight</h1>
          <p style={{ color: 'var(--color-text-muted)', margin: 0, fontWeight: '600' }}>Engagement Portal • Welcome back, Mr. Johnson</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
            <Button variant="outline" onClick={() => navigate('/dashboard/parent/profile')} style={{ fontWeight: '700', background: 'var(--color-surface)' }}>Manage Account</Button>
            <Button variant="primary" onClick={() => navigate('/dashboard/parent/messages')} style={{ gap: '0.6rem', fontWeight: '800' }}>
               <MessageSquare size={18} /> Faculty Inbox
            </Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1.2fr) 2fr', gap: '2rem', marginBottom: '2.5rem' }}>
        {/* Children Management Engine */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '2px' }}>Your Student Roster</h3>
            {children.map((child, i) => (
                <Card key={i} hoverEffect={true} style={{ padding: '2rem', borderLeft: '5px solid var(--color-primary)' }}>
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{ width: 100, height: 100, borderRadius: '2rem', background: 'var(--color-bg)', overflow: 'hidden', border: '4px solid var(--color-surface)', boxShadow: 'var(--shadow-lg)' }}>
                                <img src={child.img} alt={child.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div style={{ position: 'absolute', bottom: '-5px', right: '-5px', background: 'var(--color-success)', color: 'white', padding: '0.3rem', borderRadius: '50%', border: '3px solid var(--color-surface)' }}>
                                <CheckCircle2 size={16} />
                            </div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '0.25rem' }}>{child.name}</h3>
                            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem', fontWeight: '700' }}>{child.grade} • Institutional Section {child.section}</p>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <div style={{ background: 'var(--color-bg)', padding: '0.5rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                                    <div style={{ fontSize: '0.6rem', fontWeight: '800', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Attendance</div>
                                    <div style={{ fontWeight: '900', color: 'var(--color-success)' }}>{child.attendance}%</div>
                                </div>
                                <div style={{ background: 'var(--color-bg)', padding: '0.5rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                                    <div style={{ fontSize: '0.6rem', fontWeight: '800', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Academic</div>
                                    <div style={{ fontWeight: '900', color: 'var(--color-primary)' }}>{child.gpa}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <Button variant="outline" size="sm" onClick={() => navigate(`/dashboard/parent/children/${child.id}`)} style={{ fontWeight: '700' }}>Deep Analytics</Button>
                        <Button variant="primary" size="sm" onClick={() => navigate('/dashboard/parent/reports')} style={{ fontWeight: '800' }}>Download Transcript</Button>
                    </div>
                </Card>
            ))}
        </div>

        {/* Financial Engagement Visualizer */}
        <Card style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '2rem 2.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-surface)' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '1.25rem', fontWeight: '900' }}>
                    <CreditCard size={24} color="var(--color-primary)" /> Fiscal Commitments
                </h3>
                <Button variant="primary" size="sm" onClick={() => navigate('/dashboard/parent/fees')} style={{ fontWeight: '800' }}>Manage Payments</Button>
            </div>
            <div style={{ flex: 1, padding: '2.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
                    <div style={{ background: 'var(--color-bg)', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Total Dues</div>
                        <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--color-text-main)' }}>$2,450.00</div>
                    </div>
                    <div style={{ background: 'var(--color-bg)', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Next Installment</div>
                        <div style={{ fontSize: '1.35rem', fontWeight: '900', color: 'var(--color-warning)' }}>Oct 30, 2026</div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {[
                        { title: 'Spring 2027 Registration', status: 'Upcoming', amount: '$1,200.00', color: 'var(--color-text-muted)' },
                        { title: 'Autumn Foundation Fund', status: 'Pending', amount: '$450.00', color: 'var(--color-warning)' },
                    ].map((bill, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><TrendingUp size={20} color="var(--color-primary)" /></div>
                                <div>
                                    <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--color-text-main)' }}>{bill.title}</h4>
                                    <span style={{ fontSize: '0.75rem', fontWeight: '800', color: bill.color, textTransform: 'uppercase' }}>{bill.status}</span>
                                </div>
                            </div>
                            <div style={{ fontSize: '1.1rem', fontWeight: '900' }}>{bill.amount}</div>
                        </div>
                    ))}
                </div>
            </div>
            <div style={{ padding: '1.5rem 2.5rem', background: 'var(--color-bg)', borderTop: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <AlertCircle size={20} color="var(--color-accent)" />
                <p style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-text-muted)', margin: 0 }}>Auto-payment is currently <span style={{ color: 'var(--color-accent)' }}>Inactive</span>. Please configure in settings.</p>
            </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
          {/* Recent Notifications with Visual Icons */}
          <Card style={{ padding: '2.5rem', gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <AlertCircle size={24} color="var(--color-warning)" /> Critical Alerts
                </h3>
                <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/parent/notifications')}>Archive</Button>
            </div>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
            {[
              { title: 'Institutional Meeting', desc: 'Hybrid Session scheduled for Nov 15th at 4:30 PM (Lab C / Zoom).', time: '2 hours ago', icon: <Calendar size={18} /> },
              { title: 'Quarterly Assessment', desc: 'Alex achieved exceptional results in the Mid-semester physics evaluation.', time: '1 day ago', icon: <TrendingUp size={18} /> },
            ].map((notice, idx) => (
              <div key={idx} style={{ 
                padding: '1.5rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--color-border)', display: 'flex', gap: '1.5rem', alignItems: 'flex-start'
              }}>
                <div style={{ background: 'white', padding: '0.8rem', borderRadius: '1rem', boxShadow: 'var(--shadow-sm)', color: 'var(--color-primary)' }}>{notice.icon}</div>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--color-text-main)' }}>{notice.title}</h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: '700' }}>{notice.time}</span>
                    </div>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: '600', lineHeight: 1.5, margin: 0 }}>{notice.desc}</p>
                </div>
              </div>
            ))}
            </div>
          </Card>

          <Card style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', background: 'var(--gradient-primary)', color: 'white', border: 'none' }}>
              <div style={{ width: '80px', height: '80px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <Users size={40} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '1rem' }}>Family Sync</h3>
              <p style={{ opacity: 0.9, marginBottom: '2rem', fontSize: '0.95rem', fontWeight: '500' }}>Link multiple accounts to synchronise guardian alerts and sibling performance metrics.</p>
              <Button style={{ background: 'white', color: 'var(--color-primary)', border: 'none', fontWeight: '900', width: '100%' }}>Link New Account</Button>
          </Card>
      </div>
    </div>
  );
}
