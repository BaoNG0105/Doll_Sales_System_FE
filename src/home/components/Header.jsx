import {NavLink, Link } from 'react-router-dom';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import '../static/css/Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="site-name">
          <Link to="/">DOLL WORLD</Link>
        </div>
        <nav className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/dolls">Dolls</NavLink>
          <NavLink to="/emotion">Emotion</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>
        <div className="header-actions">
          <Link to="/login" className="user-action">
            <FaUser />
            <span>Login</span>
          </Link>
          <Link to="/cart" className="cart-icon">
            <FaShoppingCart size={24} />
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;