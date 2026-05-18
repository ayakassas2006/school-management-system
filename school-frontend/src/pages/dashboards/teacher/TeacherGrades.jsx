import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { Download, Save, Send, Users, TrendingUp } from 'lucide-react';
import { useToast } from '../../../components/ui/Toast';
import { coursesApi, studentsApi, gradesApi } from '../../../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const initialStudents = [];

export default function TeacherGrades() {
  const { success, error } = useToast();
  const queryClient = useQueryClient();
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [filterClass, setFilterClass] = useState('');
  
  const { data: courses = [] } = useQuery({
    queryKey: ['my-courses'],
    queryFn: async () => {
      const res = await coursesApi.getMyCourses();
      return res.data || [];
    }
  });

  useEffect(() => {
    if (courses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(courses[0].id.toString());
    }
  }, [courses, selectedCourseId]);

  const selectedCourse = courses.find(c => c.id.toString() === selectedCourseId);
  const selectedClassId = selectedCourse?.class_id || null;

  const { data: rawStudents = [] } = useQuery({
    queryKey: ['students-for-class', selectedClassId],
    queryFn: async () => {
      if (!selectedClassId) return [];
      const res = await studentsApi.getAll({ class_id: selectedClassId });
      return res.data || [];
    },
    enabled: !!selectedClassId
  });

  const [gradesState, setGradesState] = useState({});

  const { data: existingGrades = [] } = useQuery({
    queryKey: ['grades', selectedCourseId],
    queryFn: async () => {
      if (!selectedCourseId) return [];
      const res = await gradesApi.getAll({ course_id: selectedCourseId });
      return res.data || [];
    },
    enabled: !!selectedCourseId
  });

  useEffect(() => {
    setGradesState({});
  }, [selectedCourseId]);

  useEffect(() => {
    if (!rawStudents.length) return;
    const newState = {};
    rawStudents.forEach(st => {
      newState[st.id] = { q1: 0, mid: 0, proj: 0, fin: 0 };
    });
    // Merge existing database grades
    existingGrades.forEach(rec => {
      if (newState[rec.student_id]) {
        newState[rec.student_id] = {
          q1: parseFloat(rec.cc1) || 0,
          mid: parseFloat(rec.cc2) || 0,
          proj: parseFloat(rec.cc3) || 0,
          fin: parseFloat(rec.efm) || 0
        };
      }
    });
    setGradesState(newState);
  }, [rawStudents, existingGrades]);

  const students = rawStudents.map(st => ({
    id: st.id,
    name: st.user?.name || 'Unknown Student',
    class: st.class_room?.name || 'Unassigned',
    q1: gradesState[st.id]?.q1 || 0,
    mid: gradesState[st.id]?.mid || 0,
    proj: gradesState[st.id]?.proj || 0,
    fin: gradesState[st.id]?.fin || 0,
  }));

  const uniqueGroups = [...new Set(students.map(s => s.class))];
  const filteredStudents = filterClass === '' ? students : students.filter(s => s.class === filterClass);

  const calculateTotal = (s) => {
    // CC1, CC2, and CC3 have the same coefficient and form 1/3 of the final grade
    // EFM (End of Module Exam) has a higher coefficient, forming 2/3 of the final grade
    const ccAverage = (s.q1 + s.mid + s.proj) / 3;
    const total = (ccAverage + (s.fin * 2)) / 3;
    return Math.round(total * 100) / 100;
  };

  const handleGradeChange = (id, field, value) => {
    const val = value === '' ? 0 : Math.min(20, Math.max(0, parseFloat(value) || 0));
    setGradesState(prev => ({ ...prev, [id]: { ...prev[id], [field]: val } }));
  };

  const handlePublish = async () => {
    if (!selectedCourseId) {
      error("Please select a course first.");
      return;
    }
    try {
      for (const s of filteredStudents) {
        await gradesApi.save({
          student_id: s.id,
          course_id: selectedCourseId,
          cc1: s.q1,
          cc2: s.mid,
          cc3: s.proj,
          efm: s.fin,
          score: calculateTotal(s)
        });
      }
      queryClient.invalidateQueries({ queryKey: ['grades', selectedCourseId] });
      queryClient.invalidateQueries({ queryKey: ['teacher-students'] });
      success("Grades have been formally published to the database!");
    } catch (err) {
      error("Failed to publish grades.");
    }
  };

  const stats = useMemo(() => {
    if (filteredStudents.length === 0) return { average: 0, highest: 0, passed: 0 };
    const totals = filteredStudents.map(s => calculateTotal(s));
    const avg = totals.reduce((a, b) => a + b, 0) / totals.length;
    return {
        average: Math.round(avg * 100) / 100,
        highest: Math.max(...totals),
        passed: totals.filter(t => t >= 10).length
    };
  }, [filteredStudents]);

  const handleDownloadPDF = () => {
    if (!selectedCourseId) {
      error("Please select a course first.");
      return;
    }
    
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(18);
      doc.setTextColor(59, 130, 246);
      doc.text('Module Grades Report', 14, 22);
      
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Course: ${selectedCourse?.name || 'N/A'}`, 14, 30);
      doc.text(`Class: ${selectedCourse?.class ? selectedCourse.class.name : 'N/A'}`, 14, 36);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 42);
      
      const tableColumn = ["Student Name", "CC1", "CC2", "CC3", "EFM", "Aggregate", "Status"];
      const tableRows = [];

      filteredStudents.forEach(student => {
        const total = calculateTotal(student);
        const status = total >= 10 ? 'Pass' : 'Fail';
        const studentData = [
          student.name,
          student.q1.toString(),
          student.mid.toString(),
          student.proj.toString(),
          student.fin.toString(),
          total.toString(),
          status
        ];
        tableRows.push(studentData);
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 50,
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [59, 130, 246], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 247, 250] },
      });
      
      doc.save(`Grades_${selectedCourse?.name?.replace(/\s+/g, '_') || 'Report'}.pdf`);
      success("PDF generated successfully!");
    } catch (err) {
      error("Failed to generate PDF.");
      console.error(err);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Digital Gradebook</h1>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <select 
              value={selectedCourseId} 
              onChange={e => setSelectedCourseId(e.target.value)}
              className="form-input" 
              style={{ width: '200px', padding: '0.5rem 1rem' }}
            >
              {courses.length === 0 && <option value="">No courses assigned</option>}
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.name} {course.class ? `(${course.class.name})` : ''}
                </option>
              ))}
            </select>
            
            <select 
              value={filterClass} 
              onChange={e => setFilterClass(e.target.value)}
              className="form-input" 
              style={{ width: '200px', padding: '0.5rem 1rem' }}
            >
              <option value="">All Groups</option>
              {uniqueGroups.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
            <Button variant="outline" onClick={handleDownloadPDF} disabled={filteredStudents.length === 0} style={{ fontWeight: '600' }}>
              <Download size={18} style={{ marginRight: 8 }}/> Download PDF
            </Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
          {[
              { label: 'Class Average', value: `${stats.average}%`, icon: <TrendingUp size={20}/>, color: 'var(--color-primary)' },
              { label: 'Passing Students', value: `${stats.passed} / ${filteredStudents.length}`, icon: <Users size={20}/>, color: 'var(--color-success)' },
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
            </div>
            <Button variant="outline" size="sm" onClick={handlePublish} style={{ fontWeight: '700' }}><Save size={16} style={{ marginRight: 8 }}/> Batch Save</Button>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                <tr style={{ background: 'var(--color-bg)', color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    <th style={{ padding: '1.25rem 2rem', fontWeight: '700' }}>Student Name</th>
                    <th style={{ padding: '1.25rem 2rem', fontWeight: '700' }}>CC1</th>
                    <th style={{ padding: '1.25rem 2rem', fontWeight: '700' }}>CC2</th>
                    <th style={{ padding: '1.25rem 2rem', fontWeight: '700' }}>CC3</th>
                    <th style={{ padding: '1.25rem 2rem', fontWeight: '700' }}>EFM</th>
                    <th style={{ padding: '1.25rem 2rem', fontWeight: '800', color: 'var(--color-primary)' }}>Aggregate</th>
                </tr>
                </thead>
                <tbody>
                {filteredStudents.map((s) => (
                    <tr key={s.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.2s' }}>
                        <td style={{ padding: '1.25rem 2rem', fontWeight: '700', color: 'var(--color-text-main)' }}>{s.name}</td>
                        <td style={{ padding: '1.25rem 2rem' }}>
                            <input 
                              type="number" value={s.q1} 
                              onChange={(e) => handleGradeChange(s.id, 'q1', e.target.value)}
                              className="grade-input"
                              step="any"
                            />
                        </td>
                        <td style={{ padding: '1.25rem 2rem' }}>
                            <input 
                              type="number" value={s.mid} 
                              onChange={(e) => handleGradeChange(s.id, 'mid', e.target.value)}
                              className="grade-input"
                              step="any"
                            />
                        </td>
                        <td style={{ padding: '1.25rem 2rem' }}>
                            <input 
                              type="number" value={s.proj} 
                              onChange={(e) => handleGradeChange(s.id, 'proj', e.target.value)}
                              className="grade-input"
                              step="any"
                            />
                        </td>
                        <td style={{ padding: '1.25rem 2rem' }}>
                            <input 
                              type="number" value={s.fin} 
                              onChange={(e) => handleGradeChange(s.id, 'fin', e.target.value)}
                              className="grade-input"
                              step="any"
                            />
                        </td>
                        <td style={{ padding: '1.25rem 2rem' }}>
                            <span style={{ 
                                display: 'inline-block', padding: '0.4rem 0.8rem', borderRadius: '2rem', 
                                background: calculateTotal(s) >= 10 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                color: calculateTotal(s) >= 10 ? 'var(--color-success)' : 'var(--color-danger)',
                                fontWeight: '900', fontSize: '1rem'
                            }}>
                                {calculateTotal(s)}/20
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
