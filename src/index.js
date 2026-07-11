import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const rootElement = document.getElementById('root');

const PRERENDERED_PATHS = ['/', '/about', '/projects', '/blog', '/certificates', '/contact'];
const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
const isPrerendered = PRERENDERED_PATHS.includes(currentPath);

const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

try {
  if (rootElement.hasChildNodes() && isPrerendered) {
    hydrateRoot(rootElement, app);
  } else {
    rootElement.innerHTML = '';
    createRoot(rootElement).render(app);
  }
} catch {
  rootElement.innerHTML = '';
  createRoot(rootElement).render(app);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
