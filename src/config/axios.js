import axios from 'axios';

// Set config defaults when creating the instance
const api = axios.create({
    baseURL: 'https://localhost:7152/api',
});

export default api;