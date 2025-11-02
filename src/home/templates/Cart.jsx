import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getDollOrdersByUserId } from '../../service/api.order';
import '../static/css/Cart.css';

const Cart = () => {
  const [activeTab, setActiveTab] = useState('DollOrder');
  const [dollOrders, setDollOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { userId, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (activeTab === 'DollOrder' && userId) {
      const fetchDollOrders = async () => {
        try {
          setLoading(true);
          // Only fetch orders with status = 5 ("in cart")
          const response = await getDollOrdersByUserId(userId);
          const cartOrders = response.orders.filter(order => order.status === 5);
          setDollOrders(cartOrders);
          setError(null);
        } catch (err) {
          console.error("Failed to fetch doll orders:", err);
          setError('Unable to load your cart. Please try again later.');
        } finally {
          setLoading(false);
        }
      };

      fetchDollOrders();
    }
  }, [userId, activeTab, isAuthenticated, navigate]);

  const handleCheckout = () => {
    // Assume only one order in cart at a time
    if (dollOrders.length > 0) {
      const orderId = dollOrders[0].orderID;
      navigate(`/checkout/${orderId}`);
    }
  };

  // Calculate total amount from all orders in cart
  const totalAmount = dollOrders.reduce((sum, order) => sum + order.totalAmount, 0);

  const renderDollOrders = () => {
    if (loading) return <p className="loading-message">Loading your cart...</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (dollOrders.length === 0 || dollOrders.every(order => order.orderItems.length === 0)) {
      return <p className="empty-cart-message">Your doll cart is empty.</p>;
    }

    // Combine all orderItems from all cart orders
    const allItems = dollOrders.flatMap(order => order.orderItems.map(item => ({ ...item, orderID: order.orderID })));

    return (
      <div className="cart-content">
        <div className="order-items-list">
          {allItems.map((item) => (
            <div key={`${item.orderID}-${item.dollModelID}`} className="order-item">
              <div className="order-item-image">
                <img src={item.image || 'https://via.placeholder.com/100'} alt={item.name} />
              </div>
              <div className="order-item-details">
                <h3>{item.name || 'Product Name'}</h3>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ${item.price ? item.price.toFixed(2) : '0.00'}</p>
              </div>
              <div className="order-item-actions">
                <div className="quantity-control">
                  <button>-</button>
                  <span>{item.quantity}</span>
                  <button>+</button>
                </div>
                <button className="remove-item-btn">Remove</button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping Fee</span>
            <span>Free</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
          <button className="checkout-btn" onClick={handleCheckout} disabled={totalAmount === 0}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    );
  };

  const renderCharacterOrders = () => {
    return <p className="empty-cart-message">Character orders will be available soon.</p>;
  };

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      <div className="cart-navigation">
        <button
          className={`nav-button ${activeTab === 'DollOrder' ? 'active' : ''}`}
          onClick={() => setActiveTab('DollOrder')}
        >
          Doll Orders
        </button>
        <button
          className={`nav-button ${activeTab === 'CharacterOrder' ? 'active' : ''}`}
          onClick={() => setActiveTab('CharacterOrder')}
        >
          Character Orders
        </button>
      </div>

      {activeTab === 'DollOrder' ? renderDollOrders() : renderCharacterOrders()}
    </div>
  );
};

export default Cart;