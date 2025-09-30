import React from 'react';
import '../static/css/Characters.css';
import { Link } from 'react-router-dom';

// Dữ liệu sản phẩm mẫu (sử dụng lại ảnh từ trang Dolls để minh họa)
import J97 from '../static/img/j97.jpg';
import SonTung from '../static/img/sontung.jpg';
import Linh from '../static/img/Linh.png';
import Khoa from '../static/img/Khoa.png';
import Bao from '../static/img/Bao.png';

const products = [
  { id: 1, name: 'AI Linh Nguyen', description: 'I am Linh, a curious Ph.D. student who loves experimenting in the lab and is passionate about making new scientific discoveries.', price: '135.000đ', image: Linh },
  { id: 2, name: 'AI Khoa Cao', description: 'My name is Khoa, a dedicated Fullstack Developer who enjoys solving complex problems and bringing ideas to life through code.', price: '175.000đ', image: Khoa },
  { id: 3, name: 'AI Bao', description: ' I am Bao, an adventurous astronaut with a dream of exploring new frontiers and planting our flag among the stars.', price: '100.000đ', image: Bao },
  { id: 4, name: 'AI Jack-J97', description: 'Tôi không có bỏ con...', price: '5.000.000đ', image: J97 },
  { id: 5, name: 'AI Son Tung M-TP', description: 'Bá tước Saint Toine Emtippy', price: '2.000.000.000đ', image: SonTung },
];

function Characters() {
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
          {products.map((product) => (
            <Link to={`/characters/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div key={product.id} className="emotion-product-card">
              <img className="emotion-product-image" src={product.image} alt={product.name} />
              <div className="emotion-product-info">
                <h3 className="emotion-product-name">{product.name}</h3>
                <p className="emotion-product-description">{product.description}</p>
                <p className="emotion-product-price">{product.price}</p>
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