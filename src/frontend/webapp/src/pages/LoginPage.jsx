import { useState } from 'react'
//import { LoremIpsum } from "@/components/LoremIpsum"
import '@/css/LoginPage.scss';
import { useNavigate } from 'react-router-dom';

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

    const payload = {
      email: email,
      password: password,
    };

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
      console.log("Login Success!", data);
      navigate('/'); // go to home page after successful login
      
    } catch (err) {
      console.error(err);
      setError('An error occurred during login');
    }
    setLoading(false);
  };

  // add register button jump to register
  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="login-page">
      <button className="go-back" onClick={handleGoBack}>Go Back</button>
      <div className="login-container">
        <h2>Welcome Back！</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Please enter Email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Please enter password"
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>

        {/*（or）*/}
        <div className="separator">---------------------- or ----------------------</div>

        {/* message and Register button */}
        <p className="register-text">Don't have an account? Go to Register</p>
        <button className="register-button" onClick={handleRegister}>
          Register
        </button>
      </div>
    </div>
  );
}

export default LoginPage
