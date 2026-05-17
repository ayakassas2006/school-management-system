import React, { useState } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { Bell, AlertCircle, CheckCircle, Info, Calendar, MoreVertical, X } from 'lucide-react';
import { useToast } from '../../../components/ui/Toast';
import { useQuery } from '@tanstack/react-query';

export default function AdminNotifications() {
  const { success } = useToast();
  
  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['activity-logs'],
    queryFn: async () => {
      const res = await fetch('http://localhost:8000/api/activity-logs', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      const data = await res.json();
      return data.data || [];
    }
  });



  const getIcon = (type) => {
    switch(type) {
        case 'create':
        case 'created': return <CheckCircle size={22} color="var(--color-success)" />;
        case 'update':
        case 'updated': return <Info size={22} color="var(--color-primary)" />;
        case 'delete':
        case 'deleted': return <AlertCircle size={22} color="var(--color-warning)" />;
        default: return <Bell size={22} color="var(--color-text-muted)" />;
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h1 style={{ fontSize: '2rem' }}>Admin Notifications</h1>
            {logs.length > 0 && (
                <span style={{ 
                    background: 'var(--color-primary)', 
                    color: 'white', 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '1rem', 
                    fontSize: '0.85rem', 
                    fontWeight: '800',
                    boxShadow: '0 0 15px var(--color-primary-light)'
                }}>
                    {logs.length} Activities
                </span>
            )}
        </div>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
        <div style={{ padding: '1.25rem 2rem', background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: '700', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Recent Board Notifications</span>
            <Button variant="outline" size="sm" style={{ padding: '0.4rem' }}><MoreVertical size={16}/></Button>
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {isLoading ? (
                <li style={{ padding: '3rem 2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    Loading activity logs...
                </li>
            ) : logs.map((log) => (
                <li key={log.id} style={{ 
                    padding: '1.5rem 2rem', 
                    borderBottom: '1px solid var(--color-border)', 
                    display: 'flex', gap: '1.5rem', alignItems: 'flex-start',
                    background: 'transparent',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative'
                }}>
                    <div style={{ 
                        background: 'var(--color-bg)', 
                        padding: '0.75rem', 
                        borderRadius: '50%', 
                        boxShadow: 'var(--shadow-sm)',
                        border: '1px solid var(--color-border)',
                        flexShrink: 0
                    }}>
                        {getIcon(log.action_type)}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <h3 style={{ fontSize: '1.05rem', margin: 0, color: 'var(--color-text-main)', fontWeight: '700' }}>
                                {log.module ? log.module.charAt(0).toUpperCase() + log.module.slice(1) : 'Activity'}
                            </h3>
                            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: '600' }}>
                                {new Date(log.created_at).toLocaleString()}
                            </span>
                        </div>
                        <p style={{ color: 'var(--color-text-body)', margin: 0, lineHeight: 1.6, fontSize: '0.925rem' }}>
                            <strong>{log.user?.name || 'System'}</strong>: {log.description}
                        </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                        <button 
                            style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '0.25rem', borderRadius: '50%', transition: 'background 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                            <X size={16}/>
                        </button>
                    </div>
                </li>
            ))}
            {logs.length === 0 && !isLoading && (
                <li style={{ padding: '6rem 2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    <Bell size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                    <p style={{ fontWeight: '500' }}>Your inbox is clear. No new notifications.</p>
                </li>
            )}
        </ul>
      </Card>
    </div>
  );
}
