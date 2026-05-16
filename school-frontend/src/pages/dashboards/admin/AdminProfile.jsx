import React, { useState, useRef } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { User, Shield, Key, Bell, Upload, Camera, Save, RotateCcw } from 'lucide-react';
import { useToast } from '../../../components/ui/Toast';

const initialProfileData = {
  firstName: 'Principal',
  lastName: 'Director',
  email: 'superadmin@edusaas.com',
  phone: '+1 (555) 999-0000',
  assignment: 'Main Administration Building',
  role: 'System Administrator',
  avatar: null
};

const initialSecurityData = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  twoFactorEnabled: true
};

const initialAlertData = {
  emailLogin: true,
  weeklyDigest: true,
  paymentAlert: false
};

export default function AdminProfile() {
  const { success, warning, error } = useToast();
  const [activeTab, setActiveTab] = useState('personal');
  
  const [profileData, setProfileData] = useState(initialProfileData);
  const [securityData, setSecurityData] = useState(initialSecurityData);
  const [alertData, setAlertData] = useState(initialAlertData);
  
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSecurityChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSecurityData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleAlertChange = (e) => {
    const { name, checked } = e.target;
    setAlertData(prev => ({ ...prev, [name]: checked }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        setProfileData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setTimeout(() => {
      success("Profile settings updated successfully.");
    }, 500);
  };

  const handleSaveSecurity = (e) => {
    e.preventDefault();
    if (securityData.newPassword && securityData.newPassword !== securityData.confirmPassword) {
        error("New passwords do not match.");
        return;
    }
    setTimeout(() => {
      success("Security settings updated successfully.");
      setSecurityData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    }, 500);
  };

  const handleSaveAlerts = (e) => {
    e.preventDefault();
    setTimeout(() => {
      success("Alert preferences updated successfully.");
    }, 500);
  };

  const handleDiscard = () => {
    if (activeTab === 'personal') {
        setProfileData(initialProfileData);
        setPreviewUrl(null);
    } else if (activeTab === 'security') {
        setSecurityData(initialSecurityData);
    } else if (activeTab === 'notifications') {
        setAlertData(initialAlertData);
    }
    warning("Unsaved changes discarded.");
  };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Administrator Account Settings</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 3fr', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2.5rem 1.5rem' }}>
                <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                    <div style={{ width: '130px', height: '130px', borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', fontWeight: '800', overflow: 'hidden', border: '5px solid var(--color-surface)', boxShadow: 'var(--shadow-lg)' }}>
                        {previewUrl ? (
                            <img src={previewUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            'AD'
                        )}
                    </div>
                    <button 
                      onClick={() => fileInputRef.current.click()}
                      style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-md)', transition: 'transform 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <Camera size={20} />
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden accept="image/*" />
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', fontWeight: '800', color: 'var(--color-text-main)' }}>{profileData.firstName} {profileData.lastName}</h3>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: '600' }}>{profileData.email}</span>
                <div style={{ marginTop: '1.5rem', width: '100%' }}>
                    <span style={{ display: 'inline-block', background: 'rgba(79, 70, 229, 0.1)', color: 'var(--color-primary)', padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.85rem', fontWeight: '800', border: '1px solid rgba(79, 70, 229, 0.2)' }}>{profileData.role}</span>
                </div>
            </Card>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  { id: 'personal', icon: <User size={18}/>, label: 'Profile Settings' },
                  { id: 'security', icon: <Key size={18}/>, label: 'Security & Auth' },
                  { id: 'notifications', icon: <Bell size={18}/>, label: 'Alert Preferences' }
                ].map((item) => (
                    <button 
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      style={{ 
                        display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', 
                        background: activeTab === item.id ? 'var(--color-bg)' : 'transparent', 
                        border: activeTab === item.id ? '1px solid var(--color-border)' : '1px solid transparent', 
                        borderRadius: 'var(--radius-lg)', textAlign: 'left', fontWeight: '700', cursor: 'pointer', 
                        color: activeTab === item.id ? 'var(--color-primary)' : 'var(--color-text-muted)',
                        transition: 'all 0.2s'
                      }}
                    >
                        {item.icon} {item.label}
                    </button>
                ))}
            </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {activeTab === 'personal' && (
                <>
                    <Card style={{ padding: '2.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)', fontWeight: '800', color: 'var(--color-text-main)' }}>Institutional Profile</h2>
                        
                        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <div>
                                    <label className="form-label">First Name</label>
                                    <input name="firstName" type="text" value={profileData.firstName} onChange={handleProfileChange} className="form-input" required />
                                </div>
                                <div>
                                    <label className="form-label">Last Name</label>
                                    <input name="lastName" type="text" value={profileData.lastName} onChange={handleProfileChange} className="form-input" required />
                                </div>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <div>
                                    <label className="form-label">Super Admin Email</label>
                                    <input type="email" value={profileData.email} readOnly className="form-input" style={{ background: 'var(--color-bg)', color: 'var(--color-text-muted)', cursor: 'not-allowed' }} />
                                </div>
                                <div>
                                    <label className="form-label">Phone Connectivity</label>
                                    <input name="phone" type="tel" value={profileData.phone} onChange={handleProfileChange} className="form-input" />
                                </div>
                            </div>

                            <div>
                                <label className="form-label">Campus Building Assignment</label>
                                <select name="assignment" value={profileData.assignment} onChange={handleProfileChange} className="form-input" style={{ background: 'var(--color-bg)', color: 'var(--color-text-main)', cursor: 'pointer' }}>
                                    <option>Main Administration Building</option>
                                    <option>Science Block</option>
                                    <option>West Wing</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '2.5rem' }}>
                                <Button variant="outline" type="button" onClick={handleDiscard} style={{ gap: '0.6rem', fontWeight: '700' }}>
                                    <RotateCcw size={18}/> Discard Changes
                                </Button>
                                <Button variant="primary" type="submit" style={{ gap: '0.6rem', fontWeight: '700' }}>
                                    <Save size={18}/> Save Institutional Profile
                                </Button>
                            </div>
                        </form>
                    </Card>

                    <Card style={{ borderLeft: '4px solid var(--color-secondary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <div style={{ padding: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%' }}>
                                <Shield size={24} color="var(--color-secondary)" />
                            </div>
                            <div>
                                <h4 style={{ margin: 0, fontWeight: '800', color: 'var(--color-text-main)' }}>Secure Multi-Factor Authentication</h4>
                                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-body)', fontWeight: '500' }}>Your account is currently protected by enterprise-grade 2FA.</p>
                            </div>
                            <Button variant="outline" size="sm" type="button" style={{ marginLeft: 'auto', fontWeight: '700' }} onClick={() => setActiveTab('security')}>Manage Security</Button>
                        </div>
                    </Card>
                </>
            )}

            {activeTab === 'security' && (
                <Card style={{ padding: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)', fontWeight: '800', color: 'var(--color-text-main)' }}>Security & Authentication</h2>
                    
                    <form onSubmit={handleSaveSecurity} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: '700' }}>Change Password</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label className="form-label">Current Password</label>
                                    <input name="currentPassword" type="password" value={securityData.currentPassword} onChange={handleSecurityChange} className="form-input" placeholder="••••••••" />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                    <div>
                                        <label className="form-label">New Password</label>
                                        <input name="newPassword" type="password" value={securityData.newPassword} onChange={handleSecurityChange} className="form-input" placeholder="••••••••" />
                                    </div>
                                    <div>
                                        <label className="form-label">Confirm New Password</label>
                                        <input name="confirmPassword" type="password" value={securityData.confirmPassword} onChange={handleSecurityChange} className="form-input" placeholder="••••••••" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '2rem' }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: '700' }}>Multi-Factor Authentication</h3>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                                <input type="checkbox" name="twoFactorEnabled" checked={securityData.twoFactorEnabled} onChange={handleSecurityChange} style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }} />
                                <div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--color-text-main)' }}>Enable Two-Factor Authentication (2FA)</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Adds an extra layer of security to your account using an authenticator app.</div>
                                </div>
                            </label>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '2.5rem' }}>
                            <Button variant="outline" type="button" onClick={handleDiscard} style={{ gap: '0.6rem', fontWeight: '700' }}>
                                <RotateCcw size={18}/> Discard Changes
                            </Button>
                            <Button variant="primary" type="submit" style={{ gap: '0.6rem', fontWeight: '700' }}>
                                <Save size={18}/> Update Security Settings
                            </Button>
                        </div>
                    </form>
                </Card>
            )}

            {activeTab === 'notifications' && (
                <Card style={{ padding: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)', fontWeight: '800', color: 'var(--color-text-main)' }}>Alert Preferences</h2>
                    
                    <form onSubmit={handleSaveAlerts} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                                <input type="checkbox" name="emailLogin" checked={alertData.emailLogin} onChange={handleAlertChange} style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }} />
                                <div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--color-text-main)' }}>New Login Alerts</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Receive an email when your account is logged into from a new device.</div>
                                </div>
                            </label>
                            
                            <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                                <input type="checkbox" name="weeklyDigest" checked={alertData.weeklyDigest} onChange={handleAlertChange} style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }} />
                                <div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--color-text-main)' }}>Weekly Activity Digest</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Receive a weekly summary of administrative activities and system health.</div>
                                </div>
                            </label>

                            <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                                <input type="checkbox" name="paymentAlert" checked={alertData.paymentAlert} onChange={handleAlertChange} style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }} />
                                <div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--color-text-main)' }}>Critical Payment Alerts</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Get notified immediately when a high-value payment fails.</div>
                                </div>
                            </label>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '2.5rem' }}>
                            <Button variant="outline" type="button" onClick={handleDiscard} style={{ gap: '0.6rem', fontWeight: '700' }}>
                                <RotateCcw size={18}/> Discard Changes
                            </Button>
                            <Button variant="primary" type="submit" style={{ gap: '0.6rem', fontWeight: '700' }}>
                                <Save size={18}/> Save Alert Preferences
                            </Button>
                        </div>
                    </form>
                </Card>
            )}
        </div>
      </div>
    </div>
  );
}
