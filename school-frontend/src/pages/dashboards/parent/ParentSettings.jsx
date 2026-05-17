import React from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { User, Bell, Shield, Smartphone } from 'lucide-react';

export default function ParentSettings() {
  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Account Settings</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 3fr', gap: '2rem' }}>
        {/* Settings Navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
                { icon: <User size={18}/>, label: 'Personal Information', active: true },
                { icon: <Bell size={18}/>, label: 'Notifications', active: false },
                { icon: <Shield size={18}/>, label: 'Security & Password', active: false },
                { icon: <Smartphone size={18}/>, label: 'Connected Devices', active: false },
            ].map((item, idx) => (
                <button key={idx} style={{ 
                    display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', 
                    borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer', textAlign: 'left',
                    background: item.active ? 'var(--color-primary-light)' : 'transparent',
                    color: item.active ? 'var(--color-primary)' : 'var(--color-text-muted)',
                    fontWeight: item.active ? '600' : '500'
                }}>
                    {item.icon} {item.label}
                </button>
            ))}
        </div>

        {/* Content Area */}
        <Card style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Personal Information</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Update your contact information and profile details.</p>
          
          <form style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '1rem' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--color-secondary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold' }}>
                    JD
                </div>
                <div>
                    <Button variant="outline" size="sm" style={{ marginBottom: '0.5rem' }}>Upload New Photo</Button>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>JPG, GIF or PNG. Max size of 800K</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>First Name</label>
                  <input type="text" defaultValue="John" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Last Name</label>
                  <input type="text" defaultValue="Doe" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none' }} />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Email Address</label>
                  <input type="email" defaultValue="demo@parent.com" readOnly style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--color-bg)', color: 'var(--color-text-muted)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Phone Number</label>
                  <input type="text" defaultValue="+1 (555) 000-1234" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none' }} />
                </div>
            </div>

            <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Home Address</label>
                <input type="text" defaultValue="123 Education Lane, Apt 4B, Academiacity, AC 12345" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <Button variant="primary">Save Changes</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
