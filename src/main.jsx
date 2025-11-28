import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// ▼ 이 줄이 꼭 있어야 합니다!
import { BrowserRouter } from 'react-router-dom' 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* ▼ App 컴포넌트를 BrowserRouter로 감싸주세요! */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)