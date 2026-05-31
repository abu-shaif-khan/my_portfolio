import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Silently handle and suppress HMR websocket connection errors in developmental sandboxes
if (typeof window !== 'undefined' && (import.meta as any).env?.DEV) {
  const OriginalWebSocket = window.WebSocket;
  class SafeWebSocket extends OriginalWebSocket {
    constructor(url: string | URL, protocols?: string | string[]) {
      try {
        super(url, protocols);
        this.addEventListener('error', (event) => {
          // Prevent browser console complaining about Vite HMR disconnection
          if (typeof url === 'string' && (url.includes('vite') || url.includes('hmr') || url.includes('ws://') || url.includes('wss://'))) {
            event.stopImmediatePropagation();
            event.preventDefault();
          }
        });
      } catch (err) {
        // Silently digest initialization errors in proxy setups
      }
    }
  }
  
  // Inject the safe wrapper globally
  try {
    Object.defineProperty(window, 'WebSocket', {
      value: SafeWebSocket,
      configurable: true,
      writable: true,
    });
  } catch (e) {
    // If WebSocket is read-only or non-redefinable, gracefully handle via window error listeners
  }

  // Intercept uncaught events related to WebSocket or HMR failures
  window.addEventListener('error', (e) => {
    const errorMsg = e.message || '';
    if (errorMsg.toLowerCase().includes('websocket') || errorMsg.toLowerCase().includes('vite')) {
      e.stopImmediatePropagation();
      e.preventDefault();
    }
  }, true);

  window.addEventListener('unhandledrejection', (e) => {
    const reasonStr = String(e.reason || '');
    if (reasonStr.toLowerCase().includes('websocket') || reasonStr.toLowerCase().includes('vite')) {
      e.stopImmediatePropagation();
      e.preventDefault();
    }
  }, true);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
