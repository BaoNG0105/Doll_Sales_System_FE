import { Link } from 'react-router-dom';
import { useState } from 'react';
import '../static/css/Auth.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Register() {
  // 1. Thêm state để quản lý việc hiển thị password
  const [showPassword, setShowPassword] = useState(false);

  // 2. Hàm để bật/tắt hiển thị password
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="auth-container">
      <h1>Register</h1>
      <form className="auth-form">
        {/* Email */}
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" placeholder="Enter your email" />
        </div>
        {/* User name */}
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" placeholder="Create your username" />
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
        {/* Confirm Password */}
        <div className="input-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          {/* 3. Bọc input và icon vào một div để định vị */}
          <div className="password-wrapper">
            <input
              // 4. Thay đổi type của input dựa vào state
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              placeholder="Confirm your password"
            />
            {/* 5. Icon có sự kiện onClick để gọi hàm toggle */}
            <span onClick={togglePasswordVisibility} className="password-icon">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
        {/* Button register */}
        <button type="submit" className="auth-button">
          Register
        </button>
      </form>
      {/* Switch to login page */}
      <p className="switch-auth">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Register;