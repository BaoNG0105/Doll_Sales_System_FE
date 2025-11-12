import React, { useState, useEffect } from 'react';
import { getDollOrdersByUserId, patchDollOrder } from '../../service/api.order.js';
import { postNotification } from '../../service/api.notification.js';
import { getUserById } from '../../service/api.user.js';
// --- THÊM IMPORT ---
import { getDollVariantById } from '../../service/api.doll.js';
// ---------------------
import '../static/css/OrderHistory.css';

const OrderHistory = ({ userId }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleUpdateStatus = async (orderId, dollName) => {
        // ... (Nội dung hàm này giữ nguyên, không thay đổi)
        try {
            // 1. Cập nhật trạng thái đơn hàng
            const response = await patchDollOrder(orderId, { status: 'Completed' });
            if (response.success) {
                // Cập nhật UI ngay lập tức
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order.orderID === orderId ? { ...order, status: 'Completed' } : order
                    )
                );

                // --- BẮT ĐẦU LOGIC GỬI THÔNG BÁO ---
                try {
                    // Sử dụng 'userId' từ props thay vì localStorage
                    if (userId) {
                        // 2. Lấy thông tin user để có deviceToken
                        const userResponse = await getUserById(userId);
                        console.log('API getUserById response:', userResponse); // DEBUG
                        
                        // Đảm bảo lấy đúng data (có thể bọc trong {data: ...} hoặc không)
                        const userData = userResponse.data || userResponse;

                        if (userData && userData.deviceToken) {
                            console.log('Device Token found:', userData.deviceToken); // DEBUG
                            
                            // 3. Chuẩn bị dữ liệu thông báo
                            const notificationData = {
                                userId: userId, // Sử dụng userId từ prop
                                title: "Mua hàng thành công",
                                body: `Bạn đã nhận được Doll "${dollName}". Doll hiện đang ở trong thư viện của bạn.`,
                                deviceToken: userData.deviceToken,
                                topic: "purchases", // Thêm topic
                                data: {
                                    "additionalProp1": "string",
                                    "additionalProp2": "string",
                                    "additionalProp3": "string"
                                }
                            };
                            
                            console.log('Data for postNotification API:', notificationData); // DEBUG
                            
                            // 4. Gửi thông báo
                            await postNotification(notificationData);
                            console.log('postNotification call successful.'); // DEBUG
                        } else {
                            console.error('Device token not found in user response:', userResponse);
                        }
                    } else {
                        console.error('User ID prop is missing in OrderHistory component.');
                    }
                } catch (notificationError) {
                    // Không chặn luồng chính nếu gửi thông báo lỗi
                    console.error('Error during notification process:', notificationError);
                }
                // --- KẾT THÚC LOGIC GỬI THÔNG BÁO ---

            } else {
                setError(response.message || 'Failed to update order status.');
            }
        } catch (err) {
            setError('Error updating order status.');
            console.error('Error updating order status:', err);
        }
    };

    useEffect(() => {
        const fetchOrders = async () => {
            if (!userId) {
                setError('User ID not provided.');
                setLoading(false);
                return;
            }
            try {
                const response = await getDollOrdersByUserId(userId);
                
                if (response.success) {
                    const baseOrders = response.orders || [];

                    // --- BẮT ĐẦU THAY ĐỔI: Lấy thêm ảnh cho mỗi đơn hàng ---
                    const ordersWithImages = await Promise.all(
                        baseOrders.map(async (order) => {
                            // *** GIẢ ĐỊNH: 'order' object có chứa 'dollVariantID' ***
                            if (!order.dollVariantID) {
                                console.error('Order object is missing dollVariantID', order);
                                return { ...order, dollImage: null }; // Trả về order gốc nếu thiếu ID
                            }
                            
                            try {
                                // Gọi API để lấy chi tiết variant
                                const variantData = await getDollVariantById(order.dollVariantID);
                                // Gộp ảnh vào object order
                                return {
                                    ...order,
                                    dollImage: variantData.image // Giả định variantData có trường 'image'
                                };
                            } catch (variantError) {
                                console.error(`Failed to fetch variant ${order.dollVariantID}`, variantError);
                                // Trả về order gốc nếu gọi API variant lỗi
                                return { ...order, dollImage: null };
                            }
                        })
                    );
                    
                    setOrders(ordersWithImages); // Set state với data đã gộp
                    // --- KẾT THÚC THAY ĐỔI ---

                } else {
                    setError('Failed to fetch orders.');
                    setOrders([]); // Đảm bảo orders là mảng
                }
            } catch (err) {
                setError('An error occurred while fetching your orders.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [userId]); // Dependency là userId

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    if (loading) {
        return <div className="loading-spinner"></div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="order-history-container">
            <h3>Order History</h3>
            {orders.length > 0 ? (
                <div className="order-list">
                    {orders.map((order) => (
                        <div key={order.orderID} className="order-card">
                            
                            {/* --- BẮT ĐẦU CẤU TRÚC MỚI --- */}
                            <div className="order-card-main-content">
                                {/* 1. Hình ảnh Doll */}
                                {order.dollImage && (
                                    <img 
                                        src={order.dollImage} 
                                        alt={order.dollVariantName} 
                                        className="order-doll-image"
                                    />
                                )}
                                
                                {/* 2. Wrapper cho chi tiết (header + body) */}
                                <div className="order-card-details">
                                    <div className="order-card-header">
                                        <h4 className="order-doll-name">{order.dollVariantName}</h4>
                                        <span className={`order-status status-${order.status.toLowerCase()}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="order-card-body">
                                        <p className="order-amount">
                                            <strong>{formatCurrency(order.totalAmount)}</strong>
                                        </p>
                                        <p className="order-date">
                                            Order date: {new Date(order.orderDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {/* --- KẾT THÚC CẤU TRÚC MỚI --- */}

                            <div className="order-card-footer">
                                <div className="order-actions">
                                    {/* Khi trạng thái là 'Shipping' */}
                                    {order.status === 'Shipping' && (
                                        <button
                                            className="btn btn-action"
                                            onClick={() => handleUpdateStatus(order.orderID, order.dollVariantName)}
                                        >
                                            Received
                                        </button>
                                    )}
                                    {/* Khi trạng thái là 'Completed' */}
                                    {order.status === 'Completed' && (
                                        <>
                                            <a href="https://t.me/your_telegram_contact" target="_blank" rel="noopener noreferrer" className="btn-feedback">
                                                Feed back
                                            </a>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>You have no orders yet.</p>
            )}
        </div>
    );
};

export default OrderHistory;