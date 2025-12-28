# Quickstart Guide: UI Theme - Dark with Gold Accents

## Overview

This guide provides step-by-step instructions for implementing the modern dark theme with gold accents for your Docusaurus documentation website and embedded chatbot UI. Follow these steps to apply the cohesive design system with the specified color palette and typography.

## Prerequisites

- Node.js 18+ installed
- Docusaurus 3.x project set up
- Basic knowledge of React and CSS
- Access to project files

## Step 1: Set Up Theme Variables

Create a CSS file for theme variables at `docasaurus/src/css/theme-variables.css`:

```css
:root {
  /* Color Palette */
  --theme-color-background-primary: #0F111A;
  --theme-color-background-surface: #151826;
  --theme-color-text-primary: #E0DACC;
  --theme-color-text-muted: #9CA3AF;
  --theme-color-accent-primary: #FFD700;
  --theme-color-accent-hover: #FFC107;
  --theme-color-border: rgba(255, 215, 0, 0.15);

  /* Typography */
  --theme-font-heading: 'Inter', 'Poppins', sans-serif;
  --theme-font-body: 'Inter', system-ui, sans-serif;
  --theme-font-code: 'JetBrains Mono', 'Fira Code', monospace;

  /* Spacing */
  --theme-spacing-xs: 0.25rem;
  --theme-spacing-sm: 0.5rem;
  --theme-spacing-md: 1rem;
  --theme-spacing-lg: 1.5rem;
  --theme-spacing-xl: 2rem;

  /* Border Radius */
  --theme-radius-sm: 4px;
  --theme-radius-md: 8px;
  --theme-radius-lg: 12px;

  /* Shadows */
  --theme-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --theme-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --theme-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
```

## Step 2: Update Docusaurus Configuration

Update your `docusaurus.config.js` to include the custom CSS:

```javascript
module.exports = {
  // ... other config
  stylesheets: [
    {
      href: '/css/theme-variables.css',
      type: 'text/css',
    },
    {
      href: '/css/custom.css',
      type: 'text/css',
    }
  ],
  // ... other config
};
```

## Step 3: Create Custom CSS

Create `docasaurus/src/css/custom.css` with the base theme styles:

```css
/* Apply theme to body */
body {
  background-color: var(--theme-color-background-primary) !important;
  color: var(--theme-color-text-primary);
  font-family: var(--theme-font-body);
}

/* Navbar styling */
.navbar {
  background-color: var(--theme-color-background-primary);
  border-bottom: 1px solid var(--theme-color-border);
}

.navbar__link {
  color: var(--theme-color-text-primary);
}

.navbar__link:hover,
.navbar__link--active {
  color: var(--theme-color-accent-primary);
}

/* Sidebar styling */
.menu {
  background-color: var(--theme-color-background-primary);
}

.menu__link {
  color: var(--theme-color-text-muted);
}

.menu__link--active,
.menu__link:hover {
  color: var(--theme-color-accent-primary);
  background-color: var(--theme-color-background-surface);
}

/* Footer styling */
.footer {
  background-color: var(--theme-color-background-primary);
  border-top: 1px solid var(--theme-color-border);
}

.footer__link-item {
  color: var(--theme-color-text-muted);
}

.footer__link-item:hover {
  color: var(--theme-color-accent-primary);
}

/* Code block styling */
.code-block {
  background-color: var(--theme-color-background-surface) !important;
  color: var(--theme-color-text-primary) !important;
  border: 1px solid var(--theme-color-border);
}

/* Button styling */
.button {
  background-color: var(--theme-color-accent-primary);
  color: var(--theme-color-background-primary);
  border: none;
}

.button:hover {
  background-color: var(--theme-color-accent-hover);
  box-shadow: 0 0 8px var(--theme-color-accent-primary);
}

/* Headings */
h1, h2, h3, h4, h5, h6 {
  color: var(--theme-color-accent-primary);
  font-family: var(--theme-font-heading);
}

/* Links */
a {
  color: var(--theme-color-accent-primary);
}

a:hover {
  color: var(--theme-color-accent-hover);
}
```

## Step 4: Create Chatbot Component

Create `docasaurus/src/components/Chatbot/Chatbot.jsx`:

```jsx
import React, { useState } from 'react';
import './chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

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
            <h3>Support Chat</h3>
            <button className="chatbot-close" onClick={toggleChat}>×</button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chatbot-message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chatbot-input-container">
            <input
              type="text"
              className="chatbot-input"
              placeholder="Type your message..."
            />
            <button className="chatbot-send">Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
```

## Step 5: Create Chatbot CSS

Create `docasaurus/src/css/components/chatbot.css`:

```css
.chatbot-float-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--theme-color-background-primary);
  border: 2px solid var(--theme-color-accent-primary);
  color: var(--theme-color-accent-primary);
  font-size: 24px;
  cursor: pointer;
  z-index: 1000;
  box-shadow: var(--theme-shadow-lg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.chatbot-float-button:hover {
  background: var(--theme-color-accent-primary);
  color: var(--theme-color-background-primary);
}

.chatbot-container {
  position: fixed;
  bottom: 90px;
  right: 20px;
  width: 350px;
  height: 500px;
  background: var(--theme-color-background-surface);
  border: 1px solid var(--theme-color-border);
  border-radius: var(--theme-radius-lg);
  display: flex;
  flex-direction: column;
  box-shadow: var(--theme-shadow-lg);
  z-index: 1000;
  overflow: hidden;
}

.chatbot-header {
  background: var(--theme-color-background-primary);
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--theme-color-border);
}

.chatbot-header h3 {
  margin: 0;
  color: var(--theme-color-accent-primary);
  font-family: var(--theme-font-heading);
}

.chatbot-close {
  background: none;
  border: none;
  color: var(--theme-color-text-muted);
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chatbot-close:hover {
  color: var(--theme-color-accent-primary);
}

.chatbot-messages {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.chatbot-message {
  max-width: 80%;
  padding: 10px 15px;
  border-radius: var(--theme-radius-lg);
  font-family: var(--theme-font-body);
  word-wrap: break-word;
}

.user-message {
  align-self: flex-end;
  background: var(--theme-color-background-primary);
  border: 1px solid var(--theme-color-border);
  color: var(--theme-color-text-primary);
}

.bot-message {
  align-self: flex-start;
  background: var(--theme-color-accent-primary);
  color: var(--theme-color-background-primary);
  border: 1px solid var(--theme-color-accent-primary);
}

.chatbot-input-container {
  display: flex;
  padding: 15px;
  background: var(--theme-color-background-primary);
  border-top: 1px solid var(--theme-color-border);
}

.chatbot-input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid var(--theme-color-border);
  border-radius: var(--theme-radius-md);
  background: var(--theme-color-background-surface);
  color: var(--theme-color-text-primary);
  font-family: var(--theme-font-body);
}

.chatbot-input:focus {
  outline: none;
  border-color: var(--theme-color-accent-primary);
  box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2);
}

.chatbot-send {
  margin-left: 10px;
  padding: 10px 15px;
  background: var(--theme-color-accent-primary);
  color: var(--theme-color-background-primary);
  border: none;
  border-radius: var(--theme-radius-md);
  cursor: pointer;
  font-family: var(--theme-font-body);
}

.chatbot-send:hover {
  background: var(--theme-color-accent-hover);
}
```

## Step 6: Integrate Chatbot into Layout

Update your Docusaurus layout to include the chatbot. In your main layout file or App component:

```jsx
import Chatbot from './src/components/Chatbot/Chatbot';

// In your main component:
return (
  <div>
    {/* Your existing Docusaurus content */}
    <Chatbot />
  </div>
);
```

## Step 7: Responsive Design

Add responsive styles to your CSS:

```css
/* Responsive chatbot */
@media (max-width: 768px) {
  .chatbot-container {
    width: calc(100% - 40px);
    height: 70vh;
    bottom: 80px;
    right: 20px;
    left: 20px;
  }

  .chatbot-message {
    max-width: 90%;
  }
}

@media (max-width: 480px) {
  .chatbot-container {
    width: calc(100% - 20px);
    height: 80vh;
    bottom: 70px;
    right: 10px;
    left: 10px;
  }
}
```

## Step 8: Accessibility Implementation

Ensure your theme meets accessibility standards by implementing proper contrast ratios, ARIA labels, and keyboard navigation. Test with tools like axe-core or Lighthouse.

## Step 9: Testing

1. Run your Docusaurus site: `npm run start`
2. Verify all components use the dark theme with gold accents
3. Test responsive behavior on different screen sizes
4. Verify accessibility compliance
5. Test chatbot functionality

## Next Steps

- Customize additional components as needed
- Add animations and transitions for enhanced UX
- Implement theme switching functionality if needed
- Add analytics to track user engagement with the chatbot