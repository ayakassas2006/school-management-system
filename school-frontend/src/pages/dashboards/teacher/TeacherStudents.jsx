import React, { useState } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { Search, Mail, MessageSquare, UserPlus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentsApi } from '../../../services/api';
import { useToast } from '../../../components/ui/Toast';

// Avatar Fallback Component
export const Avatar = ({ src, name }) => {
  if (src) return <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />;
  const initials = name ? name.charAt(0).toUpperCase() : '?';
  return <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)', borderRadius: '50%', color: 'var(--color-text-main)', fontWeight: 'bold' }}>{initials}</div>;
};

export default function TeacherStudents() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { success, error: showError } = useToast();
  const [filterClass, setFilterClass] = useState('All Classes');

  const { data: students = [], isLoading } = useQuery({
    queryKey: ['teacher-students'],
    queryFn: async () => {
      const res = await studentsApi.getAll();
      return res.data.map(s => ({
        name: s.user?.name || 'Unknown',
        id: `STD-${s.id}`,
        studentId: s.id,
        class: s.classRoom?.name || 'Unassigned',
        grade: 'N/A',
        lastAttendance: 'N/A',
        avatarUrl: null
      }));
    }
  });

  const deleteStudentMutation = useMutation({
    mutationFn: async (studentId) => {
      await studentsApi.delete(studentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['teacher-students']);
      success('Student completely removed from the database.');
    },
    onError: () => {
      showError('Failed to delete student.');
    }
  });

  const filteredStudents = filterClass === 'All Classes' ? students : students.filter(s => s.class === filterClass);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem' }}>Student Roster</h1>
        <Button variant="primary" onClick={() => navigate('/dashboard/teacher/students/add')} style={{ gap: '0.6rem', fontWeight: '700' }}>
          <UserPlus size={18} /> Register New Student
        </Button>
      </div>

      <Card style={{ padding: 0 }}>
        <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none', background: 'white' }}
            >
              <option>All Classes</option>
              <option>Mathematics 10A</option>
              <option>Physics 11B</option>
              <option>Advanced Calculus</option>
            </select>
          </div>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: 12, top: 10, color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              placeholder="Search students..."
              style={{ width: '250px', padding: '0.5rem 1rem 0.5rem 2.5rem', borderRadius: '2rem', border: '1px solid var(--color-border)', outline: 'none' }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--color-bg)', color: 'var(--color-text-muted)', fontSize: '0.875rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '1.5rem', fontWeight: '600' }}>Student details</th>
                <th style={{ padding: '1.5rem', fontWeight: '600' }}>Class</th>
                <th style={{ padding: '1.5rem', fontWeight: '600' }}>Current Grade</th>
                <th style={{ padding: '1.5rem', fontWeight: '600' }}>Recent Attendance</th>
                <th style={{ padding: '1.5rem', fontWeight: '600', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Avatar src={student.avatarUrl} name={student.name} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--color-text-main)' }}>{student.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{student.id}</div>
                    </div>
                  </td>
                  <td style={{ padding: '1.5rem', color: 'var(--color-text-muted)' }}>{student.class}</td>
                  <td style={{ padding: '1.5rem', fontWeight: '600', color: parseInt(student.grade) > 85 ? 'var(--color-success)' : (parseInt(student.grade) > 70 ? 'var(--color-warning)' : 'var(--color-danger)') }}>
                    {student.grade}
                  </td>
                  <td style={{ padding: '1.5rem' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: '600',
                      background: student.lastAttendance === 'Present' ? 'var(--color-success)20' : 'var(--color-danger)20',
                      color: student.lastAttendance === 'Present' ? 'var(--color-success)' : 'var(--color-danger)',
                    }}>
                      {student.lastAttendance}
                    </span>
                  </td>
                  <td style={{ padding: '1.5rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button style={{ background: 'var(--color-bg)', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)', cursor: 'pointer' }} title="Email Student">
                        <Mail size={16} />
                      </button>
                      <button style={{ background: 'var(--color-bg)', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)', cursor: 'pointer' }} title="Message Parent">
                        <MessageSquare size={16} />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete ${student.name}? This will completely remove them and their records from the database.`)) {
                            deleteStudentMutation.mutate(student.studentId);
                          }
                        }}
                        style={{ background: 'var(--color-bg)', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', color: 'var(--color-danger)', cursor: 'pointer', transition: 'all 0.2s' }}
                        title="Delete Student">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
