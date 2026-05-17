import React, { useState, useRef, useEffect } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { Search, Send, Paperclip, Image, Phone, Video, MoreVertical } from 'lucide-react';

const initialContacts = [
  { id: 'ad', name: 'Administration', role: 'School Admin', lastMsg: 'Please review the updated syllabus.', time: '10:30 AM', unread: true },
  { id: 'aj', name: 'Alex Johnson (Parent)', role: 'Parent', lastMsg: 'Thank you for the update!', time: 'Yesterday', unread: false },
  { id: 'ep', name: 'Emily Parker', role: 'Colleague', lastMsg: 'Are you available for a meeting?', time: 'Monday', unread: false },
  { id: 'js', name: 'John Smith (Student)', role: 'Student', lastMsg: 'I have a question about the assignment.', time: 'Oct 24', unread: false },
];

const initialMessages = {
  'ad': [
    { id: 1, sender: 'them', text: "Hi! Please review the semester schedule I sent last week and confirm your free periods.", time: '10:10 AM' },
    { id: 2, sender: 'me', text: "Sure, I have reviewed it. Tuesday and Thursday evenings after 4PM work best for me.", time: '10:25 AM' },
    { id: 3, sender: 'them', text: "Please review the updated syllabus.", time: '10:30 AM' },
  ],
  'aj': [
    { id: 1, sender: 'them', text: "Hello Dr. Jenkins, thank you for the update on Alex's progress!", time: 'Yesterday' }
  ],
  'ep': [
    { id: 1, sender: 'them', text: "Are you available for a quick meeting after class tomorrow?", time: 'Monday' }
  ],
  'js': [
    { id: 1, sender: 'them', text: "I have a question about the lab report deadline.", time: 'Oct 24' }
  ]
};

export default function TeacherMessages() {
  const [activeChat, setActiveChat] = useState('ad');
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

  const filteredContacts = initialContacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentContact = initialContacts.find(c => c.id === activeChat);

  return (
    <div style={{ height: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Communication Hub</h1>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 3fr', gap: '1.5rem', overflow: 'hidden' }}>
        {/* Sidebar */}
        <Card style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input 
                placeholder="Find contact..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 1rem 0.65rem 2.75rem', borderRadius: '2rem', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--color-bg)', color: 'var(--color-text-main)', fontSize: '0.875rem' }} 
              />
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredContacts.map(c => (
              <div 
                key={c.id} 
                onClick={() => setActiveChat(c.id)} 
                style={{
                  padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: '1rem',
                  cursor: 'pointer', background: activeChat === c.id ? 'var(--color-bg)' : 'transparent', 
                  transition: 'all 0.2s',
                  borderLeft: activeChat === c.id ? '4px solid var(--color-primary)' : '4px solid transparent'
                }}
              >
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', flexShrink: 0, fontSize: '0.9rem' }}>
                  {c.id.toUpperCase().slice(0,2)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: c.unread ? '700' : '600', fontSize: '0.9rem', color: 'var(--color-text-main)' }}>{c.name}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: '600' }}>{c.time}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.lastMsg}</div>
                </div>
                {c.unread && <div style={{ width: '10px', height: '10px', background: 'var(--color-primary)', borderRadius: '50%', flexShrink: 0, marginTop: '6px' }}></div>}
              </div>
            ))}
          </div>
        </Card>

        {/* Chat Window */}
        <Card style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--color-surface)', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>{currentContact?.id.toUpperCase()}</div>
              <div>
                <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--color-text-main)', fontWeight: '700' }}>{currentContact?.name}</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: '600' }}>● Online</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button style={{ padding: '0.5rem', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}><Phone size={20}/></button>
                <button style={{ padding: '0.5rem', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}><Video size={20}/></button>
                <button style={{ padding: '0.5rem', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}><MoreVertical size={20}/></button>
            </div>
          </div>

          <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'var(--color-bg)' }}>
            {(messages[activeChat] || []).map(msg => (
              <div 
                key={msg.id} 
                style={{ 
                    alignSelf: msg.sender === 'me' ? 'flex-end' : 'flex-start', 
                    maxWidth: '75%',
                    animation: 'fadeInUp 0.3s ease-out forwards' 
                }}
              >
                <div style={{ 
                    background: msg.sender === 'me' ? 'var(--color-primary)' : 'var(--color-surface)', 
                    padding: '1rem 1.25rem', 
                    borderRadius: '1.25rem', 
                    borderBottomRightRadius: msg.sender === 'me' ? 0 : '1.25rem',
                    borderBottomLeftRadius: msg.sender === 'me' ? '1.25rem' : 0, 
                    color: msg.sender === 'me' ? 'white' : 'var(--color-text-main)', 
                    boxShadow: 'var(--shadow-sm)',
                    fontSize: '0.95rem',
                    lineHeight: '1.5',
                    border: msg.sender === 'me' ? 'none' : '1px solid var(--color-border)',
                    fontWeight: '500'
                }}>
                  {msg.text}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '0.5rem', textAlign: msg.sender === 'me' ? 'right' : 'left', fontWeight: '600' }}>{msg.time}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div style={{ padding: '1.25rem 2rem', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '1rem', alignItems: 'center', background: 'var(--color-surface)' }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}><Paperclip size={22}/></button>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}><Image size={22}/></button>
            <input 
              type="text" 
              placeholder="Type your message..." 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              style={{ flex: 1, padding: '0.85rem 1.5rem', borderRadius: '2rem', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--color-bg)', color: 'var(--color-text-main)', fontSize: '0.95rem' }} 
            />
            <Button 
                variant="primary" 
                onClick={handleSendMessage}
                style={{ borderRadius: '50%', width: '45px', height: '45px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <Send size={20}/>
            </Button>
          </div>
        </Card>
      </div>
      <style>{`
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
