'use client';
import { useState, useEffect } from 'react';
import { FiSend, FiBell, FiMessageSquare } from 'react-icons/fi';

export default function MessagesPage() {
  const [conversations, setConversations] = useState([
    { id: 1, name: 'Investor One', lastMessage: 'Hi there! I liked your pitch', unread: true },
    { id: 2, name: 'Investor Two', lastMessage: 'Can we schedule a meeting?', unread: false },
  ]);

  const [activeConversation, setActiveConversation] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState(2);

  useEffect(() => {
    if (activeConversation) {
      setMessages([
        { id: 1, sender: 'Investor One', text: 'Hi there! I liked your pitch', time: '10:30 AM', isMe: false },
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
      isMe: true,
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    setTimeout(() => {
      const reply = {
        id: messages.length + 2,
        sender: activeConversation.name,
        text: 'Thanks for your response. Let me check...',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: false,
      };
      setMessages((prev) => [...prev, reply]);
      setNotifications((prev) => prev + 1);
    }, 1000);
  };

  const markAsRead = (convoId) => {
    setConversations(conversations.map((convo) =>
      convo.id === convoId ? { ...convo, unread: false } : convo
    ));
    setNotifications((prev) => prev - 1);
  };

  return (
    <div className="bg-[#2C2C2C] p-4 sm:p-6 rounded-lg shadow-sm text-[#E8E8E8] min-h-[80vh]">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Messages</h1>
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
        {/* Left Sidebar */}
        <div className="md:w-1/3 w-full border border-[#3F3F3F] rounded-lg overflow-y-auto">
          <div className="space-y-2 p-4">
            {conversations.map((convo) => (
              <div
                key={convo.id}
                className={`p-3 rounded-lg cursor-pointer transition ${
                  activeConversation?.id === convo.id
                    ? 'bg-[#3A3A3A]'
                    : 'hover:bg-[#4A4A4A]'
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
                <p
                  className={`text-sm truncate ${
                    convo.unread ? 'font-medium text-[#E8E8E8]' : 'text-[#9ca3af]'
                  }`}
                >
                  {convo.lastMessage}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Chat Section */}
        <div className="md:w-2/3 w-full flex flex-col border border-[#3F3F3F] rounded-lg p-4">
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="border-b border-[#3F3F3F] pb-2 mb-4">
                <h2 className="text-lg font-semibold">{activeConversation.name}</h2>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] sm:max-w-md px-4 py-2 rounded-lg ${
                        msg.isMe ? 'bg-[#D0140F] text-white' : 'bg-[#383838]'
                      }`}
                    >
                      {!msg.isMe && (
                        <p className="text-xs font-medium text-[#cecbcb]">{msg.sender}</p>
                      )}
                      <p>{msg.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.isMe ? 'text-[#cecbcb]' : 'text-[#7F7F7F]'
                        }`}
                      >
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
