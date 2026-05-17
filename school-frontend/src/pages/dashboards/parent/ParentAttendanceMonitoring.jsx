import React from 'react';
import Card from '../../../components/ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Check, X, Clock } from 'lucide-react';

export default function ParentAttendanceMonitoring() {
  const weeklyData = [
    { week: 'W1', alex: 100, mia: 100 },
    { week: 'W2', alex: 80, mia: 100 },
    { week: 'W3', alex: 100, mia: 80 },
    { week: 'W4', alex: 100, mia: 100 },
    { week: 'W5', alex: 60, mia: 100 },
    { week: 'W6', alex: 100, mia: 80 },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Attendance Monitoring</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {[
          { name: 'Alex Johnson', rate: 92, present: 46, absent: 3, late: 1, avatar: 'AJ' },
          { name: 'Mia Johnson', rate: 98, present: 49, absent: 1, late: 0, avatar: 'MJ' },
        ].map((child, i) => (
          <Card key={i}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>{child.avatar}</div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: 0 }}>{child.name}</h3>
                <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: '0.85rem' }}>Overall Rate: <strong style={{ color: child.rate >= 95 ? 'var(--color-success)' : 'var(--color-warning)' }}>{child.rate}%</strong></p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1, background: 'var(--color-success)10', padding: '0.75rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <Check size={18} color="var(--color-success)" style={{ margin: '0 auto 0.25rem', display: 'block' }}/>
                <div style={{ fontWeight: '700', color: 'var(--color-success)' }}>{child.present}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Present</div>
              </div>
              <div style={{ flex: 1, background: 'var(--color-danger)10', padding: '0.75rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <X size={18} color="var(--color-danger)" style={{ margin: '0 auto 0.25rem', display: 'block' }}/>
                <div style={{ fontWeight: '700', color: 'var(--color-danger)' }}>{child.absent}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Absent</div>
              </div>
              <div style={{ flex: 1, background: 'var(--color-warning)10', padding: '0.75rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <Clock size={18} color="var(--color-warning)" style={{ margin: '0 auto 0.25rem', display: 'block' }}/>
                <div style={{ fontWeight: '700', color: 'var(--color-warning)' }}>{child.late}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Late</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <h3 style={{ marginBottom: '1.5rem' }}>Weekly Attendance Trend</h3>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false}/>
              <XAxis dataKey="week" axisLine={false} tickLine={false}/>
              <YAxis domain={[0,100]} axisLine={false} tickLine={false} unit="%"/>
              <Tooltip />
              <Line type="monotone" dataKey="alex" name="Alex" stroke="var(--color-primary)" strokeWidth={3} dot={{ r: 5 }}/>
              <Line type="monotone" dataKey="mia" name="Mia" stroke="var(--color-secondary)" strokeWidth={3} dot={{ r: 5 }}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
