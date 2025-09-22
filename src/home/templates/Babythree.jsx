import React from 'react';
import '../static/css/Dolls.css';

import BabythreeImage from '../static/img/babythrees.png';


// Dữ liệu sản phẩm mẫu
import Dog from '../static/img/dog.png';
import Snake from '../static/img/snake.png';
import Monkey from '../static/img/monkey.png';
import Pig from '../static/img/pig.png';
import Rabbit from '../static/img/rabbit.png';
import Tiger from '../static/img/tiger.png';

const products = [
  { id: 1, name: 'Dog Doll', description: 'A cute and cuddly dog doll, perfect for all ages.', price: '120.000đ', image: Dog },
  { id: 2, name: 'Snake Doll', description: 'A friendly snake doll with a charming smile.', price: '150.000đ', image: Snake },
  { id: 3, name: 'Monkey Doll', description: 'A playful monkey doll that brings endless fun.', price: '130.000đ', image: Monkey },
  { id: 4, name: 'Pig Doll', description: 'A soft and squishy pig doll for cozy hugs.', price: '180.000đ', image: Pig },
  { id: 5, name: 'Rabbit Doll', description: 'An adorable rabbit doll with long, floppy ears.', price: '200.000đ', image: Rabbit },
  { id: 6, name: 'Tiger Doll', description: 'A brave tiger doll for adventurous playtime.', price: '190.000đ', image: Tiger },
  // Thêm các sản phẩm khác nếu cần
];

function Babythree() {
  return (
    <div className="dolls-page">
      {/* Hero Section */}
      <section className="dolls-hero-section" style={{ backgroundImage: `url(${BabythreeImage})` }}>
        <div className="dolls-hero-content">
          <h1>Our Babythree Collection</h1>
          <p>Explore a world of imagination with our beautifully crafted Babythree.</p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="products-grid-container">
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="doll-product-card">
              <img className="doll-product-image" src={product.image} alt={product.name}/>
              <div className="doll-product-info">
                <h3 className="doll-product-name">{product.name}</h3>
                <p className="doll-product-description">{product.description}</p>
                <p className="doll-product-price">{product.price}</p>
                <div className="doll-card-buttons">
                  <button className="add-to-cart-btn">Add to Cart</button>
                  <button className="buy-now-btn">Buy Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Babythree;