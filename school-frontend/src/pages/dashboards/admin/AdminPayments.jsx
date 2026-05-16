import React, { useState, useEffect, useMemo } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { DollarSign, Download, TrendingUp, TrendingDown, Filter, Calendar, Search } from 'lucide-react';
import { useToast } from '../../../components/ui/Toast';
import { generatePDF } from '../../../utils/pdfGenerator';
import { paymentsApi, dashboardApi } from '../../../services/api';

export default function AdminPayments() {
  const { success, error } = useToast();
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch payments
    paymentsApi.getAll()
      .then(res => setTransactions(res.data))
      .catch(() => error('Failed to load transactions'));
      
    // Fetch dashboard stats to get total revenue and pending dues
    dashboardApi.getAdminStats()
      .then(res => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      // payment_date from API might be different than fake data 'date'
      const date = tx.payment_date?.split('T')[0] || tx.created_at?.split('T')[0];
      const studentName = tx.student?.user?.name || '';
      
      const matchesSearch = studentName.toLowerCase().includes(searchQuery.toLowerCase()) || String(tx.id).includes(searchQuery);
      if (startDate && date < startDate) return false;
      if (endDate && date > endDate) return false;
      return matchesSearch;
    });
  }, [transactions, startDate, endDate, searchQuery]);

  const handleExport = () => {
    const columns = ['Transaction ID', 'Student', 'Date', 'Amount', 'Status'];
    const rows = filteredTransactions.map(tx => [
      tx.id,
      tx.student?.user?.name || 'Unknown',
      (tx.payment_date || tx.created_at)?.split('T')[0],
      `$${Number(tx.amount).toFixed(2)}`,
      tx.status
    ]);
    
    generatePDF('Financial Transaction Report', columns, rows, 'admin_payments_report.pdf');
    success("Financial report exported successfully as PDF.");
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading payments...</div>;

  // Compute pending dues
  const pendingDues = transactions
    .filter(tx => tx.status === 'pending')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const pendingCount = transactions.filter(tx => tx.status === 'pending').length;
  const successRate = transactions.length > 0 
    ? Math.round((transactions.filter(tx => tx.status === 'completed').length / transactions.length) * 100) 
    : 0;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem' }}>Payment Gateway & Finance</h1>
          <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>Monitor institutional revenue and family billing status</p>
        </div>
        <Button variant="primary" onClick={handleExport}>
          <Download size={18} style={{ marginRight: 8 }} /> Export Report
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        {[
            { label: 'Total Revenue', value: `$${stats?.total_revenue || 0}`, trend: 'All Time', color: 'var(--color-success)', icon: <DollarSign size={20}/> },
            { label: 'Pending Dues', value: `$${pendingDues}`, trend: `${pendingCount} accounts`, color: 'var(--color-warning)', icon: <TrendingDown size={20}/> },
            { label: 'Success Rate', value: `${successRate}%`, trend: 'Completed Tx', color: 'var(--color-success)', icon: <TrendingUp size={20}/> },
        ].map((stat, i) => (
            <Card key={i} style={{ borderLeft: `4px solid ${stat.color}` }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.5px' }}>{stat.label}</div>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--color-text-main)' }}>{stat.value}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: stat.color, fontSize: '0.875rem', fontWeight: '700' }}>
                    {stat.icon} {stat.trend}
                </div>
            </Card>
        ))}
      </div>

      <Card style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
        <div style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', flexWrap: 'wrap', gap: '1.5rem', background: 'var(--color-surface)' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Transaction History</h3>
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--color-bg)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                    <Calendar size={18} color="var(--color-text-muted)" />
                    <input 
                      type="date" className="date-input-clean"
                      value={startDate} onChange={e => setStartDate(e.target.value)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--color-text-main)', fontSize: '0.875rem', outline: 'none' }}
                    />
                    <span style={{ color: 'var(--color-text-muted)' }}>→</span>
                    <input 
                      type="date" className="date-input-clean"
                      value={endDate} onChange={e => setEndDate(e.target.value)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--color-text-main)', fontSize: '0.875rem', outline: 'none' }}
                    />
                </div>
                <div style={{ position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: 12, top: 10, color: 'var(--color-text-muted)' }} />
                    <input 
                      type="text" placeholder="Search family..."
                      value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                      style={{ padding: '0.5rem 1rem 0.5rem 2.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--color-bg)', color: 'var(--color-text-main)', width: '200px' }}
                    />
                </div>
                <Button variant="outline" size="sm" onClick={() => {setStartDate(''); setEndDate(''); setSearchQuery('');}}><Filter size={16} style={{ marginRight: 8 }}/> Reset</Button>
            </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                <tr style={{ background: 'var(--color-bg)', color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    <th style={{ padding: '1.25rem 2rem', fontWeight: '700' }}>Transaction ID</th>
                    <th style={{ padding: '1.25rem 2rem', fontWeight: '700' }}>Student / Family</th>
                    <th style={{ padding: '1.25rem 2rem', fontWeight: '700' }}>Date</th>
                    <th style={{ padding: '1.25rem 2rem', fontWeight: '700' }}>Amount</th>
                    <th style={{ padding: '1.25rem 2rem', fontWeight: '700' }}>Status</th>
                </tr>
                </thead>
                <tbody>
                {filteredTransactions.map((tx) => (
                    <tr key={tx.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '1.25rem 2rem', color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: '600' }}>{tx.id}</td>
                    <td style={{ padding: '1.25rem 2rem' }}>
                        <div style={{ fontWeight: '700', color: 'var(--color-text-main)' }}>{tx.student?.user?.name || 'Unknown Student'}</div>
                    </td>
                    <td style={{ padding: '1.25rem 2rem', color: 'var(--color-text-body)', fontWeight: '500' }}>{new Date(tx.payment_date || tx.created_at).toLocaleDateString()}</td>
                    <td style={{ padding: '1.25rem 2rem', fontWeight: '800', color: 'var(--color-text-main)', fontSize: '1.1rem' }}>${Number(tx.amount).toLocaleString()}</td>
                    <td style={{ padding: '1.25rem 2rem' }}>
                        <span style={{ 
                        padding: '0.4rem 0.9rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: '800',
                        background: tx.status === 'completed' ? 'rgba(16, 185, 129, 0.1)' : (tx.status === 'pending' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)'),
                        color: tx.status === 'completed' ? 'var(--color-success)' : (tx.status === 'pending' ? 'var(--color-warning)' : 'var(--color-danger)'),
                        textTransform: 'uppercase'
                        }}>
                        {tx.status}
                        </span>
                    </td>
                    </tr>
                ))}
                {filteredTransactions.length === 0 && (
                    <tr>
                        <td colSpan="5" style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No transactions found matching your criteria.</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
      </Card>
    </div>
  );
}
