import React from 'react';
import { Link } from 'react-router-dom';
import '../static/css/Menu.css'; // Tái sử dụng CSS của trang Menu

// Import images for the cards
import labubuImage from '../static/img/labubu1.jpg';
import babythreeImage from '../static/img/babythree.png';

function Dolls() {
  return (
    <div className="menu-page">
      <div className="menu-container">
        <Link to="/dolls/labubu" className="menu-card">
          <img src={labubuImage} alt="Labubu Collection" className="menu-card-img" />
          <div className="menu-card-overlay">
            <h2 className="menu-card-title">Labubu</h2>
          </div>
        </Link>
        <Link to="/dolls/babythree" className="menu-card">
          <img src={babythreeImage} alt="Babythree Collection" className="menu-card-img" />
          <div className="menu-card-overlay">
            <h2 className="menu-card-title">Babythree</h2>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Dolls;