import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const rootElement = document.getElementById('root');

const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Prerender edilmiş HTML arama motorları ve sosyal önizlemeler içindir. Hydrate edilmez:
// animasyonlar (typewriter, framer-motion) ve async veri, prerender anındaki DOM'la ilk
// istemci render'ını farklılaştırıp React #418 hatası üretiyordu. Sıfırdan render ederiz.
rootElement.innerHTML = '';
createRoot(rootElement).render(app);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
