import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../static/css/Home.css';
import aboutImage from '../static/img/about.png';
import backgroundVideo from '../static/video/poster.mp4';
// Import collaborator logos (bạn cần tạo thư mục và thêm các file này)
import logo1 from '../static/img/logo1.png';
import logo2 from '../static/img/logo2.png';
import logo3 from '../static/img/logo3.png';
import logo4 from '../static/img/logo4.png';
import logo5 from '../static/img/logo5.png';
//api
import { getCharacters } from '../../service/api.character.js';
import { getDollModels } from '../../service/api.doll.js';

// Sample collaborator data
const collaborators = [
  { id: 1, name: 'Brand One', image: logo1 },
  { id: 2, name: 'Brand Two', image: logo2 },
  { id: 3, name: 'Brand Three', image: logo3 },
  { id: 4, name: 'Brand Four', image: logo4 },
  { id: 5, name: 'Brand Five', image: logo5 },
];

function Home() {
  // State for Doll Slider
  const [products, setProducts] = useState([]);
  const [productLoading, setProductLoading] = useState(true);
  const [productError, setProductError] = useState(null);

  // State for Character Slider
  const [characters, setCharacters] = useState([]);
  const [charLoading, setCharLoading] = useState(true);
  const [charError, setCharError] = useState(null);


  // State and Ref for About Section Animation
  const aboutSectionRef = useRef(null);
  const [isAboutVisible, setIsAboutVisible] = useState(false);

  // --- FETCH DOLL MODELS FROM API ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductLoading(true);
        const responseData = await getDollModels();
        if (responseData && responseData.items) {
          setProducts(responseData.items);
        } else {
          setProducts([]);
        }
      } catch (err) {
        setProductError('Failed to fetch dolls. Please try again later.');
        console.error(err);
      } finally {
        setProductLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // --- FETCH CHARACTERS FROM API ---
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        setCharLoading(true);
        const data = await getCharacters();
        if (Array.isArray(data.items)) {
          setCharacters(data.items);
        } else {
          setCharacters([]);
        }
      } catch (err) {
        setCharError('Failed to fetch characters. Please try again later.');
        console.error(err);
      } finally {
        setCharLoading(false);
      }
    };
    fetchCharacters();
  }, []);


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

  const handleScrollDown = () => {
    aboutSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
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
        <div className="scroll-down-container" onClick={handleScrollDown}>
          <div className="mouse-icon">
            <div className="wheel"></div>
          </div>
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
        <h2>Featured Dolls</h2>
        {productLoading ? (
          <p>Loading products...</p>
        ) : productError ? (
          <p>{productError}</p>
        ) : (
          <div className="product-slider-container">
            <div className="product-slider">
              {/* Render the list twice for a seamless loop */}
              {products.map((product) => (
                <Link to={`/doll-detail/${product.dollModelID}`} key={`${product.dollModelID}-1`} className="product-card">
                  <img src={product.image} alt={product.name} />
                  <div className="product-card-content">
                    <h3>{product.name}</h3>
                    <button className="btn-primary">View Details</button>
                  </div>
                </Link>
              ))}
              {products.map((product) => (
                <Link to={`/doll-detail/${product.dollModelID}`} key={`${product.dollModelID}-2`} className="product-card">
                  <img src={product.image} alt={product.name} />
                  <div className="product-card-content">
                    <h3>{product.name}</h3>
                    <button className="btn-primary">View Details</button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

     {/* Character Section */}
     <section className="product-section" style={{ backgroundColor: '#ffffff' }}>
        <h2>Featured Characters</h2>
        {charLoading ? (
          <p>Loading characters...</p>
        ) : charError ? (
          <p>{charError}</p>
        ) : (
          <div className="product-slider-container">
            <div className="product-slider">
              {/* Render the list twice for a seamless loop */}
              {characters.map((character) => (
                <Link to={`/characters/${character.characterId}`} key={`${character.characterID}-1`} className="product-card">
                  <img src={character.image} alt={character.name} />
                  <div className="product-card-content">
                    <h3>{character.name}</h3>
                    <button className="btn-primary">View Details</button>
                  </div>
                </Link>
              ))}
              {characters.map((character) => (
                <Link to={`/characters/${character.characterId}`} key={`${character.characterID}-2`} className="product-card">
                  <img src={character.image} alt={character.name} />
                  <div className="product-card-content">
                    <h3>{character.name}</h3>
                    <button className="btn-primary">View Details</button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Collaborator Section */}
      <section className="collaborator-section">
        <h2>Our Collaborators</h2>
        <div className="product-slider-container">
          <div className="product-slider">
            {/* Render the list twice for a seamless loop */}
            {collaborators.map((logo) => (
              <div key={`${logo.id}-1`} className="logo-item">
                <img src={logo.image} alt={logo.name} />
              </div>
            ))}
            {collaborators.map((logo) => (
              <div key={`${logo.id}-2`} className="logo-item">
                <img src={logo.image} alt={logo.name} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;