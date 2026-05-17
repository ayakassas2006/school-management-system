import React, { useState } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { UserPlus, Save, X, BookOpen, Fingerprint, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../components/ui/Toast';
import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { classesApi } from '../../../services/api';

export default function TeacherAddStudent() {
  const navigate = useNavigate();
  const { success, error } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({ firstName: '', lastName: '', dob: '', gender: 'male', assignedClass: '', session: 'Fall 2026' });
  const [avatar, setAvatar] = useState(null);

  const { data: classesList = [] } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const res = await classesApi.getAll();
      return res.data;
    }
  });
  const [preview, setPreview] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    const name = `${formData.firstName} ${formData.lastName}`;
    const email = `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}@student.edusaas.com`;
    
    payload.append('name', name);
    payload.append('email', email);
    payload.append('password', 'password123');
    payload.append('password_confirmation', 'password123');
    payload.append('role', 'student');
    
    // We append the rest of the form data even if the backend doesn't process it immediately in AuthController,
    // so it satisfies the multipart/form-data requirement
    payload.append('dob', formData.dob);
    payload.append('gender', formData.gender);
    payload.append('class_id', formData.assignedClass);
    if (avatar) payload.append('avatar', avatar);

    try {
      await axios.post('http://localhost:8000/api/register', payload, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      queryClient.invalidateQueries(['teacher-students']);
      success("Student registration request submitted and synced.");
      navigate('/dashboard/teacher/students');
    } catch (err) {
      error("Failed to submit student application. Check backend logs.");
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <button 
            onClick={() => navigate('/dashboard/teacher/students')}
            style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', marginBottom: '0.5rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            ← Back to Student Roster
          </button>
          <h1 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <UserPlus size={28} /> New Student Admission
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button variant="outline" onClick={() => navigate('/dashboard/teacher/students')} style={{ fontWeight: '600' }}>
            <X size={18} style={{ marginRight: 8 }} /> Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} style={{ gap: '0.6rem', fontWeight: '800' }}>
            <Save size={18} /> Submit Application
          </Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <Card style={{ padding: '2.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Fingerprint size={20} color="var(--color-primary)" /> Basic Identification
                </h3>
                <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label className="form-label">First Name</label>
                            <input type="text" placeholder="e.g. John" className="form-input" required value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
                        </div>
                        <div>
                            <label className="form-label">Last Name</label>
                            <input type="text" placeholder="e.g. Doe" className="form-input" required value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label className="form-label">Date of Birth</label>
                            <input type="date" className="form-input" required value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} />
                        </div>
                        <div>
                            <label className="form-label">Gender Identity</label>
                            <select className="form-input" style={{ cursor: 'pointer' }} value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Prefer not to say</option>
                            </select>
                        </div>
                    </div>
                </form>
            </Card>

            <Card style={{ padding: '2.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <BookOpen size={20} color="var(--color-secondary)" /> Academic Placement
                </h3>
                <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label className="form-label">Assigned Class / Grade</label>
                            <select className="form-input" style={{ cursor: 'pointer' }} value={formData.assignedClass} onChange={e => setFormData({...formData, assignedClass: e.target.value})} required>
                                <option value="">Select a Class</option>
                                {classesList.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="form-label">Entry Session</label>
                            <select className="form-input" style={{ cursor: 'pointer' }}>
                                <option>Fall 2026</option>
                                <option>Spring 2027</option>
                            </select>
                        </div>
                    </div>
                </form>
            </Card>
        </div>

        <div>
            <Card style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--color-bg)', border: '2px dashed var(--color-border)', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {preview ? <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <UserPlus size={40} color="var(--color-text-muted)" />}
                </div>
                <h4 style={{ marginBottom: '0.5rem' }}>Student Avatar</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>Drag and drop or click to upload official student photo.</p>
                <div style={{ position: 'relative' }}>
                    <input type="file" accept="image/*" onChange={handleFileChange} style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0, cursor: 'pointer', left: 0, top: 0 }} />
                    <Button variant="outline" size="sm" style={{ width: '100%', fontWeight: '700' }}>Select File</Button>
                </div>
            </Card>

            <div style={{ marginTop: '1.5rem' }}>
                <Card style={{ background: 'var(--color-info-light)', border: '1px solid var(--color-info)', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <Calendar size={20} color="var(--color-info)" style={{ flexShrink: 0 }} />
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-info)', margin: 0, fontWeight: '600', lineHeight: 1.4 }}>
                        Faculty admission requests are processed by the Registrar office within 24 hours.
                    </p>
                </Card>
            </div>
        </div>
      </div>
    </div>
  );
}
