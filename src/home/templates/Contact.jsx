import React from 'react';
import '../static/css/Contact.css';
import hcmImage from '../static/img/contact1.jpg';
import hanoiImage from '../static/img/contact2.jpg';
import { FaEnvelope, FaPhone, FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';

function Contact() {
    return (
        <div className="contact-container">
            <header className="contact-header">
                <h1>Our Stores</h1>
                <p>Find a Doll World store near you.</p>
            </header>

            <main className="contact-main">
                <div className="store-cards-container">
                    <div className="store-card">
                        <img src={hanoiImage} alt="Hanoi Store" className="store-image" />
                        <div className="store-info">
                            <h2>Doll World - Hanoi</h2>
                            <p><strong>Address:</strong> Vincom Center Pham Ngoc Thach, No. 2 Pham Ngoc Thach Street, Dong Da District, Hanoi, Vietnam</p>
                            <p><strong>Phone:</strong> +84 24 3333 4444</p>
                        </div>
                    </div>

                    <div className="store-card">
                        <img src={hcmImage} alt="Ho Chi Minh City Store" className="store-image" />
                        <div className="store-info">
                            <h2>Doll World - Ho Chi Minh City</h2>
                            <p><strong>Address:</strong> 456 Nguyen Hue Boulevard, District 1, Ho Chi Minh City, Vietnam</p>
                            <p><strong>Phone:</strong> +84 28 5555 6666</p>
                        </div>
                    </div>
                </div>

                <section className="contact-info-section">
                    <h2>Get In Touch</h2>
                    <div className="contact-details">
                        <p><FaEnvelope /> <strong>Email:</strong> support@dollworld.com</p>
                        <p><FaPhone /> <strong>Hotline:</strong> 1900 1234</p>
                    </div>
                    <div className="social-media-icons">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                        <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok"><FaTiktok /></a>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Contact;