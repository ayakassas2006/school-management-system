import React, { useState, useRef, useEffect, useMemo } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { Search, Send, Image, Paperclip, MoreVertical, Phone, Video, X } from 'lucide-react';
import { authApi, usersApi, messagesApi } from '../../../services/api';
import { useToast } from '../../../components/ui/Toast';

export default function AdminMessages() {
  const [currentUser, setCurrentUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [inbox, setInbox] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  
  // Modals / Simulations
  const [showCallModal, setShowCallModal] = useState(false);
  const [callType, setCallType] = useState('Voice');
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  
  const messagesEndRef = useRef(null);
  const { error, success, warning } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, activeChat]);

  useEffect(() => {
    if (activeChat) {
      loadConversation(activeChat);
    }
  }, [activeChat]);

  const fetchInitialData = async () => {
    try {
      const userRes = await authApi.getUser();
      setCurrentUser(userRes.data || userRes);

      const [usersRes, inboxRes] = await Promise.all([
        usersApi.getAll(),
        messagesApi.getInbox()
      ]);

      const allUsers = usersRes.data || [];
      const allMessages = inboxRes.data || [];
      
      setContacts(allUsers);
      setInbox(allMessages);
      
    } catch (err) {
      error('Failed to load messaging data.');
    }
  };

  const loadConversation = async (userId) => {
    try {
      const res = await messagesApi.getConversation(userId);
      setChatMessages(res.data || []);
      
      // Mark all unread messages from this user as read
      const unreadIds = (res.data || [])
        .filter(m => m.sender_id === userId && !m.is_read)
        .map(m => m.id);
        
      if (unreadIds.length > 0) {
        for(let id of unreadIds) {
           await messagesApi.markAsRead(id);
        }
        // Refresh inbox to update unread badges
        const inboxRes = await messagesApi.getInbox();
        setInbox(inboxRes.data || []);
      }
    } catch (err) {
      error('Failed to load conversation.');
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !activeChat) return;
    
    const text = inputValue.trim();
    setInputValue(''); 
    
    try {
      const res = await messagesApi.send(activeChat, text);
      const newMessage = res.data;
      setChatMessages(prev => [...prev, newMessage]);
      
      setInbox(prev => [newMessage, ...prev]);
    } catch (err) {
      error('Failed to send message.');
    }
  };

  const processedContacts = useMemo(() => {
      if (!currentUser) return [];
      
      const contactsMap = {};
      
      contacts.forEach(u => {
          if (u.id === currentUser.id) return;
          contactsMap[u.id] = {
              user: u,
              lastMessage: null,
              unreadCount: 0,
              timestamp: 0
          };
      });
      
      inbox.forEach(msg => {
          const otherId = msg.sender_id === currentUser.id ? msg.receiver_id : msg.sender_id;
          if (contactsMap[otherId]) {
              if (!contactsMap[otherId].lastMessage) {
                  contactsMap[otherId].lastMessage = msg;
                  contactsMap[otherId].timestamp = new Date(msg.created_at).getTime();
              }
              if (msg.sender_id === otherId && !msg.is_read) {
                  contactsMap[otherId].unreadCount += 1;
              }
          }
      });
      
      return Object.values(contactsMap)
        .filter(c => c.user.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => b.timestamp - a.timestamp);
  }, [contacts, inbox, currentUser, searchQuery]);

  const currentContactData = processedContacts.find(c => c.user.id === activeChat)?.user;

  const formatTime = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const getInitials = (name) => {
      if(!name) return '?';
      return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const handleAttachment = (e) => {
      if(e.target.files.length > 0) {
          success(`Attached file: ${e.target.files[0].name}`);
      }
  };

  return (
    <div style={{ height: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Internal Messaging</h1>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 3fr', gap: '1.5rem', overflow: 'hidden' }}>
        {/* Contacts Sidebar */}
        <Card style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
            <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--color-border)' }}>
                <div style={{ position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    <input 
                      type="text" 
                      placeholder="Search contacts..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem 1rem 0.65rem 2.75rem', borderRadius: '2rem', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--color-bg)', color: 'var(--color-text-main)', fontSize: '0.875rem' }} 
                    />
                </div>
            </div>
            <div style={{ overflowY: 'auto', flex: 1 }}>
                {processedContacts.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No contacts found.</div>
                ) : processedContacts.map(({ user, lastMessage, unreadCount }) => (
                    <div 
                        key={user.id} 
                        onClick={() => setActiveChat(user.id)}
                        style={{ 
                            padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: '1rem', cursor: 'pointer',
                            background: activeChat === user.id ? 'var(--color-bg-2)' : 'transparent',
                            transition: 'all 0.2s',
                            borderLeft: activeChat === user.id ? '4px solid var(--color-primary)' : '4px solid transparent'
                        }}
                    >
                        <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.9rem', flexShrink: 0 }}>
                            {getInitials(user.name)}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                <span style={{ fontWeight: unreadCount > 0 ? '700' : '600', color: 'var(--color-text-main)', fontSize: '0.9rem' }}>{user.name}</span>
                                <span style={{ fontSize: '0.7rem', color: unreadCount > 0 ? 'var(--color-primary)' : 'var(--color-text-muted)', fontWeight: '600' }}>
                                    {lastMessage ? formatTime(lastMessage.created_at) : ''}
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ fontSize: '0.8rem', color: unreadCount > 0 ? 'var(--color-text-main)' : 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: unreadCount > 0 ? '500' : '400', flex: 1 }}>
                                    {lastMessage ? lastMessage.content : 'No messages yet'}
                                </div>
                                {unreadCount > 0 && (
                                    <div style={{ background: 'var(--color-primary)', color: 'white', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 'bold', marginLeft: '0.5rem' }}>
                                        {unreadCount}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>

        {/* Chat Area */}
        <Card style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid var(--color-border)', position: 'relative' }}>
            {showCallModal && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '2rem', animation: 'pulse 1.5s infinite' }}>
                         {getInitials(currentContactData?.name)}
                    </div>
                    <h2 style={{ margin: '0 0 0.5rem 0' }}>{callType} calling {currentContactData?.name}...</h2>
                    <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '3rem' }}>Ringing...</p>
                    <button 
                        onClick={() => setShowCallModal(false)}
                        style={{ background: 'var(--color-danger)', color: 'white', border: 'none', borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)' }}
                    >
                        <Phone size={24} style={{ transform: 'rotate(135deg)' }} />
                    </button>
                </div>
            )}

            {currentContactData ? (
                <>
                    <div style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--color-surface)', zIndex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                                {getInitials(currentContactData.name)}
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: '700', color: 'var(--color-text-main)' }}>{currentContactData.name}</h3>
                                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: '600' }}>{currentContactData.role} • Online</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => { setCallType('Voice'); setShowCallModal(true); }} style={{ padding: '0.5rem', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}><Phone size={20}/></button>
                            <button onClick={() => { setCallType('Video'); setShowCallModal(true); }} style={{ padding: '0.5rem', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}><Video size={20}/></button>
                            <button onClick={() => warning("More options coming soon.")} style={{ padding: '0.5rem', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}><MoreVertical size={20}/></button>
                        </div>
                    </div>

                    <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'var(--color-bg)' }}>
                        {chatMessages.length === 0 ? (
                             <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginTop: '2rem' }}>No messages in this conversation. Say hi!</div>
                        ) : chatMessages.map((msg) => (
                            <div 
                              key={msg.id} 
                              style={{ 
                                alignSelf: msg.sender_id === currentUser?.id ? 'flex-end' : 'flex-start', 
                                maxWidth: '75%',
                                animation: 'fadeInUp 0.3s ease-out forwards' 
                              }}
                            >
                                <div style={{ 
                                    background: msg.sender_id === currentUser?.id ? 'var(--color-primary)' : 'var(--color-surface)', 
                                    padding: '1rem 1.25rem', 
                                    borderRadius: '1.25rem', 
                                    borderBottomRightRadius: msg.sender_id === currentUser?.id ? 0 : '1.25rem',
                                    borderBottomLeftRadius: msg.sender_id === currentUser?.id ? '1.25rem' : 0, 
                                    boxShadow: 'var(--shadow-sm)', 
                                    color: msg.sender_id === currentUser?.id ? 'white' : 'var(--color-text-main)',
                                    fontSize: '0.95rem',
                                    lineHeight: '1.6',
                                    border: msg.sender_id === currentUser?.id ? 'none' : '1px solid var(--color-border)',
                                    fontWeight: '500'
                                }}>
                                    {msg.content}
                                </div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '0.5rem', textAlign: msg.sender_id === currentUser?.id ? 'right' : 'left', fontWeight: '600' }}>
                                    {formatTime(msg.created_at)} {msg.sender_id === currentUser?.id && msg.is_read ? ' • Read' : ''}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <div style={{ padding: '1.25rem 2rem', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '1rem', alignItems: 'center', background: 'var(--color-surface)', zIndex: 1 }}>
                        <input type="file" ref={fileInputRef} onChange={handleAttachment} hidden />
                        <input type="file" ref={imageInputRef} onChange={handleAttachment} accept="image/*" hidden />
                        
                        <button onClick={() => fileInputRef.current?.click()} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}><Paperclip size={22}/></button>
                        <button onClick={() => imageInputRef.current?.click()} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}><Image size={22}/></button>
                        
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
                          style={{ padding: '0.75rem', borderRadius: '50%', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <Send size={18} />
                        </Button>
                    </div>
                </>
            ) : (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Send size={32} color="var(--color-border)" />
                    </div>
                    Select a contact to start messaging
                </div>
            )}
        </Card>
      </div>
      <style>{`
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.4); }
            70% { box-shadow: 0 0 0 20px rgba(79, 70, 229, 0); }
            100% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0); }
        }
      `}</style>
    </div>
  );
}
