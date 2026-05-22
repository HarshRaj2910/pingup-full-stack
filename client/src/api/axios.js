import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.MODE === 'development' ? 'http://localhost:5000' : import.meta.env.VITE_BASEURL
})

export default api