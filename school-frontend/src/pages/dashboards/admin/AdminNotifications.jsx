import React, { useState } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { Bell, AlertCircle, CheckCircle, Info, Calendar, MoreVertical, X } from 'lucide-react';
import { useToast } from '../../../components/ui/Toast';

export default function AdminNotifications() {
  const { success } = useToast();
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'System Maintenance Scheduled', desc: 'The grading portal will be down for maintenance this Saturday from 2 AM to 4 AM.', type: 'system', date: 'Today, 09:00 AM', unread: true },
    { id: 2, title: 'New Teacher Registration', desc: 'Michael Scott has registered as a new English Teacher. Approval pending.', type: 'alert', date: 'Yesterday, 14:30 PM', unread: true },
    { id: 3, title: 'Fees Processed Successfully', desc: 'Batch payment processing for Fall 2026 completed with 0 errors.', type: 'success', date: 'Oct 24, 08:00 AM', unread: false },
    { id: 4, title: 'Meeting Reminder', desc: 'Board direction meeting at 1 PM in Conference Room A.', type: 'event', date: 'Oct 23, 11:00 AM', unread: false },
    { id: 5, title: 'Database Optimization', desc: 'Weekly database indexing and cache clearing completed successfully.', type: 'success', date: 'Oct 22, 22:00 PM', unread: false },
  ]);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    success("All institutional notifications marked as read.");
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type) => {
    switch(type) {
        case 'system': return <Info size={22} color="var(--color-primary)" />;
        case 'alert': return <AlertCircle size={22} color="var(--color-warning)" />;
        case 'success': return <CheckCircle size={22} color="var(--color-success)" />;
        case 'event': return <Calendar size={22} color="var(--color-secondary)" />;
        default: return <Bell size={22} color="var(--color-text-muted)" />;
    }
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h1 style={{ fontSize: '2rem' }}>Admin Notifications</h1>
            {unreadCount > 0 && (
                <span style={{ 
                    background: 'var(--color-primary)', 
                    color: 'white', 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '1rem', 
                    fontSize: '0.85rem', 
                    fontWeight: '800',
                    boxShadow: '0 0 15px var(--color-primary-light)'
                }}>
                    {unreadCount} New Alerts
                </span>
            )}
        </div>
        <Button variant="outline" onClick={handleMarkAllRead} disabled={unreadCount === 0} style={{ fontWeight: '600' }}>
            Mark All as Read
        </Button>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
        <div style={{ padding: '1.25rem 2rem', background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: '700', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Recent Board Notifications</span>
            <Button variant="outline" size="sm" style={{ padding: '0.4rem' }}><MoreVertical size={16}/></Button>
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {notifications.map((notif) => (
                <li key={notif.id} style={{ 
                    padding: '1.5rem 2rem', 
                    borderBottom: '1px solid var(--color-border)', 
                    display: 'flex', gap: '1.5rem', alignItems: 'flex-start',
                    background: notif.unread ? 'var(--color-primary-light)' : 'transparent',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative'
                }}>
                    <div style={{ 
                        background: 'var(--color-bg)', 
                        padding: '0.75rem', 
                        borderRadius: '50%', 
                        boxShadow: 'var(--shadow-sm)',
                        border: notif.unread ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                        flexShrink: 0
                    }}>
                        {getIcon(notif.type)}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <h3 style={{ fontSize: '1.05rem', margin: 0, color: 'var(--color-text-main)', fontWeight: '700' }}>{notif.title}</h3>
                            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: '600' }}>{notif.date}</span>
                        </div>
                        <p style={{ color: 'var(--color-text-body)', margin: 0, lineHeight: 1.6, fontSize: '0.925rem' }}>{notif.desc}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                        {notif.unread && (
                            <div style={{ 
                                width: '10px', height: '10px', borderRadius: '50%', 
                                background: 'var(--color-primary)', 
                                boxShadow: '0 0 10px var(--color-primary)'
                            }}></div>
                        )}
                        <button 
                            onClick={() => deleteNotification(notif.id)}
                            style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '0.25rem', borderRadius: '50%', transition: 'background 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                            <X size={16}/>
                        </button>
                    </div>
                </li>
            ))}
            {notifications.length === 0 && (
                <li style={{ padding: '6rem 2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    <Bell size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                    <p style={{ fontWeight: '500' }}>Your inbox is clear. No new notifications.</p>
                </li>
            )}
        </ul>
      </Card>
    </div>
  );
}
