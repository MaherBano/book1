import { useState, useCallback } from 'react';

// Define TypeScript interfaces
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatbotState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

interface UseChatbotReturn {
  state: ChatbotState;
  sendMessage: (message: string, context?: string) => Promise<void>;
  clearConversation: () => void;
  getSessionId: () => string;
  getCurrentPageContext: () => string;
  getSelectedTextContext: () => string;
}

// Base API URL - will be configured based on environment
// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
const API_BASE_URL = 'http://localhost:8000';

// Simple session management using localStorage
const SESSION_STORAGE_KEY = 'chatbot-session-id';
const MESSAGES_STORAGE_KEY = 'chatbot-messages';

const generateSessionId = (): string => {
  return 'session_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

const getStoredSessionId = (): string => {
  let sessionId = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  }
  return sessionId;
};

// const useChatbot = (): UseChatbotReturn => {
//   const [state, setState] = useState<ChatbotState>({
//     messages: [],
//     isLoading: false,
//     error: null,
//   });

//   // Initialize with stored messages if available
//   useState(() => {
//     const storedMessages = localStorage.getItem(MESSAGES_STORAGE_KEY);
//     if (storedMessages) {
//       try {
//         const parsedMessages = JSON.parse(storedMessages).map((msg: any) => ({
//           ...msg,
//           timestamp: new Date(msg.timestamp),
//         }));
//         setState(prev => ({
//           ...prev,
//           messages: parsedMessages,
//         }));
//       } catch (e) {
//         console.error('Failed to parse stored messages:', e);
//       }
//     }
//   });

const useChatbot = (): UseChatbotReturn => {
  // FIXED: Moved initialization logic into useState callback
  const [state, setState] = useState<ChatbotState>(() => {
    // Initialize with stored messages if available
    const storedMessages = localStorage.getItem(MESSAGES_STORAGE_KEY);
    if (storedMessages) {
      try {
        const parsedMessages = JSON.parse(storedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        return {
          messages: parsedMessages,
          isLoading: false,
          error: null,
        };
      } catch (e) {
        console.error('Failed to parse stored messages:', e);
      }
    }
    return {
      messages: [],
      isLoading: false,
      error: null,
    };
  });



  const updateStoredMessages = useCallback((messages: Message[]) => {
    try {
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.error('Failed to store messages:', e);
    }
  }, []);

  const sendMessage = useCallback(async (message: string, context?: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date(),
    };

    // setState(prev => ({
    //   ...prev,
    //   messages: [...prev.messages, userMessage],
    //   isLoading: true,
    //   error: null,
    // }));

    // // Update stored messages
    // updateStoredMessages([...state.messages, userMessage]);

    setState(prev => {
      const newMessages = [...prev.messages, userMessage];
      updateStoredMessages(newMessages);
      return {
        ...prev,
        messages: newMessages,
        isLoading: true,
        error: null,
      };
    });


    try {
      // Prepare the request body
      const requestBody = {
        message: message,
        context_constraint: context || null,
        session_id: getStoredSessionId(),
      };

      // Call the backend API
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();

      const botMessage: Message = {
        id: Date.now().toString() + '-bot',
        content: data.response,
        sender: 'bot',
        timestamp: new Date(),
      };

      // setState(prev => ({
      //   ...prev,
      //   messages: [...prev.messages, userMessage, botMessage],
      //   isLoading: false,
      //   error: null,
      // }));

      // // Update stored messages
      // updateStoredMessages([...prev.messages, userMessage, botMessage]);


      setState(prev => {
        const newMessages = [...prev.messages, botMessage];
        updateStoredMessages(newMessages);
        return {
          ...prev,
          messages: newMessages,
          isLoading: false,
          error: null,
        };
      });


    } catch (error) {
      console.error('Error sending message:', error);

      let errorContent = 'Sorry, I encountered an error processing your request. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('429') || error.message.includes('quota')) {
          errorContent = '⚠️ The AI service has reached its daily limit. Please try again later or contact support to upgrade the plan.';
        } else if (error.message.includes('500')) {
          errorContent = '⚠️ The server encountered an error. Please try again in a moment.';
        } else if (error.message.includes('Failed to fetch')) {
          errorContent = '⚠️ Cannot connect to the server. Please make sure the backend is running.';
        }
      }

      const errorMessage: Message = {
        id: Date.now().toString() + '-error',
        content: errorContent,
        sender: 'bot',
        timestamp: new Date(),
      };

  //     setState(prev => ({
  //       ...prev,
  //       messages: [...prev.messages, userMessage, errorMessage],
  //       isLoading: false,
  //       error: (error as Error).message,
  //     }));

  //     // Update stored messages
  //     updateStoredMessages([...prev.messages, userMessage, errorMessage]);
  //   }
  // }, [state.messages, updateStoredMessages]);

      setState(prev => {
        const newMessages = [...prev.messages, errorMessage];
        updateStoredMessages(newMessages);
        return {
          ...prev,
          messages: newMessages,
          isLoading: false,
          error: (error as Error).message,
        };
      });
    }
  }, [updateStoredMessages]);

  const clearConversation = useCallback(() => {
    setState({
      messages: [],
      isLoading: false,
      error: null,
    });

    updateStoredMessages([]);
  }, [updateStoredMessages]);

  const getSessionId = useCallback((): string => {
    return getStoredSessionId();
  }, []);

  // Get current page context (URL, title, etc.)
  const getCurrentPageContext = useCallback((): string => {
    const url = window.location.href;
    const title = document.title;
    const pathname = window.location.pathname;

    return `Current page: ${title} (${url}), Path: ${pathname}`;
  }, []);

  // Get selected text context
  const getSelectedTextContext = useCallback((): string => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim() !== '') {
      return selection.toString().trim();
    }
    return '';
  }, []);

  return {
    state,
    sendMessage,
    clearConversation,
    getSessionId,
    getCurrentPageContext,
    getSelectedTextContext,
  };
};

export default useChatbot;