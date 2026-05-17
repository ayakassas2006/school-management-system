import React, { useState } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { Bell, CheckCircle, AlertCircle, Info, BookOpen } from 'lucide-react';
import { useToast } from '../../../components/ui/Toast';

export default function StudentNotifications() {
  const { success } = useToast();
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Assignment Graded', desc: 'Your "Newton\'s Laws Quiz" in Physics 101 has been graded. Score: 28/30.', type: 'success', date: 'Today, 10:00 AM', unread: true },
    { id: 2, title: 'New Assignment Posted', desc: 'Dr. Sarah Jenkins posted "Wave Mechanics Lab Report" due Oct 28.', type: 'alert', date: 'Today, 08:45 AM', unread: true },
    { id: 3, title: 'Schedule Change', desc: 'Mathematics 10A has been moved from Room 105 to Room 210 starting next week.', type: 'info', date: 'Yesterday, 04:00 PM', unread: false },
    { id: 4, title: 'New Course Material', desc: 'Chapter 5 slides have been uploaded by Dr. Jenkins for Physics 101.', type: 'material', date: 'Oct 22, 2026', unread: false },
  ]);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    success('All notifications marked as read');
  };

  const getIcon = (type) => ({
    success: <CheckCircle size={22} color="var(--color-success)" />,
    alert: <AlertCircle size={22} color="var(--color-warning)" />,
    info: <Info size={22} color="var(--color-primary)" />,
    material: <BookOpen size={22} color="var(--color-secondary)" />,
  }[type] || <Bell size={22} />);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem' }}>Notifications</h1>
        <Button variant="outline" onClick={handleMarkAllRead}>Mark All as Read</Button>
      </div>
      <Card style={{ padding: 0 }}>
        {notifications.map((n) => (
          <div key={n.id} style={{
            padding: '1.5rem', borderBottom: '1px solid var(--color-border)',
            display: 'flex', gap: '1.25rem', alignItems: 'flex-start',
            background: n.unread ? 'var(--color-primary-light)' : 'var(--color-surface)',
          }}>
            <div style={{ background: 'var(--color-bg-2)', padding: '0.65rem', borderRadius: '50%', boxShadow: 'var(--shadow-sm)', flexShrink: 0 }}>{getIcon(n.type)}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <h4 style={{ margin: 0, fontWeight: '600' }}>{n.title}</h4>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', flexShrink: 0 }}>{n.date}</span>
              </div>
              <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>{n.desc}</p>
            </div>
            {n.unread && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-primary)', marginTop: '4px', flexShrink: 0 }}></div>}
          </div>
        ))}
      </Card>
    </div>
  );
}
