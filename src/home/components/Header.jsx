import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { FaUser, FaSearch, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import '../static/css/Header.css';
// Redux
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';

function Header() {
  const { isAuthenticated, username, userId } = useSelector((state) => state.auth); // Lấy thêm userId
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setMenuOpen(false); // Close menu on logout
    navigate('/login'); // Redirect to login page after logout
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header">
      <div className="header-container">
        <div className="site-name">
          <Link to="/" onClick={closeMenu}>DOLL WORLD</Link>
        </div>

        {/* Desktop Navigation */}
        <div className="desktop-nav">
          <nav className="nav-links">
            <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>Home</NavLink>
            <NavLink to="/doll-type" className={({ isActive }) => (isActive ? 'active' : '')}>Dolls</NavLink>
            <NavLink to="/characters" className={({ isActive }) => (isActive ? 'active' : '')}>Characters</NavLink>
            <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>About</NavLink>
            <NavLink to="/contact" className={({ isActive }) => (isActive ? 'active' : '')}>Contact</NavLink>
          </nav>
          <div className="search-container">
            <input type="text" placeholder="Search a product ..." className="search-input" />
            <button className="search-button"><FaSearch /></button>
          </div>
        </div>

        {/* Right Actions (Desktop & Mobile) */}
        <div className="header-right-actions">
          <div className="header-actions">
            {isAuthenticated ? (
              <div className="user-menu">
                <Link to={`/profile/${userId}`} className="user-action">{username || 'user'}</Link>
                <button onClick={handleLogout} className="logout-button"><FaSignOutAlt size={22} /></button>
              </div>
            ) : (
              <Link to="/login" className="user-action"><FaUser /></Link>
            )}
          </div>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`mobile-nav ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeMenu}>Home</NavLink>
          <NavLink to="/doll-type" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeMenu}>Dolls</NavLink>
          <NavLink to="/characters" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeMenu}>Characters</NavLink>
          <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeMenu}>About</NavLink>
          <NavLink to="/contact" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeMenu}>Contact</NavLink>
          <div className="search-container-mobile">
            <input type="text" placeholder="Search..." className="search-input" />
            <button className="search-button"><FaSearch /></button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;