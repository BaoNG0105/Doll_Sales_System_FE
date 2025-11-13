import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../static/css/Auth.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { postRegister } from '../../service/api.register.js';

// NEW: Define Regex patterns for validation
const usernameRegex = /^[a-zA-Z0-9_]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,100}$/;

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    fullName: '',
    password: '',
    confirmPassword: '',
    phones: '',
    age: '',
  });
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- NEW VALIDATION STEPS ---

    // 1. Validate Username
    if (!usernameRegex.test(formData.username)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Username',
        text: 'Username must contain only letters, numbers, and underscores.',
      });
      return;
    }

    // 2. Validate Password
    if (!passwordRegex.test(formData.password)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Password',
        html: `Password does not meet the requirements:<br>
               - Must be 8-100 characters long.<br>
               - Must contain at least 1 uppercase letter.<br>
               - Must contain at least 1 lowercase letter.<br>
               - Must contain at least 1 number.<br>
               - Must contain at least 1 special character.`,
      });
      return;
    }

    // --- EXISTING CHECKS ---

    // 3. Check password match
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Password Mismatch',
        text: 'The confirmation password does not match!',
      });
      return;
    }

    // 4. Check age
    const age = parseInt(formData.age, 10);
    if (!age || age < 13) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Age',
        text: 'You must be 13 years or older to register.',
      });
      return;
    }

    // 5. Prepare data
    const userData = {
      username: formData.username,
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      phones: formData.phones,
      age: age,
    };

    try {
      // 6. Call API
      await postRegister(userData);

      // 7. Success and navigation
      Swal.fire({
        icon: 'success',
        title: 'Registration Successful!',
        text: 'Your account has been created.',
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        navigate('/login');
      });
    } catch (error) {
      // 8. Handle error
      console.error('Registration error:', error);
      
      // NEW: Check for specific error message from API (optional but good)
      let errorMessage = 'An error occurred. Please try again.';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: errorMessage,
      });
    }
  };

  return (
    <div className="auth-container">
      <h1>Register</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        {/* Email */}
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        {/* User name */}
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="Create your username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        {/* Full Name */}
        <div className="input-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>
        {/* Phones */}
        <div className="input-group">
          <label htmlFor="phones">Phone Number</label>
          <input
            type="tel"
            id="phones"
            placeholder="Enter your phone number"
            value={formData.phones}
            onChange={handleChange}
            required
          />
        </div>
        {/* Age */}
        <div className="input-group">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            placeholder="Enter your age"
            value={formData.age}
            onChange={handleChange}
            required
            min="13"
          />
        </div>
        {/* Password */}
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span onClick={togglePasswordVisibility} className="password-icon">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
        {/* Confirm Password */}
        <div className="input-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
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
      <p className="switch-auth">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Register;