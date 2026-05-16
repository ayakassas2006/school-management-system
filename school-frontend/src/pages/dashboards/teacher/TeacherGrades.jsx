import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { Download, Save, Send, Users, TrendingUp, UserPlus } from 'lucide-react';
import { useToast } from '../../../components/ui/Toast';
import { coursesApi, studentsApi, gradesApi } from '../../../services/api';

const initialStudents = [];

export default function TeacherGrades() {
  const { success, error } = useToast();
  const [selectedCourseId, setSelectedCourseId] = useState('');
  
  const { data: courses = [] } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => (await coursesApi.getAll()).data
  });

  useEffect(() => {
    if (courses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(courses[0].id.toString());
    }
  }, [courses, selectedCourseId]);

  const { data: rawStudents = [] } = useQuery({
    queryKey: ['students'],
    queryFn: async () => (await studentsApi.getAll()).data
  });

  const [gradesState, setGradesState] = useState({});

  useEffect(() => {
    const newState = { ...gradesState };
    rawStudents.forEach(st => {
      if (!newState[st.id]) {
        newState[st.id] = { q1: 0, mid: 0, proj: 0, fin: 0 };
      }
    });
    setGradesState(newState);
  }, [rawStudents]);

  const students = rawStudents.map(st => ({
    id: st.id,
    name: st.user?.name || 'Unknown Student',
    q1: gradesState[st.id]?.q1 || 0,
    mid: gradesState[st.id]?.mid || 0,
    proj: gradesState[st.id]?.proj || 0,
    fin: gradesState[st.id]?.fin || 0,
  }));

  const calculateTotal = (s) => {
    const total = (s.q1 * 0.1) + (s.mid * 0.3) + (s.proj * 0.2) + (s.fin * 0.4);
    return Math.round(total);
  };

  const handleGradeChange = (id, field, value) => {
    const val = value === '' ? 0 : Math.min(100, Math.max(0, parseInt(value) || 0));
    setGradesState(prev => ({ ...prev, [id]: { ...prev[id], [field]: val } }));
  };

  const handlePublish = async () => {
    if (!selectedCourseId) {
      error("Please select a course first.");
      return;
    }
    try {
      // For MVP, we save the calculated total as the final grade
      for (const s of students) {
        await gradesApi.save({
          student_id: s.id,
          course_id: selectedCourseId,
          score: calculateTotal(s) / 5 // converting 100 scale to 20 scale for backend
        });
      }
      success("Grades have been formally published to the database!");
    } catch (err) {
      error("Failed to publish grades.");
    }
  };

  const stats = useMemo(() => {
    if (students.length === 0) return { average: 0, highest: 0, passed: 0 };
    const totals = students.map(s => calculateTotal(s));
    const avg = totals.reduce((a, b) => a + b, 0) / totals.length;
    return {
        average: Math.round(avg),
        highest: Math.max(...totals),
        passed: totals.filter(t => t >= 60).length
    };
  }, [students]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Digital Gradebook</h1>
          <select 
            value={selectedCourseId} 
            onChange={e => setSelectedCourseId(e.target.value)}
            className="form-input" 
            style={{ width: '300px', padding: '0.5rem 1rem' }}
          >
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.name}</option>
            ))}
            {courses.length === 0 && <option value="">No courses available</option>}
          </select>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
            <Button variant="outline" style={{ fontWeight: '600' }}><Download size={18} style={{ marginRight: 8 }}/> Export CSV</Button>
            <Button variant="primary" onClick={handlePublish} style={{ gap: '0.6rem', fontWeight: '700' }}>
                <Send size={18} /> Publish to Portal
            </Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
          {[
              { label: 'Class Average', value: `${stats.average}%`, icon: <TrendingUp size={20}/>, color: 'var(--color-primary)' },
              { label: 'Passing Students', value: `${stats.passed} / ${students.length}`, icon: <Users size={20}/>, color: 'var(--color-success)' },
              { label: 'Highest Score', value: `${stats.highest}%`, icon: <TrendingUp size={20}/>, color: 'var(--color-accent)' },
          ].map((stat, i) => (
              <Card key={i} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem' }}>
                  <div style={{ background: `${stat.color}15`, color: stat.color, padding: '1rem', borderRadius: 'var(--radius-lg)' }}>{stat.icon}</div>
                  <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{stat.label}</div>
                      <div style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--color-text-main)' }}>{stat.value}</div>
                  </div>
              </Card>
          ))}
      </div>

      <Card style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
        <div style={{ padding: '1.25rem 2rem', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
                <Button variant="outline" size="sm" onClick={() => window.location.hash = '#teacher/students'}>
                    <UserPlus size={16} style={{ marginRight: 6 }} /> Register Student
                </Button>
            </div>
            <Button variant="outline" size="sm" onClick={handlePublish} style={{ fontWeight: '700' }}><Save size={16} style={{ marginRight: 8 }}/> Batch Save</Button>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                <tr style={{ background: 'var(--color-bg)', color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    <th style={{ padding: '1.25rem 2rem', fontWeight: '700' }}>Student Name</th>
                    <th style={{ padding: '1.25rem 2rem', fontWeight: '700' }}>Quiz (10%)</th>
                    <th style={{ padding: '1.25rem 2rem', fontWeight: '700' }}>Midterm (30%)</th>
                    <th style={{ padding: '1.25rem 2rem', fontWeight: '700' }}>Proj (20%)</th>
                    <th style={{ padding: '1.25rem 2rem', fontWeight: '700' }}>Final (40%)</th>
                    <th style={{ padding: '1.25rem 2rem', fontWeight: '800', color: 'var(--color-primary)' }}>Aggregate</th>
                </tr>
                </thead>
                <tbody>
                {students.map((s) => (
                    <tr key={s.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.2s' }}>
                        <td style={{ padding: '1.25rem 2rem', fontWeight: '700', color: 'var(--color-text-main)' }}>{s.name}</td>
                        <td style={{ padding: '1.25rem 2rem' }}>
                            <input 
                              type="number" value={s.q1} 
                              onChange={(e) => handleGradeChange(s.id, 'q1', e.target.value)}
                              className="grade-input"
                            />
                        </td>
                        <td style={{ padding: '1.25rem 2rem' }}>
                            <input 
                              type="number" value={s.mid} 
                              onChange={(e) => handleGradeChange(s.id, 'mid', e.target.value)}
                              className="grade-input"
                            />
                        </td>
                        <td style={{ padding: '1.25rem 2rem' }}>
                            <input 
                              type="number" value={s.proj} 
                              onChange={(e) => handleGradeChange(s.id, 'proj', e.target.value)}
                              className="grade-input"
                            />
                        </td>
                        <td style={{ padding: '1.25rem 2rem' }}>
                            <input 
                              type="number" value={s.fin} 
                              onChange={(e) => handleGradeChange(s.id, 'fin', e.target.value)}
                              className="grade-input"
                            />
                        </td>
                        <td style={{ padding: '1.25rem 2rem' }}>
                            <span style={{ 
                                display: 'inline-block', padding: '0.4rem 0.8rem', borderRadius: '2rem', 
                                background: calculateTotal(s) >= 60 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                color: calculateTotal(s) >= 60 ? 'var(--color-success)' : 'var(--color-danger)',
                                fontWeight: '900', fontSize: '1rem'
                            }}>
                                {calculateTotal(s)}%
                            </span>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
      </Card>

      <style>{`
        .grade-input {
            width: 70px;
            padding: 0.6rem;
            border: 1px solid var(--color-border);
            border-radius: var(--radius-sm);
            text-align: center;
            font-weight: 700;
            background: var(--color-bg);
            color: var(--color-text-main);
            outline: none;
            transition: all 0.2s;
        }
        .grade-input:focus {
            border-color: var(--color-primary);
            box-shadow: 0 0 0 3px var(--color-primary-light);
        }
      `}</style>
    </div>
  );
}
