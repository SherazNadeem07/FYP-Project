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
    // Simulate fetching messages when conversation is selected
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
      isMe: true
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
    
    // Simulate reply after 1 second
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
      convo.id === convoId ? {...convo, unread: false} : convo
    ));
    setNotifications(prev => prev - 1);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Messages</h1>
        <div className="relative">
          <FiBell className="text-2xl" />
          {notifications > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {notifications}
            </span>
          )}
        </div>
      </div>
      
      <div className="flex h-[calc(100%-60px)]">
        {/* Conversation List */}
        <div className="w-1/3 border-r pr-4">
          <div className="space-y-2 h-full overflow-y-auto">
            {conversations.map(convo => (
              <div 
                key={convo.id}
                className={`p-3 rounded-lg cursor-pointer ${activeConversation?.id === convo.id ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}
                onClick={() => {
                  setActiveConversation(convo);
                  markAsRead(convo.id);
                }}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{convo.name}</h3>
                  {convo.unread && <span className="h-2 w-2 bg-indigo-500 rounded-full"></span>}
                </div>
                <p className={`text-sm truncate ${convo.unread ? 'font-medium' : 'text-gray-500'}`}>
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
              <div className="border-b pb-2 mb-4">
                <h2 className="text-lg font-semibold">{activeConversation.name}</h2>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map(msg => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.isMe ? 'bg-indigo-500 text-white' : 'bg-gray-100'}`}>
                      {!msg.isMe && <p className="text-xs font-medium text-gray-700">{msg.sender}</p>}
                      <p>{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.isMe ? 'text-indigo-100' : 'text-gray-500'}`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <form onSubmit={handleSendMessage} className="mt-auto">
                <div className="flex items-center">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 border rounded-l-lg p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button 
                    type="submit" 
                    className="bg-indigo-500 text-white p-2 rounded-r-lg hover:bg-indigo-600"
                  >
                    <FiSend />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <FiMessageSquare className="text-4xl mb-2" />
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}