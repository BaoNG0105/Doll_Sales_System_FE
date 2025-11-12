import api from '../config/axios';

// POST notification
export const postNotification = async (notificationData) => {
    try {
        const response = await api.post('/notifications', notificationData);
        return response.data;
    } catch (error) {
        console.error('Error posting notification:', error);
        throw error;
    }
};