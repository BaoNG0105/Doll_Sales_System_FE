import axios from 'axios';

// Set config defaults when creating the instance
const api = axios.create({
    baseURL: 'https://dollaistore-api-dxdggjazgpckh2cc.japaneast-01.azurewebsites.net/api',
});

export default api;