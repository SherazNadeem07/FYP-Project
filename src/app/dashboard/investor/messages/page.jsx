'use client'
import { useState, useEffect } from 'react';
import { FiSend, FiBell, FiMessageSquare, FiUser, FiBriefcase } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { getCookie } from 'cookies-next';

export default function InvestorMessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState(0);
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchConversations();
    fetchUnreadCount();
  }, []);

  useEffect(() => {
    if (activeConversation) {
      fetchMessages();
    }
  }, [activeConversation]);

  const fetchConversations = async () => {
    try {
      const authToken = token || getCookie('token');
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${API_BASE_URL}/api/investor/conversations`, {
        headers: { Authorization: `Bearer ${authToken}` },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!activeConversation) return;

    try {
      const authToken = token || getCookie('token');
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      const response = await fetch(
        `${API_BASE_URL}/api/messages/${activeConversation.pitchId}/${activeConversation.entrepreneurId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
          credentials: 'include',
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
        fetchUnreadCount();
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const authToken = token || getCookie('token');
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${API_BASE_URL}/api/messages/unread-count`, {
        headers: { Authorization: `Bearer ${authToken}` },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !activeConversation) return;

    try {
      const authToken = token || getCookie('token');
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${API_BASE_URL}/api/messages/send`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          pitchId: activeConversation.pitchId,
          receiverId: activeConversation.entrepreneurId,
          messageText: message,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages([...messages, data.sentMessage]);
        setMessage('');
        fetchConversations();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading messages...
      </div>
    );
  }

  return (
    <div className="bg-[#252525] p-6 rounded-lg border border-[#3A3A3A] h-full text-[#F0F0F0]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Messages</h1>
        <div className="relative">
          <FiBell className="text-2xl text-[#D0140F]" />
          {notifications > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#D0140F] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {notifications}
            </span>
          )}
        </div>
      </div>

      <div className="flex h-[calc(100%-60px)]">
        {/* Conversation List */}
        <div className="w-1/3 border-r border-[#3A3A3A] pr-4">
          <div className="space-y-2 h-full overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="text-center py-8 text-[#AAAAAA]">
                <FiMessageSquare className="text-3xl mx-auto mb-2" />
                <p>No conversations yet</p>
                <p className="text-sm">Start investing in pitches to begin conversations</p>
              </div>
            ) : (
              conversations.map((convo) => (
                <div
                  key={`${convo.pitchId}-${convo.entrepreneurId}`}
                  className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                    activeConversation?.entrepreneurId === convo.entrepreneurId && 
                    activeConversation?.pitchId === convo.pitchId
                      ? 'bg-[#1A1A1A]'
                      : 'hover:bg-[#2A2A2A]'
                  }`}
                  onClick={() => setActiveConversation(convo)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-2">
                      <FiUser className="text-[#D0140F]" />
                      <h3 className="font-medium text-white">{convo.entrepreneurName}</h3>
                    </div>
                    {convo.unreadCount > 0 && (
                      <span className="bg-[#D0140F] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {convo.unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 mb-1">
                    <FiBriefcase className="text-xs text-[#AAAAAA]" />
                    <p className="text-sm text-[#AAAAAA] truncate">{convo.pitchName}</p>
                  </div>
                  <p className="text-sm truncate text-[#AAAAAA]">
                    {convo.lastMessage || 'No messages yet'}
                  </p>
                  {convo.lastMessageTime && (
                    <p className="text-xs text-[#888888] mt-1">
                      {formatTime(convo.lastMessageTime)}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message Area */}
        <div className="w-2/3 pl-4 flex flex-col">
          {activeConversation ? (
            <>
              <div className="border-b border-[#3A3A3A] pb-2 mb-4">
                <h2 className="text-lg font-semibold text-white">{activeConversation.entrepreneurName}</h2>
                <p className="text-sm text-[#AAAAAA]">{activeConversation.pitchName}</p>
                <p className="text-xs text-[#888888]">{activeConversation.pitchDescription}</p>
                {activeConversation.entrepreneurTitle && (
                  <p className="text-xs text-[#666666]">{activeConversation.entrepreneurTitle}</p>
                )}
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.length === 0 ? (
                  <div className="text-center py-8 text-[#AAAAAA]">
                    <p>No messages yet</p>
                    <p className="text-sm">Start a conversation with {activeConversation.entrepreneurName}</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.senderId === activeConversation.entrepreneurId ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.senderId === activeConversation.entrepreneurId 
                          ? 'bg-[#2A2A2A] text-[#F0F0F0]' 
                          : 'bg-[#D0140F] text-white'
                      }`}>
                        {msg.senderId === activeConversation.entrepreneurId && (
                          <p className="text-xs font-medium text-[#AAAAAA]">{msg.senderName}</p>
                        )}
                        <p>{msg.text}</p>
                        <p className={`text-xs mt-1 ${
                          msg.senderId === activeConversation.entrepreneurId 
                            ? 'text-[#888888]' 
                            : 'text-[#FFBFBF]'
                        }`}>
                          {formatTime(msg.time)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="mt-auto">
                <div className="flex items-center">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-[#1A1A1A] border border-[#3A3A3A] text-[#F0F0F0] rounded-l-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#D0140F]"
                  />
                  <button
                    type="submit"
                    className="bg-[#D0140F] text-white p-2 rounded-r-lg hover:bg-[#B0100D]"
                  >
                    <FiSend />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-[#AAAAAA]">
              <FiMessageSquare className="text-4xl mb-2" />
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
