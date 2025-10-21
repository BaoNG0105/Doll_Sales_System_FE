import React from 'react';
import { Link } from 'react-router-dom';
import '../static/css/About.css';
import about1 from '../static/img/about1.png';
import about2 from '../static/img/about2.png';
import character from '../static/img/characters.png';

function About() {
  return (
    <div className="about-container">
     <header className="about-header">
        {/* Đã xóa video background và thẻ div bao bọc */}
        <h1>About Doll World</h1>
        <p>Where every doll has a story to tell.</p>
      </header>

      <main className="about-main">
        <section className="about-section">
          <div className="about-section-image">
            <img src={about1} alt="Crafting a doll" />
          </div>
          <div className="about-section-content">
            <h2>Our Mission</h2>
            <p>
              At DOLL WORLD, we believe in the power of play. Our mission is to create beautifully crafted dolls that spark imagination, encourage creativity, and create lasting memories that will last a lifetime. We don't just sell dolls; we provide companions for your child's adventures.
            </p>
          </div>
        </section>

        <section className="about-section">
          <div className="about-section-content">
            <h2>Quality & Craftsmanship</h2>
            <p>
              Every doll at DOLL WORLD is designed with meticulous care and attention to detail. We use high-quality, safe materials to ensure that each product is not only beautiful but also durable. From the fine stitching on the clothes to the hand-painted features on the face, our commitment to quality is unwavering.
            </p>
          </div>
          <div className="about-section-image">
            {/* You can add another image here if you want */}
            <img src={about2} alt="Doll details" />
          </div>
        </section>

        <section className="about-section">
            <div className="about-section-image">
                <img src={character} alt="AI Doll Design" />
            </div>
            <div className="about-section-content">
                <h2>Innovative Designs with Character-AI</h2>
                <p>
                    At DOLL WORLD, we embrace innovation by integrating Character-AI technology into our design process. This allows us to create dolls with unique personalities and interactive features that enhance the play experience. Our AI-powered dolls can respond to touch, recognize voices, and even engage in simple conversations, making them more than just toys—they become companions that grow and learn with your child.
                </p>
            </div>
        </section>

        <section className="about-cta">
          <h2>Explore Our Collection</h2>
          <p>
            Ready to find a new friend? Explore our diverse collection of dolls and characters.
          </p>
          <Link to="/doll-type" className="btn-primary">
            Shop Now
          </Link>
        </section>
      </main>
    </div>
  );
}

export default About;