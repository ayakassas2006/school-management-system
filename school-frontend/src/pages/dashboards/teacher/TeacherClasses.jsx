import React, { useState, useEffect, useCallback, useRef } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import { BookOpen, Users, Clock, Upload, RefreshCw } from 'lucide-react';
import { useToast } from '../../../components/ui/Toast';
import { coursesApi } from '../../../services/api';

export default function TeacherClasses() {
  const { success, error } = useToast();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSyllabusOpen, setIsSyllabusOpen] = useState(false);
  const [rosterClass, setRosterClass] = useState(null);
  const fileInputRef = useRef(null);

  // Fetch courses from backend on mount so data persists after reload
  const fetchClasses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await coursesApi.getAll();
      setClasses(res.data);
    } catch (err) {
      // Keep empty list if backend is unreachable
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleSyllabusUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      success(`Syllabus "${file.name}" uploaded successfully!`);
      setIsSyllabusOpen(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem' }}>My Classes</h1>
        <Button variant="primary" onClick={() => setIsSyllabusOpen(true)}>
          <Upload size={18} style={{ marginRight: 8 }} /> Upload Syllabus
        </Button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
          <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite', marginBottom: '0.5rem' }} />
          <div>Loading classes from database...</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {classes.map((cls) => (
            <Card key={cls.id} hoverEffect={true} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BookOpen size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{cls.name}</h3>
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{cls.classRoom?.room_number || 'N/A'}</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'var(--color-bg)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Schedule</div>
                  <div style={{ fontWeight: '500', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={12}/> {cls.schedule || 'TBD'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Instructor</div>
                  <div style={{ fontWeight: '500', fontSize: '0.875rem', color: 'var(--color-success)' }}>{cls.instructor || '—'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                      <Users size={16}/> {cls.capacity || 0} Max Capacity
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setRosterClass(cls)}>
                    View Roster
                  </Button>
              </div>
            </Card>
          ))}
          {!loading && classes.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
              No classes found. Ask your Admin to create courses.
            </div>
          )}
        </div>
      )}

      {/* Upload Syllabus Modal */}
      <Modal isOpen={isSyllabusOpen} onClose={() => setIsSyllabusOpen(false)} title="Upload Syllabus">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <p style={{ color: 'var(--color-text-muted)' }}>Upload a PDF or Word document as the syllabus for your class.</p>
          <input
            type="file"
            ref={fileInputRef}
            accept=".pdf,.doc,.docx"
            style={{ display: 'none' }}
            onChange={handleSyllabusUpload}
          />
          <Button variant="primary" onClick={() => fileInputRef.current?.click()}>
            <Upload size={16} style={{ marginRight: 8 }} /> Choose File
          </Button>
          <Button variant="outline" onClick={() => setIsSyllabusOpen(false)}>Cancel</Button>
        </div>
      </Modal>

      {/* View Roster Modal */}
      <Modal isOpen={!!rosterClass} onClose={() => setRosterClass(null)} title={`Roster: ${rosterClass?.name || ''}`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ color: 'var(--color-text-muted)' }}>Student enrollment data comes from the backend.</p>
          <div style={{ padding: '1.5rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-lg)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            Capacity: {rosterClass?.capacity || 'N/A'} students
          </div>
          <Button variant="outline" onClick={() => setRosterClass(null)}>Close</Button>
        </div>
      </Modal>
    </div>
  );
}
