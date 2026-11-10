import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx' // 這裡必須是引入 App
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App /> {/* 這裡必須是渲染 <App /> */}
  </React.StrictMode>,
)