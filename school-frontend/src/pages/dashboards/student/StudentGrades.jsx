import React from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { Download, Award, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts';

import { useToast } from '../../../components/ui/Toast';
import { generatePDF } from '../../../utils/pdfGenerator';

export default function StudentGrades() {
  const { success } = useToast();

  const grades = [
    { course: 'Mathematics 10A', grade: 'A', percent: 92, status: 'Excellent', credits: 4 },
    { course: 'Physics 11B', grade: 'B+', percent: 85, status: 'Good', credits: 4 },
    { course: 'World History', grade: 'A-', percent: 90, status: 'Excellent', credits: 3 },
    { course: 'Computer Sci', grade: 'B', percent: 81, status: 'Good', credits: 3 },
    { course: 'Physical Ed', grade: 'A', percent: 98, status: 'Excellent', credits: 1 },
  ];

  const chartData = [
    { subject: 'Math', score: 92 },
    { subject: 'Physics', score: 85 },
    { subject: 'History', score: 90 },
    { subject: 'CompSci', score: 81 },
    { subject: 'PE', score: 98 },
  ];

  const handleDownloadFile = () => {
    const columns = ['Course', 'Credits', 'Percent', 'Letter Grade', 'Status'];
    const rows = grades.map(g => [g.course, g.credits.toString(), `${g.percent}%`, g.grade, g.status]);
    
    // Add Semester Average row
    rows.push(['Semester Average', '15', '89.2%', 'A', 'Excellent']);
    
    generatePDF('Unofficial Transcript - Semester 1 2026', columns, rows, 'student_transcript.pdf');
    success("Transcript downloaded successfully.");
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem' }}>Grades & Transcripts</h1>
        <Button variant="primary" onClick={handleDownloadFile}>
          <Download size={18} style={{ marginRight: 8 }} /> Download File
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <Card hoverEffect={true} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Award size={40} />
          </div>
          <h2 style={{ fontSize: '3rem', marginBottom: '0.25rem' }}>3.8</h2>
          <span style={{ color: 'var(--color-text-muted)' }}>Cumulative GPA</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', color: 'var(--color-success)', fontWeight: '500', fontSize: '0.875rem' }}>
            <TrendingUp size={16}/> +0.2 from last semester
          </div>
        </Card>

        <Card>
          <h3 style={{ marginBottom: '1.5rem' }}>Performance by Subject</h3>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="subject" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="score" fill="var(--color-primary)" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card style={{ padding: 0 }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
            <h3 style={{ margin: 0 }}>Current Semester Grades</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--color-bg)', color: 'var(--color-text-muted)', fontSize: '0.875rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '1.5rem', fontWeight: '600' }}>Course</th>
                <th style={{ padding: '1.5rem', fontWeight: '600' }}>Credits</th>
                <th style={{ padding: '1.5rem', fontWeight: '600' }}>Percent</th>
                <th style={{ padding: '1.5rem', fontWeight: '600' }}>Letter Grade</th>
                <th style={{ padding: '1.5rem', fontWeight: '600' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((grade, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1.5rem', fontWeight: '600' }}>{grade.course}</td>
                  <td style={{ padding: '1.5rem' }}>{grade.credits}</td>
                  <td style={{ padding: '1.5rem', fontWeight: '500' }}>{grade.percent}%</td>
                  <td style={{ padding: '1.5rem' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: grade.grade.includes('A') ? 'var(--color-success)' : 'var(--color-primary)' }}>
                        {grade.grade}
                    </span>
                  </td>
                  <td style={{ padding: '1.5rem' }}>
                     <span style={{ 
                        padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: '600',
                        background: 'rgba(16, 185, 129, 0.2)',
                        color: 'var(--color-success)',
                      }}>
                        {grade.status}
                      </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
