'use client';
import { useState, useEffect } from 'react';
import { FiSend, FiBell, FiMessageSquare, FiUser, FiBriefcase } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { getCookie } from 'cookies-next';

export default function EntrepreneurMessagesPage() {
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
      
      const response = await fetch(`${API_BASE_URL}/api/entrepreneur/conversations`, {
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
        `${API_BASE_URL}/api/messages/${activeConversation.pitchId}/${activeConversation.investorId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
          credentials: 'include',
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
        fetchUnreadCount(); // Refresh unread count after reading messages
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
          receiverId: activeConversation.investorId,
          messageText: message,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages([...messages, data.sentMessage]);
        setMessage('');
        fetchConversations(); // Refresh conversations to update last message
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
    <div className="bg-[#2C2C2C] p-4 sm:p-6 rounded-lg shadow-sm text-[#E8E8E8] min-h-[80vh]">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-white">Messages</h1>
        <div className="relative">
          <FiBell className="text-2xl text-[#cecbcb]" />
          {notifications > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#D0140F] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {notifications}
            </span>
          )}
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col md:flex-row gap-4 h-[70vh]">
        {/* Left Sidebar - Conversations */}
        <div className="md:w-1/3 w-full border border-[#3F3F3F] rounded-lg overflow-y-auto">
          <div className="space-y-2 p-4">
            {conversations.length === 0 ? (
              <div className="text-center py-8 text-[#7F7F7F]">
                <FiMessageSquare className="text-3xl mx-auto mb-2" />
                <p>No conversations yet</p>
                <p className="text-sm">Investors will appear here when they interact with your pitches</p>
              </div>
            ) : (
              conversations.map((convo) => (
                <div
                  key={`${convo.pitchId}-${convo.investorId}`}
                  className={`p-3 rounded-lg cursor-pointer transition ${
                    activeConversation?.investorId === convo.investorId && 
                    activeConversation?.pitchId === convo.pitchId
                      ? 'bg-[#3A3A3A]'
                      : 'hover:bg-[#4A4A4A]'
                  }`}
                  onClick={() => setActiveConversation(convo)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-2">
                      <FiUser className="text-[#D0140F]" />
                      <h3 className="font-medium text-white">{convo.investorName}</h3>
                    </div>
                    {convo.unreadCount > 0 && (
                      <span className="bg-[#D0140F] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {convo.unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 mb-1">
                    <FiBriefcase className="text-xs text-[#cecbcb]" />
                    <p className="text-sm text-[#cecbcb] truncate">{convo.pitchName}</p>
                  </div>
                  <p className="text-sm truncate text-[#9ca3af]">
                    {convo.lastMessage || 'No messages yet'}
                  </p>
                  {convo.lastMessageTime && (
                    <p className="text-xs text-[#575757] mt-1">
                      {formatTime(convo.lastMessageTime)}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Chat Section */}
        <div className="md:w-2/3 w-full flex flex-col border border-[#3F3F3F] rounded-lg p-4">
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="border-b border-[#3F3F3F] pb-2 mb-4">
                <h2 className="text-lg font-semibold text-white">{activeConversation.investorName}</h2>
                <p className="text-sm text-[#cecbcb]">{activeConversation.pitchName}</p>
                {activeConversation.investorTitle && (
                  <p className="text-xs text-[#575757]">{activeConversation.investorTitle}</p>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                {messages.length === 0 ? (
                  <div className="text-center py-8 text-[#7F7F7F]">
                    <p>No messages yet</p>
                    <p className="text-sm">Start a conversation with {activeConversation.investorName}</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.senderId === activeConversation.investorId ? 'justify-start' : 'justify-end'}`}>
                      <div
                        className={`max-w-[80%] sm:max-w-md px-4 py-2 rounded-lg ${
                          msg.senderId === activeConversation.investorId 
                            ? 'bg-[#383838]' 
                            : 'bg-[#D0140F] text-white'
                        }`}
                      >
                        {msg.senderId === activeConversation.investorId && (
                          <p className="text-xs font-medium text-[#cecbcb]">{msg.senderName}</p>
                        )}
                        <p>{msg.text}</p>
                        <p
                          className={`text-xs mt-1 ${
                            msg.senderId === activeConversation.investorId 
                              ? 'text-[#7F7F7F]' 
                              : 'text-[#FFBFBF]'
                          }`}
                        >
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
                    className="flex-1 bg-[#1c1c1c] border border-[#676767] rounded-l-lg p-2 text-white placeholder-[#575757] focus:outline-none focus:ring-1 focus:ring-[#D0140F]"
                  />
                  <button
                    type="submit"
                    className="bg-[#D0140F] text-white p-2 rounded-r-lg hover:bg-[#b9120d]"
                  >
                    <FiSend />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-[#7F7F7F]">
              <FiMessageSquare className="text-4xl mb-2" />
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
