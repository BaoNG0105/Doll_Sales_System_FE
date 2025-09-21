import { useState } from 'react';
import { FaUser, FaClipboardList, FaTicketAlt, FaCoins, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import '../static/css/Profile.css';
import Avatar from '../static/img/avatar.png';

// Dữ liệu người dùng mẫu
const user = {
    avatar: Avatar, // URL ảnh đại diện mẫu
    username: 'Username',
};

const ProfileSidebar = ({ activeTab, setActiveTab }) => {
    const [openMenu, setOpenMenu] = useState('myProfile'); // Mặc định mở menu 'My Profile'

    const toggleMenu = (menu) => {
        setOpenMenu(openMenu === menu ? null : menu);
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <aside className="profile-sidebar">
            <div className="sidebar-header">
                <img src={user.avatar} alt="User Avatar" className="sidebar-avatar" />
                <h2 className="sidebar-username">{user.username}</h2>
            </div>
            <nav className="sidebar-nav">
                <ul>

                    {/* My Profile Section */}
                    <li className="nav-item">
                        <div className="nav-menu-header" onClick={() => toggleMenu('myProfile')}>
                            <span><FaUser /> My Profile</span>
                            {openMenu === 'myProfile' ? <FaChevronUp /> : <FaChevronDown />}
                        </div>
                        {openMenu === 'myProfile' && (
                            <ul className="nav-submenu">
                                <li className={activeTab === 'profile' ? 'active' : ''} onClick={() => handleTabClick('profile')}>Profile</li>
                                <li className={activeTab === 'bank' ? 'active' : ''} onClick={() => handleTabClick('bank')}>Bank Account</li>
                                <li className={activeTab === 'address' ? 'active' : ''} onClick={() => handleTabClick('address')}>Address</li>
                                <li className={activeTab === 'account' ? 'active' : ''} onClick={() => handleTabClick('account')}>Setting Account</li>
                            </ul>
                        )}
                    </li>

                    {/* Orders Section */}
                    <li className="nav-item">
                        <div className="nav-menu-header" onClick={() => toggleMenu('orders')}>
                            <span><FaClipboardList /> Orders</span>
                            {openMenu === 'orders' ? <FaChevronUp /> : <FaChevronDown />}
                        </div>
                        {openMenu === 'orders' && (
                            <ul className="nav-submenu">
                                <li className={activeTab === 'orders-all' ? 'active' : ''} onClick={() => handleTabClick('orders-all')}>All</li>
                                <li className={activeTab === 'orders-pending' ? 'active' : ''} onClick={() => handleTabClick('orders-pending')}>Pending</li>
                                <li className={activeTab === 'orders-confirmed' ? 'active' : ''} onClick={() => handleTabClick('orders-confirmed')}>Confirmed</li>
                                <li className={activeTab === 'orders-shipping' ? 'active' : ''} onClick={() => handleTabClick('orders-shipping')}>Shipping</li>
                                <li className={activeTab === 'orders-successful' ? 'active' : ''} onClick={() => handleTabClick('orders-successful')}>Successful</li>
                                <li className={activeTab === 'orders-canceled' ? 'active' : ''} onClick={() => handleTabClick('orders-canceled')}>Canceled</li>
                                <li className={activeTab === 'orders-payback' ? 'active' : ''} onClick={() => handleTabClick('orders-payback')}>Payback</li>
                            </ul>
                        )}
                    </li>

                    {/* Other Links */}
                    <li className={`nav-item single-link ${activeTab === 'vouchers' ? 'active' : ''}`} onClick={() => handleTabClick('vouchers')}>
                        <span><FaTicketAlt /> Voucher List</span>
                    </li>
                    <li className={`nav-item single-link ${activeTab === 'points' ? 'active' : ''}`} onClick={() => handleTabClick('points')}>
                        <span><FaCoins /> Point</span>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default ProfileSidebar;