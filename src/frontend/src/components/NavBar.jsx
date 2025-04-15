import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, LogIn, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { checkIsAdmin } from '@/utils/secureApi';

function NavBar() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState(localStorage.getItem('username'));
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Check for token and username
      const currentToken = localStorage.getItem('token');
      const currentUsername = localStorage.getItem('username');

      setToken(currentToken);
      setUsername(currentUsername);

      // Check if user is admin
      if (currentToken) {
        try {
          const adminStatus = await checkIsAdmin();
          setIsAdmin(adminStatus);
        } catch (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  const isLoggedIn = token && username;

  const handleLogout = () => {
    // Clear login information when you log out
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    // Go back to the home page and refresh the page to update the state
    navigate('/');
    window.location.reload();
  };

  const title = "IHOP";
  const logo = "https://logos-world.net/wp-content/uploads/2021/08/IHOP-Logo.png";
  const phone = "(123) 456-7890";
  const location = "123 Main St, City, Country";
  const color = "#5870e7";

  return (
    <div className="flex flex-col w-full">
      <div className="w-full" style={{ "backgroundColor": color }}>
        <div className="max-w-7xl mx-auto relative px-4">
          <div className="flex justify-between items-center pt-4">
            <div className="flex items-center">
              <Link to="/">
                <img src={logo} className="h-12 sm:h-16" alt="Logo" />
              </Link>
            </div>

            <div className="flex items-center gap-2">
              {isLoggedIn && (
                <span className="text-sm font-medium text-white mr-1 hidden sm:inline">
                  Welcome, {username}!
                </span>
              )}

              {/* Admin dashboard link - only visible to admins */}
              {isLoggedIn && isAdmin && (
                <Link to="/admin">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 bg-white hover:bg-gray-100"
                  >
                    <Settings size={16} />
                    <span className="hidden sm:inline">Admin</span>
                  </Button>
                </Link>
              )}

              {/* Cart button
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-white hover:bg-gray-100"
                onClick={() => navigate('/cart')}
              >
                <ShoppingCart size={16} />
                <span className="hidden sm:inline">Cart</span>
              </Button> */}

              {isLoggedIn ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-white hover:bg-gray-100"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              ) : (
                <Link to="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 bg-white hover:bg-gray-100"
                  >
                    <LogIn size={16} />
                    <span className="hidden sm:inline">Log In</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-center items-center py-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{title}</h1>
            <div className="flex flex-col sm:flex-row justify-center gap-3 text-white text-sm md:text-base">
              <span className="mx-2">Phone: {phone}</span>
              <span className="hidden sm:inline">•</span>
              <span className="mx-2">Location: {location}</span>
            </div>
          </div>

          <div className="absolute bottom-2 left-4">
            <span className="text-xs text-white opacity-70">{color}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export { NavBar };