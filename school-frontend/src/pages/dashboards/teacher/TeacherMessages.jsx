import React, { useState, useRef, useEffect } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { Search, Send, Paperclip, Image, Phone, Video, MoreVertical, MessageSquare } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messagesApi, authApi } from '../../../services/api';

export default function TeacherMessages() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const passedState = location.state;
  const processedStateRef = useRef(false);

  const [activeChat, setActiveChat] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  // Fetch current user
  const { data: currentUserRes } = useQuery({
    queryKey: ['auth_user'],
    queryFn: authApi.getUser
  });
  const myId = currentUserRes?.data?.id;

  // Fetch inbox
  const { data: inbox = [], refetch: refetchInbox } = useQuery({
    queryKey: ['inbox'],
    queryFn: async () => {
      const res = await messagesApi.getInbox();
      return res.data;
    }
  });

  // Build contacts map from inbox
  const contactsMap = {};
  if (myId) {
    inbox.forEach(msg => {
      const otherUser = msg.sender_id === myId ? msg.receiver : msg.sender;
      if (!otherUser) return;
      const targetId = otherUser.id.toString();
      
      if (!contactsMap[targetId]) {
         contactsMap[targetId] = {
            id: targetId,
            name: otherUser.name,
            role: otherUser.role,
            lastMsg: msg.content,
            time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestamp: new Date(msg.created_at).getTime(),
            unread: !msg.is_read && msg.receiver_id === myId
         };
      } else {
         if (new Date(msg.created_at).getTime() > contactsMap[targetId].timestamp) {
             contactsMap[targetId].lastMsg = msg.content;
             contactsMap[targetId].time = new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
             contactsMap[targetId].timestamp = new Date(msg.created_at).getTime();
         }
         if (!msg.is_read && msg.receiver_id === myId) {
             contactsMap[targetId].unread = true;
         }
      }
    });
  }

  // Handle incoming passed state to force a contact into the list if they aren't there yet
  if (passedState?.targetUser) {
    const targetId = passedState.targetUser.id.toString();
    if (!contactsMap[targetId]) {
      contactsMap[targetId] = {
        id: targetId,
        name: passedState.targetUser.name,
        role: passedState.targetUser.role,
        lastMsg: 'New conversation...',
        time: 'Just now',
        timestamp: Date.now() + 1000, // Force to top
        unread: false
      };
    }
  }

  const contactsList = Object.values(contactsMap).sort((a, b) => b.timestamp - a.timestamp);
  const filteredContacts = contactsList.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Auto-select chat
  useEffect(() => {
    if (passedState?.targetUser && !activeChat) {
      setActiveChat(passedState.targetUser.id.toString());
    } else if (contactsList.length > 0 && !activeChat) {
      setActiveChat(contactsList[0].id);
    }
  }, [passedState, contactsList, activeChat]);

  // Fetch active conversation
  const { data: conversation = [], refetch: refetchConversation } = useQuery({
    queryKey: ['conversation', activeChat],
    queryFn: async () => {
      if (!activeChat) return [];
      const res = await messagesApi.getConversation(activeChat);
      return res.data;
    },
    enabled: !!activeChat,
    refetchInterval: 5000 // poll every 5s
  });

  const currentContact = contactsMap[activeChat];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation, activeChat]);

  // Mark messages as read when active chat changes or new messages arrive
  useEffect(() => {
    if (myId && activeChat && conversation.length > 0) {
      const unreadMessages = conversation.filter(msg => !msg.is_read && msg.receiver_id === myId);
      if (unreadMessages.length > 0) {
        // Mark the last unread message as read (backend can handle marking all)
        unreadMessages.forEach(msg => {
          messagesApi.markAsRead(msg.id).catch(() => {});
        });
        // Optimistically update query data
        queryClient.invalidateQueries(['inbox']);
      }
    }
  }, [conversation, activeChat, myId, queryClient]);

  // Sending message
  const sendMessageMutation = useMutation({
    mutationFn: async ({ receiverId, content }) => {
      await messagesApi.send(receiverId, content);
    },
    onSuccess: () => {
      refetchInbox();
      refetchConversation();
    }
  });

  const handleSendMessage = () => {
    if (!inputValue.trim() || !activeChat) return;
    sendMessageMutation.mutate({ receiverId: activeChat, content: inputValue.trim() });
    setInputValue('');
  };

  // Auto-send or pre-fill passed message
  useEffect(() => {
    if (passedState?.prefillMsg && passedState?.targetUser && activeChat === passedState.targetUser.id.toString() && !processedStateRef.current) {
      processedStateRef.current = true; // Mark as processed immediately
      if (passedState.autoSend) {
          sendMessageMutation.mutate({ receiverId: activeChat, content: passedState.prefillMsg });
      } else {
          setInputValue(passedState.prefillMsg);
      }
    }
  }, [activeChat, passedState, sendMessageMutation]);

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
            {filteredContacts.length === 0 && (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                    No conversations found.
                </div>
            )}
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
                  {c.name?.slice(0,2).toUpperCase()}
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
          {activeChat ? (
            <>
              <div style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--color-surface)', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>{currentContact?.name?.slice(0,2).toUpperCase()}</div>
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
                {conversation.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginTop: '2rem' }}>
                        No messages yet. Send a message to start the conversation!
                    </div>
                ) : (
                    conversation.map(msg => {
                      const isMe = msg.sender_id === myId;
                      return (
                        <div 
                          key={msg.id} 
                          style={{ 
                              alignSelf: isMe ? 'flex-end' : 'flex-start', 
                              maxWidth: '75%',
                              animation: 'fadeInUp 0.3s ease-out forwards' 
                          }}
                        >
                          <div style={{ 
                              background: isMe ? 'var(--color-primary)' : 'var(--color-surface)', 
                              padding: '1rem 1.25rem', 
                              borderRadius: '1.25rem', 
                              borderBottomRightRadius: isMe ? 0 : '1.25rem',
                              borderBottomLeftRadius: isMe ? '1.25rem' : 0, 
                              color: isMe ? 'white' : 'var(--color-text-main)', 
                              boxShadow: 'var(--shadow-sm)',
                              fontSize: '0.95rem',
                              lineHeight: '1.5',
                              border: isMe ? 'none' : '1px solid var(--color-border)',
                              fontWeight: '500'
                          }}>
                            {msg.content}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '0.5rem', textAlign: isMe ? 'right' : 'left', fontWeight: '600' }}>
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      );
                    })
                )}
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
                    disabled={sendMessageMutation.isPending}
                    style={{ borderRadius: '50%', width: '45px', height: '45px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <Send size={20}/>
                </Button>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', flexDirection: 'column', gap: '1rem' }}>
                <MessageSquare size={48} style={{ opacity: 0.2 }} />
                <p>Select a contact to start messaging</p>
            </div>
          )}
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
