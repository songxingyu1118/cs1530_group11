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
              <img src={logo} className="h-12 sm:h-16" />
            </div>

            <div className="flex items-center gap-2">
              {isLoggedIn && (
                <span className="text-sm font-medium text-white mr-1 hidden sm:inline">
                  Welcome, {username}!
                </span>
              )}

              {/* <Link to="/cart">
                <Button variant="outline" size="sm" className="flex items-center gap-2 bg-white hover:bg-gray-100">
                  <Badge variant="secondary" className="mr-1">5</Badge>
                  <ShoppingCart size={16} />
                </Button>
              </Link> */}

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