import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';

// Iframe sandbox survive helper: polyfill localStorage if it is blocked or throws SecurityError
try {
  const dummy = window.localStorage;
} catch (e) {
  console.warn('[Sandbox Guard] localStorage is blocked or throws SecurityError. Applying memory fallback:', e);
  const storageCache: Record<string, string> = {};
  const mockStorage = {
    getItem: (key: string) => (key in storageCache ? storageCache[key] : null),
    setItem: (key: string, value: string) => { storageCache[key] = String(value); },
    removeItem: (key: string) => { delete storageCache[key]; },
    clear: () => { for (const key in storageCache) delete storageCache[key]; },
    key: (index: number) => Object.keys(storageCache)[index] || null,
    get length() { return Object.keys(storageCache).length; }
  };
  try {
    Object.defineProperty(window, 'localStorage', {
      value: mockStorage,
      writable: true,
      configurable: true
    });
  } catch (err) {
    console.error('[Sandbox Guard] Failed to patch localStorage:', err);
  }
}

import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
