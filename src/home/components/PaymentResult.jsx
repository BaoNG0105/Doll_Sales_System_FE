// src/home/templates/PaymentResult.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaHome, FaShoppingBag } from 'react-icons/fa';
import '../static/css/PaymentResult.css'; // Import file CSS bạn sẽ tạo ở bước 2

function PaymentResult() {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('processing'); // 'processing', 'success', 'failed'
    const [message, setMessage] = useState('Processing payment...');
    // const [orderInfo, setOrderInfo] = useState('');
    // const [amount, setAmount] = useState('');

    useEffect(() => {
        // Lấy các tham số từ URL do MoMo trả về
        const resultCode = searchParams.get('resultCode');
        const messageFromMoMo = searchParams.get('message');
        // const orderInfoFromMoMo = searchParams.get('orderInfo');
        // const amountFromMoMo = searchParams.get('amount');

        if (resultCode === '0') {
            setStatus('success');
            setMessage('Payment successful!');
        } else {
            setStatus('failed');
            setMessage(decodeURIComponent(messageFromMoMo) || 'Giao dịch thất bại hoặc bị hủy.');
        }
        
        // if (orderInfoFromMoMo) setOrderInfo(decodeURIComponent(orderInfoFromMoMo));
        // if (amountFromMoMo) setAmount(new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amountFromMoMo));

    }, [searchParams]);

    return (
        <div className="payment-result-container">
            <div className={`payment-result-card ${status}`}>
                {status === 'processing' && (
                    <div className="processing-state">
                        <h2>Processing...</h2>
                        <p>Please wait while we process your payment.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="result-content success">
                        <FaCheckCircle className="result-icon" />
                        <h2>Payment Successful!</h2>
                        <p className="result-message">{message}</p>
                        {/* <div className="order-details">
                            <p><strong>Description:</strong> {orderInfo}</p>
                            <p><strong>Total Amount:</strong> <span className="amount">{amount}</span></p>
                        </div> */}
                        <div className="result-actions">
                             {/* Điều chỉnh link này dẫn đến trang lịch sử đơn hàng của bạn nếu có */}
                            <Link to="/profile/me" className="btn-primary">
                                <FaShoppingBag /> View Order History
                            </Link>
                            <Link to="/" className="btn-secondary">
                                <FaHome /> Back to Home
                            </Link>
                        </div>
                    </div>
                )}

                {status === 'failed' && (
                    <div className="result-content failed">
                        <FaTimesCircle className="result-icon" />
                        <h2>Oops, Payment Failed!</h2>
                        <p className="result-message">{message}</p>
                        <div className="result-actions">
                            <Link to="/" className="btn-secondary">
                                <FaHome />Back to Home
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PaymentResult;