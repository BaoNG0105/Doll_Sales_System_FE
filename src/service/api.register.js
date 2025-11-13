import api from '../config/axios';

// POST register
export const postRegister = async (userData) => {
    try {
        const response = await api.post('/Auth/register', userData);
        return response.data;
    } catch (error) {
        console.error('Error during registration:', error);
        throw error;
    }
};