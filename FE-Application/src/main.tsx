import { createRoot } from 'react-dom/client'
import './index.css'

// Polyfill cho SockJS/StompJS trên trình duyệt
// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (typeof (window as any).global === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).global = window;
}

import App from './App'

createRoot(document.getElementById('root')!).render(
  <App />
)
