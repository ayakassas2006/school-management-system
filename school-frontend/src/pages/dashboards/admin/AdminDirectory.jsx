import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import { Search, Plus, MoreVertical, Mail, Phone, UserPlus, RefreshCw, Trash2, Edit } from 'lucide-react';
import { useToast } from '../../../components/ui/Toast';
import { useQuery } from '@tanstack/react-query';
import { usersApi, authApi, classesApi } from '../../../services/api';

export default function AdminDirectory() {
  const { success, error: showError } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: 'password',
    password_confirmation: 'password',
    role: '',
    phone: '',
    department: '',
    specialization: '',
    class_ids: [],
    class_id: '',
    parent_id: '',
    student_id: '',
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editUser, setEditUser] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    phone: '',
    department: '',
    specialization: '',
    class_id: '',
    parent_id: '',
    student_id: '',
  });

  const { data: studentsList = [] } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const res = await usersApi.getAll({ role: 'student' });
      return res.data || [];
    }
  });

  const { data: parentsList = [] } = useQuery({
    queryKey: ['parents'],
    queryFn: async () => {
      const res = await usersApi.getAll({ role: 'parent' });
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

  // Fetch users from the real API
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await usersApi.getAll();
      setUsers(res.data);
    } catch (err) {
      showError(err?.message || 'Failed to load users from the database.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesFilter = filter === 'All' || u.role === filter;
      const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            u.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [users, filter, searchQuery]);

  const handleAddUser = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Register via the API (also creates the role sub-profile)
      await authApi.register({
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        password_confirmation: newUser.password_confirmation,
        role: newUser.role,
        specialization: newUser.role === 'teacher' ? newUser.specialization : undefined,
        class_ids: newUser.role === 'teacher' ? newUser.class_ids : undefined,
        class_id: newUser.role === 'student' ? newUser.class_id : undefined,
        parent_id: newUser.role === 'student' ? newUser.parent_id : undefined,
        student_id: newUser.role === 'parent' ? newUser.student_id : undefined,
      });

      success(`${newUser.name} has been added and saved to the database!`);
      setIsModalOpen(false);
      setNewUser({ name: '', email: '', password: 'password', password_confirmation: 'password', role: '', phone: '', department: '', specialization: '', class_ids: [], class_id: '', parent_id: '', student_id: '' });

      // Refresh the list to include the new user from the DB
      await fetchUsers();
    } catch (err) {
      const errorMsg = err?.errors
        ? Object.values(err.errors).flat().join(' ')
        : (err?.message || 'Failed to create user.');
      showError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name: editUser.name,
        email: editUser.email,
        role: editUser.role,
      };
      if (editUser.password) {
        payload.password = editUser.password;
        payload.password_confirmation = editUser.password;
      }
      if (editUser.role === 'teacher') {
        payload.specialization = editUser.specialization;
        payload.class_id = editUser.class_id;
      }
      if (editUser.role === 'student') {
        payload.class_id = editUser.class_id;
        payload.parent_id = editUser.parent_id;
      }
      if (editUser.role === 'parent') {
        payload.student_id = editUser.student_id;
      }

      await usersApi.update(editingUserId, payload);

      success(`${editUser.name}'s account has been updated!`);
      setIsEditModalOpen(false);
      
      // Refresh the list to include updated user details
      await fetchUsers();
    } catch (err) {
      const errorMsg = err?.errors
        ? Object.values(err.errors).flat().join(' ')
        : (err?.message || 'Failed to update user.');
      showError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Delete "${userName}"? This cannot be undone.`)) return;
    try {
      await usersApi.delete(userId);
      success(`${userName} has been removed.`);
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (err) {
      showError('Failed to delete user.');
    }
  };

  const getRoleColor = (role) => {
    const map = { Admin: '#7c3aed', Teacher: '#2563eb', Student: '#059669', Parent: '#d97706' };
    return map[role] || '#6b7280';
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem' }}>Directory Management</h1>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="outline" onClick={fetchUsers} disabled={loading}>
            <RefreshCw size={16} style={{ marginRight: 6 }} />
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} style={{ marginRight: 8 }} /> Add New User
          </Button>
        </div>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
        <div style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', flexWrap: 'wrap', gap: '1rem', background: 'var(--color-surface)' }}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {['All', 'Student', 'Teacher', 'Parent', 'Admin'].map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                style={{
                  background: filter === type ? 'var(--color-primary)' : 'var(--color-bg)',
                  color: filter === type ? 'white' : 'var(--color-text-muted)',
                  border: '1px solid',
                  borderColor: filter === type ? 'var(--color-primary)' : 'var(--color-border)',
                  padding: '0.5rem 1.25rem', borderRadius: '2rem', cursor: 'pointer',
                  fontWeight: '600', transition: 'all 0.2s', fontSize: '0.875rem'
                }}
              >
                {type === 'All' ? 'All' : `${type}s`}
              </button>
            ))}
          </div>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '2rem', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--color-bg)', color: 'var(--color-text-main)', fontSize: '0.9rem' }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--color-bg)', color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                <th style={{ padding: '1.25rem 2rem', fontWeight: '700' }}>User</th>
                <th style={{ padding: '1.25rem 2rem', fontWeight: '700' }}>Contact</th>
                <th style={{ padding: '1.25rem 2rem', fontWeight: '700' }}>Role</th>
                <th style={{ padding: '1.25rem 2rem', fontWeight: '700' }}>Joined</th>
                <th style={{ padding: '1.25rem 2rem', fontWeight: '700', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite', marginBottom: '0.5rem' }} />
                    <div>Loading users from database...</div>
                  </td>
                </tr>
              ) : filteredUsers.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.2s' }}>
                  <td style={{ padding: '1.25rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: getRoleColor(user.role), color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.1rem' }}>
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', color: 'var(--color-text-main)', fontSize: '1rem' }}>{user.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: '600' }}>ID #{user.id}</div>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.875rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-body)' }}>
                        <Mail size={14} color="var(--color-primary)" /> {user.email}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 2rem' }}>
                    <span style={{ padding: '0.3rem 0.9rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: '700', background: getRoleColor(user.role) + '22', color: getRoleColor(user.role) }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem 2rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                  <td style={{ padding: '1.25rem 2rem', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => {
                        setEditingUserId(user.id);
                        setEditUser({
                          name: user.name,
                          email: user.email,
                          password: '',
                          role: user.role.toLowerCase(),
                          specialization: user.profile?.specialization || '',
                          class_id: user.role.toLowerCase() === 'teacher' ? (classesList.find(c => c.teacher_id === user.profile?.id)?.id || '') : (user.profile?.class_id || ''),
                          parent_id: user.profile?.parent_id || '',
                          student_id: user.role.toLowerCase() === 'parent' ? (studentsList.find(s => s.profile?.parent_id === user.profile?.id)?.profile?.id || '') : '',
                        });
                        setIsEditModalOpen(true);
                      }}
                      style={{ background: 'rgba(59,130,246,0.1)', border: 'none', borderRadius: 'var(--radius-md)', padding: '0.5rem 0.75rem', color: '#3b82f6', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <Edit size={14} /> Update
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id, user.name)}
                      style={{ background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: 'var(--radius-md)', padding: '0.5rem 0.75rem', color: '#dc2626', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    No users found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add User Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register New User">
        <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--color-bg)', border: '2px dashed var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
              <UserPlus size={32} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div>
              <label className="form-label">Full Name *</label>
              <input type="text" required className="form-input" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} placeholder="e.g. Robert Smith" />
            </div>
            <div>
              <label className="form-label">Email Address *</label>
              <input type="email" required className="form-input" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} placeholder="r.smith@example.com" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div>
              <label className="form-label">Password *</label>
              <input type="password" required className="form-input" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value, password_confirmation: e.target.value })} placeholder="Min. 8 characters" />
            </div>
            <div>
              <label className="form-label">Role *</label>
              <select className="form-input" required value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                <option value="">Select Role</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="parent">Parent</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {newUser.role === 'teacher' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <label className="form-label">Specialization</label>
                <input type="text" className="form-input" value={newUser.specialization} onChange={e => setNewUser({ ...newUser, specialization: e.target.value })} placeholder="e.g. Mathematics, Physics" />
              </div>
              <div>
                <label className="form-label">Assign Classes</label>
                <div style={{ 
                  border: '1px solid var(--color-border)', 
                  borderRadius: 'var(--radius-md)', 
                  padding: '0.5rem', 
                  maxHeight: '120px', 
                  overflowY: 'auto', 
                  background: 'var(--color-bg)' 
                }}>
                  {classesList.map(c => (
                    <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0', fontSize: '0.85rem', color: 'var(--color-text-body)', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        value={c.id}
                        checked={newUser.class_ids.includes(c.id.toString())}
                        onChange={e => {
                          const id = e.target.value;
                          const currentIds = newUser.class_ids;
                          if (e.target.checked) {
                            setNewUser({ ...newUser, class_ids: [...currentIds, id] });
                          } else {
                            setNewUser({ ...newUser, class_ids: currentIds.filter(x => x !== id) });
                          }
                        }}
                      />
                      {c.name}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {newUser.role === 'student' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <label className="form-label">Assign Class</label>
                <select className="form-input" value={newUser.class_id} onChange={e => setNewUser({ ...newUser, class_id: e.target.value })}>
                  <option value="">Select Class</option>
                  {classesList.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Select Parent</label>
                <select className="form-input" value={newUser.parent_id} onChange={e => setNewUser({ ...newUser, parent_id: e.target.value })}>
                  <option value="">Select Parent</option>
                  {parentsList.map(p => (
                    <option key={p.id} value={p.profile?.id || ''}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {newUser.role === 'parent' && (
            <div>
              <label className="form-label">Select Child (leur enfant)</label>
              <select className="form-input" value={newUser.student_id} onChange={e => setNewUser({ ...newUser, student_id: e.target.value })}>
                <option value="">Select Child</option>
                {studentsList.map(s => (
                  <option key={s.id} value={s.profile?.id || ''}>{s.name}</option>
                ))}
              </select>
            </div>
          )}

          <div style={{ padding: '0.75rem 1rem', background: 'rgba(99,102,241,0.08)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--color-primary)' }}>
            ✅ The user will be saved to the database and their role profile will be created automatically.
          </div>

          <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create User Account'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Update User">
        <form onSubmit={handleUpdateUser} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--color-bg)', border: '2px dashed var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
              <Edit size={32} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div>
              <label className="form-label">Full Name *</label>
              <input type="text" required className="form-input" value={editUser.name} onChange={e => setEditUser({ ...editUser, name: e.target.value })} placeholder="e.g. Robert Smith" />
            </div>
            <div>
              <label className="form-label">Email Address *</label>
              <input type="email" required className="form-input" value={editUser.email} onChange={e => setEditUser({ ...editUser, email: e.target.value })} placeholder="r.smith@example.com" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div>
              <label className="form-label">Password</label>
              <input type="password" className="form-input" value={editUser.password} onChange={e => setEditUser({ ...editUser, password: e.target.value })} placeholder="Leave blank to keep current password" />
            </div>
            <div>
              <label className="form-label">Role</label>
              <select className="form-input" required disabled value={editUser.role} onChange={e => setEditUser({ ...editUser, role: e.target.value })}>
                <option value="">Select Role</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="parent">Parent</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {editUser.role === 'teacher' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <label className="form-label">Specialization</label>
                <input type="text" className="form-input" value={editUser.specialization} onChange={e => setEditUser({ ...editUser, specialization: e.target.value })} placeholder="e.g. Mathematics, Physics" />
              </div>
              <div>
                <label className="form-label">Assign Class</label>
                <select className="form-input" value={editUser.class_id} onChange={e => setEditUser({ ...editUser, class_id: e.target.value })}>
                  <option value="">Select Class</option>
                  {classesList.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {editUser.role === 'student' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <label className="form-label">Assign Class</label>
                <select className="form-input" value={editUser.class_id} onChange={e => setEditUser({ ...editUser, class_id: e.target.value })}>
                  <option value="">Select Class</option>
                  {classesList.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Select Parent</label>
                <select className="form-input" value={editUser.parent_id} onChange={e => setEditUser({ ...editUser, parent_id: e.target.value })}>
                  <option value="">Select Parent</option>
                  {parentsList.map(p => (
                    <option key={p.id} value={p.profile?.id || ''}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {editUser.role === 'parent' && (
            <div>
              <label className="form-label">Select Child (leur enfant)</label>
              <select className="form-input" value={editUser.student_id} onChange={e => setEditUser({ ...editUser, student_id: e.target.value })}>
                <option value="">Select Child</option>
                {studentsList.map(s => (
                  <option key={s.id} value={s.profile?.id || ''}>{s.name}</option>
                ))}
              </select>
            </div>
          )}

          <div style={{ padding: '0.75rem 1rem', background: 'rgba(99,102,241,0.08)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--color-primary)' }}>
            ℹ️ Only fields that are changed will be updated in the database.
          </div>

          <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <Button variant="outline" type="button" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? 'Updating...' : 'Update User Account'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
