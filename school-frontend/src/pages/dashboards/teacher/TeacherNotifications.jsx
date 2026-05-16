import React from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { Bell, CheckCircle, AlertCircle, Info, Calendar } from 'lucide-react';

export default function TeacherNotifications() {
  const notifications = [
    { title: 'Assignment Submitted', desc: 'Emily Davis submitted "Wave Mechanics Lab Report" for Physics 101.', type: 'success', date: 'Today, 11:20 AM', unread: true },
    { title: 'New Announcement from Admin', desc: 'Staff meeting scheduled for Friday October 25th at 2:00 PM in Conference Room A.', type: 'alert', date: 'Today, 09:00 AM', unread: true },
    { title: 'Grade Review Request', desc: 'Alex Johnson has submitted a grade review request for the midterm exam.', type: 'info', date: 'Yesterday, 03:15 PM', unread: false },
    { title: 'Class Reminder', desc: 'Your Physics 101 class starts in 30 minutes in Room 204.', type: 'event', date: 'Oct 24, 08:30 AM', unread: false },
  ];

  const getIcon = (type) => ({
    success: <CheckCircle size={22} color="var(--color-success)" />,
    alert: <AlertCircle size={22} color="var(--color-warning)" />,
    info: <Info size={22} color="var(--color-primary)" />,
    event: <Calendar size={22} color="var(--color-secondary)" />,
  }[type] || <Bell size={22} />);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem' }}>Notifications</h1>
        <Button variant="outline">Mark All as Read</Button>
      </div>
      <Card style={{ padding: 0 }}>
        {notifications.map((n, idx) => (
          <div key={idx} style={{
            padding: '1.5rem', borderBottom: '1px solid var(--color-border)',
            display: 'flex', gap: '1.25rem', alignItems: 'flex-start',
            background: n.unread ? 'var(--color-primary-light)' : 'white',
          }}>
            <div style={{ background: 'white', padding: '0.65rem', borderRadius: '50%', boxShadow: 'var(--shadow-sm)', flexShrink: 0 }}>{getIcon(n.type)}</div>
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
