import React from 'react';
import OriginalLayout from '@theme-original/Layout';
import ChatbotWidget from '../components/Chatbot/ChatbotWidget';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = (props: LayoutProps) => {
  console.log('🎨 Layout is rendering!');
  
  return (
    <>
      <OriginalLayout {...props} />
      <ChatbotWidget />
    </>
  );
};

export default Layout;


