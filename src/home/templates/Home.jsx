import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../static/css/Home.css';
import aboutImage from '../static/img/about.png';

// Import doll images
import Dog from '../static/img/dog.png';
import Snake from '../static/img/snake.png';
import Monkey from '../static/img/monkey.png';
import Pig from '../static/img/pig.png';
import Rabbit from '../static/img/rabbit.png';
import Tiger from '../static/img/tiger.png';
import backgroundVideo from '../static/video/poster.mp4';

// Import character images
import J97 from '../static/img/j97.jpg';
import SonTung from '../static/img/sontung.jpg';
import Linh from '../static/img/Linh.png';
import Khoa from '../static/img/Khoa.png';
import Bao from '../static/img/Bao.png';

// Sample product data
const products = [
  { id: 1, name: 'Dog', price: '120.000', image: Dog },
  { id: 2, name: 'Snake', price: '150.000', image: Snake },
  { id: 3, name: 'Monkey', price: '130.000', image: Monkey },
  { id: 4, name: 'Pig', price: '180.000', image: Pig },
  { id: 5, name: 'Rabbit', price: '200.000', image: Rabbit },
  { id: 6, name: 'Tiger', price: '190.000', image: Tiger },
];

// Sample character data from Characters.jsx
const characters = [
  { id: 1, name: 'AI Linh Nguyen', price: '135.000', image: Linh },
  { id: 2, name: 'AI Khoa Cao', price: '175.000', image: Khoa },
  { id: 3, name: 'AI Bao', price: '100.000', image: Bao },
  { id: 4, name: 'AI Jack-J97', price: '5.000.000', image: J97 },
  { id: 5, name: 'AI Son Tung M-TP', price: '2.000.000.000', image: SonTung },
];

function Home() {
  // State and Refs for Product Slider
  const productSliderRef = useRef(null);
  const [productActiveIndex, setProductActiveIndex] = useState(0);
  const [productDotsCount, setProductDotsCount] = useState(0);
  const [isProductHovering, setIsProductHovering] = useState(false);

  // State and Refs for Character Slider
  const charSliderRef = useRef(null);
  const [charActiveIndex, setCharActiveIndex] = useState(0);
  const [charDotsCount, setCharDotsCount] = useState(0);
  const [isCharHovering, setIsCharHovering] = useState(false);

  // State and Ref for About Section Animation
  const aboutSectionRef = useRef(null);
  const [isAboutVisible, setIsAboutVisible] = useState(false);

  // --- LOGIC FOR ABOUT SECTION ANIMATION ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        // Update state based on whether the element is intersecting the viewport
        setIsAboutVisible(entry.isIntersecting);
      },
      {
        root: null, // observing intersections relative to the viewport
        rootMargin: '0px',
        threshold: 0.2, // Trigger when 20% of the element is visible
      }
    );

    const currentRef = aboutSectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // --- LOGIC FOR PRODUCT SLIDER ---
  const calculateProductDots = () => {
    if (productSliderRef.current) {
      const { scrollWidth, clientWidth } = productSliderRef.current;
      const count = Math.ceil(scrollWidth / clientWidth);
      setProductDotsCount(count);
    }
  };

  useEffect(() => {
    calculateProductDots();
    window.addEventListener('resize', calculateProductDots);
    return () => window.removeEventListener('resize', calculateProductDots);
  }, [products]);

  useEffect(() => {
    if (productDotsCount > 0 && !isProductHovering) {
      const interval = setInterval(() => {
        const nextIndex = (productActiveIndex + 1) % productDotsCount;
        if (productSliderRef.current) {
          const { clientWidth } = productSliderRef.current;
          productSliderRef.current.scrollTo({ left: nextIndex * clientWidth, behavior: 'smooth' });
        }
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [productActiveIndex, productDotsCount, isProductHovering]);

  useEffect(() => {
    const slider = productSliderRef.current;
    const handleScroll = () => {
      const { scrollLeft, clientWidth } = slider;
      const newIndex = Math.round(scrollLeft / clientWidth);
      setProductActiveIndex(newIndex);
    };
    if (slider) slider.addEventListener('scroll', handleScroll);
    return () => { if (slider) slider.removeEventListener('scroll', handleScroll); };
  }, []);

  const scrollProducts = (direction) => {
    if (productSliderRef.current) {
      const { clientWidth } = productSliderRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth : clientWidth;
      productSliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // --- LOGIC FOR CHARACTER SLIDER ---
  const calculateCharDots = () => {
    if (charSliderRef.current) {
      const { scrollWidth, clientWidth } = charSliderRef.current;
      const count = Math.ceil(scrollWidth / clientWidth);
      setCharDotsCount(count);
    }
  };

  useEffect(() => {
    calculateCharDots();
    window.addEventListener('resize', calculateCharDots);
    return () => window.removeEventListener('resize', calculateCharDots);
  }, [characters]);

  useEffect(() => {
    if (charDotsCount > 0 && !isCharHovering) {
      const interval = setInterval(() => {
        const nextIndex = (charActiveIndex + 1) % charDotsCount;
        if (charSliderRef.current) {
          const { clientWidth } = charSliderRef.current;
          charSliderRef.current.scrollTo({ left: nextIndex * clientWidth, behavior: 'smooth' });
        }
      }, 2500); // Use a different interval time
      return () => clearInterval(interval);
    }
  }, [charActiveIndex, charDotsCount, isCharHovering]);

  useEffect(() => {
    const slider = charSliderRef.current;
    const handleScroll = () => {
      const { scrollLeft, clientWidth } = slider;
      const newIndex = Math.round(scrollLeft / clientWidth);
      setCharActiveIndex(newIndex);
    };
    if (slider) slider.addEventListener('scroll', handleScroll);
    return () => { if (slider) slider.removeEventListener('scroll', handleScroll); };
  }, []);

  const scrollCharacters = (direction) => {
    if (charSliderRef.current) {
      const { clientWidth } = charSliderRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth : clientWidth;
      charSliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };


  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="video-background">
          <video autoPlay loop muted playsInline>
            <source src={backgroundVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="hero-content">
          <h1>Welcome to Doll World</h1>
          <p>Discover a world of beautifully crafted dolls for every occasion.</p>
          <Link to="/products">
            <button className="shop-now-btn">Shop now</button>
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section
        ref={aboutSectionRef}
        className={`about-section ${isAboutVisible ? 'is-visible' : ''}`}
      >
        <div className="about-content">
          <h2>About Our Dolls</h2>
          <p>
            At DOLL WORLD, we believe in the power of play. Our dolls are crafted with love and care, designed to inspire imagination and create lasting memories. Each doll has a unique story waiting to be told.
          </p>
          <Link to="/about">
            <button className="btn-secondary">Learn More</button>
          </Link>
        </div>
        <div className="about-image">
          <img src={aboutImage} alt="About Us" />
        </div>
      </section>

      {/* Doll Section */}
      <section className="product-section">
        <h2>Featured Products</h2>
        <div
          className="product-slider-container"
          onMouseEnter={() => setIsProductHovering(true)}
          onMouseLeave={() => setIsProductHovering(false)}
        >
          <div className="product-slider" ref={productSliderRef}>
            {products.map((product) => (
              <Link to={`/dolls/${product.id}`} key={product.id} className="product-card">
              <div key={product.id} className="product-card">
                <img src={product.image} alt={product.name} />
                <div className="product-card-content">
                  <h3>{product.name}</h3>
                  <p>{product.price} VNĐ</p>
                  <button className="btn-primary">Add to Cart</button>
                </div>
              </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="product-nav">
          <button className="nav-arrow" onClick={() => scrollProducts('left')} disabled={productActiveIndex === 0}>
            &lt;
          </button>
          <div className="pagination-container">
            <div className="pagination-dots">
              {Array.from({ length: productDotsCount }).map((_, index) => (
                <span key={index} className={`dot ${index === productActiveIndex ? 'active' : ''}`}></span>
              ))}
            </div>
          </div>
          <button className="nav-arrow" onClick={() => scrollProducts('right')} disabled={productActiveIndex === productDotsCount - 1}>
            &gt;
          </button>
        </div>
      </section>

      {/* Character Section */}
      <section className="product-section" style={{ backgroundColor: '#ffffff' }}>
        <h2>Featured Characters</h2>
        <div
          className="product-slider-container"
          onMouseEnter={() => setIsCharHovering(true)}
          onMouseLeave={() => setIsCharHovering(false)}
        >
          <div className="product-slider" ref={charSliderRef}>
            {characters.map((character) => (
              <Link to={`/characters/${character.id}`} key={character.id} className="product-card">   
              <div key={character.id} className="product-card">
                <img src={character.image} alt={character.name} />
                <div className="product-card-content">
                  <h3>{character.name}</h3>
                  <p>{character.price} VNĐ</p>
                  <button className="btn-primary">Add to Cart</button>
                </div>
              </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="product-nav">
          <button className="nav-arrow" onClick={() => scrollCharacters('left')} disabled={charActiveIndex === 0}>
            &lt;
          </button>
          <div className="pagination-container">
            <div className="pagination-dots">
              {Array.from({ length: charDotsCount }).map((_, index) => (
                <span key={index} className={`dot ${index === charActiveIndex ? 'active' : ''}`}></span>
              ))}
            </div>
          </div>
          <button className="nav-arrow" onClick={() => scrollCharacters('right')} disabled={charActiveIndex === charDotsCount - 1}>
            &gt;
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;