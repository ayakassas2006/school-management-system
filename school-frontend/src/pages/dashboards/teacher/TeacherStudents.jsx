import React, { useState } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { Search, Mail, MessageSquare, Trash2, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentsApi, classesApi } from '../../../services/api';
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
  const [filterClass, setFilterClass] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: students = [], isLoading } = useQuery({
    queryKey: ['teacher-students'],
    queryFn: async () => {
      const res = await studentsApi.getAll();
      return res.data.map(s => {
        const grades = s.grades || [];
        const avgGrade = grades.length > 0 
          ? (grades.reduce((sum, g) => sum + parseFloat(g.score), 0) / grades.length).toFixed(1) 
          : 'N/A';
          
        const attendance = s.attendance || [];
        let lastAttendance = 'N/A';
        if (attendance.length > 0) {
          const sortedAttendance = attendance.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
          const lastAtt = sortedAttendance[0].status;
          lastAttendance = lastAtt ? lastAtt.charAt(0).toUpperCase() + lastAtt.slice(1) : 'N/A';
        }

        return {
          name: s.user?.name || 'Unknown',
          id: `STD-${s.id}`,
          studentId: s.id,
          class: s.class_room?.name || 'Unassigned',
          classId: s.class_id,
          grade: avgGrade,
          lastAttendance: lastAttendance,
          avatarUrl: null,
          studentEmail: s.user?.email || null,
          parentEmail: s.school_parent?.user?.email || null,
          studentUserId: s.user?.id || null,
          parentUserId: s.school_parent?.user?.id || null,
          parentName: s.school_parent?.user?.name || null
        };
      });
    }
  });

  const { data: classesList = [] } = useQuery({
    queryKey: ['classes-list'],
    queryFn: async () => {
      const res = await fetch('http://127.0.0.1:8000/api/classes', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      const data = await res.json();
      return data.data || [];
    }
  });

  const handleAssignClass = async (studentId, classId) => {
    try {
      const res = await fetch('http://localhost:8000/api/students/assign-class', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ student_id: studentId, class_id: classId })
      });
      const data = await res.json();
      if (data.status === 'success') {
        queryClient.invalidateQueries(['teacher-students']);
        success('Student assigned to class successfully.');
      } else {
        showError('Failed to assign student: ' + (data.message || ''));
      }
    } catch (err) {
      showError('Failed to assign student to class.');
    }
  };

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

  const handleDownloadPDF = (student) => {
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(22);
      doc.setTextColor(59, 130, 246); // Primary blue color
      doc.text('Student Academic Report', 20, 30);
      
      doc.setFontSize(12);
      doc.setTextColor(50, 50, 50);
      
      let yPos = 50;
      const lineHeight = 10;
      
      doc.text(`Student Name: ${student.name}`, 20, yPos);
      yPos += lineHeight;
      doc.text(`Student ID: ${student.id}`, 20, yPos);
      yPos += lineHeight;
      doc.text(`Assigned Class: ${student.class}`, 20, yPos);
      yPos += lineHeight;
      doc.text(`Current Grade: ${student.grade !== 'N/A' ? student.grade + '/20' : 'N/A'}`, 20, yPos);
      yPos += lineHeight;
      doc.text(`Recent Attendance: ${student.lastAttendance}`, 20, yPos);
      
      doc.setDrawColor(200, 200, 200);
      doc.line(20, yPos + 10, 190, yPos + 10);
      
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text(`Generated on ${new Date().toLocaleDateString()} by EduSaaS System`, 20, yPos + 20);
      
      doc.save(`${student.name.replace(/\s+/g, '_')}_Report.pdf`);
      success('PDF Report downloaded successfully!');
    } catch (err) {
      showError('Failed to generate PDF. Make sure jspdf is installed correctly.');
    }
  };

  const uniqueGroups = [...new Set(students.map(s => s.class))];
  const filteredStudents = students.filter(s => {
    const matchesClass = filterClass === '' || s.class === filterClass;
    const matchesSearch = searchQuery === '' || s.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem' }}>Student Roster</h1>
      </div>

      <Card style={{ padding: 0 }}>
        <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none', background: 'white' }}
            >
              <option value="">Select Group</option>
              {uniqueGroups.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: 12, top: 10, color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{student.class}</div>
                    </div>
                  </td>
                  <td style={{ padding: '1.5rem', color: 'var(--color-text-muted)' }}>{student.class}</td>
                  <td style={{ padding: '1.5rem', fontWeight: '600', color: student.grade === 'N/A' ? 'var(--color-text-muted)' : (parseFloat(student.grade) >= 15 ? 'var(--color-success)' : (parseFloat(student.grade) >= 10 ? 'var(--color-warning)' : 'var(--color-danger)')) }}>
                    {student.grade !== 'N/A' ? `${student.grade}/20` : 'N/A'}
                  </td>
                  <td style={{ padding: '1.5rem' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: '600',
                      background: student.lastAttendance === 'Present' ? 'var(--color-success)20' : (student.lastAttendance === 'N/A' ? 'var(--color-bg)' : 'var(--color-danger)20'),
                      color: student.lastAttendance === 'Present' ? 'var(--color-success)' : (student.lastAttendance === 'N/A' ? 'var(--color-text-muted)' : 'var(--color-danger)'),
                    }}>
                      {student.lastAttendance}
                    </span>
                  </td>
                  <td style={{ padding: '1.5rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => {
                          if (student.studentUserId) {
                            navigate('/dashboard/teacher/messages', { state: { targetUser: { id: student.studentUserId, name: student.name, role: 'Student' } } });
                          } else {
                            alert('No valid student user found to message.');
                          }
                        }}
                        style={{ background: 'var(--color-bg)', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)', cursor: 'pointer', transition: 'all 0.2s' }} 
                        title="Message Student"
                      >
                        <Mail size={16} />
                      </button>
                      <button 
                        onClick={() => {
                          if (student.parentUserId) {
                            navigate('/dashboard/teacher/messages', { state: { targetUser: { id: student.parentUserId, name: student.parentName || (student.name + "'s Parent"), role: 'Parent' } } });
                          } else {
                            alert('No valid parent user found to message.');
                          }
                        }}
                        style={{ background: 'var(--color-bg)', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)', cursor: 'pointer', transition: 'all 0.2s' }} 
                        title="Message Parent"
                      >
                        <MessageSquare size={16} />
                      </button>
                      <button 
                        onClick={() => handleDownloadPDF(student)}
                        style={{ background: 'rgba(59,130,246,0.1)', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-primary)', color: 'var(--color-primary)', cursor: 'pointer', transition: 'all 0.2s' }} 
                        title="Download PDF Report"
                      >
                        <Download size={16} />
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
