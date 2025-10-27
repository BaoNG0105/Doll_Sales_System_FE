import api from '../config/axios';

//Post google login
export const postGoogleLogin = async (token) => {
    try {
        const response = await api.post('/Auth/google-login', { idToken: token });
        return response.data;
    } catch (error) {
        console.error('Error during Google login:', error);
        throw error;
    }
};

// Post login
export const postLogin = async (credentials) => {
    try {
        const response = await api.post('/Auth/login', credentials);
        return response.data;
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};