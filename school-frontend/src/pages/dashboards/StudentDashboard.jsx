import React from 'react';
import Card from '../../components/ui/Card';
import { ResponsiveContainer, RadialBarChart, RadialBar, Tooltip } from 'recharts';
import { Calendar, Download, Trophy } from 'lucide-react';
import Button from '../../components/ui/Button';

import { useToast } from '../../components/ui/Toast';
import { generatePDF } from '../../utils/pdfGenerator';

const performanceData = [
  { name: 'Math', score: 85, fill: 'var(--color-primary)' },
  { name: 'Science', score: 92, fill: 'var(--color-secondary)' },
  { name: 'History', score: 78, fill: 'var(--color-warning)' },
  { name: 'English', score: 88, fill: 'var(--color-success)' },
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
    
    // Add Attendance row
    rows.push(['Attendance', '92%', 'Excellent']);
    
    generatePDF('Student Report Card - Q1 2026', columns, rows, 'student_report_card.pdf');
    success("Report Card downloaded automatically.");
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem' }}>My Progress</h1>
        <Button variant="outline" size="sm" onClick={handleDownloadReport}>
          <Download size={16} style={{ marginRight: 8 }} /> Download Report Card
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Attendance Widget */}
        <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 style={{ marginBottom: '1rem' }}>Overall Attendance</h3>
          <div style={{ position: 'relative', width: '200px', height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart 
                cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" 
                barSize={15} data={[{ name: 'Attendance', value: 92, fill: 'var(--color-primary)' }]}
                startAngle={90} endAngle={-270}
              >
                <RadialBar background clockWise dataKey="value" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>92%</span>
              <span style={{ color: 'var(--color-text-muted)' }}>Present</span>
            </div>
          </div>
        </Card>

        {/* Grades Overview */}
        <Card>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Trophy size={20} color="var(--color-warning)" /> Current Grades
          </h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {performanceData.map((subject, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '100px', fontWeight: '500' }}>{subject.name}</div>
                <div style={{ flex: 1, background: 'var(--color-bg)', height: '12px', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${subject.score}%`, background: subject.fill, borderRadius: '6px' }}></div>
                </div>
                <div style={{ width: '40px', textAlign: 'right', fontWeight: 'bold' }}>{subject.score}%</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Timetable */}
      <Card>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={20} color="var(--color-primary)" /> Weekly Timetable
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
            <thead>
              <tr style={{ background: 'var(--color-bg)' }}>
                <th style={{ padding: '1rem', border: '1px solid var(--color-border)' }}>Time</th>
                <th style={{ padding: '1rem', border: '1px solid var(--color-border)' }}>Mon</th>
                <th style={{ padding: '1rem', border: '1px solid var(--color-border)' }}>Tue</th>
                <th style={{ padding: '1rem', border: '1px solid var(--color-border)' }}>Wed</th>
                <th style={{ padding: '1rem', border: '1px solid var(--color-border)' }}>Thu</th>
                <th style={{ padding: '1rem', border: '1px solid var(--color-border)' }}>Fri</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '1rem', border: '1px solid var(--color-border)', fontWeight: '500' }}>09:00 - 10:30</td>
                <td style={{ padding: '1rem', border: '1px solid var(--color-border)', background: 'var(--color-primary-light)' }}>Mathematics</td>
                <td style={{ padding: '1rem', border: '1px solid var(--color-border)', background: 'rgba(245, 158, 11, 0.1)' }}>History</td>
                <td style={{ padding: '1rem', border: '1px solid var(--color-border)', background: 'var(--color-primary-light)' }}>Mathematics</td>
                <td style={{ padding: '1rem', border: '1px solid var(--color-border)', background: 'rgba(6, 182, 212, 0.1)' }}>Science</td>
                <td style={{ padding: '1rem', border: '1px solid var(--color-border)', background: 'rgba(6, 182, 212, 0.1)' }}>Science</td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
