import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Loader2 } from "lucide-react";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoBack = () => {
    navigate('/');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = { email, password };

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Login failed, please check your email and password');
        setLoading(false);
        return;
      }
      const data = await response.json();
      localStorage.setItem('token', data.token);

      // Get the current user by token {id, name, email}
      try {
        const userResponse = await fetch(`/api/auth/users/me?token=${data.token}`);
        if (userResponse.ok) {
          const userData = await userResponse.json();
          // Store the username in localStorage so the NavBar can read it
          localStorage.setItem('username', userData.name);
        }
      } catch (userFetchErr) {
        console.error('Failed to fetch user info:', userFetchErr);
      }

      console.log("Login Success!", data);
      // go back to home
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('An error occurred during login');
    }
    setLoading(false);
  };

  // go to register
  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          className="mb-4 flex items-center"
          onClick={handleGoBack}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Welcome Back!</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Please enter Email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Please enter password"
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
                    Loading...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </form>
          </CardContent>

          <div className="px-6 pb-2">
            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                or
              </span>
            </div>
          </div>

          <CardFooter className="flex-col space-y-4 pt-4">
            <p className="text-sm text-center text-muted-foreground">
              Don't have an account?
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleRegister}
            >
              Register
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default LoginPage;
