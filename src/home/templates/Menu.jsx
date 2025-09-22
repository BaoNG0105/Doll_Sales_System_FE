import React from 'react';
import { Link } from 'react-router-dom';
import '../static/css/Menu.css';

// Import images for the cards
import dollsImage from '../static/img/dolls.png';
import charactersImage from '../static/img/characters.png';

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
        <Link to="/characters" className="menu-card">
          <img src={charactersImage} alt="Characters Collection" className="menu-card-img" />
          <div className="menu-card-overlay">
            <h2 className="menu-card-title">Characters</h2>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Menu;