import React from 'react';
import Card from '../../../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ParentGradesMonitoring() {
  const grades = [
    { subject: 'Physics', alex: 92, mia: 88 },
    { subject: 'Math', alex: 88, mia: 95 },
    { subject: 'History', alex: 94, mia: 82 },
    { subject: 'English', alex: 85, mia: 90 },
    { subject: 'Science', alex: 90, mia: 87 },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Grades Monitoring</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {[
          { name: 'Alex Johnson', grade: '10th', gpa: '3.8', trend: '+0.2', avatar: 'AJ' },
          { name: 'Mia Johnson', grade: '7th', gpa: '3.9', trend: '+0.1', avatar: 'MJ' },
        ].map((child, i) => (
          <Card key={i} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 'bold', flexShrink: 0 }}>{child.avatar}</div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{child.name}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>{child.grade} Grade</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{child.gpa}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-success)', fontWeight: '600' }}>{child.trend} this term</div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <h3 style={{ marginBottom: '1.5rem' }}>Subject Comparison</h3>
        <div style={{ height: '350px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={grades} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="subject" axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="alex" name="Alex" fill="var(--color-primary)" radius={[4,4,0,0]} barSize={30} />
              <Bar dataKey="mia" name="Mia" fill="var(--color-secondary)" radius={[4,4,0,0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
