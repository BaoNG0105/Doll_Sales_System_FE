import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../static/css/Auth.css';
import { FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../config/firebase';
import { postGoogleLogin } from '../api/api.login';

function Login() {
  const navigate = useNavigate();
  // 1. Thêm state để quản lý việc hiển thị password
  const [showPassword, setShowPassword] = useState(false);

  // 2. Hàm để bật/tắt hiển thị password
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // 3. Hàm xử lý đăng nhập bằng Google
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      
      // Gửi idToken đến backend
      const response = await postGoogleLogin(idToken);
      
      console.log('Backend response:', response);
      // Xử lý sau khi đăng nhập thành công (ví dụ: lưu token, chuyển hướng)
      // localStorage.setItem('userToken', response.token);
      navigate('/'); // Chuyển hướng về trang chủ
    } catch (error) {
      console.error('Error during Google login:', error);
    }
  };

  return (
    <div className="auth-container">
      <h1>Login</h1>
      <form className="auth-form">
        {/* User name */}
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" placeholder="Enter your username" />
        </div>
        {/* Password */}
        <div className="input-group">
          <label htmlFor="password">Password</label>
          {/* 3. Bọc input và icon vào một div để định vị */}
          <div className="password-wrapper">
            <input
              // 4. Thay đổi type của input dựa vào state
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Enter your password"
            />
            {/* 5. Icon có sự kiện onClick để gọi hàm toggle */}
            <span onClick={togglePasswordVisibility} className="password-icon">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
        {/* Form otion: remember me and forgot password */}
        <div className="form-options">
          <div className="remember-me">
            <input type="checkbox" id="remember-me" />
            <label htmlFor="remember-me">Remember me</label>
          </div>
          <div className="forgot-password">
            <Link to="/reset-password">Forgot Password?</Link>
          </div>
        </div>
        {/* Button login */}
        <button type="submit" className="auth-button">
          Login
        </button>
        {/* OR */}
        <div className="separator">
          <span>OR</span>
        </div>
        {/* Button login with google */}
        <button type="button" className="google-login-button" onClick={handleGoogleLogin}>
          <FaGoogle className="google-icon" /> Login with Google
        </button>
      </form>
      {/* Switch to register page */}
      <p className="switch-auth">
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;