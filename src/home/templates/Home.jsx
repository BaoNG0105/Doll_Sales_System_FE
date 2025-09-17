import React, { useState, useRef, useEffect } from 'react';
import '../static/css/Home.css';
import aboutImage from '../static/img/about.png';
import Dog from '../static/img/dog.png';
import Snake from '../static/img/snake.png';
import Monkey from '../static/img/monkey.png';
import Pig from '../static/img/pig.png';
import Rabbit from '../static/img/rabbit.png';
import Tiger from '../static/img/tiger.png';

// Sample product data
const products = [
  { id: 1, name: 'Dog', price: '120.000', image: Dog },
  { id: 2, name: 'Snake', price: '150.000', image: Snake },
  { id: 3, name: 'Monkey', price: '130.000', image: Monkey },
  { id: 4, name: 'Pig', price: '180.000', image: Pig },
  { id: 5, name: 'Rabbit', price: '200.000', image: Rabbit },
  { id: 6, name: 'Tiger', price: '190.000', image: Tiger },
];

function Home() {
  const sliderRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dotsCount, setDotsCount] = useState(0);
  const [isHovering, setIsHovering] = useState(false);


  // Calculate how many "pages" of content there are
  const calculateDots = () => {
    if (sliderRef.current) {
      const { scrollWidth, clientWidth } = sliderRef.current;
      // Calculate how many "pages" of content there are
      const count = Math.ceil(scrollWidth / clientWidth);
      setDotsCount(count);
    }
  };

  // Calculate dots on mount and on window resize
  useEffect(() => {
    calculateDots();
    window.addEventListener('resize', calculateDots);
    return () => window.removeEventListener('resize', calculateDots);
  }, [products]); // Recalculate if products change

  // Auto-play effect
  useEffect(() => {
    if (dotsCount > 0 && !isHovering) {
      const interval = setInterval(() => {
        // Go to the next index, or loop back to the start
        const nextIndex = (activeIndex + 1) % dotsCount;
        if (sliderRef.current) {
          const { clientWidth } = sliderRef.current;
          sliderRef.current.scrollTo({
            left: nextIndex * clientWidth,
            behavior: 'smooth',
          });
        }
      }, 2000); // Change slide every 2 seconds

      return () => clearInterval(interval); // Cleanup interval on unmount or when dependencies change
    }
  }, [activeIndex, dotsCount, isHovering]);

  // Update active dot on scroll
  useEffect(() => {
    const slider = sliderRef.current;
    const handleScroll = () => {
      const { scrollLeft, clientWidth } = slider;
      // Find the new active index based on scroll position
      const newIndex = Math.round(scrollLeft / clientWidth);
      setActiveIndex(newIndex);
    };

    if (slider) {
      slider.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (slider) {
        slider.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const { clientWidth } = sliderRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth : clientWidth;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="video-background">
          <iframe
            src="https://www.youtube.com/embed/ZKoPbJqWOt0?autoplay=1&mute=1&loop=1&playlist=ZKoPbJqWOt0&controls=0&showinfo=0&modestbranding=1&rel=0"
            title="YouTube video player"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen>
          </iframe>
        </div>
        <div className="hero-content">
          <h1>Welcome to Our Doll Store</h1>
          <p>Discover a world of beautifully crafted dolls for every occasion.</p>
          <button className="shop-now-btn">Shop Now</button>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="about-content">
          <h2>About Our Dolls</h2>
          <p>
            At DOLL WORLD, we believe in the power of play. Our dolls are crafted with love and care, designed to inspire imagination and create lasting memories. Each doll has a unique story waiting to be told.
          </p>
          <button className="btn-secondary">Learn More</button>
        </div>
        <div className="about-image">
          <img src={aboutImage} alt="About Us" />
        </div>
      </section>

      {/* Product Section */}
      <section className="product-section">
        <h2>Featured Products</h2>
        <div
          className="product-slider-container"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="product-slider-container">
            <div className="product-slider" ref={sliderRef}>
              {products.map((product) => (
                <div key={product.id} className="product-card">
                  <img src={product.image} alt={product.name} />
                  <div className="product-card-content">
                    <h3>{product.name}</h3>
                    <p>{product.price} VNĐ</p>
                    <button className="btn-primary">Add to Cart</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="product-nav">
          <button className="nav-arrow" onClick={() => scroll('left')} disabled={activeIndex === 0}>
            &lt;
          </button>
          <div className="pagination-container">
          <div className="pagination-dots">
            {Array.from({ length: dotsCount }).map((_, index) => (
              <span key={index} className={`dot ${index === activeIndex ? 'active' : ''}`}></span>
            ))}
          </div>
          </div>
          <button className="nav-arrow" onClick={() => scroll('right')} disabled={activeIndex === dotsCount - 1}>
            &gt;
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;