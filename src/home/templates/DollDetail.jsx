import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaShoppingCart, FaPlus, FaMinus } from 'react-icons/fa';
import '../static/css/DollDetail.css';

// --- Mock Data ---
import Dog from '../static/img/dog.png';
import Snake from '../static/img/snake.png';
import Monkey from '../static/img/monkey.png';
import Pig from '../static/img/pig.png';
import Rabbit from '../static/img/rabbit.png';
import Tiger from '../static/img/tiger.png';
import Labubu1 from '../static/img/labubu1.jpg';
import Labubu2 from '../static/img/labubu2.jpg';
import Labubu3 from '../static/img/labubu3.jpg';

const dollProducts = [
    { id: 1, name: 'Dog Doll', description: 'A cute and cuddly dog doll, perfect for all ages.', price: '120.000đ', image: Dog, rating: 4.5, colors: [{ name: 'brown', hex: '#8B4513' }, { name: 'white', hex: '#FFFFFF' }, { name: 'black', hex: '#000000' }] },
    { id: 2, name: 'Snake Doll', description: 'A friendly snake doll with a charming smile.', price: '150.000đ', image: Snake, rating: 4.0, colors: [{ name: 'green', hex: '#228B22' }, { name: 'yellow', hex: '#FFD700' }] },
    { id: 3, name: 'Monkey Doll', description: 'A playful monkey doll that brings endless fun.', price: '130.000đ', image: Monkey, rating: 5.0 },
    { id: 4, name: 'Pig Doll', description: 'A soft and squishy pig doll for cozy hugs.', price: '180.000đ', image: Pig, rating: 4.5, colors: [{ name: 'pink', hex: '#FFC0CB' }, { name: 'light-brown', hex: '#D2B48C' }] },
    { id: 5, name: 'Rabbit Doll', description: 'An adorable rabbit doll with long, floppy ears.', price: '200.000đ', image: Rabbit, rating: 5.0, colors: [{ name: 'white', hex: '#FFFFFF' }, { name: 'grey', hex: '#808080' }] },
    { id: 6, name: 'Tiger Doll', description: 'A brave tiger doll for adventurous playtime.', price: '190.000đ', image: Tiger, rating: 4.0 },
    { id: 7, name: 'Labubu Ver1', description: 'A cute and cuddly doll, perfect for all ages.', price: '120.000đ', image: Labubu1, rating: 4.8, colors: [{ name: 'blue', hex: '#ADD8E6' }, { name: 'pink', hex: '#FFC0CB' }] },
    { id: 8, name: 'Labubu Ver2', description: 'A friendly doll with a charming smile.', price: '150.000đ', image: Labubu2, rating: 4.7 },
    { id: 9, name: 'Labubu Ver3', description: 'A playful doll that brings endless fun.', price: '130.000đ', image: Labubu3, rating: 4.9 },
];


const ProductRating = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
        <div className="product-rating">
            {[...Array(fullStars)].map((_, i) => <FaStar key={`full-${i}`} />)}
            {halfStar && <FaStarHalfAlt />}
            {[...Array(emptyStars)].map((_, i) => <FaStar key={`empty-${i}`} style={{ color: '#e4e5e9' }} />)}
            <span className="rating-value">{rating.toFixed(1)}</span>
        </div>
    );
};

function DollDetail() {
    const { id } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(null);
    const product = dollProducts.find(p => p.id === parseInt(id));

    useEffect(() => {
        if (product && product.colors && product.colors.length > 0) {
            setSelectedColor(product.colors[0]);
        } else {
            setSelectedColor(null);
        }
    }, [product]);

    if (!product) {
        return (
            <div className="product-detail-page product-not-found">
                <h2>Doll Not Found</h2>
                <p>Sorry, we couldn't find the doll you're looking for.</p>
                <Link to="/babythree" className="back-to-shop-link">Back to Dolls</Link>
            </div>
        );
    }

    const handleQuantityChange = (amount) => {
        setQuantity(prev => Math.max(1, prev + amount));
    };

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
                    {selectedColor && (
                        <div className="color-selector">
                            {/* <label>
                                Color: <span className="selected-color-name">{selectedColor.name}</span>
                            </label> */}
                            <div className="color-options">
                                {product.colors.map((color) => (
                                    <button
                                        key={color.name}
                                        className={`color-swatch ${selectedColor.name === color.name ? 'active' : ''}`}
                                        style={{ backgroundColor: color.hex }}
                                        onClick={() => setSelectedColor(color)}
                                        aria-label={`Select color ${color.name}`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="quantity-selector">
                        {/* <label htmlFor="quantity">Quantity:</label> */}
                        <div className="quantity-input-wrapper">
                            <button className="quantity-btn" onClick={() => handleQuantityChange(-1)}><FaMinus /></button>
                            <input
                                type="number"
                                id="quantity"
                                className="quantity-display"
                                value={quantity}
                                readOnly
                            />
                            <button className="quantity-btn" onClick={() => handleQuantityChange(1)}><FaPlus /></button>
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

export default DollDetail;