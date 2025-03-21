import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { Navigate, Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';

import HomePage from '@/pages/HomePage.jsx';
import LoginPage from '@/pages/LoginPage.jsx';
import RegisterPage from '@/pages/RegisterPage.jsx';
import Cart from '@/pages/Cart.jsx';
import FullMenuItem from '@/pages/FullMenuItem.jsx';
import FourOFour from '@/pages/FourOFour.jsx';
import AdminPage from '@/pages/AdminPage.jsx';

import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { Separator } from '@/components/ui/separator';
import '@/index.css';

const MainWrapper = () => {
  return (
    <>
      <NavBar />
      <div className='p-4 container max-w-7xl mx-auto'>
        <Outlet />
        <Separator className="my-8" />
        <Footer />
      </div>
    </>
  );
};

const BASE_URL = import.meta.env.BASE_URL || '/';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <MainWrapper />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'cart', element: <Cart /> },
      ],
    },
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/register',
      element: <RegisterPage />,
    },
    {
      path: '/logout',
      element: <Navigate to='/login' replace />,
    },
    {
      path: '/menu/:id',
      element: <MainWrapper />,
      children: [
        { index: true, element: <FullMenuItem /> },
      ],
    },
    {
      path: '*',
      element: <FourOFour />,
    },
    {
      path: '/admin',
      element: <AdminPage />,
    },
  ],
  {
    basename: BASE_URL,
  }
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
