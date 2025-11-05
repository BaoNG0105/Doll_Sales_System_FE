import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { FaMoneyBillWave, FaTimes, FaWallet } from 'react-icons/fa'; // Thêm FaTimes
import { getDollTypes, getDollModelById, getDollVariantsByDollModelId, getDollVariantById } from '../../service/api.doll'; // Thêm getDollVariantById
import { postDollOrder } from '../../service/api.order';
import { postPayment } from '../../service/api.payment';
import '../static/css/DollVariant.css';

function DollDetail() {
    const { typeId, modelId } = useParams();
    const navigate = useNavigate();
    const { userId, isAuthenticated } = useSelector((state) => state.auth);
    const [dollModel, setDollModel] = useState(null);
    const [variants, setVariants] = useState([]);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State cho modal mua hàng
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalVariantDetails, setModalVariantDetails] = useState(null);
    const [shippingAddress, setShippingAddress] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);


    // Group variants by color for easier selection
    const variantsByColor = useMemo(() => {
        return variants.reduce((acc, variant) => {
            (acc[variant.color] = acc[variant.color] || []).push(variant);
            return acc;
        }, {});
    }, [variants]);

    const availableColors = Object.keys(variantsByColor);
    const availableSizes = selectedColor ? variantsByColor[selectedColor].map(v => v.size) : [];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // --- Access Validation ---
                const [typesData, modelRes] = await Promise.all([
                    getDollTypes(),
                    getDollModelById(modelId)
                ]);

                const dollType = typesData.items.find(t => String(t.dollTypeID) === String(typeId));

                if (!dollType || !dollType.isActive) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Access Denied',
                        text: 'This doll category is inactive or does not exist!',
                    }).then(() => navigate('/doll-type'));
                    return;
                }

                if (!modelRes || !modelRes.isActive) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Access Denied',
                        text: 'This doll model is inactive or does not exist!',
                    }).then(() => navigate(`/doll-type/${typeId}`));
                    return;
                }
                // --- End Validation ---

                setDollModel(modelRes);

                const variantsRes = await getDollVariantsByDollModelId(modelId);

                if (variantsRes && Array.isArray(variantsRes) && variantsRes.length > 0) {
                    setVariants(variantsRes);
                    const firstVariant = variantsRes[0];
                    setSelectedColor(firstVariant.color);
                    setSelectedSize(firstVariant.size);
                } else {
                    setVariants([]);
                }

            } catch (err) {
                console.error("Failed to fetch doll details:", err);
                setError('Could not load product details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [modelId, typeId, navigate]);

    // Update selected variant when color or size changes
    useEffect(() => {
        if (selectedColor && selectedSize) {
            const variant = variants.find(v => v.color === selectedColor && v.size === selectedSize);
            setSelectedVariant(variant);
        }
    }, [selectedColor, selectedSize, variants]);

    const handleColorSelect = (color) => {
        setSelectedColor(color);
        // Automatically select the first available size for the new color
        const firstSizeForColor = variantsByColor[color][0].size;
        setSelectedSize(firstSizeForColor);
    };

    const handleSizeSelect = (size) => {
        setSelectedSize(size);
        const variant = variants.find(v => v.color === selectedColor && v.size === size);
        setSelectedVariant(variant);
    };

    // --- CÁC HÀM MỚI CHO MODAL ---

    const handleOpenBuyModal = async () => {
        if (!selectedVariant) {
            Swal.fire('Please select a variant', 'You must select a color and size first.', 'warning');
            return;
        }
        if (!isAuthenticated) {
            Swal.fire({
                icon: 'warning',
                title: 'Please Log In',
                text: 'You need to be logged in to make a purchase.',
                confirmButtonText: 'Log In'
            }).then(() => navigate('/login'));
            return;
        }

        try {
            // Lấy dữ liệu mới nhất của variant để hiển thị trong modal
            const variantDetails = await getDollVariantById(selectedVariant.dollVariantID);
            setModalVariantDetails(variantDetails);
            setIsModalOpen(true);
        } catch (err) {
            setError('Could not fetch variant details. Please try again.');
            console.error(err);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalVariantDetails(null);
        // Reset state của modal
        setShippingAddress('');
    };

    const handleConfirmPurchase = async () => {
        if (!shippingAddress.trim()) {
            Swal.fire('Validation Error', 'Please enter a shipping address.', 'error');
            return;
        }
        setIsSubmitting(true);
    
        const orderData = {
            userID: parseInt(userId, 10),
            dollVariantID: modalVariantDetails.dollVariantID,
            shippingAddress: shippingAddress,
            totalAmount: modalVariantDetails.price
        };
    
        try {
            // Tạo đơn hàng
            const orderRes = await postDollOrder(orderData);
            if (orderRes.success && orderRes.data) {
                // Gọi API thanh toán
                const paymentReq = {
                    amount: orderRes.data.totalAmount,
                    orderId: orderRes.data.orderID
                };
                const paymentRes = await postPayment(paymentReq);
                if (paymentRes.success && paymentRes.payUrl) {
                    handleCloseModal();
                    window.location.href = paymentRes.payUrl; // Chuyển hướng sang trang thanh toán Momo
                    return;
                } else {
                    Swal.fire('Payment Error', 'Could not get payment URL.', 'error');
                }
            } else {
                Swal.fire('Order Error', 'Could not create order.', 'error');
            }
        } catch (err) {
            console.error('Error placing order or payment:', err);
            Swal.fire('Order Failed', 'There was an issue placing your order. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="loading-container">Loading...</div>;

    if (error) {
        return <div className="error-container"><p>{error}</p></div>;
    }

    if (!dollModel) {
        return <div className="error-container"><p>Product not found.</p></div>;
    }

    // Use selected variant's image and price, fallback to model's data
    const displayImage = selectedVariant?.image || dollModel.image;
    const displayName = selectedVariant?.name || dollModel.name;
    const displayPrice = selectedVariant?.price;

    return (
        <div className="doll-detail-container">
            <div className="doll-detail-card">
                <div className="doll-image-section">
                    <img src={displayImage} alt={displayName} className="main-doll-image" />
                </div>
                <div className="doll-info-section">
                    <h1 className="doll-title">{dollModel.name}</h1>
                    <p className="doll-description">{dollModel.description}</p>

                    {displayPrice !== undefined ? (
                        <div className="doll-price">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(displayPrice)}</div>
                    ) : (
                        <div className="doll-price">Please select an option</div>
                    )}

                    {variants.length > 0 && (
                        <>
                            <div className="option-group">
                                <p className="option-label">Color:</p>
                                <div className="option-buttons">
                                    {availableColors.map(color => (
                                        <button key={color} onClick={() => handleColorSelect(color)} className={`option-btn ${selectedColor === color ? 'selected' : ''}`}>
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="option-group">
                                <p className="option-label">Size:</p>
                                <div className="option-buttons">
                                    {availableSizes.map(size => (
                                        <button key={size} onClick={() => handleSizeSelect(size)} className={`option-btn ${selectedSize === size ? 'selected' : ''}`}>
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    <div className="action-buttons-container">
                        {/* Nút Buy Now được cập nhật */}
                        <button
                            onClick={handleOpenBuyModal}
                            className="buy-now-button"
                            disabled={!selectedVariant}
                        >
                            <FaMoneyBillWave /> Buy Now
                        </button>
                    </div>
                </div>
            </div>

            {/* --- MODAL MUA HÀNG --- */}
            {isModalOpen && modalVariantDetails && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button onClick={handleCloseModal} className="modal-close-btn"><FaTimes /></button>
                        <h2 className="modal-title">Confirm Your Purchase</h2>

                        {/* Product Details in Modal */}
                        <div className="modal-body">
                            <div className="modal-product-info">
                                <img src={modalVariantDetails.image} alt={modalVariantDetails.name} className="modal-product-image" />
                                <div>
                                    <h3>{modalVariantDetails.name}</h3>
                                    <p>Color: {modalVariantDetails.color}, Size: {modalVariantDetails.size}</p>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="modal-form-group">
                                <label htmlFor="shippingAddress">Shipping Address</label>
                                <input
                                    type="text"
                                    id="shippingAddress"
                                    value={shippingAddress}
                                    onChange={(e) => setShippingAddress(e.target.value)}
                                    placeholder="Enter your full shipping address"
                                />
                            </div>

                            {/* Payment Method*/}
                            <div className="modal-form-group">
                                <label>Payment Method</label>
                                <div className="option-buttons">
                                    <button className="option-btn selected" disabled>
                                        <FaWallet /> Momo
                                    </button>
                                </div>
                            </div>

                            {/* Total Amount */}
                            <div className="modal-total">
                                <span>Total Amount:</span>
                                <span className="modal-product-price-large">{modalVariantDetails.price.toLocaleString()} VND</span>
                            </div>
                        </div>

                        {/* Confirm & Pay Button */}
                        <div className="modal-footer">
                            <button
                                onClick={handleConfirmPurchase}
                                className="buy-now-button"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Processing...' : 'Confirm & Pay'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DollDetail;