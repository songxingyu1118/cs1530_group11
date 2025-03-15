import React from 'react';
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, LogIn } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function NavBar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const isLoggedIn = token && username;

  const handleLogout = () => {
    // Clear login information when you log out
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    // Go back to the home page and refresh the page to update the state
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="flex flex-col w-full">
      <div className="bg-[#382E28] relative">
        <div className="absolute top-2 right-4 flex items-center gap-2 z-10">
          {isLoggedIn && (
            <span className="text-sm font-medium text-white mr-1 hidden sm:inline">
              Welcome, {username}!
            </span>
          )}

          <Link to="/cart">
            <Button variant="outline" size="sm" className="flex items-center gap-2 bg-white hover:bg-gray-100">
              <Badge variant="secondary" className="mr-1">5</Badge>
              <ShoppingCart size={16} />
            </Button>
          </Link>

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

        <div className="flex flex-col items-center justify-center py-4">
          <span className="text-5xl md:text-8xl font-bold my-3 text-white">Logo</span>
          <div className="flex flex-col sm:flex-row justify-center gap-3 text-white text-sm md:text-base">
            <span className="mx-2">Phone: (123) 456-7890</span>
            <span className="hidden sm:inline">•</span>
            <span className="mx-2">Location: 123 Main St, City, Country</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export { NavBar };