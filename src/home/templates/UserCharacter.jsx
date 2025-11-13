import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserCharactersByUserId } from '../../service/api.user';
import { getCharacterById } from '../../service/api.character.js'; // --- THÊM IMPORT NÀY ---
import '../static/css/UserCharacter.css';

const UserCharacters = ({ userId }) => {
    const [userCharacters, setUserCharacters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCharacters = async () => {
            if (!userId) {
                setError("User ID not provided.");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                // 1. Lấy danh sách character cơ bản của user
                const res = await getUserCharactersByUserId(userId);
                const baseCharacters = res.data || [];

                if (baseCharacters.length === 0) {
                    setUserCharacters([]);
                    setLoading(false); // Cần set loading false ở đây
                    return;
                }

                // 2. Tạo một mảng các promise để lấy chi tiết (và ảnh) cho mỗi character
                const characterImagePromises = baseCharacters.map(char => 
                    getCharacterById(char.characterID)
                );

                // 3. Gọi tất cả các promise một cách an toàn với Promise.allSettled
                const characterImageResults = await Promise.allSettled(characterImagePromises);

                // 4. Kết hợp dữ liệu ảnh vào danh sách character cơ bản
                const combinedCharacters = baseCharacters.map((char, index) => {
                    const imageResult = characterImageResults[index];
                    let imageUrl = null; // Ảnh mặc định (hoặc null)

                    if (imageResult.status === 'fulfilled' && imageResult.value.image) {
                        imageUrl = imageResult.value.image;
                    } else if (imageResult.status === 'rejected') {
                        // Ghi log lỗi nếu không tải được ảnh cho 1 character cụ thể
                        console.error(`Failed to load image for characterID ${char.characterID}:`, imageResult.reason);
                    }

                    return {
                        ...char,      // Dữ liệu gốc (packageName, statusDisplay, ...)
                        image: imageUrl // Thêm thuộc tính image
                    };
                });

                // 5. Cập nhật state với dữ liệu đã được kết hợp
                setUserCharacters(combinedCharacters);

            } catch (err) {
                setError("Không thể tải danh sách character");
                console.error("Error fetching user characters:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCharacters();
    }, [userId]); // Chỉ phụ thuộc vào userId

    const getStatusClass = (status) => {
        if (!status) return 'status-unknown';
        return `status-${status.toLowerCase().replace(' ', '-')}`;
    };

    if (loading) {
        return <div className="loading-spinner"></div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="user-characters-container">
            <h3>My Purchased Characters</h3>
            {userCharacters.length > 0 ? (
                <div className="character-list">
                    {userCharacters.map((char) => {
                        
                        // --- LOGIC MỚI ĐỂ KIỂM TRA VÔ HIỆU HÓA ---
                        const now = new Date();
                        const endDate = new Date(char.endAt);
                        
                        // Kiểm tra xem đã hết hạn chưa
                        const isExpired = endDate < now; 
                        
                        // Nút bị vô hiệu hóa nếu:
                        // 1. Trạng thái không phải "Active"
                        // HOẶC 2. Đã hết hạn (endDate < thời gian hiện tại)
                        const isDisabled = (char.statusDisplay !== "Active") || isExpired;
                        // --- KẾT THÚC LOGIC MỚI ---

                        return (
                            <div key={char.userCharacterID} className="character-card">
                                
                                {/* --- BẮT ĐẦU CẤU TRÚC MỚI --- */}
                                <div className="character-card-main-content">
                                    {/* 1. Thêm ảnh */}
                                    {char.image && (
                                        <img 
                                            src={char.image} 
                                            alt={char.characterName} 
                                            className="character-card-image" // Class mới cho CSS
                                        />
                                    )}

                                    {/* 2. Bọc details */}
                                    <div className="character-card-details">
                                        <div className="character-card-header">
                                            <h4 className="character-name">{char.characterName}</h4>
                                            <span className={`character-status ${getStatusClass(char.statusDisplay)}`}>
                                                {char.statusDisplay}
                                            </span>
                                        </div>
                                        <div className="character-card-body">
                                            <p className="character-package">
                                                <strong>Package:</strong> {char.packageName}
                                            </p>
                                            <p className="character-duration">
                                                <strong>Duration:</strong> 
                                                {new Date(char.startAt).toLocaleDateString()} - {new Date(char.endAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {/* --- KẾT THÚC CẤU TRÚC MỚI --- */}

                                <div className="character-card-footer">
                                    <button
                                        className="btn-use-character"
                                        onClick={() => navigate(`/ai/${char.characterID}`, { state: { owned: true, character: char } })}
                                        // Sử dụng biến logic mới ở đây
                                        disabled={isDisabled}
                                    >
                                        Use Character
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                // --- THAY ĐỔI Ở ĐÂY ---
                <div className="empty-list-message">
                    <p>You haven't purchased any characters yet.</p>
                    <p>Visit the store to start your collection!</p>
                </div>
                // --- KẾT THÚC THAY ĐỔI ---
            )}
        </div>
    );
};

export default UserCharacters;