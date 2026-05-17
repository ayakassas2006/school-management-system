import React, { useState, useEffect } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { Settings as SettingsIcon, Bell, Shield, PaintBucket, Database, Layout } from 'lucide-react';
import { settingsApi } from '../../../services/api';
import { useToast } from '../../../components/ui/Toast';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('General Information');
  const [settings, setSettings] = useState({
    institution_name: '',
    registration_number: '',
    about: '',
    contact_email: '',
    phone_number: '',
    address: '',
    primary_color: '#4f46e5',
    secondary_color: '#ec4899',
    dark_mode_default: '0',
    email_notifications: '1',
    sms_notifications: '0',
    system_alerts: '1',
    require_2fa: '0',
    session_timeout: '30',
    password_expiry_days: '90',
    backup_frequency: 'Weekly',
    data_retention_years: '5'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { success, error } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = () => {
    setLoading(true);
    settingsApi.getAll()
      .then(res => {
        if (res.data) {
          setSettings(prev => ({ ...prev, ...res.data }));
        }
      })
      .catch(() => error('Failed to load settings'))
      .finally(() => setLoading(false));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    
    settingsApi.update({ settings })
      .then(() => {
        success('Settings saved successfully');
      })
      .catch(() => {
        error('Failed to save settings');
      })
      .finally(() => setSaving(false));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? (checked ? '1' : '0') : value 
    }));
  };

  const inputStyle = { width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--color-bg)', color: 'var(--color-text-main)' };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Platform Settings</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 3fr', gap: '2rem' }}>
        {/* Settings Navigation Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
                { icon: <Layout size={18}/>, label: 'General Information' },
                { icon: <PaintBucket size={18}/>, label: 'Branding & Theme' },
                { icon: <Bell size={18}/>, label: 'Notifications' },
                { icon: <Shield size={18}/>, label: 'Security & Roles' },
                { icon: <Database size={18}/>, label: 'Data Management' },
            ].map((item, idx) => (
                <button 
                    key={idx} 
                    type="button"
                    onClick={() => setActiveTab(item.label)}
                    style={{ 
                        display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', 
                        borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer', textAlign: 'left',
                        background: activeTab === item.label ? 'var(--color-primary-light)' : 'transparent',
                        color: activeTab === item.label ? 'var(--color-primary)' : 'var(--color-text-muted)',
                        fontWeight: activeTab === item.label ? '600' : '500',
                        transition: 'all 0.2s'
                    }}
                >
                    {item.icon} {item.label}
                </button>
            ))}
        </div>

        {/* Settings Content Area */}
        <Card style={{ padding: '2rem' }}>
          {loading ? (
             <div style={{ textAlign: 'center', padding: '2rem' }}>Loading settings...</div>
          ) : (
             <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {activeTab === 'General Information' && (
                    <>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>General Information</h2>
                        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Update your institution's profile and contact details.</p>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Institution Name</label>
                                <input type="text" name="institution_name" value={settings.institution_name || ''} onChange={handleChange} placeholder="EduSaaS Global High School" style={inputStyle} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Registration Number</label>
                                <input type="text" name="registration_number" value={settings.registration_number || ''} onChange={handleChange} placeholder="REG-2026-9938" style={inputStyle} />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>About Institution</label>
                            <textarea name="about" rows="4" value={settings.about || ''} onChange={handleChange} placeholder="A leading institution dedicated to fostering innovation..." style={{...inputStyle, resize: 'vertical'}}></textarea>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Contact Email</label>
                                <input type="email" name="contact_email" value={settings.contact_email || ''} onChange={handleChange} placeholder="admin@edusaas.com" style={inputStyle} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Phone Number</label>
                                <input type="text" name="phone_number" value={settings.phone_number || ''} onChange={handleChange} placeholder="+1 (555) 123-4567" style={inputStyle} />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Address</label>
                            <input type="text" name="address" value={settings.address || ''} onChange={handleChange} placeholder="742 Evergreen Terrace..." style={inputStyle} />
                        </div>
                    </>
                )}

                {activeTab === 'Branding & Theme' && (
                    <>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Branding & Theme</h2>
                        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Customize the visual appearance of the portal.</p>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Primary Color</label>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <input type="color" name="primary_color" value={settings.primary_color || '#4f46e5'} onChange={handleChange} style={{ width: '50px', height: '40px', padding: '0', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', background: 'transparent' }} />
                                    <input type="text" name="primary_color" value={settings.primary_color || '#4f46e5'} onChange={handleChange} style={inputStyle} />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Secondary Color</label>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <input type="color" name="secondary_color" value={settings.secondary_color || '#ec4899'} onChange={handleChange} style={{ width: '50px', height: '40px', padding: '0', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', background: 'transparent' }} />
                                    <input type="text" name="secondary_color" value={settings.secondary_color || '#ec4899'} onChange={handleChange} style={inputStyle} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', width: 'fit-content' }}>
                                <input type="checkbox" name="dark_mode_default" checked={settings.dark_mode_default === '1'} onChange={handleChange} style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }} />
                                <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Enable Dark Mode by Default</span>
                            </label>
                        </div>
                    </>
                )}

                {activeTab === 'Notifications' && (
                    <>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Notifications</h2>
                        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Manage global communication preferences.</p>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', width: 'fit-content' }}>
                                <input type="checkbox" name="email_notifications" checked={settings.email_notifications === '1'} onChange={handleChange} style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }} />
                                <div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: '600' }}>Email Notifications</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Send system updates and daily summaries via email</div>
                                </div>
                            </label>
                            
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', width: 'fit-content' }}>
                                <input type="checkbox" name="sms_notifications" checked={settings.sms_notifications === '1'} onChange={handleChange} style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }} />
                                <div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: '600' }}>SMS Alerts</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Notify admins via SMS for critical incidents</div>
                                </div>
                            </label>

                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', width: 'fit-content' }}>
                                <input type="checkbox" name="system_alerts" checked={settings.system_alerts === '1'} onChange={handleChange} style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }} />
                                <div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: '600' }}>In-App System Alerts</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Show banner notifications inside the dashboard</div>
                                </div>
                            </label>
                        </div>
                    </>
                )}

                {activeTab === 'Security & Roles' && (
                    <>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Security & Roles</h2>
                        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Configure authentication and access protocols.</p>
                        
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', width: 'fit-content' }}>
                                <input type="checkbox" name="require_2fa" checked={settings.require_2fa === '1'} onChange={handleChange} style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }} />
                                <div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: '600' }}>Enforce Two-Factor Authentication</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Require all faculty and staff to use 2FA</div>
                                </div>
                            </label>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Session Timeout (Minutes)</label>
                                <input type="number" name="session_timeout" value={settings.session_timeout || '30'} onChange={handleChange} style={inputStyle} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Password Expiry (Days)</label>
                                <input type="number" name="password_expiry_days" value={settings.password_expiry_days || '90'} onChange={handleChange} style={inputStyle} />
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'Data Management' && (
                    <>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Data Management</h2>
                        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Set backup and archiving policies.</p>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Auto Backup Frequency</label>
                                <select name="backup_frequency" value={settings.backup_frequency || 'Weekly'} onChange={handleChange} style={inputStyle}>
                                    <option value="Daily">Daily</option>
                                    <option value="Weekly">Weekly</option>
                                    <option value="Monthly">Monthly</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Data Retention Policy (Years)</label>
                                <input type="number" name="data_retention_years" value={settings.data_retention_years || '5'} onChange={handleChange} style={inputStyle} />
                            </div>
                        </div>
                        
                        <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--color-warning)15', border: '1px solid var(--color-warning)', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-warning)', fontWeight: '700', marginBottom: '0.5rem' }}>
                                <Database size={16} /> Storage Usage
                            </div>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>You are currently using 45% (45GB/100GB) of your allocated database storage space.</p>
                        </div>
                    </>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
                    <Button type="button" variant="outline" onClick={fetchSettings}>Discard Changes</Button>
                    <Button type="submit" variant="primary" disabled={saving}>
                        {saving ? 'Saving...' : 'Save Configuration'}
                    </Button>
                </div>
             </form>
          )}
        </Card>
      </div>
    </div>
  );
}
