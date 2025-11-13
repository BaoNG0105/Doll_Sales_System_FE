// src/pages/Search.jsx (File mới)

import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getDollVariants } from '../../service/api.doll';
import { getCharacters } from '../../service/api.character';
import '../static/css/Characters.css'; // Tái sử dụng CSS từ trang Characters cho đồng bộ
import '../static/css/Search.css'; // Tạo file CSS mới cho layout trang search

function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  
  const [dollResults, setDollResults] = useState([]);
  const [characterResults, setCharacterResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const searchParams = { search: query };

        // Gọi cả 2 API song song
        const [dollData, charData] = await Promise.all([
          getDollVariants(searchParams),
          getCharacters(searchParams)
        ]);

        setDollResults(dollData.items || []);
        setCharacterResults(charData.items.filter(char => char.isActive) || []); // Lọc active characters
        
      } catch (err) {
        console.error('Failed to fetch search results:', err);
        setError('Could not load results. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]); // Chạy lại mỗi khi 'query' thay đổi

  if (loading) {
    return <div className="loading-container">Searching...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  const noResults = dollResults.length === 0 && characterResults.length === 0;

  return (
    <div className="search-page-container">
      <h1 className="search-title">Search Results for: "{query}"</h1>

      {noResults ? (
        <p className="search-no-results">No results found.</p>
      ) : (
        <>
          {/* Phần kết quả Characters */}
          {characterResults.length > 0 && (
            <section className="results-section">
              <h2>Characters</h2>
              <div className="products-grid">
                {characterResults.map((char) => (
                  <Link to={`/characters/${char.characterId}`} style={{ textDecoration: 'none', color: 'inherit' }} key={char.characterId}>
                    <div className="emotion-product-card">
                      <img className="emotion-product-image" src={char.image} alt={char.name} />
                      <div className="emotion-product-info">
                        <h3 className="emotion-product-name">{char.name}</h3>
                        <p className="emotion-product-description"><strong>Personality:</strong> {char.personality}</p>
                        <div className="emotion-card-buttons">
                          <button className="buy-now-btn">View Detail</button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Phần kết quả Doll Variants */}
          {dollResults.length > 0 && (
            <section className="results-section">
              <h2>Doll Products</h2>
              <div className="products-grid">
                {dollResults.map((variant) => (
                  // LƯU Ý: API getDollVariants không trả về typeId
                  // Bạn cần cập nhật <Link> bên dưới cho phù hợp với cấu trúc
                  // Ví dụ: <Link to={`/doll-type/${variant.typeId}/${variant.dollModelId}`}>
                  // Hiện tại, tôi chỉ hiển thị thông tin.
                  <div className="emotion-product-card" key={variant.dollVariantID}>
                    <img className="emotion-product-image" src={variant.image} alt={variant.name} />
                    <div className="emotion-product-info">
                      <h3 className="emotion-product-name">{variant.name}</h3>
                      <p className="emotion-product-description"><strong>Color:</strong> {variant.color}</p>
                      <p className="emotion-product-description"><strong>Size:</strong> {variant.size}</p>
                      <div className="doll-price">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(variant.price)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

export default SearchPage;