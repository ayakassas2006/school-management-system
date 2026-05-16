import React from 'react';
import Card from '../../../components/ui/Card';
import { Check, X, Clock, HelpCircle } from 'lucide-react';

export default function StudentAttendance() {
  const records = [
    { date: 'Oct 24, 2026', class: 'Physics 101', status: 'present' },
    { date: 'Oct 23, 2026', class: 'Mathematics 10A', status: 'present' },
    { date: 'Oct 22, 2026', class: 'World History', status: 'absent' },
    { date: 'Oct 21, 2026', class: 'Physics 101', status: 'late' },
    { date: 'Oct 20, 2026', class: 'English Literature', status: 'present' },
    { date: 'Oct 17, 2026', class: 'Mathematics 10A', status: 'excused' },
  ];

  const statusConfig = {
    present: { icon: <Check size={16}/>, color: 'var(--color-success)', bg: 'var(--color-success)20', label: 'Present' },
    absent: { icon: <X size={16}/>, color: 'var(--color-danger)', bg: 'var(--color-danger)20', label: 'Absent' },
    late: { icon: <Clock size={16}/>, color: 'var(--color-warning)', bg: 'var(--color-warning)20', label: 'Late' },
    excused: { icon: <HelpCircle size={16}/>, color: 'var(--color-text-muted)', bg: 'var(--color-border)', label: 'Excused' },
  };

  const total = records.length;
  const present = records.filter(r => r.status === 'present').length;
  const rate = Math.round((present / total) * 100);

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>My Attendance</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        {[
          { label: 'Overall Rate', value: `${rate}%`, color: 'var(--color-primary)' },
          { label: 'Present', value: records.filter(r => r.status === 'present').length, color: 'var(--color-success)' },
          { label: 'Absent', value: records.filter(r => r.status === 'absent').length, color: 'var(--color-danger)' },
          { label: 'Late', value: records.filter(r => r.status === 'late').length, color: 'var(--color-warning)' },
        ].map((stat, i) => (
          <Card key={i} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: stat.color, marginBottom: '0.5rem' }}>{stat.value}</div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{stat.label}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '2rem' }}>
        <Card style={{ padding: 0 }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
            <h3 style={{ margin: 0 }}>Attendance Log</h3>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--color-bg)', color: 'var(--color-text-muted)', fontSize: '0.875rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Date</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Class</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => {
                const cfg = statusConfig[r.status];
                return (
                  <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-muted)' }}>{r.date}</td>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>{r.class}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: cfg.bg, color: cfg.color, padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: '600' }}>
                        {cfg.icon} {cfg.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>

        <Card>
          <h3 style={{ marginBottom: '1.5rem' }}>By Subject</h3>
          {[
            { name: 'Physics 101', rate: 95 },
            { name: 'Mathematics', rate: 100 },
            { name: 'World History', rate: 80 },
            { name: 'English Lit.', rate: 88 },
          ].map((s, i) => (
            <div key={i} style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.875rem' }}>
                <span style={{ fontWeight: '500' }}>{s.name}</span>
                <span style={{ color: s.rate >= 90 ? 'var(--color-success)' : 'var(--color-warning)', fontWeight: '600' }}>{s.rate}%</span>
              </div>
              <div style={{ height: '8px', background: 'var(--color-bg)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${s.rate}%`, height: '100%', background: s.rate >= 90 ? 'var(--color-success)' : 'var(--color-warning)', borderRadius: '4px', transition: 'width 1s ease' }}></div>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
