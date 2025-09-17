import React from 'react';
import { Link } from 'react-router-dom';
import '../static/css/Menu.css';

// Import images for the cards
import dollsImage from '../static/img/menu-dolls.png';
import emotionImage from '../static/img/menu-emotion.jpg';

function Menu() {
  return (
    <div className="menu-page">
      <div className="menu-container">
        <Link to="/dolls" className="menu-card">
          <img src={dollsImage} alt="Dolls Collection" className="menu-card-img" />
          <div className="menu-card-overlay">
            <h2 className="menu-card-title">Dolls</h2>
          </div>
        </Link>
        <Link to="/emotion" className="menu-card">
          <img src={emotionImage} alt="Emotion Collection" className="menu-card-img" />
          <div className="menu-card-overlay">
            <h2 className="menu-card-title">Emotion</h2>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Menu;