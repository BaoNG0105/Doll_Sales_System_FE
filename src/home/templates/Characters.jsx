import React, { useState, useEffect } from 'react';
import '../static/css/Characters.css';
import { Link } from 'react-router-dom';
import { getCharacters } from '../../service/api.character.js';

function Characters() {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const data = await getCharacters();
        console.log('Fetched characters data:', data); // Debug log
        setCharacters(data.items);
      } catch (error) {
        console.error('Failed to fetch characters:', error);
        // Handle error if needed
      }
    };

    fetchCharacters();
  }, []);

  return (
    <div className="emotion-page">
      {/* Hero Section */}
      <section className="emotion-hero-section">
        <div className="emotion-hero-content">
          <h1>Our Characters Collection</h1>
          <p>Discover our unique characters that bring stories to life.</p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="products-grid-container">
        <div className="products-grid">
          {characters.map((character) => (
            <Link to={`/characters/${character.characterId}`} style={{ textDecoration: 'none', color: 'inherit' }} key={character.characterId}>
            <div className="emotion-product-card">
              <img className="emotion-product-image" src={character.image} alt={character.name} />
              <div className="emotion-product-info">
                <h3 className="emotion-product-name">{character.name}</h3>
                <p className="emotion-product-description"><strong>Age:</strong> {character.ageRange}</p>
                <p className="emotion-product-description"><strong>Personality:</strong> {character.personality}</p>
                <p className="emotion-product-description">{character.description}</p>
                <div className="emotion-card-buttons">
                  <button className="add-to-cart-btn">Add to Cart</button>
                  <button className="buy-now-btn">Buy Now</button>
                </div>
              </div>
            </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Characters;