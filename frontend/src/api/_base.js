import axios from 'axios'

export const apiInstance = axios.create({
    baseURL: import.meta.env.MODE === 'development' ? import.meta.env.VITE_API_URL : import.meta.env.VITE_BACKEND_PROD,
    withCredentials: true
})

// Interceptor to add JWT token from localStorage to all requests
apiInstance.interceptors.request.use((config) => {
    try {
        const token = localStorage.getItem('donor_jwt');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (error) {
        // Ignore localStorage errors
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});