import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaMoneyBillWave } from 'react-icons/fa';
import { getCharacterById, getCharacterPackagesByCharacterId } from '../../service/api.character.js';
import { postCharacterOrder } from '../../service/api.order.js';
// --- THAY ĐỔI: Đã xóa import 'postPayment' ---
// import { postPayment } from '../../service/api.payment.js';
import '../static/css/CharacterDetail.css';

function CharacterDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [character, setCharacter] = useState(null);
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [characterResult, packagesResult] = await Promise.allSettled([
                    getCharacterById(id),
                    getCharacterPackagesByCharacterId(id)
                ]);

                if (characterResult.status === 'fulfilled') {
                    if (!characterResult.value || !characterResult.value.isActive) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Access Denied',
                            text: 'This character is inactive or does not exist!',
                        }).then(() => navigate('/characters'));
                        return;
                    }
                    setCharacter(characterResult.value);
                } else {
                    throw characterResult.reason;
                }

                if (packagesResult.status === 'fulfilled') {
                    const packagesData = packagesResult.value;
                    // Sử dụng logic đúng để lấy package từ response
                    const validPackages = Array.isArray(packagesData.data) ? packagesData.data.filter(p => p.isActive) : [];
                    setPackages(validPackages);

                    // Tự động chọn package đầu tiên nếu có
                    if (validPackages.length > 0) {
                        setSelectedOption(validPackages[0].packageId);
                    }
                } else {
                    console.error("Failed to fetch packages:", packagesResult.reason);
                    setPackages([]);
                }

            } catch (err) {
                setError(err);
                console.error(`Failed to fetch data for character with id ${id}:`, err);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Could not load character data.',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, navigate]);

    useEffect(() => {
        if (selectedOption && packages.length > 0) {
            const foundPackage = packages.find(pkg => pkg.packageId === selectedOption);
            setSelectedPackage(foundPackage);
        } else {
            setSelectedPackage(null);
        }
    }, [selectedOption, packages]);

    const handleBuyNowClick = () => {
        if (!selectedPackage) {
            Swal.fire({
                icon: 'warning',
                title: 'No Package Selected',
                text: 'Please select a subscription package before proceeding.',
            });
            return;
        }
        setIsModalOpen(true);
    };

    // --- THAY ĐỔI: Cập nhật hàm handleConfirmAndPay ---
    const handleConfirmAndPay = async () => {
        if (!selectedPackage || !character) return;

        setIsProcessing(true);
        try {
            // Dữ liệu request không đổi
            const orderData = {
                packageID: selectedPackage.packageId,
                characterID: parseInt(id, 10),
            };
            
            // 1. Chỉ gọi postCharacterOrder
            const orderResponse = await postCharacterOrder(orderData);

            // 2. Kiểm tra response mới, lấy payUrl từ object 'payment'
            if (orderResponse && orderResponse.success && orderResponse.payment && orderResponse.payment.payUrl) {
                // 3. Chuyển hướng thanh toán
                window.location.href = orderResponse.payment.payUrl;
            } else {
                // Xử lý lỗi nếu không nhận được payUrl
                throw new Error(orderResponse.message || 'Failed to create order or get payment URL.');
            }
        } catch (err) {
            console.error('Payment process failed:', err);
            Swal.fire({
                icon: 'error',
                title: 'Payment Failed',
                text: err.message || 'An unexpected error occurred. Please try again.',
            });
            setIsProcessing(false);
        }
    };
    // --- KẾT THÚC THAY ĐỔI ---

    const closeModal = () => {
        if (!isProcessing) {
            setIsModalOpen(false);
        }
    };

    if (loading) {
        return <div className="product-detail-page"><h2>Loading...</h2></div>;
    }

    if (error || !character) {
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
                <div className="product-image-gallery">
                    <img src={character.image} alt={character.name} className="main-product-image" />
                </div>
                <div className="product-info">
                    <h1 className="product-name">{character.name}</h1>
                    <p className="product-description-short"><strong>Age:</strong> {character.ageRange}</p>
                    <p className="product-description-short"><strong>Personality:</strong> {character.personality}</p>
                    <p className="product-description-short">{character.description}</p>
                    
                    <div className="subscription-selector">
                        <label>Choose Package:</label>
                        <div className="subscription-options">
                            {packages.map((pkg) => (
                                <button
                                    key={pkg.packageId}
                                    className={`subscription-btn ${selectedOption === pkg.packageId ? 'active' : ''}`}
                                    onClick={() => setSelectedOption(pkg.packageId)}
                                >
                                    {pkg.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {selectedPackage && (
                        <div className="product-price-container">
                            <span className="product-price">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedPackage.price)}
                            </span>
                        </div>
                    )}

                    <div className="action-buttons">
                        <button className="buy-now-detail-btn" onClick={handleBuyNowClick}><FaMoneyBillWave /> Buy Now</button>
                    </div>
                </div>
            </div>

            {isModalOpen && selectedPackage && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={closeModal} disabled={isProcessing}>&times;</button>
                        <h2 className="modal-title">Confirm Your Purchase</h2>
                        <div className="modal-body">
                            <div className="modal-product-info">
                                <img src={character.image} alt={character.name} className="modal-product-image" />
                                <div>
                                    <h3>{character.name}</h3>
                                    <p>Package: {selectedPackage.name}</p>
                                D</div>
                            </div>
                            <div className="modal-total">
                                <span>Total Amount:</span>
                                <span className="modal-product-price-large">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedPackage.price)}
                                </span>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="buy-now-button"
                                onClick={handleConfirmAndPay}
                                disabled={isProcessing}
                            >
                                {isProcessing ? 'Processing...' : 'Confirm & Pay'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CharacterDetail;