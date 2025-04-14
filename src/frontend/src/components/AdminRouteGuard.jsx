import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle } from 'lucide-react';
import { checkIsAdmin } from '@/utils/secureApi';

/**
 * A component that protects admin routes by checking admin status
 * This works with the router structure from main.jsx
 */
const AdminRouteGuard = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        // Check if user is admin
        const adminStatus = await checkIsAdmin();
        setIsAdmin(adminStatus);
        setLoading(false);
      } catch (error) {
        console.error('Admin verification error:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    verifyAdmin();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin" />
          <p className="mt-2">Verifying admin privileges...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <Button className="mt-4" onClick={() => navigate('/')}>
            Go Home
          </Button>
        </Alert>
      </div>
    );
  }

  // Check if user is logged in
  const token = localStorage.getItem('token');
  if (!token) {
    // Store the attempted URL to redirect back after login
    sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
    return <Navigate to="/login" replace />;
  }

  // Check if user is admin
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You do not have administrator privileges to access this page.
          </AlertDescription>
          <Button className="mt-4" onClick={() => navigate('/')}>
            Go Home
          </Button>
        </Alert>
      </div>
    );
  }

  // User is admin, allow access to the protected route
  return children;
};

export default AdminRouteGuard;