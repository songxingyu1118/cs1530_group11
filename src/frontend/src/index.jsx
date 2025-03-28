import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { useState, useEffect } from 'react';
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
import { initializeECDH, isInitialized } from '@/security/ecdhclient';
import '@/index.css';

// Create the loading overlay
const createLoadingOverlay = () => {
  const overlay = document.createElement('div');
  overlay.id = 'security-loading-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.zIndex = '9999';
  overlay.style.fontFamily = 'Arial, sans-serif';
  overlay.innerHTML = `<div style="text-align: center; padding: 20px; background-color: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    <div style="margin-bottom: 15px; font-weight: bold;">Establishing secure connection...</div>
    <div style="width: 40px; height: 40px; border: 3px solid #f3f3f3; border-top: 3px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
  </div>
  <style>
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>`;
  return overlay;
};

const createErrorOverlay = (message) => {
  const overlay = document.createElement('div');
  overlay.id = 'security-error-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.zIndex = '9999';
  overlay.style.fontFamily = 'Arial, sans-serif';
  overlay.innerHTML = `<div style="text-align: center; padding: 20px; background-color: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    <div style="margin-bottom: 15px; color: #e74c3c;">Security Error</div>
    <div style="margin-bottom: 20px;">${message}</div>
    <button onclick="window.location.reload()" style="background-color: #3498db; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">Retry</button>
  </div>`;
  return overlay;
};

// Main wrapper component
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

// Create router
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

// Root component with security initialization
const AppRoot = () => {
  const [securityReady, setSecurityReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initSecurity = async () => {
      // Show loading overlay
      const loadingOverlay = createLoadingOverlay();
      document.body.appendChild(loadingOverlay);

      try {
        // Check for existing sessionId in localStorage
        const storedSessionId = localStorage.getItem('ecdh_session_id');

        // If already initialized, skip
        if (isInitialized()) {
          console.log('Security already initialized');
          setSecurityReady(true);
          document.body.removeChild(loadingOverlay);
          return;
        }

        console.log('Initializing secure communication...');
        const result = await initializeECDH();

        if (result) {
          // Store the session ID in localStorage for potential later use
          const sessionId = localStorage.getItem('ecdh_session_id');
          if (!sessionId) {
            localStorage.setItem('ecdh_session_id', result.sessionId);
          }
          console.log('Security initialized successfully');
          setSecurityReady(true);
        } else {
          throw new Error('Security initialization failed');
        }
      } catch (error) {
        console.error('Failed to initialize security:', error);
        setError(error.message || 'Failed to establish secure connection');
      } finally {
        // Remove loading overlay
        if (document.body.contains(loadingOverlay)) {
          document.body.removeChild(loadingOverlay);
        }
      }
    };

    initSecurity();
  }, []);

  // Show error overlay if there's an error
  useEffect(() => {
    if (error) {
      const errorOverlay = createErrorOverlay(error);
      document.body.appendChild(errorOverlay);

      return () => {
        if (document.body.contains(errorOverlay)) {
          document.body.removeChild(errorOverlay);
        }
      };
    }
  }, [error]);

  // Render app once security is ready
  if (securityReady) {
    return (
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    );
  }
  return <div id="initializing"></div>;
};

// Render the root component
ReactDOM.createRoot(document.getElementById('root')).render(<AppRoot />);