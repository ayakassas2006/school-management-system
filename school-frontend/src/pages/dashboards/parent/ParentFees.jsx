import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import { CreditCard, Download, DollarSign, Filter, CreditCard as CardIcon, Trash2, Edit2, Calendar, Loader } from 'lucide-react';
import { useToast } from '../../../components/ui/Toast';
import { generatePDF } from '../../../utils/pdfGenerator';
import { parentsApi, paymentsApi } from '../../../services/api';

const initialCards = [
  { id: 1, type: 'Mastercard', last4: '4092', expiry: '12/28', bank: 'Global Bank' }
];

export default function ParentFees() {
  const queryClient = useQueryClient();
  const { success, warning, error } = useToast();
  const user = JSON.parse(localStorage.getItem('user'));

  const { data: feesData = [] } = useQuery({
    queryKey: ['parent-fees', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const res = await parentsApi.getFees(user.id);
      return res.data.map(fee => ({
        id: fee.id,
        student_id: fee.student_id,
        date: fee.payment_date || fee.created_at?.split('T')[0] || 'N/A',
        desc: `Tuition & Fees - ${fee.student_name}`,
        amount: parseFloat(fee.amount),
        status: fee.status === 'completed' ? 'Paid' : 'Pending'
      }));
    },
    enabled: !!user?.id
  });

  const [cards, setCards] = useState(initialCards);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [cardForm, setCardForm] = useState({ holderName: '', number: '', expiry: '', cvv: '' });

  const [paymentModal, setPaymentModal] = useState({ isOpen: false, fee: null });
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredTransactions = useMemo(() => {
    return feesData.filter(tx => {
      const date = tx.date;
      if (startDate && date < startDate) return false;
      if (endDate && date > endDate) return false;
      return true;
    });
  }, [feesData, startDate, endDate]);

  const totalDue = useMemo(() => {
    const total = feesData
      .filter(tx => tx.status === 'Pending')
      .reduce((sum, tx) => sum + tx.amount, 0);
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total);
  }, [feesData]);

  const processPayment = useMutation({
    mutationFn: async (feeId) => {
      return await paymentsApi.process(feeId, cards[0]?.type || 'Credit Card');
    },
    onMutate: () => setIsProcessing(true),
    onSettled: () => setIsProcessing(false),
    onSuccess: () => {
      queryClient.invalidateQueries(['parent-fees', user?.id]);
      setPaymentModal({ isOpen: false, fee: null });
      success("Payment processed successfully! Thank you.");
    },
    onError: (err) => {
      error(err?.message || "Payment processing failed. Please try again.");
    }
  });

  const handleConfirmPayment = (e) => {
    e.preventDefault();
    if (!paymentModal.fee) return;
    processPayment.mutate(paymentModal.fee.id);
  };

  const handleDownloadStatement = () => {
    const columns = ['Date', 'Description', 'Amount', 'Status'];
    const rows = filteredTransactions.map(tx => [
      tx.date, 
      tx.desc, 
      `$${tx.amount.toFixed(2)}`, 
      tx.status
    ]);
    
    generatePDF('Parent Payment Statement', columns, rows, 'payment_statement.pdf');
    success("Statement generated and downloaded.");
  };

  const handleOpenAddCard = () => {
    setEditingCard(null);
    setCardForm({ holderName: '', number: '', expiry: '', cvv: '' });
    setIsCardModalOpen(true);
  };

  const handleOpenEditCard = (card) => {
    setEditingCard(card);
    setCardForm({ holderName: 'Parent Name', number: `**** **** **** ${card.last4}`, expiry: card.expiry, cvv: '***' });
    setIsCardModalOpen(true);
  };

  const handleSaveCard = (e) => {
    e.preventDefault();
    if (editingCard) {
      setCards(prev => prev.map(c => c.id === editingCard.id ? { ...c, expiry: cardForm.expiry } : c));
      success("Payment method updated successfully");
    } else {
      const newCard = {
        id: Date.now(),
        type: cardForm.number.startsWith('4') ? 'Visa' : 'Mastercard',
        last4: cardForm.number.slice(-4),
        expiry: cardForm.expiry,
        bank: 'New Bank'
      };
      setCards(prev => [...prev, newCard]);
      success("New payment method added");
    }
    setIsCardModalOpen(false);
  };

  const handleDeleteCard = (id) => {
    setCards(prev => prev.filter(c => c.id !== id));
    warning("Payment method removed");
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem' }}>Fees & Payments</h1>
        <Button variant="outline" onClick={handleDownloadStatement}>
          <Download size={18} style={{ marginRight: 8 }} /> Download Statement
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem', marginBottom: '2rem' }}>
        {/* Payment Summary */}
        <Card style={{ background: 'var(--gradient-primary)', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 10px 25px rgba(79, 70, 229, 0.3)' }}>
          <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.9, marginBottom: '1rem', textTransform: 'uppercase', fontSize: '0.875rem', letterSpacing: '1px' }}>
                  <DollarSign size={18} /> Total Outstanding Balance
              </div>
              <div style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                  {totalDue}
              </div>
              <p style={{ opacity: 0.8, fontSize: '0.9rem', lineHeight: '1.6' }}>
                  Your next payment cycle ends soon. Avoid late fees by ensuring your primary payment method is up to date.
              </p>
          </div>
          <div style={{ marginTop: '2rem' }}>
              <Button style={{ background: 'white', color: 'var(--color-primary)', border: 'none', width: '100%', fontWeight: '700' }} onClick={() => success("Redirecting to payment gateway...")}>
                  Pay Now
              </Button>
          </div>
        </Card>

        {/* Saved Payment Methods */}
        <Card>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CreditCard size={20} color="var(--color-primary)" /> Saved Cards
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {cards.map(card => (
                  <div key={card.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', background: 'var(--color-surface)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ width: '48px', height: '32px', background: card.type === 'Visa' ? '#1434CB' : '#1A1F71', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '10px', fontWeight: 'bold' }}>
                              {card.type}
                          </div>
                          <div>
                              <div style={{ fontWeight: '600', color: 'var(--color-text-main)' }}>{card.type} ending in {card.last4}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Expires {card.expiry} • {card.bank}</div>
                          </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <Button variant="outline" size="sm" style={{ padding: '0.5rem' }} onClick={() => handleOpenEditCard(card)}><Edit2 size={14}/></Button>
                          <Button variant="outline" size="sm" style={{ padding: '0.5rem', color: 'var(--color-danger)' }} onClick={() => handleDeleteCard(card.id)}><Trash2 size={14}/></Button>
                      </div>
                  </div>
                ))}

                <button 
                  onClick={handleOpenAddCard}
                  style={{ padding: '1.25rem', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-lg)', background: 'var(--color-bg)', color: 'var(--color-primary)', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--color-primary-light)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--color-bg)'}
                >
                    + Add New Card
                </button>
            </div>
        </Card>
      </div>

      <Card style={{ padding: 0 }}>
        <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ margin: 0 }}>Transaction History</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--color-bg)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                    <Calendar size={16} color="var(--color-text-muted)" />
                    <input 
                      type="date" 
                      value={startDate} 
                      onChange={e => setStartDate(e.target.value)}
                      style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--color-text-main)', fontSize: '0.875rem' }} 
                    />
                    <span style={{ color: 'var(--color-text-muted)' }}>→</span>
                    <input 
                      type="date" 
                      value={endDate} 
                      onChange={e => setEndDate(e.target.value)}
                      style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--color-text-main)', fontSize: '0.875rem' }} 
                    />
                    {(startDate || endDate) && (
                      <button onClick={() => {setStartDate(''); setEndDate('');}} style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', fontSize: '0.75rem' }}>Clear</button>
                    )}
                </div>
                <Button variant="outline" size="sm"><Filter size={16} style={{ marginRight: 8 }}/> All Types</Button>
            </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--color-bg)', color: 'var(--color-text-muted)', fontSize: '0.875rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: '600' }}>Date</th>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: '600' }}>Description</th>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: '600' }}>Amount</th>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: '600' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} style={{ borderBottom: '1px solid var(--color-border)', hover: 'var(--color-bg-2)' }}>
                  <td style={{ padding: '1.25rem 1.5rem', color: 'var(--color-text-main)' }}>{new Date(tx.date).toLocaleDateString()}</td>
                  <td style={{ padding: '1.25rem 1.5rem', fontWeight: '500', color: 'var(--color-text-main)' }}>{tx.desc}</td>
                  <td style={{ padding: '1.25rem 1.5rem', fontWeight: '600', color: 'var(--color-text-main)' }}>${tx.amount.toFixed(2)}</td>
                  <td style={{ padding: '1.25rem 1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ 
                      padding: '0.4rem 0.8rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: '700',
                      background: tx.status === 'Paid' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      color: tx.status === 'Paid' ? 'var(--color-success)' : 'var(--color-warning)',
                    }}>
                      {tx.status}
                    </span>
                    {tx.status === 'Pending' && (
                      <Button variant="primary" size="sm" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }} onClick={() => setPaymentModal({ isOpen: true, fee: tx })}>
                        Pay Now
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    No transactions found for the selected date range.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Card Modal */}
      <Modal 
        isOpen={isCardModalOpen} 
        onClose={() => setIsCardModalOpen(false)} 
        title={editingCard ? "Edit Card" : "Add New Payment Method"}
      >
        <form onSubmit={handleSaveCard} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="form-label">Cardholder Name</label>
            <input 
              type="text" 
              required
              className="form-input" 
              placeholder="e.g. John Doe"
              value={cardForm.holderName}
              onChange={e => setCardForm({...cardForm, holderName: e.target.value})}
            />
          </div>
          <div>
            <label className="form-label">Card Number</label>
            <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  required
                  maxLength="19"
                  className="form-input" 
                  placeholder="0000 0000 0000 0000"
                  value={cardForm.number}
                  onChange={e => setCardForm({...cardForm, number: e.target.value})}
                />
                <CardIcon size={18} style={{ position: 'absolute', right: '1rem', top: '0.8rem', color: 'var(--color-text-muted)' }} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Expiry Date</label>
              <input 
                type="text" 
                required
                maxLength="5"
                className="form-input" 
                placeholder="MM/YY"
                value={cardForm.expiry}
                onChange={e => setCardForm({...cardForm, expiry: e.target.value})}
              />
            </div>
            <div>
              <label className="form-label">CVV</label>
              <input 
                type="password" 
                required
                maxLength="3"
                className="form-input" 
                placeholder="***"
                value={cardForm.cvv}
                onChange={e => setCardForm({...cardForm, cvv: e.target.value})}
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <Button variant="outline" type="button" onClick={() => setIsCardModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Save Card</Button>
          </div>
        </form>
      </Modal>

      {/* Payment Confirmation Modal */}
      <Modal 
        isOpen={paymentModal.isOpen} 
        onClose={() => !isProcessing && setPaymentModal({ isOpen: false, fee: null })} 
        title="Pay Due Amount"
      >
        {paymentModal.fee && (
          <form onSubmit={handleConfirmPayment} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ background: 'var(--color-bg)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                <div style={{ color: 'var(--color-text-muted)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Amount Due</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>${paymentModal.fee.amount.toFixed(2)}</div>
                <div style={{ color: 'var(--color-text-main)', marginTop: '0.5rem', fontWeight: '500' }}>{paymentModal.fee.desc}</div>
            </div>

            <div>
                <label className="form-label">Select Payment Method</label>
                <select className="form-input" required disabled={isProcessing}>
                    {cards.map(card => (
                        <option key={card.id} value={card.id}>{card.type} ending in {card.last4}</option>
                    ))}
                    {cards.length === 0 && <option value="">No cards saved. Please add one.</option>}
                </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
              <Button variant="outline" type="button" onClick={() => setPaymentModal({ isOpen: false, fee: null })} disabled={isProcessing}>Cancel</Button>
              <Button variant="primary" type="submit" disabled={isProcessing || cards.length === 0} style={{ minWidth: '140px' }}>
                  {isProcessing ? <><Loader size={16} className="spinner" style={{ marginRight: 8 }}/> Processing...</> : 'Confirm Payment'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
