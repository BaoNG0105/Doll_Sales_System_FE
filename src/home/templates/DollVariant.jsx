import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { FaShoppingCart, FaMoneyBillWave } from 'react-icons/fa';
import {getDollTypes ,getDollModelById, getDollVariantsByDollModelId } from '../../service/api.doll';
import { postDollOrder } from '../../service/api.order';
import '../static/css/DollVariant.css';

function DollDetail() {
    const {typeId, modelId } = useParams(); // Changed from id to modelId
    const navigate = useNavigate();
    const { userId, isAuthenticated } = useSelector((state) => state.auth);
    const [dollModel, setDollModel] = useState(null);
    const [variants, setVariants] = useState([]);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            Swal.fire({
                icon: 'warning',
                title: 'Please Log In',
                text: 'You need to be logged in to add items to your cart.',
                confirmButtonText: 'Log In'
            }).then(() => {
                navigate('/login');
            });
            return;
        }

        if (!selectedVariant) {
            Swal.fire({
                icon: 'error',
                title: 'No Variant Selected',
                text: 'Please select a color and size!',
            });
            return;
        }

        const orderData = {
            userID: userId,
            shippingAddress: "User's default address", // Placeholder
            orderItems: [
                {
                    dollVariantID: selectedVariant.dollVariantID,
                    quantity: 1 // Assuming quantity is 1 for now
                }
            ]
        };

        try {
            await postDollOrder(orderData);
            Swal.fire({
                icon: 'success',
                title: 'Added to cart successfully!',
                showConfirmButton: false,
                timer: 1500
            });
            navigate('/cart/:id'.replace(':id', userId)); // Navigate to the cart page
        } catch (err) {
            console.error("Failed to add to cart:", err);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Failed to add to cart. Please try again.',
            });
        }
    };

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

    if (loading) {
        return <div className="loading-container"><p>Loading product...</p></div>;
    }

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
                                        <button key={size} onClick={() => setSelectedSize(size)} className={`option-btn ${selectedSize === size ? 'selected' : ''}`}>
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    <div className="action-buttons-container">
                        <button
                            className="add-to-cart-button"
                            onClick={handleAddToCart}
                            disabled={!selectedVariant}
                        >
                            <FaShoppingCart /> Add to Cart
                        </button>
                        <button
                            className="buy-now-button"
                            disabled={!selectedVariant}
                        >
                            <FaMoneyBillWave /> Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DollDetail;