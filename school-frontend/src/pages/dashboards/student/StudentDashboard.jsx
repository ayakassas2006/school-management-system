import React from 'react';
import Card from '../../components/ui/Card';
import { motion } from 'framer-motion';
import { Calendar, Download, Trophy, TrendingUp, BookOpen, Clock } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { generatePDF } from '../../utils/pdfGenerator';

const performanceData = [
  { name: 'Mathematics', score: 85, color: '#4F46E5', activity: [40, 60, 45, 80, 75, 85, 90] },
  { name: 'Advanced Science', score: 92, color: '#06B6D4', activity: [70, 75, 80, 85, 82, 88, 92] },
  { name: 'World History', score: 78, color: '#F59E0B', activity: [60, 65, 70, 72, 75, 76, 78] },
  { name: 'English Literature', score: 88, color: '#10B981', activity: [80, 82, 85, 84, 86, 88, 88] },
];

export default function StudentDashboard() {
  const { success } = useToast();

  const handleDownloadReport = () => {
    const columns = ['Subject', 'Score', 'Status'];
    const rows = performanceData.map(subject => [
      subject.name, 
      `${subject.score}%`,
      subject.score >= 80 ? 'Excellent' : 'Good'
    ]);
    rows.push(['Overall Attendance', '94%', 'Optimal']);
    generatePDF('Academic Performance Report - Fall 2026', columns, rows, 'student_report_card.pdf');
    success("Comprehensive performance report generated successfully.");
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.02em' }}>Academic Oversight</h1>
          <p style={{ color: 'var(--color-text-muted)', margin: 0, fontWeight: '600' }}>Welcome back, Alex. Your current standing is <span style={{ color: 'var(--color-success)' }}>Top 5%</span> of your grade.</p>
        </div>
        <Button variant="primary" onClick={handleDownloadReport} style={{ gap: '0.6rem', fontWeight: '700', borderRadius: 'var(--radius-lg)' }}>
          <Download size={20} /> Export Transcript
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1.2fr) 2fr', gap: '2rem', marginBottom: '2.5rem' }}>
        {/* Animated Attendance Widget */}
        <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2.5rem' }}>
          <h3 style={{ marginBottom: '2rem', fontSize: '1.25rem', fontWeight: '800' }}>Session Participation</h3>
          <div style={{ position: 'relative', width: '220px', height: '220px' }}>
            <svg style={{ transform: 'rotate(-90deg)', width: '220px', height: '220px' }}>
              <circle cx="110" cy="110" r="100" stroke="var(--color-bg)" strokeWidth="15" fill="none" />
              <motion.circle 
                cx="110" cy="110" r="100" stroke="var(--color-primary)" strokeWidth="15" fill="none" 
                strokeDasharray="628"
                initial={{ strokeDashoffset: 628 }}
                animate={{ strokeDashoffset: 628 - (628 * 0.94) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                strokeLinecap="round"
              />
            </svg>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
              <motion.span 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ fontSize: '3.5rem', fontWeight: '900', color: 'var(--color-text-main)' }}
              >
                94%
              </motion.span>
              <span style={{ color: 'var(--color-text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem' }}>Attendance Rate</span>
            </div>
          </div>
          <div style={{ marginTop: '2.5rem', width: '100%', display: 'flex', justifyContent: 'space-around', background: 'var(--color-bg)', padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: '900', color: 'var(--color-text-main)' }}>142</div>
                <div style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Present</div>
              </div>
              <div style={{ borderLeft: '1px solid var(--color-border)' }}></div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: '900', color: 'var(--color-danger)' }}>6</div>
                <div style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Late</div>
              </div>
              <div style={{ borderLeft: '1px solid var(--color-border)' }}></div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: '900', color: 'var(--color-text-subtle)' }}>3</div>
                <div style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Absent</div>
              </div>
          </div>
        </Card>

        {/* Premium Grade Visualizer */}
        <Card style={{ padding: '2rem 2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Trophy size={22} color="var(--color-warning)" /> Course Performance
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-text-muted)' }}>
                <TrendingUp size={16} color="var(--color-success)" /> Improving
            </div>
          </div>
          
          <div style={{ display: 'grid', gap: '2.5rem' }}>
            {performanceData.map((subject, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.75rem' }}>
                  <div>
                    <span style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--color-text-main)' }}>{subject.name}</span>
                    {/* Activity Micro-Sparkline */}
                    <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '12px', marginTop: '4px' }}>
                        {subject.activity.map((val, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ height: 0 }}
                                animate={{ height: `${val / 8}%` }}
                                transition={{ delay: 0.5 + (idx * 0.05) }}
                                style={{ width: '3px', background: subject.color, opacity: 0.4, borderRadius: '1px' }}
                            />
                        ))}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        style={{ fontSize: '1.25rem', fontWeight: '900', color: subject.color }}
                    >
                        {subject.score}%
                    </motion.div>
                  </div>
                </div>
                <div style={{ width: '100%', background: 'var(--color-bg)', height: '10px', borderRadius: '5px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${subject.score}%` }}
                    transition={{ duration: 1, delay: 0.2 + (i * 0.1), ease: "easeOut" }}
                    style={{ height: '100%', background: `linear-gradient(90deg, ${subject.color}aa, ${subject.color})`, borderRadius: '5px' }}
                  ></motion.div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '2rem' }}>
          {/* Quick Schedule */}
        <Card style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 2rem', background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Clock size={20} color="var(--color-primary)" />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800' }}>Upcoming Sessions</h3>
            </div>
            <div style={{ padding: '1.5rem 2rem' }}>
                {[
                    { time: '09:00 AM', subject: 'Advanced Calculus', teacher: 'Dr. Emily Watson', room: 'Lab 204', color: '#4F46E5' },
                    { time: '11:15 AM', subject: 'Quantum Physics', teacher: 'Prof. Sarah Jenkins', room: 'Hall A', color: '#06B6D4' },
                    { time: '02:00 PM', subject: 'British Literature', teacher: 'Mr. David Smith', room: 'Room 102', color: '#10B981' },
                ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: i === 2 ? 0 : '1.5rem', padding: '1.25rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: item.color }}></div>
                        <div style={{ width: '85px', fontWeight: '900', fontSize: '0.9rem', color: 'var(--color-text-main)' }}>{item.time}</div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--color-text-main)', marginBottom: '0.2rem' }}>{item.subject}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: '600' }}>{item.teacher}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Location</div>
                            <div style={{ fontWeight: '700', color: 'var(--color-text-main)' }}>{item.room}</div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>

        {/* Notifications / Announcements */}
        <Card style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.1rem', fontWeight: '800' }}>
                <BookOpen size={20} color="var(--color-accent)" /> Announcements
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {[
                    { date: 'Oct 24', title: 'Science Fair Registration', desc: 'Confirm your topic by this Friday.', type: 'academic' },
                    { date: 'Oct 22', title: 'Winter Break Schedule', desc: 'Updated calendar posted in portal.', type: 'admin' },
                    { date: 'Oct 21', title: 'Sports Meet Selection', desc: 'Tryouts in the main stadium at 4 PM.', type: 'events' },
                ].map((note, i) => (
                    <div key={i} style={{ paddingBottom: '1.25rem', borderBottom: i === 2 ? 'none' : '1px solid var(--color-border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                            <span style={{ fontSize: '0.7rem', fontWeight: '900', color: 'var(--color-accent)', textTransform: 'uppercase' }}>{note.date}</span>
                        </div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '800', marginBottom: '0.25rem', color: 'var(--color-text-main)' }}>{note.title}</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0, fontWeight: '500' }}>{note.desc}</p>
                    </div>
                ))}
            </div>
            <Button variant="outline" style={{ width: '100%', marginTop: '1.5rem', fontWeight: '700' }}>View Archives</Button>
        </Card>
      </div>
    </div>
  );
}
