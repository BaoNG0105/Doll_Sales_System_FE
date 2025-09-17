import React from 'react';
import { Link } from 'react-router-dom';
import '../static/css/Error.css';

function Error() {
  return (
    <div className="error-page">
      <div className="error-container">
        <div className="error-text">
          <h1 className="error-title">404</h1>
        </div>
        <h2 className="error-subtitle">Oops! Page Not Found.</h2>
        <p className="error-description">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/" className="error-home-link">
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}

export default Error;