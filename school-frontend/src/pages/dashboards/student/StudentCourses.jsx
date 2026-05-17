import React, { useState, useEffect } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import { BookOpen, Video, FileText, CheckCircle, ExternalLink } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const JoinClassButton = ({ nextLiveClassTime, meetingUrl }) => {
  const [isJoinable, setIsJoinable] = useState(false);

  useEffect(() => {
    const checkTime = () => {
      const now = new Date().getTime();
      const scheduledTime = new Date(nextLiveClassTime).getTime();
      setIsJoinable(now >= scheduledTime);
    };

    checkTime();
    const interval = setInterval(checkTime, 10000);
    return () => clearInterval(interval);
  }, [nextLiveClassTime]);

  return (
    <Button 
      variant={isJoinable ? "primary" : "outline"} 
      size="sm" 
      style={{ flex: 1, opacity: isJoinable ? 1 : 0.6 }}
      disabled={!isJoinable}
      onClick={() => window.open(meetingUrl, '_blank')}
    >
      <CheckCircle size={16} style={{ marginRight: 8 }}/> {isJoinable ? 'Join Class Now' : 'Starts Soon'}
    </Button>
  );
};

export default function StudentCourses() {
  const [materialsCourseId, setMaterialsCourseId] = useState(null);

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['student-courses'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:8000/api/student/courses', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      return res.data;
    }
  });

  const { data: materials = [] } = useQuery({
    queryKey: ['course-materials', materialsCourseId],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:8000/api/student/courses/${materialsCourseId}/materials`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      return res.data;
    },
    enabled: !!materialsCourseId
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem' }}>My Courses</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {courses.map((course, idx) => (
          <Card key={idx} hoverEffect={true} style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${course.color}20`, color: course.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{course.name}</h3>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{course.instructor}</span>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--color-text-muted)', fontWeight: '500' }}>Course Progress</span>
                    <span style={{ fontWeight: '600' }}>{course.progress}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'var(--color-bg)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${course.progress}%`, background: course.color, borderRadius: '4px' }}></div>
                </div>
            </div>

            <div style={{ background: 'var(--color-bg)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Next Live Class</div>
                <div style={{ fontWeight: '500', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Video size={16} color={course.color || 'var(--color-primary)'}/> {new Date(course.nextLiveClassTime).toLocaleString()}
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                <Button variant="outline" size="sm" style={{ flex: 1 }} onClick={() => setMaterialsCourseId(course.id)}><FileText size={16} style={{ marginRight: 8 }}/> Materials</Button>
                <JoinClassButton nextLiveClassTime={course.nextLiveClassTime} meetingUrl={course.meetingUrl} />
            </div>
          </Card>
        ))}
        {courses.length === 0 && !isLoading && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>You are not enrolled in any courses yet.</div>
        )}
      </div>

      <Modal isOpen={!!materialsCourseId} onClose={() => setMaterialsCourseId(null)} title="Course Materials">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {materials.map((mat) => (
            <div key={mat.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {mat.type === 'pdf' ? <FileText color="var(--color-primary)" /> : <Video color="var(--color-secondary)" />}
                <div>
                  <div style={{ fontWeight: '600' }}>{mat.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{mat.type.toUpperCase()} • {mat.size}</div>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => window.open(mat.url, '_blank')}><ExternalLink size={16}/></Button>
            </div>
          ))}
          {materials.length === 0 && <div style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>No materials available for this course.</div>}
        </div>
      </Modal>
    </div>
  );
}
