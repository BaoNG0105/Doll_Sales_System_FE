import axios from "axios";
import { store } from '../redux/store'; // Import store của Redux

const api = axios.create({
    baseURL: "https://dollaistore-api-dxdggjazgpckh2cc.japaneast-01.azurewebsites.net/api",
});

// Thêm một request interceptor
api.interceptors.request.use(
    (config) => {
        // Lấy token từ Redux store
        const token = store.getState().auth.accessToken;
        
        // Nếu có token, thêm nó vào header Authorization
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        // Xử lý lỗi request
        return Promise.reject(error);
    }
);

export default api;