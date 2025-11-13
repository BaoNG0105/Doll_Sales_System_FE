import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

/**
 * Component này chỉ dùng để điều hướng
 * Khi người dùng truy cập /dashboard, router sẽ render component này.
 * Nó sẽ đọc role từ Redux và chuyển hướng đến trang mặc định
 * của role đó.
 */
const DashboardIndex = () => {
  const { role } = useSelector((state) => state.auth);

  if (role) {
    const processedRole = role.toLowerCase();

    if (processedRole === 'admin') {
      // Admin: Chuyển đến manage-doll-types
      return <Navigate to="/dashboard/manage-doll-types" replace />;
    } else if (processedRole === 'manager') {
      // Manager: Chuyển đến overview
      return <Navigate to="/dashboard/overview" replace />;
    }
  }
  
  // Nếu vai trò đang tải (role = null),
  // component sẽ không render gì cả (hoặc bạn có thể trả về 1 spinner)
  // và chờ Redux cập nhật, sau đó nó sẽ tự động chạy lại.
  return null; 
};

export default DashboardIndex;