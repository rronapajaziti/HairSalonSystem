import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/ExtraStyle.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
  
    try {
      const response = await fetch('https://localhost:7158/api/User/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }
  
      const data = await response.json();
  
      console.log('Login response:', data); 
  
      if (!data.user || !data.user.userID) {
        throw new Error('User data is missing in the response.');
      }
  
      // Store token and userId in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.user.userID);


      console.log(localStorage.getItem('token'));  
      console.log(localStorage.getItem('userId'));  


  
      navigate('/');
    } catch (error) {
      console.error('Login error occurred:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };
  
  

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-heading">Sign In</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email" className="login-label">
              Email
            </label>
            <input
              type="text"
              id="email"
              className="login-input"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
          </div>
          <div className="input-group">
            <label htmlFor="password" className="login-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="login-input"
              placeholder="********"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        {errorMessage && (
          <div className="error-message-container">
            <p className="error-message">{'Email or Password is incorrect'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignIn;
