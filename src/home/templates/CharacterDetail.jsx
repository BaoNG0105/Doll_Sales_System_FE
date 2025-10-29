import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { getCharacterById, getCharacterPackagesByCharacterId } from '../../service/api.character.js'; // Import the API functions
import '../static/css/CharacterDetail.css';

function CharacterDetail() {
    const { id } = useParams();
    const [character, setCharacter] = useState(null);
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedPackage, setSelectedPackage] = useState(null); // State for the selected package object

useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [characterResult, packagesResult] = await Promise.allSettled([
                    getCharacterById(id),
                    getCharacterPackagesByCharacterId(id)
                ]);

                if (characterResult.status === 'fulfilled') {
                    setCharacter(characterResult.value);
                } else {
                    // If character fails to load, we should treat it as a critical error
                    throw characterResult.reason;
                }

                if (packagesResult.status === 'fulfilled') {
                    const packagesData = packagesResult.value;
                    const validPackages = Array.isArray(packagesData.data) ? packagesData.data : [];
                    setPackages(validPackages);

                    if (validPackages.length > 0) {
                        setSelectedOption(validPackages[0].packageId);
                    }
                } else {
                    // Log error for packages but don't block rendering the character
                    console.error(`Failed to fetch packages for character with id ${id}:`, packagesResult.reason);
                    setPackages([]); // Set packages to empty array on failure
                }

            } catch (err) {
                setError(err);
                console.error(`Failed to fetch data for character with id ${id}:`, err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // Effect to update the selected package object when the option changes
    useEffect(() => {
        if (selectedOption && packages.length > 0) {
            const foundPackage = packages.find(pkg => pkg.packageId === selectedOption);
            setSelectedPackage(foundPackage);
        } else {
            setSelectedPackage(null);
        }
    }, [selectedOption, packages]);

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
                {/* Product Image Gallery */}
                <div className="product-image-gallery">
                    <img src={character.image} alt={character.name} className="main-product-image" />
                </div>
                {/* Product Info Section */}
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

                    {/* Display Price of Selected Package */}
                    {selectedPackage && (
                        <div className="product-price-container">
                            <span className="product-price">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedPackage.price)}
                            </span>
                        </div>
                    )}

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