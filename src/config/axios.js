import axios from "axios";
import { store } from '../redux/store'; // Import store của Redux
import { logout } from "../redux/authSlice"; // 1. Import hàm logout
import Swal from 'sweetalert2'; // 2. Import SweetAlert2

const api = axios.create({
    baseURL: "https://dollaistore-api-dxdggjazgpckh2cc.japaneast-01.azurewebsites.net/api",
});

// Thêm một request interceptor (Giữ nguyên)
api.interceptors.request.use(
    (config) => {
        const token = store.getState().auth.accessToken;
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. THÊM BỘ CHẶN PHẢN HỒI (RESPONSE INTERCEPTOR)
api.interceptors.response.use(
    // (response) => response: Nếu phản hồi thành công, cho nó đi qua
    (response) => response,

    // (error) => { ... }: Nếu phản hồi bị lỗi, xử lý nó ở đây
    async (error) => {
        const originalRequest = error.config;

        // Kiểm tra xem có phải lỗi 401 (Unauthorized) không
        if (error.response && error.response.status === 401) {
            
            // Chỉ xử lý 1 lần, tránh lặp vô hạn nếu nhiều request cùng bị 401
            // (Bạn có thể bỏ qua phần _retry này nếu thấy phức tạp,
            // chỉ cần dispatch(logout()) là đủ)
            if (!originalRequest._retry) {
                originalRequest._retry = true; 

                console.error("Token hết hạn hoặc không hợp lệ. Đang đăng xuất...");
                
                // Tự động dispatch hành động logout
                store.dispatch(logout());

                // Thông báo cho người dùng
                Swal.fire({
                    title: 'Phiên đăng nhập hết hạn',
                    text: 'Vui lòng đăng nhập lại để tiếp tục.',
                    icon: 'warning',
                    confirmButtonText: 'Đồng ý'
                }).then(() => {
                    // Chuyển hướng về trang đăng nhập
                    window.location.href = '/login'; 
                });
            }
        }

        // Với tất cả các lỗi khác (404, 500, v.v.), chỉ cần trả về lỗi
        return Promise.reject(error);
    }
);


export default api;