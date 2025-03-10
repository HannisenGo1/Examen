import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './cssFiles/index.css'
import App from './App.tsx'
import './cssFiles/App.css'
import './cssFiles/front.css'
import './cssFiles/mediaQ.css'
import './cssFiles/mediaQ320.css'
import './cssFiles/registerAccount.css'
import './cssFiles/findpartner.css'
import './cssFiles/messages.css'
import './cssFiles/shop.css'
import './cssFiles/useinfo.css'
import './cssFiles/report.css'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
