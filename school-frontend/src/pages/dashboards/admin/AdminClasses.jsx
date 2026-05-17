import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import { BookOpen, Users, Clock, MoreHorizontal, Plus, GraduationCap, Trash2, Edit } from 'lucide-react';
import { useToast } from '../../../components/ui/Toast';
import { coursesApi, usersApi, classesApi } from '../../../services/api';

export default function AdminClasses() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({ class_id: '', name: '', duration: '', teacher_id: '', capacity: 30, schedule: 'Mon, Wed 09:00 AM' });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editCourse, setEditCourse] = useState({ class_name: '', name: '', duration: '', teacher_id: '', capacity: 30, schedule: 'Mon, Wed 09:00 AM' });
  const [selectedClassDetails, setSelectedClassDetails] = useState(null);
  const [selectedClassRoster, setSelectedClassRoster] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState('');

  // Fetch all courses using React Query
  const { data: courses = [], isLoading: loading } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const res = await coursesApi.getAll();
      return res.data.map(c => ({
        ...c,
        color: c.color || `hsl(${(c.id * 73) % 360}, 65%, 50%)`,
        students: c.enrollments_count ?? c.students ?? 0,
        status: c.status || 'Active',
      }));
    }
  });

  const { data: teachersList = [] } = useQuery({
    queryKey: ['teachers'],
    queryFn: async () => {
      const res = await usersApi.getAll({ role: 'teacher' });
      return res.data || [];
    }
  });

  const { data: studentsList = [] } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const res = await usersApi.getAll({ role: 'student' });
      return res.data || [];
    }
  });

  const { data: classesList = [] } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const res = await classesApi.getAll();
      return res.data || [];
    }
  });

  const deleteCourse = useMutation({
    mutationFn: async (courseId) => {
      return await coursesApi.delete(courseId); // Assuming delete exists
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['courses']);
      success('Course deleted successfully.');
    },
    onError: () => {
      error('Failed to delete course.');
    }
  });

  const { data: roster = [] } = useQuery({
    queryKey: ['roster', selectedClassRoster?.id],
    queryFn: async () => {
      if (!selectedClassRoster) return [];
      const res = await fetch(`http://localhost:8000/api/courses/${selectedClassRoster.id}/roster`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      return await res.json();
    },
    enabled: !!selectedClassRoster
  });

  const removeStudent = useMutation({
    mutationFn: async (enrollmentId) => {
      return await fetch(`http://localhost:8000/api/enrollments/${enrollmentId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}` 
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['roster', selectedClassRoster?.id]);
      success('Student removed from course.');
    }
  });

  const addStudent = useMutation({
    mutationFn: async (payload) => {
      return await fetch(`http://localhost:8000/api/enrollments`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}` 
        },
        body: JSON.stringify({
          student_id: payload.student_id,
          course_id: selectedClassRoster.id
        })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['roster', selectedClassRoster?.id]);
      success('Student added to roster.');
      setSelectedStudentId('');
    },
    onError: () => {
      error('Failed to add student to roster.');
    }
  });

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const courseToAdd = { 
        ...newCourse,
        students: 0, 
        status: 'Active', 
        color: `hsl(${Math.random() * 360}, 70%, 50%)` 
      };
      
      await coursesApi.create(courseToAdd);
      
      queryClient.invalidateQueries(['courses']);
      setIsModalOpen(false);
      setNewCourse({ class_name: '', name: '', duration: '', teacher_id: '', capacity: 30, schedule: 'Mon, Wed 09:00 AM' });
      success(`${newCourse.name} has been created and saved to the database.`);
    } catch (err) {
      error('Failed to create course. ' + (err?.message || ''));
    }
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    try {
      await coursesApi.update(editingCourseId, editCourse);
      
      queryClient.invalidateQueries(['courses']);
      setIsEditModalOpen(false);
      success(`${editCourse.name} has been updated successfully.`);
    } catch (err) {
      error('Failed to update course. ' + (err?.message || ''));
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem' }}>Class & Course Management</h1>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} style={{ marginRight: 8 }} /> Create Course
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {loading ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
            Loading courses from database...
          </div>
        ) : courses.map((course) => (
          <Card key={course.id} hoverEffect={true} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '1rem', background: `${course.color}20`, color: course.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BookOpen size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', fontWeight: '700', color: 'var(--color-text-main)' }}>{course.name}</h3>
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>{course.id}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                 <button onClick={() => {
                    setEditingCourseId(course.id);
                    setEditCourse({
                       class_name: course.classRoom?.name || '',
                       name: course.name,
                       duration: course.duration || '',
                       teacher_id: course.teacher_id || '',
                       capacity: course.capacity || 30,
                       schedule: course.schedule || '',
                       instructor: course.instructor || ''
                    });
                    setIsEditModalOpen(true);
                 }} style={{ background: 'var(--color-primary)15', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', padding: '0.4rem', borderRadius: '0.5rem' }}>
                     <Edit size={16} />
                 </button>
                 <button onClick={() => deleteCourse.mutate(course.id)} style={{ background: 'var(--color-danger)15', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: '0.4rem', borderRadius: '0.5rem' }}>
                     <Trash2 size={16} />
                 </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'var(--color-bg)', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Instructor</div>
                <div style={{ fontWeight: '600', fontSize: '0.875rem', color: 'var(--color-text-main)' }}>{course.teacher?.user?.name || course.instructor || 'Unassigned'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Schedule</div>
                <div style={{ fontWeight: '600', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-text-main)' }}><Clock size={12}/> {course.schedule}</div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontWeight: '500' }}><Users size={16}/> Enrolled Students</span>
                <span style={{ fontWeight: '700', color: course.students >= course.capacity ? 'var(--color-danger)' : 'var(--color-text-main)' }}>{course.students} / {course.capacity}</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--color-bg)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(course.students / course.capacity) * 100}%`, background: course.students >= course.capacity ? 'var(--color-danger)' : course.color, borderRadius: '4px' }}></div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                <Button variant="outline" size="sm" style={{ flex: 1, fontWeight: '600' }} onClick={() => setSelectedClassDetails(course)}>View Details</Button>
                <Button variant="outline" size="sm" style={{ flex: 1, fontWeight: '600' }} onClick={() => setSelectedClassRoster(course)}>Manage Roster</Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Course Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Course">
        <form onSubmit={handleCreateCourse} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <GraduationCap size={32} />
                </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div>
                    <label className="form-label">Group / Class</label>
                    <select 
                      className="form-input" 
                      required
                      value={newCourse.class_id}
                      onChange={e => setNewCourse({...newCourse, class_id: e.target.value})}
                    >
                      <option value="">Select Class</option>
                      {classesList.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                </div>
                <div>
                    <label className="form-label">Course Name</label>
                    <input 
                      type="text" 
                      required 
                      className="form-input" 
                      placeholder="e.g. Advanced Chemistry"
                      value={newCourse.name}
                      onChange={e => setNewCourse({...newCourse, name: e.target.value})}
                    />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div>
                    <label className="form-label">Course Duration</label>
                    <input 
                      type="text" 
                      required 
                      className="form-input" 
                      placeholder="e.g. 3 months, 40 hours"
                      value={newCourse.duration}
                      onChange={e => setNewCourse({...newCourse, duration: e.target.value})}
                    />
                </div>
                <div>
                    <label className="form-label">Assign Teacher</label>
                    <select 
                      className="form-input" 
                      value={newCourse.teacher_id}
                      onChange={e => {
                        const selectedTeacher = teachersList.find(t => t.profile?.id == e.target.value);
                        setNewCourse({...newCourse, teacher_id: e.target.value, instructor: selectedTeacher ? selectedTeacher.name : ''});
                      }}
                      required
                    >
                      <option value="">Select a Teacher</option>
                      {teachersList.map(t => (
                        <option key={t.id} value={t.profile?.id || ''}>{t.name}</option>
                      ))}
                    </select>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div>
                    <label className="form-label">Max Capacity</label>
                    <input 
                      type="number" 
                      required 
                      className="form-input" 
                      value={newCourse.capacity}
                      onChange={e => setNewCourse({...newCourse, capacity: parseInt(e.target.value)})}
                    />
                </div>
                <div>
                    <label className="form-label">Default Schedule</label>
                    <input 
                      type="datetime-local" 
                      required 
                      className="form-input" 
                      value={newCourse.schedule}
                      onChange={e => setNewCourse({...newCourse, schedule: e.target.value})}
                    />
                </div>
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button variant="primary" type="submit">Create Course</Button>
            </div>
        </form>
      </Modal>

      {/* Edit Course Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Course">
        <form onSubmit={handleUpdateCourse} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Edit size={32} />
                </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div>
                    <label className="form-label">Class Name</label>
                    <input 
                      type="text" 
                      required 
                      className="form-input" 
                      placeholder="e.g. 10th Grade"
                      value={editCourse.class_name}
                      onChange={e => setEditCourse({...editCourse, class_name: e.target.value})}
                    />
                </div>
                <div>
                    <label className="form-label">Course Name</label>
                    <input 
                      type="text" 
                      required 
                      className="form-input" 
                      placeholder="e.g. Advanced Chemistry"
                      value={editCourse.name}
                      onChange={e => setEditCourse({...editCourse, name: e.target.value})}
                    />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div>
                    <label className="form-label">Course Duration</label>
                    <input 
                      type="text" 
                      required 
                      className="form-input" 
                      placeholder="e.g. 3 months, 40 hours"
                      value={editCourse.duration}
                      onChange={e => setEditCourse({...editCourse, duration: e.target.value})}
                    />
                </div>
                <div>
                    <label className="form-label">Assign Teacher</label>
                    <select 
                      className="form-input" 
                      value={editCourse.teacher_id}
                      onChange={e => {
                        const selectedTeacher = teachersList.find(t => t.profile?.id == e.target.value);
                        setEditCourse({...editCourse, teacher_id: e.target.value, instructor: selectedTeacher ? selectedTeacher.name : ''});
                      }}
                      required
                    >
                      <option value="">Select a Teacher</option>
                      {teachersList.map(t => (
                        <option key={t.id} value={t.profile?.id || ''}>{t.name}</option>
                      ))}
                    </select>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div>
                    <label className="form-label">Max Capacity</label>
                    <input 
                      type="number" 
                      required 
                      className="form-input" 
                      value={editCourse.capacity}
                      onChange={e => setEditCourse({...editCourse, capacity: parseInt(e.target.value)})}
                    />
                </div>
                <div>
                    <label className="form-label">Default Schedule</label>
                    <input 
                      type="datetime-local" 
                      required 
                      className="form-input" 
                      value={editCourse.schedule}
                      onChange={e => setEditCourse({...editCourse, schedule: e.target.value})}
                    />
                </div>
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <Button variant="outline" type="button" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                <Button variant="primary" type="submit">Update Course</Button>
            </div>
        </form>
      </Modal>

      {/* Class Details Modal */}
      <Modal isOpen={!!selectedClassDetails} onClose={() => setSelectedClassDetails(null)} title={selectedClassDetails?.name + " Details"}>
        {selectedClassDetails && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ padding: '1.5rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Instructor</div>
              <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{selectedClassDetails.instructor}</div>
            </div>
            <div style={{ padding: '1.5rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Schedule</div>
              <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{selectedClassDetails.schedule}</div>
            </div>
            <div style={{ padding: '1.5rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Capacity & Enrollment</div>
              <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{selectedClassDetails.students} / {selectedClassDetails.capacity} Students</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <Button variant="outline" onClick={() => setSelectedClassDetails(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Manage Roster Modal */}
      <Modal isOpen={!!selectedClassRoster} onClose={() => setSelectedClassRoster(null)} title={"Manage Roster: " + selectedClassRoster?.name}>
        {selectedClassRoster && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {roster.map(student => (
              <div key={student.id} style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: '600' }}>{student.user?.name || student.name}</div>
                <Button variant="outline" size="sm" onClick={() => removeStudent.mutate(student.enrollment_id)}>Remove</Button>
              </div>
            ))}
            {roster.length === 0 && <div style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>No students enrolled.</div>}
            
            {/* Add Student Form */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                addStudent.mutate({ 
                  student_id: selectedStudentId, 
                  class_id: selectedClassRoster.class_id || selectedClassRoster.id
                });
              }} 
              style={{ marginTop: '1.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}
            >
              <label className="form-label">Add Student to Roster</label>
              
              <input 
                type="hidden" 
                name="class_id" 
                value={selectedClassRoster.class_id || selectedClassRoster.id || ''} 
              />
              
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <select 
                  className="form-input" 
                  value={selectedStudentId} 
                  onChange={e => setSelectedStudentId(e.target.value)}
                  required
                  style={{ flex: 1 }}
                >
                  <option value="">Select a Student</option>
                  {studentsList
                    .filter(s => {
                      const classId = s.class_id || s.profile?.class_id;
                      const studentId = s.id || s.profile?.id;
                      const enrolledStudentIds = roster.map(r => r.id);
                      return classId === selectedClassRoster.class_id && !enrolledStudentIds.includes(studentId);
                    })
                    .map(s => (
                      <option key={s.id} value={s.profile?.id || s.id}>{s.name}</option>
                    ))}
                </select>
                
                <Button 
                  variant="primary" 
                  type="submit" 
                  disabled={addStudent.isLoading || !selectedStudentId}
                >
                  {addStudent.isLoading ? 'Adding...' : 'Add'}
                </Button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
}
