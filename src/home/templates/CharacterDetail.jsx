import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import '../static/css/DollDetail.css'; // Reusing doll detail styles
import '../static/css/CharacterDetail.css'; // Adding specific styles for character detail

// --- Mock Data ---
import J97 from '../static/img/j97.jpg';
import SonTung from '../static/img/sontung.jpg';
import Linh from '../static/img/Linh.png';
import Khoa from '../static/img/Khoa.png';
import Bao from '../static/img/Bao.png';

const characterProducts = [
  { id: 1, name: 'AI Linh Nguyen', description: 'I am Linh, a curious Ph.D. student who loves experimenting in the lab and is passionate about making new scientific discoveries.', price: '135.000đ/month', image: Linh },
  { id: 2, name: 'AI Khoa Cao', description: 'My name is Khoa, a dedicated Fullstack Developer who enjoys solving complex problems and bringing ideas to life through code.', price: '175.000đ/month', image: Khoa },
  { id: 3, name: 'AI Bao', description: ' I am Bao, an adventurous astronaut with a dream of exploring new frontiers and planting our flag among the stars.', price: '100.000đ/month', image: Bao },
  { id: 4, name: 'AI Jack-J97', description: 'Tôi không có bỏ con...', price: '5.000.000đ/month', image: J97 },
  { id: 5, name: 'AI Son Tung M-TP', description: 'Bá tước Saint Toine Emtippy', price: '2.000.000.000đ/month', image: SonTung },
];

const subscriptionOptions = [
    { label: '1 Month', value: '1-month' },
    { label: '3 Months', value: '3-months' },
    { label: '1 Year', value: '1-year' },
];

function CharacterDetail() {
    const { id } = useParams();
    const [selectedOption, setSelectedOption] = useState(subscriptionOptions[0].value);
    const product = characterProducts.find(p => p.id === parseInt(id));

    if (!product) {
        return (
            <div className="product-detail-page product-not-found">
                <h2>Character Not Found</h2>
                <p>Sorry, we couldn't find the character you're looking for.</p>
                <Link to="/characters" className="back-to-shop-link">Back to Characters</Link>
            </div>
        );
    }

    return (
        <div className="product-detail-page">
            <div className="product-detail-container">
                {/* Product Image Gallery */}
                <div className="product-image-gallery">
                    <img src={product.image} alt={product.name} className="main-product-image" />
                </div>
                {/* Product Info Section */}
                <div className="product-info">
                    <h1 className="product-name">{product.name}</h1>
                    <p className="product-description-short">{product.description}</p>
                    <p className="product-price">{product.price}</p>
                    
                    <div className="subscription-selector">
                        <label>Choose Package:</label>
                        <div className="subscription-options">
                            {subscriptionOptions.map((option) => (
                                <button
                                    key={option.value}
                                    className={`subscription-btn ${selectedOption === option.value ? 'active' : ''}`}
                                    onClick={() => setSelectedOption(option.value)}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="action-buttons">
                        <button className="add-to-cart-detail-btn">
                            <FaShoppingCart /> Add to Cart
                        </button>
                        <button className="buy-now-detail-btn">Buy Now</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CharacterDetail;