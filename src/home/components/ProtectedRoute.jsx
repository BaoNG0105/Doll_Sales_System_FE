import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const { isAuthenticated, role } = useSelector((state) => state.auth);

    if (!isAuthenticated) {
        // Nếu chưa đăng nhập, chuyển hướng về trang login
        return <Navigate to="/login" replace />;
    }

    if (role !== 'admin' && role !== 'manager') {
        // Nếu đã đăng nhập nhưng không phải admin/manager, chuyển hướng về trang chủ
        return <Navigate to="/" replace />;
    }

    // Nếu đã đăng nhập và có quyền, cho phép truy cập
    return <Outlet />;
};

export default ProtectedRoute;