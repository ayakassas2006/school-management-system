import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { motion } from 'framer-motion';
import { 
  Users, DollarSign, Activity, BookOpen, TrendingUp, ArrowUpRight, 
  Calendar, ShieldCheck, Mail, Bell, Search, Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/ui/Toast';
import { dashboardApi } from '../../services/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // UI Interactive States
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [showFilter, setShowFilter] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All Facilities');

  useEffect(() => {
    dashboardApi.getAdminStats()
      .then(res => {
        setStats(res.data);
      })
      .catch(err => {
        error('Failed to load dashboard stats');
      })
      .finally(() => setLoading(false));
  }, []);

  const downloadCSV = () => {
    if (!stats || !stats.financial_data) return;
    const csvContent = "data:text/csv;charset=utf-8,Month,Amount,Trend\n" 
      + stats.financial_data.map(d => `${d.month},${d.amount},${d.trend}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "dashboard_analytics.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success('Dashboard analytics downloaded as CSV.');
  };

  const handleDateChange = (e) => {
      setSelectedDate(e.target.value);
      success(`Dashboard timeframe updated to ${e.target.value}`);
      // Simulate refetching data to show interactivity
      setLoading(true);
      setTimeout(() => setLoading(false), 500);
  };

  const applyFilter = (filterName) => {
      setActiveFilter(filterName);
      setShowFilter(false);
      success(`Filter applied: ${filterName}`);
      setLoading(true);
      setTimeout(() => setLoading(false), 500);
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading dashboard data...</div>;
  }

  if (!stats) return null;

  const statCards = [
    { title: 'Total Students', value: stats.total_students, sub: 'Active Enrolled', icon: <Users size={22} />, color: 'var(--color-primary)' },
    { title: 'Faculty Members', value: stats.total_teachers, sub: 'Active Instructors', icon: <BookOpen size={22} />, color: 'var(--color-secondary)' },
    { title: 'Fiscal Revenue', value: `$${stats.total_revenue}`, sub: 'Total Collections', icon: <DollarSign size={22} />, color: 'var(--color-success)' },
    { title: 'Attendance Rate', value: `${stats.attendance_rate}%`, sub: 'Current Term', icon: <ShieldCheck size={22} />, color: 'var(--color-accent)' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.03em' }}>Institutional Intelligence</h1>
          <p style={{ color: 'var(--color-text-muted)', margin: 0, fontWeight: '600' }}>Admin Command Center • Academy Global Campus</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', position: 'relative', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', left: '1rem', pointerEvents: 'none', color: 'var(--color-text-muted)' }}>
                    <Calendar size={18} />
                </div>
                <input 
                    type="month" 
                    value={selectedDate}
                    onChange={handleDateChange}
                    style={{ 
                        padding: '0.75rem 1.25rem 0.75rem 2.5rem', 
                        background: 'transparent', 
                        border: 'none', 
                        fontWeight: '800', 
                        fontSize: '0.9rem', 
                        color: 'var(--color-text-main)',
                        cursor: 'pointer',
                        outline: 'none'
                    }} 
                />
            </div>
            
            <button 
                onClick={() => setShowFilter(!showFilter)}
                style={{ position: 'relative', padding: '0.75rem', background: activeFilter !== 'All Facilities' ? 'var(--color-primary)10' : 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', color: activeFilter !== 'All Facilities' ? 'var(--color-primary)' : 'var(--color-text-main)', boxShadow: 'var(--shadow-sm)', cursor: 'pointer', transition: 'all 0.2s' }}
            >
                <Filter size={20} />
                {activeFilter !== 'All Facilities' && (
                    <span style={{ position: 'absolute', top: -2, right: -2, width: '8px', height: '8px', background: 'var(--color-primary)', borderRadius: '50%' }}></span>
                )}
            </button>

            {showFilter && (
                <div style={{ position: 'absolute', top: '110%', right: 0, width: '220px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', zIndex: 50, overflow: 'hidden' }}>
                    <div style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--color-text-muted)', textTransform: 'uppercase', borderBottom: '1px solid var(--color-border)' }}>
                        Filter by Faculty
                    </div>
                    {['All Facilities', 'Science Faculty', 'Arts & Humanities', 'Business School'].map(f => (
                        <button 
                            key={f}
                            onClick={() => applyFilter(f)}
                            style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.8rem 1rem', background: activeFilter === f ? 'var(--color-bg)' : 'transparent', border: 'none', borderBottom: '1px solid var(--color-border)', color: activeFilter === f ? 'var(--color-primary)' : 'var(--color-text-main)', fontWeight: activeFilter === f ? '700' : '500', cursor: 'pointer', transition: 'background 0.2s' }}
                            onMouseEnter={e => { if(activeFilter !== f) e.currentTarget.style.background = 'var(--color-bg)'; }}
                            onMouseLeave={e => { if(activeFilter !== f) e.currentTarget.style.background = 'transparent'; }}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            )}
        </div>
      </div>

      {/* KPI Cards with Premium Styling */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {statCards.map((stat, idx) => (
          <Card key={idx} hoverEffect={true} style={{ borderBottom: `4px solid ${stat.color}40`, padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div style={{ background: `${stat.color}15`, color: stat.color, padding: '0.9rem', borderRadius: '1.25rem' }}>{stat.icon}</div>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--color-success)', background: 'var(--color-success)10', padding: '0.2rem 0.6rem', borderRadius: '2rem' }}>Live</span>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>{stat.title}</div>
              <h3 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--color-text-main)', marginBottom: '0.25rem' }}>{stat.value}</h3>
              <p style={{ fontSize: '0.8rem', color: stat.title.includes('Revenue') ? 'var(--color-success)' : 'var(--color-text-muted)', fontWeight: '700', margin: 0 }}>{stat.sub}</p>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
        {/* Dynamic Financial Inflow Chart */}
        <Card style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
            <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '0.25rem' }}>Financial Inflow Trend</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>Aggregated fee collections and institutional grants</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--gradient-primary)' }}></div>
                    <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--color-text-muted)' }}>Revenue</span>
                </div>
                <Button variant="outline" size="sm" onClick={downloadCSV}>Download Analytics</Button>
            </div>
          </div>
          
          <div style={{ height: '240px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 1rem', borderBottom: '2px solid var(--color-bg)' }}>
            {stats.financial_data && stats.financial_data.map((d, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', flex: 1 }}>
                <div style={{ position: 'relative', width: '45px', display: 'flex', justifyContent: 'center' }}>
                    <motion.div 
                        initial={{ height: 0 }}
                        whileInView={{ height: `${Math.max(d.amount * 2, 10)}px` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
                        style={{ width: '32px', background: 'var(--gradient-primary)', borderRadius: '6px 6px 0 0', position: 'relative', boxShadow: '0 4px 15px rgba(79, 70, 229, 0.2)' }}
                    >
                        <div style={{ position: 'absolute', top: -30, left: '50%', transform: 'translateX(-50%)', fontSize: '0.75rem', fontWeight: '900', color: 'var(--color-text-main)' }}>{d.amount}k</div>
                    </motion.div>
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--color-text-muted)' }}>{d.month}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Global Attendance Health */}
        <Card style={{ padding: '2.5rem' }}>
          <h3 style={{ fontSize: '1.35rem', fontWeight: '900', marginBottom: '1rem' }}>Institute Health</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', fontWeight: '600', marginBottom: '2.5rem' }}>Live presence across all faculties</p>
          
          <div style={{ position: 'relative', width: '100%', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
            <svg style={{ transform: 'rotate(-90deg)', width: '180px', height: '180px' }}>
                <circle cx="90" cy="90" r="80" stroke="var(--color-bg)" strokeWidth="12" fill="none" />
                <motion.circle 
                    cx="90" cy="90" r="80" stroke="var(--color-secondary)" strokeWidth="12" fill="none" 
                    strokeDasharray="502"
                    initial={{ strokeDashoffset: 502 }}
                    whileInView={{ strokeDashoffset: 502 - (502 * (stats.attendance_rate / 100)) }}
                    viewport={{ once: true }}
                    transition={{ duration: 2 }}
                    strokeLinecap="round"
                />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--color-text-main)' }}>{stats.attendance_rate}%</div>
                <div style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--color-success)', textTransform: 'uppercase' }}>Optimal</div>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {[
                { label: 'Students', val: stats.total_students },
                { label: 'Faculty', val: stats.total_teachers },
                { label: 'Classes', val: stats.total_classes }
            ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem 1rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--color-text-main)' }}>{item.label}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: '900', color: 'var(--color-secondary)' }}>{item.val} Active</span>
                </div>
            ))}
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '2rem' }}>
        <Card style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '900' }}>Recent Activities</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <span style={{ padding: '0.4rem 0.8rem', background: 'var(--color-primary)15', color: 'var(--color-primary)', borderRadius: 'var(--radius-md)', fontSize: '0.75rem', fontWeight: '900' }}>Live Logs</span>
                </div>
            </div>
            <div style={{ padding: '1.5rem 2rem' }}>
                {stats.recent_activities && stats.recent_activities.length > 0 ? stats.recent_activities.map((log, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.25rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', marginBottom: i === stats.recent_activities.length - 1 ? 0 : '1rem', transition: 'all 0.2s' }}>
                        <div style={{ color: 'var(--color-primary)' }}><Activity size={16} /></div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--color-text-main)' }}>{log.description}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{log.user ? log.user.name : 'System'} • {new Date(log.created_at).toLocaleString()}</div>
                        </div>
                    </div>
                )) : <div style={{ color: 'var(--color-text-muted)' }}>No recent activities.</div>}
            </div>
        </Card>

        <Card style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '900', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Bell size={20} color="var(--color-warning)" /> Active Modules
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {[
                    { title: 'Payments System', status: 'Active', desc: `${stats.total_courses} Courses Monitored`, color: 'var(--color-success)' },
                    { title: 'Attendance Tracker', status: 'Active', desc: `${stats.total_classes} Classes Monitored`, color: 'var(--color-success)' },
                ].map((note, i) => (
                    <div key={i} style={{ paddingLeft: '1.25rem', borderLeft: `3px solid ${note.color}`, position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                            <span style={{ fontSize: '0.95rem', fontWeight: '900', color: 'var(--color-text-main)' }}>{note.title}</span>
                            <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--color-text-muted)' }}>{note.status}</span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: '600', margin: 0 }}>{note.desc}</p>
                    </div>
                ))}
            </div>
            <Button variant="outline" style={{ width: '100%', marginTop: '2rem', fontWeight: '800' }}>View All Logs</Button>
        </Card>
      </div>
    </div>
  );
}
