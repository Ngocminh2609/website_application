import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Polyfill cho SockJS/StompJS trên trình duyệt
// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (typeof (window as any).global === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).global = window;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
