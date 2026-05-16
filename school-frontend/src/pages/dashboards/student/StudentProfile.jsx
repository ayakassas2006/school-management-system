import React, { useState, useRef } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { Upload, User, Shield, Bell } from 'lucide-react';
import { useToast } from '../../../components/ui/Toast';

export default function StudentProfile() {
  const { success, warning } = useToast();
  const fileInputRef = useRef(null);

  const [profileData, setProfileData] = useState({
    firstName: 'Alex',
    lastName: 'Johnson',
    phone: '+1 (555) 567-8902',
    address: '123 Education Lane, Apt 4B, Academiacity',
    avatar: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  });

  const [formData, setFormData] = useState({ ...profileData });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setProfileData({ ...formData });
    success("Profile updated successfully");
  };

  const handleDiscard = (e) => {
    e.preventDefault();
    setFormData({ ...profileData });
    warning("Changes discarded");
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({ ...prev, avatar: reader.result }));
        success("Profile picture updated");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>My Profile</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', marginBottom: '1rem', border: '4px solid var(--color-primary-light)', position: 'relative' }}>
              <img src={profileData.avatar} alt="Student" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />
              <button onClick={handleAvatarClick} style={{ position: 'absolute', bottom: 0, right: 0, background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Upload size={14}/>
              </button>
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{profileData.firstName} {profileData.lastName}</h3>
            <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: '0.875rem' }}>STD-1002 • 10th Grade, Sec A</p>
            <span style={{ marginTop: '1rem', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--color-success)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: '600' }}>Active Student</span>
          </Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[{ icon: <User size={18}/>, label: 'Personal Info', active: true }, { icon: <Shield size={18}/>, label: 'Security', active: false }, { icon: <Bell size={18}/>, label: 'Preferences', active: false }].map((item, i) => (
              <button key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1rem', background: item.active ? 'var(--color-bg)' : 'transparent', border: item.active ? '1px solid var(--color-border)' : '1px solid transparent', borderRadius: 'var(--radius-md)', cursor: 'pointer', color: item.active ? 'var(--color-text-main)' : 'var(--color-text-muted)', fontWeight: item.active ? '600' : '500' }}>
                {item.icon} {item.label}
              </button>
            ))}
          </div>
        </div>

        <Card>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>Personal Information</h2>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label className="form-label">First Name</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="form-input" />
              </div>
              <div>
                <label className="form-label">Last Name</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="form-input" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label className="form-label">Email</label>
                <input type="email" value="demo@student.com" readOnly className="form-input" style={{ opacity: 0.7, cursor: 'not-allowed' }} />
              </div>
              <div>
                <label className="form-label">Phone</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="form-input" />
              </div>
            </div>
            <div>
              <label className="form-label">Home Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} className="form-input" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
              <Button type="button" variant="outline" onClick={handleDiscard}>Discard Changes</Button>
              <Button type="submit" variant="primary">Save Changes</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
