import React, { useState } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { Bell, CheckCircle, AlertCircle, Info, DollarSign } from 'lucide-react';
import { useToast } from '../../../components/ui/Toast';

export default function ParentNotifications() {
  const { success } = useToast();
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Alex\'s Physics Grade Posted', desc: 'Alex received 92% on "Newton\'s Laws Quiz" in Physics 101.', type: 'success', date: 'Today, 10:00 AM', unread: true },
    { id: 2, title: 'Fee Payment Due Reminder', desc: 'Fall semester tuition of $2,450 for Alex is due by October 30.', type: 'alert', date: 'Today, 08:00 AM', unread: true },
    { id: 3, title: 'Parent-Teacher Meeting', desc: 'Annual parent-teacher conference scheduled for Nov 5 at 3:00 PM.', type: 'info', date: 'Yesterday, 02:00 PM', unread: false },
    { id: 4, title: 'Payment Received', desc: 'Bus transportation fee of $600 has been successfully processed.', type: 'payment', date: 'Oct 22, 2026', unread: false },
  ]);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    success("All notifications marked as read");
  };

  const getIcon = (type) => ({
    success: <CheckCircle size={22} color="var(--color-success)" />,
    alert: <AlertCircle size={22} color="var(--color-warning)" />,
    info: <Info size={22} color="var(--color-primary)" />,
    payment: <DollarSign size={22} color="var(--color-success)" />,
  }[type] || <Bell size={22} />);

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h1 style={{ fontSize: '2rem' }}>Notifications</h1>
            {unreadCount > 0 && (
                <span style={{ background: 'var(--color-primary)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.875rem', fontWeight: '700' }}>
                    {unreadCount} New
                </span>
            )}
        </div>
        <Button variant="outline" onClick={handleMarkAllRead} disabled={unreadCount === 0}>
            Mark All as Read
        </Button>
      </div>
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {notifications.map((n) => (
          <div key={n.id} style={{
            padding: '1.5rem 2rem', borderBottom: '1px solid var(--color-border)',
            display: 'flex', gap: '1.5rem', alignItems: 'flex-start',
            transition: 'all 0.2s',
            background: n.unread ? 'var(--color-primary-light)' : 'var(--color-surface)',
          }}>
            <div style={{ 
                background: 'var(--color-bg-2)', 
                padding: '0.75rem', 
                borderRadius: '50%', 
                boxShadow: 'var(--shadow-sm)', 
                flexShrink: 0,
                border: n.unread ? '1px solid var(--color-primary-light)' : '1px solid var(--color-border)'
            }}>
                {getIcon(n.type)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <h4 style={{ margin: 0, fontWeight: '700', fontSize: '1rem', color: 'var(--color-text-main)' }}>{n.title}</h4>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', flexShrink: 0, fontWeight: '500' }}>{n.date}</span>
              </div>
              <p style={{ margin: 0, color: 'var(--color-text-body)', fontSize: '0.925rem', lineHeight: 1.6 }}>{n.desc}</p>
            </div>
            {n.unread && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-primary)', marginTop: '6px', flexShrink: 0, boxShadow: '0 0 10px var(--color-primary)' }}></div>}
          </div>
        ))}
        {notifications.length === 0 && (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                <Bell size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                <p>No new notifications to show.</p>
            </div>
        )}
      </Card>
    </div>
  );
}
