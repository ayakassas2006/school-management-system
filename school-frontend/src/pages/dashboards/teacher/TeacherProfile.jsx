import React, { useState, useRef } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { Upload, Shield, Bell, User, Mail, Phone, BookOpen, Camera, Save, RotateCcw } from 'lucide-react';
import { useToast } from '../../../components/ui/Toast';

const initialData = {
  firstName: 'Sarah',
  lastName: 'Jenkins',
  email: 'demo@teacher.com',
  phone: '+1 (555) 234-5678',
  specialization: 'Physics, Advanced Mathematics',
  bio: 'Physics educator with 12+ years of experience. PhD in Applied Physics from MIT. Passionate about making science accessible and engaging for all students.',
  department: 'Science Department',
  avatar: null
};

export default function TeacherProfile() {
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
    setTimeout(() => {
      success("Profile configurations updated successfully across the board.");
    }, 500);
  };

  const handleDiscard = () => {
    setFormData(initialData);
    setPreviewUrl(null);
    warning("Unsaved changes discarded.");
  };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Personal Profile Settings</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 3fr', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2.5rem 1.5rem' }}>
            <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <div style={{ width: '130px', height: '130px', borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', fontWeight: '800', overflow: 'hidden', border: '5px solid var(--color-surface)', boxShadow: 'var(--shadow-lg)' }}>
                    {previewUrl ? (
                        <img src={previewUrl} alt="Avatar Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        'SJ'
                    )}
                </div>
                <button 
                  onClick={() => fileInputRef.current.click()}
                  style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-md)', transition: 'transform 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <Camera size={20}/>
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden accept="image/*" />
            </div>
            
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', fontWeight: '800', color: 'var(--color-text-main)' }}>Dr. {formData.firstName} {formData.lastName}</h3>
            <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: '0.9rem', fontWeight: '600' }}>{formData.department}</p>
            
            <div style={{ marginTop: '1.5rem', width: '100%' }}>
                <span style={{ display: 'inline-block', background: 'rgba(79, 70, 229, 0.1)', color: 'var(--color-primary)', padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.85rem', fontWeight: '800', border: '1px solid rgba(79, 70, 229, 0.2)' }}>Senior Faculty Member</span>
            </div>
          </Card>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  { id: 'personal', icon: <User size={18}/>, label: 'Identity Settings', active: true },
                  { id: 'security', icon: <Shield size={18}/>, label: 'Password & Auth', active: false },
                  { id: 'notifications', icon: <Bell size={18}/>, label: 'Alert Preferences', active: false }
                ].map((item) => (
                    <button 
                      key={item.id}
                      style={{ 
                        display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', 
                        background: item.active ? 'var(--color-bg)' : 'transparent', 
                        border: item.active ? '1px solid var(--color-border)' : '1px solid transparent', 
                        borderRadius: 'var(--radius-lg)', textAlign: 'left', fontWeight: '700', cursor: 'pointer', 
                        color: item.active ? 'var(--color-primary)' : 'var(--color-text-muted)',
                        transition: 'all 0.2s'
                      }}
                    >
                        {item.icon} {item.label}
                    </button>
                ))}
            </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card style={{ padding: '2.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)', fontWeight: '800', color: 'var(--color-text-main)' }}>Personal Information</h2>
            
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div style={{ position: 'relative' }}>
                  <label className="form-label">First Name</label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--color-text-muted)' }} />
                    <input name="firstName" type="text" value={formData.firstName} onChange={handleChange} className="form-input" style={{ paddingLeft: '2.75rem' }} required />
                  </div>
                </div>
                <div style={{ position: 'relative' }}>
                  <label className="form-label">Last Name</label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--color-text-muted)' }} />
                    <input name="lastName" type="text" value={formData.lastName} onChange={handleChange} className="form-input" style={{ paddingLeft: '2.75rem' }} required />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                  <label className="form-label">Official Email</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--color-text-muted)' }} />
                    <input type="email" value={formData.email} readOnly className="form-input" style={{ paddingLeft: '2.75rem', background: 'var(--color-bg)', color: 'var(--color-text-muted)', cursor: 'not-allowed' }} />
                  </div>
                </div>
                <div>
                  <label className="form-label">Mobile Connectivity</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--color-text-muted)' }} />
                    <input name="phone" type="tel" value={formData.phone} onChange={handleChange} className="form-input" style={{ paddingLeft: '2.75rem' }} />
                  </div>
                </div>
              </div>

              <div>
                <label className="form-label">Expertise & Specialization</label>
                <div style={{ position: 'relative' }}>
                  <BookOpen size={16} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--color-text-muted)' }} />
                  <input name="specialization" type="text" value={formData.specialization} onChange={handleChange} className="form-input" style={{ paddingLeft: '2.75rem' }} />
                </div>
              </div>

              <div>
                <label className="form-label">Professional Biography</label>
                <textarea name="bio" rows={5} value={formData.bio} onChange={handleChange} className="form-input" style={{ resize: 'vertical' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '2rem' }}>
                <Button variant="outline" type="button" onClick={handleDiscard} style={{ gap: '0.6rem', fontWeight: '700' }}>
                    <RotateCcw size={18}/> Discard Changes
                </Button>
                <Button variant="primary" type="submit" style={{ gap: '0.6rem', fontWeight: '700' }}>
                    <Save size={18}/> Update System Profile
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
