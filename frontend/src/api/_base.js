import axios from 'axios'

export const apiInstance = axios.create({
    baseURL: import.meta.env.MODE === 'development' ? import.meta.env.VITE_API_URL : import.meta.env.VITE_BACKEND_PROD,
    withCredentials: true
})

// Attach Bearer token from session storage if present
apiInstance.interceptors.request.use((config) => {
    try {
        const token = (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('donor_jwt')) 
            || (typeof localStorage !== 'undefined' && localStorage.getItem('donor_jwt'));
        if (token && !config.headers?.Authorization) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch { /* ignore storage errors */ }
    return config;
});