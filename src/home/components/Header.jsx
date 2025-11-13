// Header.jsx (Cập nhật)

import { useState } from 'react'; // Đã có
import { NavLink, Link, useNavigate } from 'react-router-dom'; // Đã có
import { FaUser, FaSearch, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa'; // Đã có
import '../static/css/Header.css'; // Đã có
// Redux
import { useSelector, useDispatch } from 'react-redux'; // Đã có
import { logout } from '../../redux/authSlice'; // Đã có

function Header() {
  const { isAuthenticated, username, userId } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Đalready imported
  const [menuOpen, setMenuOpen] = useState(false);
  
  // --- THÊM MỚI ---
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    dispatch(logout());
    setMenuOpen(false);
    navigate('/login');
  };

  const closeMenu = () => setMenuOpen(false);

  // --- THÊM MỚI ---
  const handleSearch = (e) => {
    e.preventDefault(); // Ngăn form submit_load lại trang
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm(''); // Xóa nội dung tìm kiếm sau khi submit
      setMenuOpen(false); // Đóng menu mobile (nếu đang mở)
    }
  };

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
          
          {/* --- CẬP NHẬT SEARCH DESKTOP --- */}
          <form className="search-container" onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Search product, character..." 
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="search-button"><FaSearch /></button>
          </form>
        </div>

        {/* Right Actions (Desktop & Mobile) */}
        <div className="header-right-actions">
          {/* ... (Phần user-menu không đổi) ... */}
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
          
          {/* --- CẬP NHẬT SEARCH MOBILE --- */}
          <form className="search-container-mobile" onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Search..." 
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="search-button"><FaSearch /></button>
          </form>
        </div>
      </div>
    </header>
  );
}

export default Header;