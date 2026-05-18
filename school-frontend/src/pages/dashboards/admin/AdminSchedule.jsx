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
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().substring(0, 10));
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getWeekDates = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const day = date.getDay();
    const diffToMonday = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date.setDate(diffToMonday));
    
    const weekDates = {};
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    for (let i = 0; i < 5; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      weekDates[days[i]] = d.toISOString().substring(0, 10);
    }
    return weekDates;
  };

  const weekDates = getWeekDates(selectedDate);
  const [newSchedule, setNewSchedule] = useState({ class_room_id: '', course_id: '', teacher_id: '', day_of_week: 'Monday', start_time: '', end_time: '', room_number: '' });
  const [newEvent, setNewEvent] = useState({ title: '', description: '', start_time: '', end_time: '', room: '' });

  const { data: schedules = [] } = useQuery({
    queryKey: ['schedules'],
    queryFn: async () => {
      const res = await schedulesApi.getAll();
      return res.data;
    }
  });

  const { data: events = [] } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const res = await fetch(`http://localhost:8000/api/events`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      const data = await res.json();
      return data.data || [];
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

  const createEvent = useMutation({
    mutationFn: async (data) => {
      return await fetch(`http://localhost:8000/api/events`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}` 
        },
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
      setIsModalOpen(false);
      setNewEvent({ title: '', description: '', start_time: '', end_time: '', course_id: '' });
      success('Event created successfully.');
    },
    onError: () => error('Failed to create event')
  });

  const handleCreateEvent = (e) => {
    e.preventDefault();
    const descriptionWithRoom = newEvent.room ? `Room: ${newEvent.room} | ${newEvent.description}` : newEvent.description;
    createEvent.mutate({
      title: newEvent.title,
      start_time: newEvent.start_time,
      end_time: newEvent.end_time,
      description: descriptionWithRoom
    });
  };

  const deleteSchedule = useMutation({
    mutationFn: async (id) => await schedulesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['schedules']);
      success('Schedule deleted successfully.');
    },
    onError: () => error('Failed to delete schedule')
  });

  const deleteEvent = useMutation({
    mutationFn: async (id) => {
      return await fetch(`http://localhost:8000/api/events/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
      success('Event deleted successfully.');
    },
    onError: () => error('Failed to delete event')
  });

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to remove this schedule?')) deleteSchedule.mutate(id);
  };

  const handleDeleteEvent = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to remove this event?')) deleteEvent.mutate(id);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    createSchedule.mutate(newSchedule);
  };

  const handlePrint = () => window.print();

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const selectedDateObj = new Date(selectedDate || new Date());
  const selectedDayName = days[selectedDateObj.getDay()];
  const daysOfWeek = [selectedDayName];

  const getTopAndHeight = (start_time, end_time) => {
    if (!start_time || !end_time) return { top: '0px', height: '100px' };
    const [sH, sM] = start_time.split(':').map(Number);
    const [eH, eM] = end_time.split(':').map(Number);
    
    const startOffset = sH + (sM / 60); // 00:00 is 0
    let duration = (eH + (eM / 60)) - (sH + (sM / 60));
    
    // Handle overnight events spanning past midnight
    if (duration < 0) duration += 24;

    return {
      top: `${startOffset * 100}px`,
      height: `${Math.max(85, duration * 100)}px`
    };
  };

  const getDayAndTime = (scheduleStr) => {
    if (!scheduleStr) return null;
    try {
      const date = new Date(scheduleStr.replace(' ', 'T'));
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayName = days[date.getDay()];
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return { day: dayName, time: `${hours}:${minutes}` };
    } catch (e) {
      return null;
    }
  };

  return (
    <div className="printable-area">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }} className="no-print">
        <div>
          <h1 style={{ fontSize: '2rem' }}>Master Class Schedule</h1>
          <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>Manage weekly timetables and resolve conflicts</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input 
              type="date" 
              className="form-input" 
              value={selectedDate} 
              onChange={e => setSelectedDate(e.target.value)} 
              style={{ width: 'auto', padding: '0.5rem' }}
            />
            <Button variant="outline" onClick={handlePrint}>
                <Printer size={18} style={{ marginRight: 8 }} /> Print
            </Button>
            <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                <Plus size={18} style={{ marginRight: 8 }} /> Add Meeting / Event
            </Button>
        </div>
      </div>

      <Card className="print-card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
        <div className="print-overflow" style={{ overflowX: 'auto' }}>
            <div style={{ minWidth: '800px', padding: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: `100px repeat(${daysOfWeek.length}, 1fr)`, borderBottom: '2px solid var(--color-border)', background: 'var(--color-bg)', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }}>
                    <div style={{ padding: '1.25rem', textAlign: 'center', fontWeight: '800', color: 'var(--color-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Time</div>
                    {daysOfWeek.map((day, idx) => (
                        <div key={idx} style={{ padding: '1.25rem', textAlign: 'center', fontWeight: '700', borderLeft: '1px solid var(--color-border)', color: 'var(--color-text-main)' }}>
                            {day} - {selectedDate}
                        </div>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: `100px repeat(${daysOfWeek.length}, 1fr)`, position: 'relative', background: 'var(--color-surface)' }}>
                    <div style={{ borderRight: '1px solid var(--color-border)' }}>
                        {Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0') + ':00').map(time => (
                            <div key={time} style={{ height: '100px', padding: '0.75rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-border)', fontWeight: '600' }}>
                                {time}
                            </div>
                        ))}
                    </div>

                    {daysOfWeek.map((day, i) => {
                        const dayItems = [];

                        // 1. Schedules
                        schedules.filter(s => s.day_of_week === day).forEach(s => {
                            dayItems.push({ ...s, itemType: 'schedule', start: s.start_time, end: s.end_time });
                        });

                        // 2. Courses
                        coursesData.forEach(course => {
                            const dt = getDayAndTime(course.schedule);
                            const courseDate = course.schedule?.substring(0, 10);
                            if (dt && dt.day === day && courseDate === selectedDate) {
                                dayItems.push({ 
                                    ...course, 
                                    itemType: 'course', 
                                    start: dt.time, 
                                    end: `${String(parseInt(dt.time.split(':')[0]) + 2).padStart(2, '0')}:00` 
                                });
                            }
                        });

                        // 3. Events
                        events.forEach(event => {
                            const dt = getDayAndTime(event.start_time);
                            const dtEnd = getDayAndTime(event.end_time);
                            const eventDate = event.start_time?.substring(0, 10);
                            if (dt && dt.day === day && eventDate === selectedDate) {
                                dayItems.push({ 
                                    ...event, 
                                    itemType: 'event', 
                                    start: dt.time, 
                                    end: dtEnd ? dtEnd.time : `${String(parseInt(dt.time.split(':')[0]) + 1).padStart(2, '0')}:00` 
                                });
                            }
                        });

                        // Sort by start time
                        dayItems.sort((a, b) => a.start.localeCompare(b.start));

                        return (
                        <div key={i} style={{ borderRight: '1px solid var(--color-border)', position: 'relative' }}>
                            {Array(24).fill(null).map((_, j) => (
                                <div key={j} style={{ height: '100px', borderBottom: '1px solid var(--color-border)' }}></div>
                            ))}

                            {dayItems.map((item, idx) => {
                                const { top, height } = getTopAndHeight(item.start, item.end);
                                
                                const baseStyle = {
                                    position: 'absolute', top, 
                                    left: '8px', 
                                    width: 'calc(100% - 16px)', 
                                    height, 
                                    borderRadius: 'var(--radius-md)', padding: '0.5rem', zIndex: 1,
                                    boxShadow: 'var(--shadow-sm)', transition: 'all 0.2s',
                                    display: 'flex', flexDirection: 'column', gap: '4px',
                                    overflow: 'hidden'
                                };

                                if (item.itemType === 'schedule') {
                                    return (
                                        <div key={`schedule-${item.id}-${idx}`} style={{ ...baseStyle, background: 'rgba(99, 102, 241, 0.1)', borderLeft: '4px solid var(--color-primary)' }}>
                                            <div style={{ position: 'absolute', top: '4px', right: '4px', zIndex: 10 }} className="no-print">
                                                <button onClick={(e) => handleDelete(item.id, e)} style={{ background: 'transparent', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: '2px' }}>
                                                    <X size={14} />
                                                </button>
                                            </div>
                                            <div style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--color-primary)', paddingRight: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.course?.name || 'Course'}</div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-body)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                                                <Users size={12}/> {item.class_room?.name}
                                            </div>
                                            <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <BookOpen size={12}/> {item.teacher?.user?.name}
                                            </div>
                                            <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Clock size={12}/> {item.start.substring(0,5)} - {item.end.substring(0,5)}
                                            </div>
                                        </div>
                                    );
                                } else if (item.itemType === 'course') {
                                    return (
                                        <div key={`course-${item.id}-${idx}`} style={{ ...baseStyle, background: 'rgba(16, 185, 129, 0.1)', borderLeft: '4px solid var(--color-success)' }}>
                                            <div style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--color-success)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-body)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                                                <Users size={12}/> {item.class_room?.name}
                                            </div>
                                            <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Clock size={12}/> {item.start.substring(0,5)}
                                            </div>
                                        </div>
                                    );
                                } else if (item.itemType === 'event') {
                                    return (
                                        <div key={`event-${item.id}-${idx}`} style={{ ...baseStyle, background: 'rgba(245, 158, 11, 0.1)', borderLeft: '4px solid var(--color-warning)' }}>
                                            <div style={{ position: 'absolute', top: '4px', right: '4px', zIndex: 10 }} className="no-print">
                                                <button onClick={(e) => handleDeleteEvent(item.id, e)} style={{ background: 'transparent', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: '2px' }}>
                                                    <X size={14} />
                                                </button>
                                            </div>
                                            <div style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--color-warning)', paddingRight: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-body)', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {item.description}
                                            </div>
                                            <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Clock size={12}/> {item.start.substring(0,5)}
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    )})}
                </div>
            </div>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Meeting / Event">
          <form onSubmit={handleCreateEvent} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
                <label className="form-label">Event Title</label>
                <input type="text" required className="form-input" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} placeholder="e.g. Staff Meeting" />
            </div>
            <div>
                <label className="form-label">Description</label>
                <textarea className="form-input" value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} placeholder="e.g. Discuss curriculum changes" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                    <label className="form-label">Start Time</label>
                    <input type="datetime-local" required className="form-input" value={newEvent.start_time} onChange={e => setNewEvent({...newEvent, start_time: e.target.value})} />
                </div>
                <div>
                    <label className="form-label">End Time</label>
                    <input type="datetime-local" required className="form-input" value={newEvent.end_time} onChange={e => setNewEvent({...newEvent, end_time: e.target.value})} />
                </div>
            </div>
            <div>
                <label className="form-label">Room</label>
                <input type="text" className="form-input" placeholder="e.g. 101A" value={newEvent.room} onChange={e => setNewEvent({...newEvent, room: e.target.value})} />
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button variant="primary" type="submit">Save Event</Button>
            </div>
          </form>
      </Modal>

      <style>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          .no-print, aside, nav, header { display: none !important; }
          body { background: white !important; margin: 0; padding: 0; }
          .printable-area { margin: 0 !important; width: 100% !important; }
          .print-card { box-shadow: none !important; border: 1px solid #ccc !important; overflow: visible !important; }
          .print-overflow { overflow: visible !important; }
        }
      `}</style>
    </div>
  );
}
