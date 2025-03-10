import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router';
import './css/index.css'
import HomePage from '@/pages/HomePage.jsx'
import LoginPage from '@/pages/LoginPage.jsx'
import RegisterPage from '@/pages/RegisterPage.jsx'
import Cart from '@/pages/Cart.jsx'


createRoot(document.getElementById('root')).render(
  <div>
    {/* Content placed here will appear on every page */}
    <div className="gutters bg-[#f4f4f4]">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </BrowserRouter>
    </div>
  </div>
  
  
)
