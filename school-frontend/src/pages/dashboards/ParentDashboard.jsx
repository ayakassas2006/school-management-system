import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { CreditCard, MessageSquare, TrendingUp, AlertCircle, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useToast } from '../../components/ui/Toast';

export default function ParentDashboard() {
  const navigate = useNavigate();
  const { success, error } = useToast();
  const queryClient = useQueryClient();

  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(2450.00);

  const sendMessage = useMutation({
    mutationFn: async () => {
      await axios.post('http://localhost:8000/api/messages', {
        receiver_id: 'teacher_id_here', // Placeholder for teacher ID
        content: messageContent
      }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
    },
    onSuccess: () => {
      success('Message sent to teacher. They have been notified.');
      setIsMessageModalOpen(false);
      setMessageContent('');
    }
  });

  const processPayment = useMutation({
    mutationFn: async () => {
      await axios.post('http://localhost:8000/api/parent/fees/pay', {
        amount: paymentAmount,
        feeId: 1
      }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['parent-fees']);
      success('Payment successful! Backend synced with Admin Data Explorer.');
      setIsPaymentModalOpen(false);
    }
  });

  const { data: fees } = useQuery({
    queryKey: ['parent-fees'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:8000/api/parent/fees', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      return res.data;
    }
  });

  const pendingFee = fees?.find(f => f.status === 'Pending') || { amount: 2450, status: 'Pending', desc: 'Fall Semester Tuition' };
  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Parent Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Child Profile Cards */}
        <Card hoverEffect={true} style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--color-primary)' }}></div>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--color-bg)', overflow: 'hidden' }}>
              <img src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Child Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.25rem' }}>Alex Johnson</h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>10th Grade • Section A</p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.875rem', background: 'var(--color-success)20', color: 'var(--color-success)', padding: '0.25rem 0.5rem', borderRadius: '1rem' }}>92% Attendance</span>
                <span style={{ fontSize: '0.875rem', background: 'var(--color-primary)20', color: 'var(--color-primary)', padding: '0.25rem 0.5rem', borderRadius: '1rem' }}>Overall A-</span>
              </div>
            </div>
          </div>
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
            <Button variant="outline" size="sm" style={{ flex: 1 }} onClick={() => setIsMessageModalOpen(true)}><MessageSquare size={16} style={{ marginRight: 8 }}/> Message Teacher</Button>
            <Button variant="primary" size="sm" style={{ flex: 1 }} onClick={() => navigate('/dashboard/parent/reports', { state: { child: 'Alex Johnson' } })}><TrendingUp size={16} style={{ marginRight: 8 }}/> Full Report</Button>
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CreditCard size={20} color="var(--color-primary)" /> Fees & Payments
            </h3>
            <Button variant="primary" size="sm" onClick={() => setIsPaymentModalOpen(true)}>Pay Due Amount</Button>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
              <div>
                <h4>{pendingFee.desc}</h4>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Due by Oct 30, 2026</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>${pendingFee.amount.toFixed(2)}</div>
                <div style={{ color: pendingFee.status === 'Paid' ? 'var(--color-success)' : 'var(--color-warning)', fontSize: '0.875rem' }}>{pendingFee.status}</div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem' }}>
              <div>
                <h4>Bus Transportation</h4>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Paid on Sep 1, 2026</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text-muted)' }}>$300.00</div>
                <div style={{ color: 'var(--color-success)', fontSize: '0.875rem' }}>Paid</div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <AlertCircle size={20} color="var(--color-warning)" />
            <h3>Recent Notifications</h3>
          </div>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { title: 'Parent-Teacher Meeting', desc: 'Scheduled for Nov 15th at 4:00 PM via Zoom.', time: '2 hours ago' },
              { title: 'Math Exam Results', desc: 'Alex scored 95% on the mid-term exams. Amazing job!', time: '1 day ago' },
              { title: 'School Closed', desc: 'School will be closed next Monday for national holiday.', time: '3 days ago' },
            ].map((notice, idx) => (
              <li key={idx} style={{ 
                paddingLeft: '1rem', borderLeft: '2px solid var(--color-primary-light)',
                position: 'relative'
              }}>
                <div style={{ position: 'absolute', left: '-5px', top: '5px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-primary)' }}></div>
                <h4 style={{ marginBottom: '0.25rem' }}>{notice.title}</h4>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>{notice.desc}</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{notice.time}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Modal isOpen={isMessageModalOpen} onClose={() => setIsMessageModalOpen(false)} title="Message Teacher">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <textarea 
            className="form-input" 
            rows="5" 
            placeholder="Type your message to the teacher here..."
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
          ></textarea>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="primary" onClick={() => sendMessage.mutate()}>
              <Send size={16} style={{ marginRight: 8 }}/> Send Message
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} title="Pay Due Amount">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ padding: '1.5rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-lg)' }}>
            <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>Amount Due</p>
            <h2 style={{ margin: 0, fontSize: '2rem' }}>${pendingFee.amount.toFixed(2)}</h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Payment will be processed securely using your saved Mastercard ending in 4092.</p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <Button variant="outline" onClick={() => setIsPaymentModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => processPayment.mutate()}>Confirm Payment</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
