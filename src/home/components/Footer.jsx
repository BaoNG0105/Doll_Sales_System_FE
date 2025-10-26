import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';
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
                        <li><Link to="/contact">Contact Us</Link></li>
                    </ul>
                </div>

                <div className="footer-section links">
                    <h3>Products</h3>    
                    <ul>
                        <li><Link to="/doll-type">Dolls</Link></li>
                        <li><Link to="/characters">Characters</Link></li>
                    </ul>
                </div>

                <div className="footer-section social">
                    <h3>Follow Us</h3>
                    <div className="social-icons">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebook /></a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
                        <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok"><FaTiktok /></a>
                    </div>
                </div>

                <div className="footer-section map">
                    <h3>Our Location</h3>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1959.304746494021!2d106.8087296450207!3d10.841167104392698!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752731176b07b1%3A0xb752b24b379bae5e!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBGUFQgVFAuIEhDTQ!5e0!3m2!1svi!2s!4v1761503598405!5m2!1svi!2s"
                        className="map-iframe"
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Google Maps Location">
                    </iframe>
                </div>
                
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} DOLL WORLD. All Rights Reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;