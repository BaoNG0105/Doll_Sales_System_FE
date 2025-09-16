import React from 'react';
import '../static/css/Emotion.css';

// Dữ liệu sản phẩm mẫu (sử dụng lại ảnh từ trang Dolls để minh họa)
import Funny from '../static/img/funny.png';
import Sad from '../static/img/sad.png';
import Angry from '../static/img/angry.png';
import Scary from '../static/img/scary.png';
import Boring from '../static/img/boring.png';

const products = [
  { id: 1, name: 'Funny', description: 'A joyful doll that brings smiles to everyone.', price: '125.000đ', image: Funny },
  { id: 2, name: 'Sad', description: 'A doll to share your quiet and thoughtful moments.', price: '145.000đ', image: Sad },
  { id: 3, name: 'Angry', description: 'A doll to express and understand strong feelings.', price: '135.000đ', image: Angry },
  { id: 4, name: 'Scary', description: 'A wide-eyed doll for all of life\'s surprises.', price: '175.000đ', image: Scary },
  { id: 5, name: 'Boring', description: 'A serene doll that brings a sense of peace.', price: '205.000đ', image: Boring },
];

function Emotion() {
  return (
    <div className="emotion-page">
      {/* Hero Section */}
      <section className="emotion-hero-section">
        <div className="emotion-hero-content">
          <h1>Our Emotion Collection</h1>
          <p>Explore a world of feelings with our expressive emotion dolls.</p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="products-grid-container">
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="emotion-product-card">
              <img className="emotion-product-image" src={product.image} alt={product.name}/>
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
          ))}
        </div>
      </section>
    </div>
  );
}

export default Emotion;