import React, { useState, useRef, useEffect } from 'react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your documentation assistant. How can I help you today?", sender: 'bot', timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate bot response after a delay
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        text: "Thanks for your message! I'm a documentation assistant. In a real implementation, I would provide helpful answers based on the documentation content.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      {!isOpen && (
        <button className="chatbot-float-button" onClick={toggleChat}>
          💬
        </button>
      )}
      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <h3>Documentation Assistant</h3>
            <button className="chatbot-close" onClick={toggleChat}>×</button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chatbot-message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form className="chatbot-input-container" onSubmit={handleSend}>
            <input
              type="text"
              className="chatbot-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your question..."
            />
            <button type="submit" className="chatbot-send">Send</button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;