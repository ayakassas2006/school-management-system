import React, { useState } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { Clock, CheckCircle, AlertCircle, Upload } from 'lucide-react';

import { useToast } from '../../../components/ui/Toast';

export default function StudentAssignments() {
  const { success } = useToast();
  const [activeTab, setActiveTab] = useState('pending');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [assignments, setAssignments] = useState({
    pending: [
      { title: 'Wave Mechanics Lab Report', subject: 'Physics 101', due: 'Oct 28, 2026', points: 100, type: 'Lab Report' },
      { title: 'Chapter 12 Problem Set', subject: 'Mathematics 10A', due: 'Oct 30, 2026', points: 50, type: 'Homework' },
      { title: 'Historical Analysis Essay', subject: 'World History', due: 'Nov 02, 2026', points: 80, type: 'Essay' },
    ],
    submitted: [
      { title: 'Newton\'s Laws Quiz', subject: 'Physics 101', due: 'Oct 20, 2026', points: 30, score: 28, type: 'Quiz' },
      { title: 'Algebra Practice Problems', subject: 'Mathematics 10A', due: 'Oct 18, 2026', points: 40, score: 38, type: 'Homework' },
    ],
  });

  const handleSubmit = (title, points) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setAssignments(prev => {
        const remainingPending = prev.pending.filter(a => a.title !== title);
        const original = prev.pending.find(a => a.title === title);
        const newlySubmitted = {
          title,
          subject: original.subject,
          due: 'Submitted just now',
          points,
          score: '-', 
          type: original.type
        };
        return {
          pending: remainingPending,
          submitted: [newlySubmitted, ...prev.submitted]
        };
      });
      setIsSubmitting(false);
      success(`Successfully submitted ${title}`);
    }, 800);
  };

  const TabButton = ({ id, label }) => (
    <button onClick={() => setActiveTab(id)} style={{
      padding: '0.75rem 1.5rem', border: 'none', cursor: 'pointer', fontWeight: '600',
      borderBottom: activeTab === id ? `3px solid var(--color-primary)` : '3px solid transparent',
      color: activeTab === id ? 'var(--color-primary)' : 'var(--color-text-muted)',
      background: 'transparent', transition: 'all 0.2s'
    }}>{label}</button>
  );

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Assignments</h1>

      <div style={{ borderBottom: '1px solid var(--color-border)', marginBottom: '2rem', display: 'flex' }}>
        <TabButton id="pending" label={`Pending (${assignments.pending.length})`} />
        <TabButton id="submitted" label={`Submitted (${assignments.submitted.length})`} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {activeTab === 'pending' && assignments.pending.map((a, i) => (
          <Card key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'var(--color-warning)20', color: 'var(--color-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <AlertCircle size={22}/>
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', marginBottom: '0.25rem' }}>{a.title}</h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'flex', gap: '1rem' }}>
                  <span>{a.subject}</span>
                  <span>•</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={13}/> Due {a.due}</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexShrink: 0 }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Points</div>
                <div style={{ fontWeight: '700' }}>{a.points} pts</div>
              </div>
              <Button 
                variant="primary" 
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                onClick={() => handleSubmit(a.title, a.points)}
                disabled={isSubmitting}
              >
                <Upload size={16}/> Submit
              </Button>
            </div>
          </Card>
        ))}

        {activeTab === 'submitted' && assignments.submitted.map((a, i) => (
          <Card key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'var(--color-success)20', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CheckCircle size={22}/>
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', marginBottom: '0.25rem' }}>{a.title}</h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{a.subject} • Submitted Oct {10 + i * 3}, 2026</div>
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Score</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-success)' }}>{a.score}/{a.points}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
