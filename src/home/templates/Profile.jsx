import { useState } from 'react';
import ProfileSidebar from '../components/ProfileSidebar';
import '../static/css/Profile.css';

// Các component nội dung mẫu
const ProfileDetails = () => <div><h2>Profile Details</h2><p>Your personal information.</p></div>;
const BankAccount = () => <div><h2>Bank Account</h2><p>Your bank account details.</p></div>;
const Address = () => <div><h2>Address</h2><p>Your shipping addresses.</p></div>;
const SettingAccount = () => <div><h2>Setting Account</h2><p>Setting your account.</p></div>;
const OrderList = ({ filter }) => <div><h2>Orders: {filter}</h2><p>List of your orders.</p></div>;
const VoucherList = () => <div><h2>Voucher List</h2><p>Your available vouchers.</p></div>;
const Point = () => <div><h2>Point</h2><p>Your loyalty points.</p></div>;


const Profile = () => {
    const [activeTab, setActiveTab] = useState('profile'); // Tab mặc định

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileDetails />;
            case 'bank':
                return <BankAccount />;
            case 'address':
                return <Address />;
            case 'account':
                return <SettingAccount />;
            case 'delete':
                return <DeleteAccount />;
            case 'orders-all':
                return <OrderList filter="All" />;
            case 'orders-pending':
                return <OrderList filter="Pending" />;
            case 'orders-confirmed':
                return <OrderList filter="Confirmed" />;
            case 'orders-shipping':
                return <OrderList filter="Shipping" />;
            case 'orders-successful':
                return <OrderList filter="Successful" />;
            case 'orders-canceled':
                return <OrderList filter="Canceled" />;
            case 'orders-payback':
                return <OrderList filter="Payback" />;
            case 'vouchers':
                return <VoucherList />;
            case 'points':
                return <Point />;
            default:
                return <ProfileDetails />;
        }
    };

    return (
        <div className="profile-page">
            <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="profile-content">
                {renderContent()}
            </main>
        </div>
    );
};

export default Profile;