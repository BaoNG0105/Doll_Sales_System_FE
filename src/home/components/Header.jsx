import {NavLink, Link } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSearch } from 'react-icons/fa';
import '../static/css/Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <div className="site-name">
            <Link to="/">DOLL WORLD</Link>
          </div>
          <nav className="nav-links">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/dolls">Dolls</NavLink>
            <NavLink to="/characters">Characters</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </nav>
        </div>
        <div className="header-right">
          <div className="search-container">
            <input type="text" placeholder="Search a product ..." className="search-input"/>
            <button className="search-button">
              <FaSearch />
            </button>
          </div>
          <div className="header-actions">
            <Link to="/login" className="user-action">
              <FaUser />
            </Link>
            <Link to="/cart" className="cart-icon">
              <FaShoppingCart size={24} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;