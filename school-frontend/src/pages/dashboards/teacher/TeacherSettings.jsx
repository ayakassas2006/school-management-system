import React from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { Bell, Globe, Lock } from 'lucide-react';

export default function TeacherSettings() {
  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Settings</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <Card>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Bell size={20} color="var(--color-primary)" /> Notification Preferences</h3>
          {[
            { label: 'Email notification when student submits assignment', defaultChecked: true },
            { label: 'Email notification for new messages', defaultChecked: true },
            { label: 'SMS alerts for school announcements', defaultChecked: false },
            { label: 'Weekly performance digest', defaultChecked: true },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: '0.95rem' }}>{item.label}</span>
              <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked={item.defaultChecked} style={{ opacity: 0, width: 0, height: 0 }} />
                <span style={{ position: 'absolute', inset: 0, background: item.defaultChecked ? 'var(--color-primary)' : 'var(--color-border)', borderRadius: '24px', transition: 'background 0.3s' }}></span>
                <span style={{ position: 'absolute', width: '18px', height: '18px', left: item.defaultChecked ? '23px' : '3px', top: '3px', background: 'white', borderRadius: '50%', transition: 'left 0.3s' }}></span>
              </label>
            </div>
          ))}
        </Card>

        <Card>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Globe size={20} color="var(--color-primary)" /> Portal Preferences</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Language</label>
              <select style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none', background: 'white' }}>
                <option>English (US)</option>
                <option>French</option>
                <option>Spanish</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Time Zone</label>
              <select style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none', background: 'white' }}>
                <option>Eastern Time (UTC-5)</option>
                <option>Pacific Time (UTC-8)</option>
                <option>UTC</option>
              </select>
            </div>
          </div>
        </Card>

        <Card>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Lock size={20} color="var(--color-primary)" /> Security</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Current Password</label>
              <input type="password" placeholder="••••••••" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>New Password</label>
              <input type="password" placeholder="••••••••" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="primary">Update Password</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
