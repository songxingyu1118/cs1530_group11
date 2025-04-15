import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Loader2 } from "lucide-react";
import { encrypt, decrypt, getSessionId, isInitialized, initializeECDH } from '@/security/ecdhclient';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [securityInitialized, setSecurityInitialized] = useState(false);

  // Initialize ECDH when component mounts
  useEffect(() => {
    const setupSecurity = async () => {
      try {
        if (!isInitialized()) {
          await initializeECDH();
        }
        setSecurityInitialized(true);
      } catch (err) {
        console.error('Failed to initialize security:', err);
        setError('Failed to initialize secure connection. Please try refreshing the page.');
      }
    };

    setupSecurity();
  }, []);

  const handleGoBack = () => {
    navigate('/');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!securityInitialized) {
      setError('Secure connection not established. Please wait or refresh the page.');
      setLoading(false);
      return;
    }

    try {
      // Create credentials object
      const credentials = JSON.stringify({
        email,
        password
      });

      // Encrypt the credentials
      const encryptedCredentials = await encrypt(credentials);

      // Get the session ID
      const sessionId = getSessionId();

      if (!sessionId) {
        throw new Error('No session ID available. Security not properly initialized.');
      }

      // Create the secure login request
      const payload = {
        sessionId,
        encryptedCredentials
      };

      console.log('Sending secure login request with session ID:', sessionId);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 400) {
          setError('Session expired or invalid. Please refresh the page and try again.');
        } else {
          const errorData = await response.json().catch(() => ({}));
          setError(errorData.message || 'Login failed. Please check your credentials.');
        }
        setLoading(false);
        return;
      }

      const data = await response.json();

      try {
        // Decrypt the encrypted token
        console.log('Decrypting token...');
        const decryptedToken = await decrypt(data.token);
        console.log('Token decrypted successfully');

        // Store the decrypted token
        localStorage.setItem('token', decryptedToken);

        // Get the current user using the decrypted token
        const userResponse = await fetch(`/api/auth/users/me?token=${encodeURIComponent(decryptedToken)}`);
        if (userResponse.ok) {
          const userData = await userResponse.json();
          localStorage.setItem('username', userData.name);
          console.log('User data retrieved successfully:', userData.name);
        } else {
          console.error('Failed to fetch user data:', userResponse.status);
        }
      } catch (err) {
        console.error('Error processing token:', err);
        setError(`Error processing login response: ${err.message}`);
        setLoading(false);
        return;
      }

      console.log("Login Success!");
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError(`An error occurred during login: ${err.message}`);
    }
    setLoading(false);
  };

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
                disabled={loading || !securityInitialized}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : !securityInitialized ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Initializing secure connection...
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