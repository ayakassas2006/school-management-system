import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { ChevronLeft, ChevronRight, Clock, MapPin, Video } from 'lucide-react';
import { eventsApi } from '../../../services/api';

export default function StudentSchedule() {
  const [currentWeek, setCurrentWeek] = useState('October 19 - October 25, 2026');

  const { data: events = [] } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const res = await eventsApi.getAll();
      return res.data.map(e => {
        const d = new Date(e.start_time);
        const dayIndex = d.getDay() === 0 ? 6 : d.getDay() - 1;
        
        const hours = d.getHours();
        const top = `${(hours - 8) * 80}px`; // 8:00 AM is top 0, each hour is 80px here
        
        const endHours = new Date(e.end_time).getHours();
        const height = `${(endHours - hours) * 80 || 80}px`;
        
        return {
          id: e.id,
          title: e.title,
          time: `${d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${new Date(e.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`,
          location: e.description || 'Main Campus',
          dayIndex: dayIndex >= 0 && dayIndex <= 4 ? dayIndex : Math.floor(Math.random() * 5),
          top,
          height,
          color: e.type === 'global' ? 'var(--color-primary)' : 'var(--color-secondary)'
        };
      });
    }
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem' }}>My Schedule</h1>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontWeight: '600' }}>{currentWeek}</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button variant="outline" size="sm" style={{ padding: '0.5rem' }}><ChevronLeft size={18} /></Button>
                <Button variant="outline" size="sm" style={{ padding: '0.5rem' }}><ChevronRight size={18} /></Button>
            </div>
        </div>
      </div>

      <Card style={{ padding: 0, overflowX: 'auto' }}>
        <div style={{ minWidth: '800px' }}>
            {/* Timeline Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '80px repeat(5, 1fr)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg)' }}>
                <div style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: 'var(--color-text-muted)' }}>Time</div>
                {['Monday 19', 'Tuesday 20', 'Wednesday 21', 'Thursday 22', 'Friday 23'].map((day, idx) => (
                    <div key={idx} style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', borderLeft: '1px solid var(--color-border)' }}>
                        {day}
                    </div>
                ))}
            </div>

            {/* Timeline Body */}
            <div style={{ display: 'grid', gridTemplateColumns: '80px repeat(5, 1fr)', position: 'relative' }}>
                {/* Time labels */}
                <div style={{ borderRight: '1px solid var(--color-border)' }}>
                    {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'].map(time => (
                        <div key={time} style={{ height: '80px', padding: '0.5rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-border)' }}>
                            {time}
                        </div>
                    ))}
                </div>

                {/* Day Columns */}
                {Array(5).fill(null).map((_, i) => (
                    <div key={i} style={{ borderRight: '1px solid var(--color-border)', position: 'relative' }}>
                        {/* Fake grid lines */}
                        {Array(8).fill(null).map((_, j) => (
                            <div key={j} style={{ height: '80px', borderBottom: '1px solid var(--color-border)' }}></div>
                        ))}

                        {/* Rendering dynamic events */}
                        {events.filter(e => e.dayIndex === i).map(event => (
                            <div key={event.id} style={{ position: 'absolute', top: event.top, left: '10px', right: '10px', height: event.height, background: `${event.color}15`, borderLeft: `4px solid ${event.color}`, borderRadius: '4px', padding: '0.5rem', overflow: 'hidden' }}>
                                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: event.color, marginBottom: '0.25rem' }}>{event.title}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={12}/> {event.time}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}><MapPin size={12}/> {event.location}</div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
      </Card>
    </div>
  );
}
