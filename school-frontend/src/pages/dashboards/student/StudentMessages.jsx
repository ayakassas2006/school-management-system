import React, { useState, useRef, useEffect } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { Search, Send, Paperclip, Image } from 'lucide-react';

const initialContacts = [
  { id: 'sj', name: 'Dr. Sarah Jenkins', role: 'Physics Teacher', lastMsg: 'Don\'t forget to submit your lab report by Friday.', time: '11:20 AM', unread: true },
  { id: 'md', name: 'Prof. Mark Davis', role: 'Math Teacher', lastMsg: 'Great job on the last quiz!', time: 'Yesterday', unread: false },
  { id: 'sg', name: 'Study Group', role: '5 members', lastMsg: 'Emily: Anyone up for library session?', time: 'Monday', unread: true },
];

const initialMessages = {
  'sj': [
    { id: 1, sender: 'them', text: "Hi Alex! Just a reminder about the Wave Mechanics lab report. It's due this Friday by 11:59 PM.", time: '11:15 AM' },
    { id: 2, sender: 'me', text: "Thanks Dr. Jenkins! I'm almost done with it. Quick question — should we include the error analysis section?", time: '11:18 AM' },
    { id: 3, sender: 'them', text: "Yes, absolutely! Don't forget to submit your lab report by Friday. The error analysis is worth 20% of the total grade.", time: '11:20 AM' },
  ],
  'md': [
    { id: 1, sender: 'them', text: "Great job on the last quiz!", time: 'Yesterday' }
  ],
  'sg': [
    { id: 1, sender: 'them', text: "Emily: Anyone up for library session?", time: 'Monday' }
  ]
};

export default function StudentMessages() {
  const [activeChat, setActiveChat] = useState('sj');
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeChat]);

  const filteredContacts = initialContacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      sender: 'me',
      text: inputValue.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), newMessage]
    }));
    
    setInputValue('');
  };

  const activeContactInfo = initialContacts.find(c => c.id === activeChat);

  return (
    <div style={{ height: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Messages</h1>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'minmax(260px, 1fr) 3fr', gap: '1.5rem', overflow: 'hidden' }}>
        <Card style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 10, top: 11, color: 'var(--color-text-muted)' }} />
              <input 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '0.5rem 0.5rem 0.5rem 2.25rem', borderRadius: '2rem', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--color-bg)', color: 'var(--color-text-main)', fontSize: '0.875rem' }} 
              />
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredContacts.map(c => (
              <div key={c.id} onClick={() => setActiveChat(c.id)} style={{
                padding: '1rem', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: '0.75rem',
                cursor: 'pointer', background: activeChat === c.id ? 'var(--color-bg-2)' : 'transparent', transition: 'background 0.2s'
              }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0, fontSize: '0.8rem' }}>
                  {c.id.toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                    <span style={{ fontWeight: c.unread ? '700' : '500', fontSize: '0.9rem' }}>{c.name}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{c.time}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.lastMsg}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {activeContactInfo && (
            <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {activeContactInfo.id.toUpperCase()}
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', margin: 0 }}>{activeContactInfo.name}</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-success)' }}>● Online</span>
              </div>
            </div>
          )}
          <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', background: 'var(--color-bg)' }}>
            {(messages[activeChat] || []).map(msg => (
              <div key={msg.id} style={{ alignSelf: msg.sender === 'me' ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                <div style={{ 
                  background: msg.sender === 'me' ? 'var(--color-primary)' : 'var(--color-surface)', 
                  color: msg.sender === 'me' ? 'white' : 'var(--color-text-main)', 
                  padding: '0.875rem 1.125rem', 
                  borderRadius: '1rem', 
                  borderBottomRightRadius: msg.sender === 'me' ? 0 : '1rem',
                  borderBottomLeftRadius: msg.sender === 'me' ? '1rem' : 0, 
                  boxShadow: 'var(--shadow-sm)' 
                }}>
                  {msg.text}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '0.25rem', textAlign: msg.sender === 'me' ? 'right' : 'left' }}>
                  {msg.time}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div style={{ padding: '1rem', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '0.75rem', alignItems: 'center', background: 'var(--color-surface)' }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}><Paperclip size={20}/></button>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}><Image size={20}/></button>
            <input 
              type="text" 
              placeholder="Type a message..." 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              style={{ flex: 1, padding: '0.7rem 1rem', borderRadius: '2rem', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--color-bg)', color: 'var(--color-text-main)' }} 
            />
            <Button variant="primary" style={{ borderRadius: '50%', padding: '0.7rem' }} onClick={handleSendMessage}>
              <Send size={18}/>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
