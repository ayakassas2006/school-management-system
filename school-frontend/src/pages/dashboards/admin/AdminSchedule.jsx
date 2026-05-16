import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Printer, MapPin, Clock, X, Users, BookOpen } from 'lucide-react';
import { useToast } from '../../../components/ui/Toast';
import { schedulesApi, classesApi, coursesApi, teachersApi } from '../../../services/api';

export default function AdminSchedule() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const [currentWeek, setCurrentWeek] = useState('Current Timetable');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSchedule, setNewSchedule] = useState({ class_room_id: '', course_id: '', teacher_id: '', day_of_week: 'Monday', start_time: '', end_time: '', room_number: '' });

  const { data: schedules = [] } = useQuery({
    queryKey: ['schedules'],
    queryFn: async () => {
      const res = await schedulesApi.getAll();
      return res.data;
    }
  });

  const { data: classesData = [] } = useQuery({ queryKey: ['classes'], queryFn: async () => (await classesApi.getAll()).data });
  const { data: coursesData = [] } = useQuery({ queryKey: ['courses'], queryFn: async () => (await coursesApi.getAll()).data });
  const { data: teachersData = [] } = useQuery({ queryKey: ['teachers'], queryFn: async () => (await teachersApi.getAll()).data });

  const createSchedule = useMutation({
    mutationFn: async (data) => await schedulesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['schedules']);
      setIsModalOpen(false);
      setNewSchedule({ class_room_id: '', course_id: '', teacher_id: '', day_of_week: 'Monday', start_time: '', end_time: '', room_number: '' });
      success('Schedule created successfully.');
    },
    onError: (err) => error(err?.message || 'Failed to create schedule')
  });

  const deleteSchedule = useMutation({
    mutationFn: async (id) => await schedulesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['schedules']);
      success('Schedule deleted successfully.');
    },
    onError: () => error('Failed to delete schedule')
  });

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to remove this schedule?')) deleteSchedule.mutate(id);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    createSchedule.mutate(newSchedule);
  };

  const handlePrint = () => window.print();

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const getTopAndHeight = (start_time, end_time) => {
    if (!start_time || !end_time) return { top: '0px', height: '100px' };
    const [sH, sM] = start_time.split(':').map(Number);
    const [eH, eM] = end_time.split(':').map(Number);
    
    const startOffset = sH + (sM / 60) - 8; // 8 AM is 0
    const duration = (eH + (eM / 60)) - (sH + (sM / 60));
    
    return {
      top: `${Math.max(0, startOffset * 100)}px`,
      height: `${Math.max(50, duration * 100)}px`
    };
  };

  return (
    <div className="printable-area">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }} className="no-print">
        <div>
          <h1 style={{ fontSize: '2rem' }}>Master Class Schedule</h1>
          <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>Manage weekly timetables and resolve conflicts</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
            <Button variant="outline" onClick={handlePrint}>
                <Printer size={18} style={{ marginRight: 8 }} /> Print
            </Button>
            <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                <Plus size={18} style={{ marginRight: 8 }} /> Add Schedule
            </Button>
        </div>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
        <div style={{ overflowX: 'auto' }}>
            <div style={{ minWidth: '1000px', padding: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '100px repeat(5, 1fr)', borderBottom: '2px solid var(--color-border)', background: 'var(--color-bg)', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }}>
                    <div style={{ padding: '1.25rem', textAlign: 'center', fontWeight: '800', color: 'var(--color-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Time</div>
                    {daysOfWeek.map((day, idx) => (
                        <div key={idx} style={{ padding: '1.25rem', textAlign: 'center', fontWeight: '700', borderLeft: '1px solid var(--color-border)', color: 'var(--color-text-main)' }}>
                            {day}
                        </div>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '100px repeat(5, 1fr)', position: 'relative', background: 'var(--color-surface)' }}>
                    <div style={{ borderRight: '1px solid var(--color-border)' }}>
                        {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'].map(time => (
                            <div key={time} style={{ height: '100px', padding: '0.75rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-border)', fontWeight: '600' }}>
                                {time}
                            </div>
                        ))}
                    </div>

                    {daysOfWeek.map((day, i) => (
                        <div key={i} style={{ borderRight: '1px solid var(--color-border)', position: 'relative' }}>
                            {Array(9).fill(null).map((_, j) => (
                                <div key={j} style={{ height: '100px', borderBottom: '1px solid var(--color-border)' }}></div>
                            ))}

                            {schedules.filter(s => s.day_of_week === day).map(s => {
                                const { top, height } = getTopAndHeight(s.start_time, s.end_time);
                                return (
                                <div key={s.id} style={{ 
                                    position: 'absolute', top, left: '8px', right: '8px', height, 
                                    background: 'rgba(99, 102, 241, 0.1)', borderLeft: '4px solid var(--color-primary)', 
                                    borderRadius: 'var(--radius-md)', padding: '0.75rem', zIndex: 1,
                                    boxShadow: 'var(--shadow-sm)', transition: 'transform 0.2s',
                                    display: 'flex', flexDirection: 'column', gap: '4px'
                                }}>
                                    <div style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 10 }} className="no-print">
                                        <button 
                                            onClick={(e) => handleDelete(s.id, e)}
                                            style={{ background: 'transparent', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: '2px' }}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--color-primary)', paddingRight: '20px' }}>{s.course?.name || 'Unknown Course'}</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-body)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                                        <Users size={12}/> Class: {s.class_room?.name}
                                    </div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <BookOpen size={12}/> Teacher: {s.teacher?.user?.name}
                                    </div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Clock size={12}/> {s.start_time.substring(0,5)} - {s.end_time.substring(0,5)} • <MapPin size={12}/> {s.room_number}
                                    </div>
                                </div>
                            )})}
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Class Schedule">
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                    <label className="form-label">Class</label>
                    <select className="form-input" required value={newSchedule.class_room_id} onChange={e => setNewSchedule({...newSchedule, class_room_id: e.target.value})}>
                        <option value="">Select Class</option>
                        {classesData.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="form-label">Course</label>
                    <select className="form-input" required value={newSchedule.course_id} onChange={e => setNewSchedule({...newSchedule, course_id: e.target.value})}>
                        <option value="">Select Course</option>
                        {coursesData.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                    <label className="form-label">Teacher</label>
                    <select className="form-input" required value={newSchedule.teacher_id} onChange={e => setNewSchedule({...newSchedule, teacher_id: e.target.value})}>
                        <option value="">Select Teacher</option>
                        {teachersData.map(t => <option key={t.id} value={t.id}>{t.user?.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="form-label">Day of Week</label>
                    <select className="form-input" required value={newSchedule.day_of_week} onChange={e => setNewSchedule({...newSchedule, day_of_week: e.target.value})}>
                        {daysOfWeek.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                    <label className="form-label">Start Time</label>
                    <input type="time" required className="form-input" value={newSchedule.start_time} onChange={e => setNewSchedule({...newSchedule, start_time: e.target.value})} />
                </div>
                <div>
                    <label className="form-label">End Time</label>
                    <input type="time" required className="form-input" value={newSchedule.end_time} onChange={e => setNewSchedule({...newSchedule, end_time: e.target.value})} />
                </div>
                <div>
                    <label className="form-label">Room</label>
                    <input type="text" className="form-input" placeholder="e.g. 101A" value={newSchedule.room_number} onChange={e => setNewSchedule({...newSchedule, room_number: e.target.value})} />
                </div>
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button variant="primary" type="submit">Save Schedule</Button>
            </div>
          </form>
      </Modal>

      <style>{`
        @media print {
          .no-print, aside, nav, header { display: none !important; }
          body { background: white !important; margin: 0; padding: 0; }
          .printable-area { margin: 0 !important; width: 100% !important; position: absolute; left: 0; top: 0; }
          Card { box-shadow: none !important; border: 1px solid #eee !important; }
        }
      `}</style>
    </div>
  );
}
