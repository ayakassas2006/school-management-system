import React, { useState, useEffect, useCallback } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import { FileText, Plus, CheckCircle, Clock, Calendar, Hash, MoreVertical, RefreshCw } from 'lucide-react';
import { useToast } from '../../../components/ui/Toast';
import { assignmentsApi } from '../../../services/api';

export default function TeacherAssignments() {
  const { success, error } = useToast();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
      title: '', class: 'Physics 101', dueDate: '', points: 100, instructions: ''
  });

  // Fetch all assignments from backend on mount for persistence across reloads
  const fetchAssignments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await assignmentsApi.getAll();
      // Normalize backend shape to match the UI's expected shape
      const normalized = res.data.map(a => ({
        id: a.id,
        title: a.title,
        class: a.course?.name ?? a.class ?? 'N/A',
        dueDate: a.due_date ?? a.dueDate ?? '',
        submitted: a.submitted ?? 0,
        total: a.total ?? 25,
        status: a.status ?? 'Active',
      }));
      setAssignments(normalized);
    } catch (err) {
      // Keep the empty array; backend may not be seeded yet
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    try {
      await assignmentsApi.create({
        title: newAssignment.title,
        due_date: newAssignment.dueDate,
        description: newAssignment.instructions,
        // course_id would normally come from a real select; using 1 as a placeholder
        course_id: newAssignment.course_id || null,
      });
      await fetchAssignments(); // Re-fetch to show the saved record
      setIsModalOpen(false);
      setNewAssignment({ title: '', class: 'Physics 101', dueDate: '', points: 100, instructions: '' });
      success(`Assignment "${newAssignment.title}" has been posted successfully.`);
    } catch (err) {
      error('Failed to post assignment. ' + (err?.message || ''));
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem' }}>Academic Assignments</h1>
          <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>Create and manage student evaluations</p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)} style={{ gap: '0.6rem', fontWeight: '700' }}>
          <Plus size={18} /> Post New Assignment
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
          {[
              { label: 'Pending Reviews', value: '12', icon: <Clock size={20}/>, color: 'var(--color-warning)' },
              { label: 'Avg Submission Rate', value: '84%', icon: <CheckCircle size={20}/>, color: 'var(--color-success)' },
              { label: 'Active Tasks', value: assignments.filter(a => a.status === 'Active').length, icon: <FileText size={20}/>, color: 'var(--color-primary)' },
          ].map((stat, i) => (
              <Card key={i} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.5rem' }}>
                  <div style={{ padding: '0.85rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-lg)', color: stat.color, border: '1px solid var(--color-border)' }}>{stat.icon}</div>
                  <div>
                      <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--color-text-main)' }}>{stat.value}</div>
                      <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{stat.label}</div>
                  </div>
              </Card>
          ))}
      </div>

      <Card style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--color-bg)', color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                <th style={{ padding: '1.25rem 2rem', fontWeight: '700' }}>Engagement Title</th>
                <th style={{ padding: '1.25rem 2rem', fontWeight: '700' }}>Subject/Class</th>
                <th style={{ padding: '1.25rem 2rem', fontWeight: '700' }}>Deadline</th>
                <th style={{ padding: '1.25rem 2rem', fontWeight: '700' }}>Progress</th>
                <th style={{ padding: '1.25rem 2rem', fontWeight: '700', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => (
                <tr key={assignment.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.2s' }}>
                  <td style={{ padding: '1.25rem 2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ 
                            width: '40px', height: '40px', borderRadius: 'var(--radius-md)', 
                            background: assignment.status === 'Completed' ? 'rgba(16, 185, 129, 0.1)' : 'var(--color-primary-light)', 
                            color: assignment.status === 'Completed' ? 'var(--color-success)' : 'var(--color-primary)', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '1px solid currentColor'
                        }}>
                        <FileText size={20} />
                        </div>
                        <div>
                        <div style={{ fontWeight: '700', color: 'var(--color-text-main)', fontSize: '0.95rem' }}>{assignment.title}</div>
                        <div style={{ fontSize: '0.7rem', color: assignment.status === 'Completed' ? 'var(--color-success)' : 'var(--color-text-muted)', fontWeight: '800', textTransform: 'uppercase' }}>{assignment.status}</div>
                        </div>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 2rem', fontWeight: '700', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{assignment.class}</td>
                  <td style={{ padding: '1.25rem 2rem' }}>
                    <span style={{ 
                        display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '600',
                        color: new Date(assignment.dueDate) < new Date() ? 'var(--color-danger)' : 'var(--color-text-main)' 
                    }}>
                        <Clock size={14}/> {new Date(assignment.dueDate).toLocaleDateString()}
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem 2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ flex: 1, height: '8px', background: 'var(--color-bg)', borderRadius: '4px', width: '100px', border: '1px solid var(--color-border)' }}>
                            <div style={{ height: '100%', width: `${(assignment.submitted / assignment.total)*100}%`, background: assignment.submitted === assignment.total ? 'var(--color-success)' : 'var(--gradient-primary)', borderRadius: '4px' }}></div>
                        </div>
                        <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--color-text-main)' }}>{assignment.submitted}/{assignment.total}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>
                    <Button variant="outline" size="sm" style={{ fontWeight: '700' }}>
                       {assignment.status === 'Completed' ? 'Recap Grades' : 'Grade Submissions'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Assignment">
          <form onSubmit={handleCreateAssignment} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                  <label className="form-label">Assignment Title</label>
                  <input 
                    type="text" required className="form-input" placeholder="e.g. Newton's Third Law Recap" 
                    value={newAssignment.title} onChange={e => setNewAssignment({...newAssignment, title: e.target.value})}
                  />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div>
                    <label className="form-label">Target Class</label>
                    <select className="form-input" value={newAssignment.class} onChange={e => setNewAssignment({...newAssignment, class: e.target.value})}>
                        <option>Physics 101 - Section A</option>
                        <option>Physics 101 - Section B</option>
                        <option>Advanced Physics</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Deadline Date</label>
                    <div style={{ position: 'relative' }}>
                        <Calendar size={16} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--color-text-muted)' }} />
                        <input 
                            type="date" required className="form-input" style={{ paddingLeft: '2.75rem' }}
                            value={newAssignment.dueDate} onChange={e => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                        />
                    </div>
                  </div>
              </div>

              <div>
                  <label className="form-label">Max Achievement Points</label>
                  <div style={{ position: 'relative' }}>
                    <Hash size={16} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--color-text-muted)' }} />
                    <input 
                        type="number" className="form-input" style={{ paddingLeft: '2.75rem' }}
                        value={newAssignment.points} onChange={e => setNewAssignment({...newAssignment, points: e.target.value})}
                    />
                  </div>
              </div>

              <div>
                  <label className="form-label">Submission Instructions</label>
                  <textarea 
                    rows="4" className="form-input" placeholder="Detail the requirements and resource references..."
                    value={newAssignment.instructions} onChange={e => setNewAssignment({...newAssignment, instructions: e.target.value})}
                  ></textarea>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                  <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button variant="primary" type="submit" style={{ fontWeight: '700' }}>Deploy Assignment</Button>
              </div>
          </form>
      </Modal>
    </div>
  );
}
