import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUserById, deleteUser, pathUser } from '../../service/api.user';
import { logout } from '../../redux/authSlice';
import Swal from 'sweetalert2';
import '../static/css/Profile.css';
import Avatar from '../static/img/avatar.png';

// --- Modal Component defined within the same file ---
const EditProfileModal = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        phones: '',
        email: '',
        age: 0,
    });

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                phones: user.phones || '',
                email: user.email || '',
                age: user.age || 0,
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSave = {
            ...formData,
            age: parseInt(formData.age, 10) || 0,
        };
        onSave(dataToSave);
    };

    if (!user) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Edit Profile</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="fullName">Full Name</label>
                        <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phones">Phone Number</label>
                        <input type="text" id="phones" name="phones" value={formData.phones} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="age">Age</label>
                        <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} />
                    </div>
                    <div className="modal-actions">
                        <button type="submit" className="btn-save">Save Changes</button>
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// --- Main Profile Component ---
const Profile = () => {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { userId, username } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        // Đưa định nghĩa hàm vào bên trong useEffect
        const fetchUserData = async () => {
            if (!userId) {
                setError("Could not find logged-in user information.");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const userData = await getUserById(userId);
                const finalUserData = userData.data || userData;

                if (finalUserData && Object.keys(finalUserData).length > 0) {
                    setUser(finalUserData);
                } else {
                    setError("No user data found from API.");
                }
            } catch (err) {
                console.error("Error in fetchUserData:", err);
                setError("Could not load user data.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]); // Giữ userId làm dependency

    const handleEdit = () => {
        setIsModalOpen(true);
    };

    const handleSave = async (updatedData) => {
        try {
            // API pathUser sẽ trả về thông tin user đã được cập nhật
            const response = await pathUser(userId, updatedData);
            const updatedUser = response.data || response;

            // Cập nhật trực tiếp state 'user' với dữ liệu mới
            setUser(updatedUser);
            setIsModalOpen(false);

            Swal.fire({
                title: 'Success!',
                text: 'Your profile has been updated.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
            // Không cần gọi fetchUserData() ở đây nữa
        } catch (err) {
            console.error("Failed to update profile:", err);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to update profile. Please try again.',
                icon: 'error',
            });
        }
    };

    const handleDelete = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteUser(userId);
                    Swal.fire(
                        'Deleted!',
                        'Your account has been deleted.',
                        'success'
                    ).then(() => {
                        dispatch(logout());
                        navigate('/login');
                    });
                } catch (err) {
                    console.error("Failed to delete account:", err);
                    Swal.fire('Error!', 'Failed to delete account. Please try again.', 'error');
                }
            }
        });
    };

    const renderContent = () => {
        if (loading) return <div className="loading-spinner"></div>;
        if (error) return <p className="error-message">{error}</p>;
        if (!user) return <p>No user data to display.</p>;

        switch (activeTab) {
            case 'profile':
                return (
                    <div className="profile-details">
                        <div className="profile-header">
                            <h3>Profile Information</h3>
                            <div className="profile-actions">
                                <button onClick={handleEdit} className="edit-btn">Edit Profile</button>
                                <button onClick={handleDelete} className="delete-btn">Delete Account</button>
                            </div>
                        </div>
                        <div className="details-list">
                            <div className="detail-item"><span>Full Name</span><p>{user.fullName || 'N/A'}</p></div>
                            <div className="detail-item"><span>Email</span><p>{user.email}</p></div>
                            <div className="detail-item"><span>Phone Number</span><p>{user.phones || 'N/A'}</p></div>
                            <div className="detail-item"><span>Age</span><p>{user.age || 'N/A'}</p></div>
                        </div>
                    </div>
                );
            case 'orders':
                return (
                    <div>
                        <h3>Order History</h3>
                        <p>This feature is under development.</p>
                    </div>
                );
            default:
                return null;
        }
    };

    //Profile sidebar
    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="profile-sidebar">
                    {/* 2. Sử dụng hình ảnh đã import */}
                    <img src={Avatar} alt="User Avatar" className="profile-avatar" />
                    <h2 className="profile-username">{user?.userName || username}</h2>
                    <div className="profile-tabs">
                        <button
                            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
                            onClick={() => setActiveTab('profile')}
                        >
                            Profile
                        </button>
                        <button
                            className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
                            onClick={() => setActiveTab('orders')}
                        >
                            Orders
                        </button>
                    </div>
                </div>
                <div className="profile-content">
                    {renderContent()}
                </div>
                {isModalOpen && (
                    <EditProfileModal
                        user={user}
                        onClose={() => setIsModalOpen(false)}
                        onSave={handleSave}
                    />
                )}
            </div>
        </div>
    );
};

export default Profile;