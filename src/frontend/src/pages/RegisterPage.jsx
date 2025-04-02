import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChevronLeft, Loader2 } from "lucide-react";

function RegisterPage() {
  const navigate = useNavigate();
  // form display
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // error message and loading status
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const nameRegex = /^[A-Za-z]+$/;               // only english letters
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // email format
  const passwordRegex = /^[A-Za-z0-9]{8,}$/;      // password format

  // go back button
  const handleGoBackToLogin = () => {
    navigate('/login');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!nameRegex.test(name)) {
      setError('Name must contain only English letters (A-Za-z).');
      return;
    }
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters long (letters or digits).');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name,
        email,
        password,
      };

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Registration failed. Please try again.');
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log('Registration success!', data);

      navigate('/login');
    } catch (err) {
      console.error(err);
      setError('An error occurred during registration.');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          className="mb-4 flex items-center"
          onClick={handleGoBackToLogin}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Go Back To Login
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Register</CardTitle>
            <CardDescription className="text-center">
              Create a new account to get started
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  'Register'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default RegisterPage;