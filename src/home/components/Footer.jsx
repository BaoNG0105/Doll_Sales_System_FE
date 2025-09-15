import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaTiktok } from 'react-icons/fa';
import '../static/css/Footer.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section about">
                    <h2 className="footer-logo">
                        <Link to="/">DOLL WORLD</Link>
                    </h2>
                    <p>
                        Place your trusted online doll store. We offer a wide variety of dolls for all ages and occasions.
                    </p>
                </div>

                <div className="footer-section links">
                    <h3>Company</h3>
                    <ul>
                        <li><Link to="/about">About us</Link></li>
                        <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                        <li><Link to="/terms-of-service">Terms of service</Link></li>
                    </ul>
                </div>

                <div className="footer-section links">
                    <h3>Support</h3>
                    <ul>
                        <li><Link to="/faq">FAQ</Link></li>
                        <li><Link to="/order-tracking">Order Tracking</Link></li>
                        <li><Link to="/shipping-returns">Shipping & Returns</Link></li>
                        <li><Link to="/payment-options">Payment option</Link></li>
                    </ul>
                </div>

                <div className="footer-section links">
                    <h3>Products</h3>    
                    <ul>
                        <li><Link to="/dolls">Dolls</Link></li>
                        <li><Link to="/emotion">Emotion</Link></li>
                    </ul>
                </div>

                <div className="footer-section social">
                    <h3>Follow Us</h3>
                    <div className="social-icons">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebook /></a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
                        <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok"><FaTiktok /></a>
                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><FaYoutube /></a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} DOLL WORLD. All Rights Reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;