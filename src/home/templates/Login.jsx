import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../static/css/Auth.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { postGoogleLogin, postLogin } from '../../service/api.login'; // Import postLogin
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/authSlice';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      const response = await postGoogleLogin(idToken);
      
      console.log('Backend response:', response);
      dispatch(loginSuccess(response));
      navigate('/');
    } catch (error) {
      console.error('Error during Google login:', error);
      setError('Google login failed. Please try again.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Reset error message
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }
    try {
      const credentials = { username, password };
      const response = await postLogin(credentials);

      console.log('Login successful:', response);

      // Store tokens and user info in Redux store
      dispatch(loginSuccess(response));

      // Navigate to home page
      navigate('/');
    } catch (err) {
      console.error('Login failed:', err);
      setError('Invalid username or password. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <h1>Login</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="password-icon" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
        <div className="form-options">
          <div className="remember-me">
            <input type="checkbox" id="remember-me" />
            <label htmlFor="remember-me">Remember me</label>
          </div>
          <div className="forgot-password">
            <Link to="/reset-password">Forgot Password?</Link>
          </div>
        </div>
        <button type="submit" className="auth-button">
          Login
        </button>
        <div className="separator">
          <span>OR</span>
        </div>
        <button type="button" className="google-login-button" onClick={handleGoogleLogin}>
          <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262" width="20" height="20" style={{ marginRight: '10px' }}>
            <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.686H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
            <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
            <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.8-4.351-25.82 0-9.02 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"></path>
            <path fill="#EB4335" d="M130.55 50.479c19.205 0 36.344 6.698 50.073 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
          </svg>
          <span>Login with Google</span>
        </button>
      </form>
      <p className="switch-auth">
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;