'use client';
import { useState, useEffect } from 'react';
import { FiSend, FiBell, FiMessageSquare } from 'react-icons/fi';

export default function MessagesPage() {
  const [conversations, setConversations] = useState([
    { id: 1, name: 'Enterpreneur one', lastMessage: 'Hi there! you liked my pitch', unread: true },
    { id: 2, name: 'Enterpreneur Two', lastMessage: 'Can we schedule a meeting?', unread: false },
  ]);
  
  const [activeConversation, setActiveConversation] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState(2);

  useEffect(() => {
    if (activeConversation) {
      setMessages([
        { id: 1, sender: 'enterpreneur One', text: 'Hi there! you liked my pitch', time: '10:30 AM', isMe: false },
        { id: 2, sender: 'Me', text: 'Thank you! Would you like to know more?', time: '10:32 AM', isMe: true },
      ]);
    }
  }, [activeConversation]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !activeConversation) return;

    const newMessage = {
      id: messages.length + 1,
      sender: 'Me',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    setTimeout(() => {
      const reply = {
        id: messages.length + 2,
        sender: activeConversation.name,
        text: 'Thanks for your response. Let me check...',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: false
      };
      setMessages(prev => [...prev, reply]);
      setNotifications(prev => prev + 1);
    }, 1000);
  };

  const markAsRead = (convoId) => {
    setConversations(conversations.map(convo => 
      convo.id === convoId ? { ...convo, unread: false } : convo
    ));
    setNotifications(prev => prev - 1);
  };

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
            {conversations.map(convo => (
              <div
                key={convo.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                  activeConversation?.id === convo.id
                    ? 'bg-[#1A1A1A]'
                    : 'hover:bg-[#2A2A2A]'
                }`}
                onClick={() => {
                  setActiveConversation(convo);
                  markAsRead(convo.id);
                }}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-white">{convo.name}</h3>
                  {convo.unread && <span className="h-2 w-2 bg-[#D0140F] rounded-full"></span>}
                </div>
                <p className={`text-sm truncate ${
                  convo.unread ? 'font-medium text-white' : 'text-[#AAAAAA]'
                }`}>
                  {convo.lastMessage}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Message Area */}
        <div className="w-2/3 pl-4 flex flex-col">
          {activeConversation ? (
            <>
              <div className="border-b border-[#3A3A3A] pb-2 mb-4">
                <h2 className="text-lg font-semibold text-white">{activeConversation.name}</h2>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.isMe ? 'bg-[#D0140F] text-white' : 'bg-[#2A2A2A] text-[#F0F0F0]'
                    }`}>
                      {!msg.isMe && (
                        <p className="text-xs font-medium text-[#AAAAAA]">{msg.sender}</p>
                      )}
                      <p>{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.isMe ? 'text-[#FFBFBF]' : 'text-[#888888]'}`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
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
