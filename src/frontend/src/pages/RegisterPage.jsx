import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '@/css/RegisterPage.scss';

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

    // Authen
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
      // format
      const payload = {
        name,
        email,
        password,
      };

      // registeration submit
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // error messgae
        const errorData = await response.json();
        setError(errorData.message || 'Registration failed. Please try again.');
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log('Registration success!', data);

      // jump to login after successful registed
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError('An error occurred during registration.');
    }
    setLoading(false);
  };

  return (
    <div className="register-page">
      <button className="go-back" onClick={handleGoBackToLogin}>
        Go Back To Login
      </button>
      <div className="register-container">
        <h2>Welcome to Register Page!</h2>

        {/* error message */}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleRegister}>
          {/* Name */}
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* submit button */}
          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
