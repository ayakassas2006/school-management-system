import React, { useState } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function AdminAnalytics() {
  const [source, setSource] = useState('revenue');
  const [timeRange, setTimeRange] = useState('30days');
  const [shouldFetch, setShouldFetch] = useState(false);

  const { data: chartData = [], isLoading, isFetching } = useQuery({
    queryKey: ['analytics', source, timeRange],
    queryFn: async () => {
      const res = await axios.get('http://localhost:8000/api/analytics', {
        params: { source, timeRange },
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      return res.data;
    },
    enabled: shouldFetch,
  });

  const handleRunQuery = () => {
    setShouldFetch(true);
  };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Data Explorer</h1>

      <Card style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <label className="form-label">Data Source</label>
            <select className="form-input" value={source} onChange={(e) => setSource(e.target.value)}>
              <option value="revenue">Revenue</option>
              <option value="attendance">Attendance</option>
              <option value="enrollment">Enrollment</option>
            </select>
          </div>
          <div>
            <label className="form-label">Time Range</label>
            <select className="form-input" value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="6months">Last 6 Months</option>
            </select>
          </div>
          <Button variant="primary" onClick={handleRunQuery} disabled={isFetching}>
            {isFetching ? 'Loading...' : 'Run Query'}
          </Button>
        </div>

        <div style={{ height: '400px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
          {!shouldFetch && chartData.length === 0 && (
            <div style={{ color: 'var(--color-text-muted)' }}>Select parameters and click "Run Query" to generate chart.</div>
          )}
          {shouldFetch && chartData.length === 0 && !isFetching && (
            <div style={{ color: 'var(--color-text-muted)' }}>No data available for the selected parameters.</div>
          )}
          {chartData.length > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              {source === 'revenue' ? (
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="var(--color-secondary)" fillOpacity={0.3} fill="var(--color-secondary)" />
                </AreaChart>
              )}
            </ResponsiveContainer>
          )}
        </div>
      </Card>
    </div>
  );
}
