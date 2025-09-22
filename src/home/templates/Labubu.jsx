import React from 'react';
import '../static/css/Dolls.css';

import labubuImage from '../static/img/labubus.png';

// Dữ liệu sản phẩm mẫu
import Labubu1 from '../static/img/labubu1.jpg';
import Labubu2 from '../static/img/labubu2.jpg';
import Labubu3 from '../static/img/labubu3.jpg';

const products = [
  { id: 1, name: 'Labubu Ver1', description: 'A cute and cuddly doll, perfect for all ages.', price: '120.000đ', image: Labubu1 },
  { id: 2, name: 'Labubu Ver2', description: 'A friendly doll with a charming smile.', price: '150.000đ', image: Labubu2 },
  { id: 3, name: 'Labubu Ver3', description: 'A playful doll that brings endless fun.', price: '130.000đ', image: Labubu3 },
 
  // Thêm các sản phẩm khác nếu cần
];

function Labubu() {
  return (
    <div className="dolls-page">
      {/* Hero Section */}
      <section className="dolls-hero-section" style={{ backgroundImage: `url(${labubuImage})` }}>
        <div className="dolls-hero-content">
          <h1>Our Labubu Collection</h1>
          <p>Explore a world of imagination with our beautifully crafted Labubu.</p>
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

export default Labubu;