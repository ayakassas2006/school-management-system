import React, { useState, useRef } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { Camera, User, Shield, Bell, Save, RotateCcw } from 'lucide-react';
import { useToast } from '../../../components/ui/Toast';

const initialData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'demo@parent.com',
  phone: '+1 (555) 000-1234',
  address: '123 Education Lane, Apt 4B, Academiacity, AC 12345',
  avatar: null
};

export default function ParentProfile() {
  const { success, warning } = useToast();
  const [formData, setFormData] = useState(initialData);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        setFormData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      success("Profile updated successfully!");
    }, 500);
  };

  const handleDiscard = () => {
    setFormData(initialData);
    setPreviewUrl(null);
    warning("Changes discarded");
  };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>My Profile & Settings</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 3fr', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2.5rem 1.5rem' }}>
            <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'var(--color-secondary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 'bold', overflow: 'hidden', border: '4px solid var(--color-surface)', boxShadow: 'var(--shadow-lg)' }}>
                    {previewUrl ? (
                        <img src={previewUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        'JD'
                    )}
                </div>
                <button 
                  onClick={() => fileInputRef.current.click()}
                  style={{ position: 'absolute', bottom: '5px', right: '5px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-md)', transition: 'transform 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <Camera size={18}/>
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden accept="image/*" />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', fontWeight: '700' }}>{formData.firstName} {formData.lastName}</h3>
            <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: '0.875rem', fontWeight: '500' }}>Parent / Guardian</p>
            
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <span style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: '600' }}>2 Children</span>
                <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: '600' }}>Verified Account</span>
            </div>
          </Card>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { id: 'info', icon: <User size={18}/>, label: 'Personal Info', active: true },
              { id: 'sec', icon: <Shield size={18}/>, label: 'Security & Password', active: false },
              { id: 'notif', icon: <Bell size={18}/>, label: 'Notification Prefs', active: false }
            ].map((item) => (
              <button key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', background: item.active ? 'var(--color-primary-light)' : 'transparent', border: item.active ? '1px solid var(--color-primary-light)' : '1px solid transparent', borderRadius: 'var(--radius-lg)', cursor: 'pointer', color: item.active ? 'var(--color-primary)' : 'var(--color-text-muted)', fontWeight: item.active ? '700' : '500', transition: 'all 0.2s', textAlign: 'left' }}>
                {item.icon} {item.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Card style={{ padding: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', fontWeight: '700', color: 'var(--color-text-main)', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>General Information</h2>
                <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <div>
                            <label className="form-label">First Name</label>
                            <input name="firstName" type="text" value={formData.firstName} onChange={handleChange} className="form-input" placeholder="Enter first name" required />
                        </div>
                        <div>
                            <label className="form-label">Last Name</label>
                            <input name="lastName" type="text" value={formData.lastName} onChange={handleChange} className="form-input" placeholder="Enter last name" required />
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <div>
                            <label className="form-label">Email Address</label>
                            <input type="email" value={formData.email} readOnly className="form-input" style={{ background: 'var(--color-bg)', color: 'var(--color-text-muted)', cursor: 'not-allowed' }} />
                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>Primary email cannot be changed.</p>
                        </div>
                        <div>
                            <label className="form-label">Phone Number</label>
                            <input name="phone" type="tel" value={formData.phone} onChange={handleChange} className="form-input" placeholder="+1 (xxx) xxx-xxxx" />
                        </div>
                    </div>
                    <div>
                        <label className="form-label">Home Address</label>
                        <input name="address" type="text" value={formData.address} onChange={handleChange} className="form-input" placeholder="Full residential address" />
                    </div>

                    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '2rem' }}>
                        <Button variant="outline" type="button" onClick={handleDiscard} style={{ gap: '0.5rem' }}>
                            <RotateCcw size={18}/> Discard Changes
                        </Button>
                        <Button variant="primary" type="submit" style={{ gap: '0.5rem' }}>
                            <Save size={18}/> Save Changes
                        </Button>
                    </div>
                </form>
            </Card>

            <Card style={{ borderLeft: '4px solid var(--color-warning)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Shield size={24} color="var(--color-warning)" />
                    <div>
                        <h4 style={{ margin: 0, fontWeight: '700' }}>Security Note</h4>
                        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-body)' }}>Update your password regularly to keep your children's data secure.</p>
                    </div>
                    <Button variant="outline" size="sm" style={{ marginLeft: 'auto' }}>Change Password</Button>
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
}
