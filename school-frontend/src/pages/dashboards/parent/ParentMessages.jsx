import React, { useState, useRef, useEffect } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { Search, Send, Paperclip, Image, MoreVertical, Phone, Video } from 'lucide-react';

const initialContacts = [
  { id: 'sj', name: 'Dr. Sarah Jenkins', role: 'Physics Teacher', lastMsg: 'I\'ll send over Alex\'s lab results tonight.', time: '11:20 AM', unread: true },
  { id: 'md', name: 'Prof. Mark Davis', role: 'Mathematics Teacher', lastMsg: 'Mia is showing great improvement in geometry.', time: 'Yesterday', unread: false },
  { id: 'er', name: 'Ms. Elena Rodríguez', role: 'History Teacher', lastMsg: 'The parent-teacher conference is scheduled for Tue.', time: 'Monday', unread: false },
  { id: 'jw', name: 'Mr. James Wilson', role: 'English Teacher', lastMsg: 'We can discuss the essay requirements anytime.', time: 'Oct 20', unread: true },
];

const initialMessages = {
  'sj': [
    { id: 1, sender: 'them', text: "Hello! I wanted to update you on Alex's progress in Physics. He's doing exceptionally well in the lab assignments.", time: '11:15 AM' },
    { id: 2, sender: 'me', text: "That's great to hear! We were a bit worried about the Wave Mechanics chapter. Does he need any extra resources?", time: '11:18 AM' },
    { id: 3, sender: 'them', text: "I'll send over Alex's lab results tonight. He's got a solid grasp on it now, just needs to keep up the consistency.", time: '11:20 AM' },
  ],
  'md': [
    { id: 1, sender: 'them', text: "Mia is showing great improvement in geometry. Her score on the last quiz was the highest in the class!", time: 'Yesterday' }
  ],
  'er': [
    { id: 1, sender: 'them', text: "The parent-teacher conference is scheduled for next Tuesday at 4:00 PM. Looking forward to seeing you then.", time: 'Monday' }
  ],
  'jw': [
    { id: 1, sender: 'them', text: "We can discuss the essay requirements anytime. I've uploaded the rubric to the student portal.", time: 'Oct 20' }
  ]
};

export default function ParentMessages() {
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
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Teacher Correspondence</h1>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 3fr', gap: '1.5rem', overflow: 'hidden' }}>
        <Card style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--color-text-muted)' }} />
              <input 
                placeholder="Search teachers..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '0.6rem 0.6rem 0.6rem 2.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--color-bg)', color: 'var(--color-text-main)', fontSize: '0.875rem' }} 
              />
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredContacts.map(c => (
              <div key={c.id} onClick={() => setActiveChat(c.id)} style={{
                padding: '1.25rem', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: '1rem',
                cursor: 'pointer', background: activeChat === c.id ? 'var(--color-bg-2)' : 'transparent', transition: 'all 0.2s',
                borderLeft: activeChat === c.id ? '4px solid var(--color-primary)' : '4px solid transparent'
              }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0, fontSize: '0.9rem', boxShadow: 'var(--shadow-sm)' }}>
                  {c.id.toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: c.unread ? '700' : '600', fontSize: '0.9rem', color: 'var(--color-text-main)' }}>{c.name}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>{c.time}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.lastMsg}</div>
                </div>
                {c.unread && <div style={{ width: '8px', height: '8px', background: 'var(--color-primary)', borderRadius: '50%', alignSelf: 'center' }}></div>}
              </div>
            ))}
          </div>
        </Card>

        <Card style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
          {activeContactInfo && (
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--color-surface)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {activeContactInfo.id.toUpperCase()}
                </div>
                <div>
                    <h3 style={{ fontSize: '1rem', margin: 0, fontWeight: '700' }}>{activeContactInfo.name}</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>{activeContactInfo.role}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button variant="outline" size="sm" style={{ padding: '0.5rem' }}><Phone size={16}/></Button>
                <Button variant="outline" size="sm" style={{ padding: '0.5rem' }}><Video size={16}/></Button>
                <Button variant="outline" size="sm" style={{ padding: '0.5rem' }}><MoreVertical size={16}/></Button>
              </div>
            </div>
          )}
          <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'var(--color-bg)' }}>
            {(messages[activeChat] || []).map(msg => (
              <div key={msg.id} style={{ alignSelf: msg.sender === 'me' ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
                <div style={{ 
                  background: msg.sender === 'me' ? 'var(--color-primary)' : 'var(--color-surface)', 
                  color: msg.sender === 'me' ? 'white' : 'var(--color-text-main)', 
                  padding: '1rem 1.25rem', 
                  borderRadius: '1.25rem', 
                  borderBottomRightRadius: msg.sender === 'me' ? 0 : '1.25rem',
                  borderBottomLeftRadius: msg.sender === 'me' ? '1.25rem' : 0, 
                  boxShadow: 'var(--shadow-sm)',
                  lineHeight: '1.5',
                  fontSize: '0.95rem',
                  border: msg.sender === 'me' ? 'none' : '1px solid var(--color-border)'
                }}>
                  {msg.text}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '0.5rem', textAlign: msg.sender === 'me' ? 'right' : 'left', fontWeight: '500' }}>
                  {msg.time}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div style={{ padding: '1.25rem', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '1rem', alignItems: 'center', background: 'var(--color-surface)' }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}><Paperclip size={20}/></button>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}><Image size={20}/></button>
            <input 
              type="text" 
              placeholder="Type your message to the teacher..." 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              style={{ flex: 1, padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--color-bg)', color: 'var(--color-text-main)', fontSize: '0.95rem' }} 
            />
            <Button variant="primary" style={{ borderRadius: '50%', width: '44px', height: '44px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={handleSendMessage}>
              <Send size={20}/>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
