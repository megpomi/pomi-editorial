// Entry point. Kept deliberately free of side effects beyond mounting the app.
// Module graph revision: 2026-11-17 (busts a stale preview module cache).
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)