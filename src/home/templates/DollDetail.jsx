import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { FaShoppingCart, FaMoneyBillWave, FaPlus, FaMinus } from 'react-icons/fa';
import { getDollModelById, getDollVariantsByDollModelId } from '../api/api.doll';
import '../static/css/DollDetail.css';

function DollDetail() {
    const { id } = useParams(); // This is dollModelID
    const [dollModel, setDollModel] = useState(null);
    const [variants, setVariants] = useState([]);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

                const [modelRes, variantsRes] = await Promise.all([
                    getDollModelById(id),
                    getDollVariantsByDollModelId(id)
                ]);

                if (modelRes && modelRes.data) {
                    setDollModel(modelRes.data);
                } else {
                    throw new Error('Doll model not found.');
                }

                if (variantsRes && Array.isArray(variantsRes) && variantsRes.length > 0) {
                    setVariants(variantsRes);
                    // Set initial selection
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
    }, [id]);

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
                        <button className="add-to-cart-button" disabled={!selectedVariant}>
                            <FaShoppingCart /> Add to Cart
                        </button>
                        <button className="buy-now-button" disabled={!selectedVariant}>
                            <FaMoneyBillWave /> Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DollDetail;