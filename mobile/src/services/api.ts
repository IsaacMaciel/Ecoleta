import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.25.148:3333'
});

export default api;