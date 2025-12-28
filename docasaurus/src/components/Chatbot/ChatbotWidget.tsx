import React, { useState, useEffect, useRef } from 'react';
import useChatbot from './useChatbot';
import './ChatbotWidget.css';

const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { state, sendMessage, getCurrentPageContext, getSelectedTextContext, clearConversation} = useChatbot();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  // Function to test connection to backend
  const checkConnection = async () => {
    try {
      const response = await fetch('http://localhost:8000/health');
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  // Check connection status periodically
  useEffect(() => {
    const checkStatus = async () => {
      const isConnected = await checkConnection();
      setConnectionStatus(isConnected ? 'connected' : 'disconnected');
    };

    // Check immediately
    checkStatus();

    // Then check every 10 seconds
    const interval = setInterval(checkStatus, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || state.isLoading) return;

    // Get context information for the current page and any selected text
    const pageContext = getCurrentPageContext();
    const selectedTextContext = getSelectedTextContext();

    // Combine context information
    let context = pageContext;
    if (selectedTextContext) {
      context += `\nSelected text: "${selectedTextContext}"`;
    }

    await sendMessage(inputValue, context);
    setInputValue('');

    // Focus back on input after sending
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Connection status indicator element
  const ConnectionIndicator = () => {
    const statusColors = {
      connecting: '#FFC107', // Yellow
      connected: '#4CAF50',  // Green
      disconnected: '#F44336' // Red
    };

    const statusText = {
      connecting: 'Connecting...',
      connected: 'Connected',
      disconnected: 'Disconnected'
    };

    return (
      <div className="connection-status" style={{
        display: 'flex',
        alignItems: 'center',
        fontSize: '0.8em',
        color: '#999',
        marginLeft: '10px',
        marginTop: '3px'
      }}
      aria-label={`Connection status: ${statusText[connectionStatus]}`}
      role="status">
        <span
          style={{
            display: 'inline-block',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: statusColors[connectionStatus],
            marginRight: '6px'
          }}
          aria-hidden="true"
        ></span>
        <span>{statusText[connectionStatus]}</span>
      </div>
    );
  };

  return (
    <div className="chatbot-widget" role="complementary" aria-label="AI Assistant Chatbot">
      {isOpen ? (
        <div className="chatbot-container" role="dialog" aria-modal="true" aria-labelledby="chatbot-title">
          <div className="chatbot-header">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <h3 id="chatbot-title">AI Assistant</h3>
              <ConnectionIndicator />
            </div>
            <button
              className="chatbot-close-button"
              onClick={() => {
                setIsOpen(false);
                clearConversation();
              }}
              aria-label="Close chat"
              title="Close chat"
            >
              ×
            </button>
          </div>
          <div
            className="chatbot-messages"
            aria-live="polite"
            aria-relevant="additions"
            role="log"
            aria-label="Chat messages"
          >
            {state.messages.length === 0 ? (
              <div className="chatbot-welcome-message">
                <p>Hello! I'm your AI assistant. How can I help you with the documentation?</p>
              </div>
            ) : (
              state.messages.map((message) => (
                <div
                  key={message.id}
                  className={`chatbot-message ${message.sender}-message`}
                  role="listitem"
                  aria-label={`${message.sender} message: ${message.content}`}
                >
                  <div className="message-content">{message.content}</div>
                  <div className="message-timestamp" aria-label={`Sent at ${message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))
            )}
            {state.isLoading && (
              <div className="chatbot-message bot-message" role="status" aria-label="Bot is typing">
                <div className="typing-indicator" aria-label="Typing indicator">
                  <span aria-hidden="true"></span>
                  <span aria-hidden="true"></span>
                  <span aria-hidden="true"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} aria-hidden="true" />
          </div>
          <div className="chatbot-input-area">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question about the documentation..."
              className="chatbot-input"
              rows={1}
              disabled={state.isLoading}
              aria-label="Type your message"
              role="textbox"
              aria-multiline="true"
            />
            <button
              onClick={handleSendMessage}
              disabled={state.isLoading || !inputValue.trim()}
              className="chatbot-send-button"
              aria-label="Send message"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <button
          className="chatbot-open-button"
          onClick={() => setIsOpen(true)}
          aria-label="Open chat"
          aria-expanded="false"
          title="Open chat"
        >
          💬
        </button>
      )}
    </div>
  );
};

export default ChatbotWidget;



// Temporary simplified version to test if ChatbotWidget renders
// Replace your ChatbotWidget.tsx with this temporarily

// import React, { useState, useEffect, useRef } from 'react';

// // Define interfaces
// interface Message {
//   id: string;
//   content: string;
//   sender: 'user' | 'bot';
//   timestamp: Date;
// }

// const ChatbotWidget: React.FC = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [inputValue, setInputValue] = useState('');
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLTextAreaElement>(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Check backend connection
//   const checkConnection = async () => {
//     try {
//       const response = await fetch('http://localhost:8000/health');
//       return response.ok;
//     } catch (error) {
//       return false;
//     }
//   };

//   // Check connection status periodically
//   useEffect(() => {
//     const checkStatus = async () => {
//       const isConnected = await checkConnection();
//       setConnectionStatus(isConnected ? 'connected' : 'disconnected');
//     };

//     checkStatus();
//     const interval = setInterval(checkStatus, 10000);
//     return () => clearInterval(interval);
//   }, []);

//   const handleSendMessage = async () => {
//     if (!inputValue.trim() || isLoading) return;

//     const userMessage: Message = {
//       id: Date.now().toString(),
//       content: inputValue,
//       sender: 'user',
//       timestamp: new Date(),
//     };

//     setMessages(prev => [...prev, userMessage]);
//     setInputValue('');
//     setIsLoading(true);

//     try {
//       const response = await fetch('http://localhost:8000/chat', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           message: inputValue,
//           context_constraint: `Current page: ${document.title}`,
//           session_id: 'session_' + Date.now(),
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`API request failed with status ${response.status}`);
//       }

//       const data = await response.json();

//       const botMessage: Message = {
//         id: Date.now().toString() + '-bot',
//         content: data.response || 'Sorry, I received an empty response.',
//         sender: 'bot',
//         timestamp: new Date(),
//       };

//       setMessages(prev => [...prev, botMessage]);
//     } catch (error) {
//       console.error('Error sending message:', error);

//       const errorMessage: Message = {
//         id: Date.now().toString() + '-error',
//         content: 'Sorry, I could not connect to the server. Please make sure the backend is running on http://localhost:8000',
//         sender: 'bot',
//         timestamp: new Date(),
//       };

//       setMessages(prev => [...prev, errorMessage]);
//     } finally {
//       setIsLoading(false);
//       if (inputRef.current) {
//         inputRef.current.focus();
//       }
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   return (
//     <div style={{
//       position: 'fixed',
//       bottom: '20px',
//       right: '20px',
//       zIndex: 999999,
//       fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
//     }}>
//       {isOpen ? (
//         <div style={{
//           width: '380px',
//           height: '500px',
//           backgroundColor: 'white',
//           borderRadius: '12px',
//           boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
//           border: '1px solid #e1e5e9',
//           display: 'flex',
//           flexDirection: 'column',
//         }}>
//           {/* Header */}
//           <div style={{
//             backgroundColor: '#4f6ef7',
//             color: 'white',
//             padding: '16px',
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             borderTopLeftRadius: '12px',
//             borderTopRightRadius: '12px',
//           }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//               <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>AI Assistant</h3>
//               <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.75em', gap: '6px' }}>
//                 <span style={{
//                   display: 'inline-block',
//                   width: '8px',
//                   height: '8px',
//                   borderRadius: '50%',
//                   backgroundColor: connectionStatus === 'connected' ? '#4CAF50' : connectionStatus === 'connecting' ? '#FFC107' : '#F44336',
//                 }}></span>
//                 <span style={{ fontSize: '11px', opacity: 0.9 }}>
//                   {connectionStatus === 'connected' ? 'Connected' : connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
//                 </span>
//               </div>
//             </div>
//             <button
//               onClick={() => setIsOpen(false)}
//               style={{
//                 background: 'none',
//                 border: 'none',
//                 color: 'white',
//                 fontSize: '24px',
//                 cursor: 'pointer',
//                 padding: 0,
//                 width: '30px',
//                 height: '30px',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 borderRadius: '50%',
//               }}
//               onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
//               onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
//             >
//               ×
//             </button>
//           </div>

//           {/* Messages */}
//           <div style={{
//             flex: 1,
//             padding: '16px',
//             backgroundColor: '#f9fafb',
//             overflowY: 'auto',
//             display: 'flex',
//             flexDirection: 'column',
//             gap: '12px',
//           }}>
//             {messages.length === 0 ? (
//               <div style={{ 
//                 textAlign: 'center', 
//                 padding: '20px 0', 
//                 color: '#6b7280',
//                 fontStyle: 'italic',
//               }}>
//                 <p>Hello! I'm your AI assistant. How can I help you with the documentation?</p>
//               </div>
//             ) : (
//               messages.map((message) => (
//                 <div
//                   key={message.id}
//                   style={{
//                     maxWidth: '80%',
//                     padding: '10px 14px',
//                     borderRadius: '18px',
//                     alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
//                     backgroundColor: message.sender === 'user' ? '#4f6ef7' : 'white',
//                     color: message.sender === 'user' ? 'white' : '#000',
//                     border: message.sender === 'bot' ? '1px solid #e5e7eb' : 'none',
//                     borderBottomRightRadius: message.sender === 'user' ? '4px' : '18px',
//                     borderBottomLeftRadius: message.sender === 'bot' ? '4px' : '18px',
//                     wordWrap: 'break-word',
//                     animation: 'fadeIn 0.3s ease',
//                   }}
//                 >
//                   <div>{message.content}</div>
//                   <div style={{
//                     fontSize: '0.7rem',
//                     color: message.sender === 'user' ? 'rgba(255,255,255,0.7)' : '#9ca3af',
//                     marginTop: '4px',
//                     textAlign: 'right',
//                   }}>
//                     {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                   </div>
//                 </div>
//               ))
//             )}
            
//             {isLoading && (
//               <div style={{
//                 maxWidth: '80%',
//                 padding: '10px 14px',
//                 borderRadius: '18px',
//                 alignSelf: 'flex-start',
//                 backgroundColor: 'white',
//                 border: '1px solid #e5e7eb',
//               }}>
//                 <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
//                   <span style={{
//                     width: '8px',
//                     height: '8px',
//                     backgroundColor: '#9ca3af',
//                     borderRadius: '50%',
//                     display: 'inline-block',
//                     animation: 'typing 1s infinite',
//                   }}></span>
//                   <span style={{
//                     width: '8px',
//                     height: '8px',
//                     backgroundColor: '#9ca3af',
//                     borderRadius: '50%',
//                     display: 'inline-block',
//                     animation: 'typing 1s infinite 0.2s',
//                   }}></span>
//                   <span style={{
//                     width: '8px',
//                     height: '8px',
//                     backgroundColor: '#9ca3af',
//                     borderRadius: '50%',
//                     display: 'inline-block',
//                     animation: 'typing 1s infinite 0.4s',
//                   }}></span>
//                 </div>
//               </div>
//             )}
            
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Input */}
//           <div style={{
//             padding: '12px',
//             backgroundColor: 'white',
//             borderTop: '1px solid #e5e7eb',
//             display: 'flex',
//             gap: '8px',
//             borderBottomLeftRadius: '12px',
//             borderBottomRightRadius: '12px',
//           }}>
//             <textarea
//               ref={inputRef}
//               value={inputValue}
//               onChange={(e) => setInputValue(e.target.value)}
//               onKeyPress={handleKeyPress}
//               placeholder="Ask a question..."
//               disabled={isLoading}
//               style={{
//                 flex: 1,
//                 padding: '10px 12px',
//                 border: '1px solid #d1d5db',
//                 borderRadius: '8px',
//                 fontSize: '14px',
//                 fontFamily: 'inherit',
//                 resize: 'none',
//                 maxHeight: '100px',
//                 outline: 'none',
//               }}
//               rows={1}
//               onFocus={(e) => e.currentTarget.style.borderColor = '#4f6ef7'}
//               onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
//             />
//             <button
//               onClick={handleSendMessage}
//               disabled={isLoading || !inputValue.trim()}
//               style={{
//                 padding: '10px 16px',
//                 backgroundColor: (isLoading || !inputValue.trim()) ? '#d1d5db' : '#4f6ef7',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '8px',
//                 cursor: (isLoading || !inputValue.trim()) ? 'not-allowed' : 'pointer',
//                 fontWeight: 500,
//                 transition: 'background-color 0.2s',
//               }}
//               onMouseEnter={(e) => {
//                 if (!isLoading && inputValue.trim()) {
//                   e.currentTarget.style.backgroundColor = '#3d5bd4';
//                 }
//               }}
//               onMouseLeave={(e) => {
//                 if (!isLoading && inputValue.trim()) {
//                   e.currentTarget.style.backgroundColor = '#4f6ef7';
//                 }
//               }}
//             >
//               Send
//             </button>
//           </div>
//         </div>
//       ) : (
//         <button
//           onClick={() => setIsOpen(true)}
//           style={{
//             width: '60px',
//             height: '60px',
//             borderRadius: '50%',
//             backgroundColor: '#4f6ef7',
//             color: 'white',
//             border: 'none',
//             fontSize: '24px',
//             cursor: 'pointer',
//             boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             transition: 'all 0.3s ease',
//           }}
//           onMouseEnter={(e) => {
//             e.currentTarget.style.transform = 'scale(1.05)';
//             e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
//           }}
//           onMouseLeave={(e) => {
//             e.currentTarget.style.transform = 'scale(1)';
//             e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
//           }}
//         >
//           💬
//         </button>
//       )}

//       <style>{`
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(5px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes typing {
//           0%, 100% { transform: translateY(0); }
//           50% { transform: translateY(-5px); }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ChatbotWidget;