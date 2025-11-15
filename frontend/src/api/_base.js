import axios from 'axios'

export const apiInstance = axios.create({
    baseURL: import.meta.env.MODE === 'development' ? import.meta.env.VITE_API_URL : import.meta.env.VITE_BACKEND_PROD,
    withCredentials: true
})

// Interceptor to add JWT token from localStorage to all requests
apiInstance.interceptors.request.use((config) => {
    try {
        // Ensure headers object exists
        if (!config.headers) {
            config.headers = {};
        }
        
        const token = localStorage.getItem('donor_jwt');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            // Debug log for checkAuth requests
            if (config.url?.includes('checkAuth')) {
                console.log('[API Interceptor] Adding Authorization header:', {
                    hasToken: !!token,
                    tokenLength: token.length,
                    tokenPreview: token.substring(0, 20) + '...',
                    url: config.url,
                    headerSet: !!config.headers.Authorization,
                    headerValue: config.headers.Authorization?.substring(0, 30) + '...'
                });
            }
        } else {
            if (config.url?.includes('checkAuth')) {
                console.warn('[API Interceptor] No token found in localStorage for checkAuth request');
            }
        }
    } catch (error) {
        console.error('[API Interceptor] Error getting token:', error);
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor to handle 401 errors
apiInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error('[API Interceptor] 401 Unauthorized:', {
                url: error.config?.url,
                hasAuthHeader: !!error.config?.headers?.Authorization,
                authHeader: error.config?.headers?.Authorization?.substring(0, 30) + '...',
                responseData: error.response?.data
            });
        }
        return Promise.reject(error);
    }
);