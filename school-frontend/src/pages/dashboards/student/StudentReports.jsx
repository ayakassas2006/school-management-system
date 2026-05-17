import React, { useState } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { Download, FileText, TrendingUp, Loader } from 'lucide-react';
import { useToast } from '../../../components/ui/Toast';
import { generatePDF } from '../../../utils/pdfGenerator';

export default function StudentReports() {
  const { success } = useToast();
  const [downloadingId, setDownloadingId] = useState(null);

  const reports = [
    { title: 'Fall 2026 Progress Report', type: 'Academic', date: 'Oct 15, 2026', status: 'Available' },
    { title: 'Spring 2026 Transcript', type: 'Transcript', date: 'Jun 20, 2026', status: 'Available' },
    { title: 'Behavioral Assessment', type: 'Conduct', date: 'Sep 30, 2026', status: 'Available' },
    { title: 'Attendance Summary Report', type: 'Administrative', date: 'Oct 01, 2026', status: 'Available' },
  ];

  const handleDownload = (report, index) => {
    setDownloadingId(index);
    setTimeout(() => {
      generatePDF(report.title, ['Detail', 'Value'], [
        ['Type', report.type],
        ['Date', report.date],
        ['Status', report.status],
        ['Student Name', 'Alex Student']
      ], `${report.title.toLowerCase().replace(/ /g, '_')}.pdf`);
      setDownloadingId(null);
      success(`${report.title} downloaded successfully.`);
    }, 1000);
  };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>My Reports</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'auto auto auto', gap: '1.5rem', marginBottom: '2rem' }}>
        <Card style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>3.8</div>
          <div style={{ color: 'var(--color-text-muted)' }}>Cumulative GPA</div>
        </Card>
        <Card style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--color-success)', marginBottom: '0.5rem' }}>
            <TrendingUp size={28}/> 92%
          </div>
          <div style={{ color: 'var(--color-text-muted)' }}>Overall Attendance</div>
        </Card>
        <Card style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>A+</div>
          <div style={{ color: 'var(--color-text-muted)' }}>Conduct Grade</div>
        </Card>
      </div>

      <Card style={{ padding: 0 }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
          <h3 style={{ margin: 0 }}>Available Reports</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--color-bg)', color: 'var(--color-text-muted)', fontSize: '0.875rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Report</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Category</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Date</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <FileText size={18} color="var(--color-primary)"/> {r.title}
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{ background: 'var(--color-bg)', padding: '0.2rem 0.6rem', borderRadius: '1rem', border: '1px solid var(--color-border)', fontSize: '0.75rem' }}>{r.type}</span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-muted)' }}>{r.date}</td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <Button variant="outline" size="sm" onClick={() => handleDownload(r, i)} disabled={downloadingId === i}>
                        {downloadingId === i ? <Loader size={14} style={{ marginRight: 6 }} className="spin" /> : <Download size={14} style={{ marginRight: 6 }}/>} 
                        {downloadingId === i ? 'Generating...' : 'Download'}
                      </Button>
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
