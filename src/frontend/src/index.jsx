import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import './index.css';
import HomePage from '@/pages/HomePage.jsx';
import LoginPage from '@/pages/LoginPage.jsx';
import RegisterPage from '@/pages/RegisterPage.jsx';
import Cart from '@/pages/Cart.jsx';
import { Footer } from '@/components/Footer';
import { Separator } from '@/components/ui/separator';

const MainWrapper = ({ children }) => {
  return (
    <div className='p-4 container max-w-6xl mx-auto'>
      {children}
      <Separator className="my-8" />
      <Footer />
    </div>
  );
};

createRoot(document.getElementById('root')).render(
  <div>
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainWrapper><HomePage /></MainWrapper>} />
          <Route path="/cart" element={<MainWrapper><Cart /></MainWrapper>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  </div>
);
