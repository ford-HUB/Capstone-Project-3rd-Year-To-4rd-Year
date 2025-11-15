import axios from 'axios'

export const apiInstance = axios.create({
    baseURL: import.meta.env.MODE === 'development' ? import.meta.env.VITE_API_URL : import.meta.env.VITE_BACKEND_PROD,
    withCredentials: true
})

// Interceptor to add JWT token from localStorage ONLY for donor requests
// Volunteers/students use httpOnly cookies, so we don't add Authorization header for them
apiInstance.interceptors.request.use((config) => {
    try {
        // Only add Authorization header for donor endpoints
        // Volunteer/student endpoints use cookies, not Authorization headers
        const isDonorEndpoint = config.url?.includes('/api/donor-auth/') || 
                                config.url?.includes('/api/donor/');
        
        if (isDonorEndpoint) {
            // Ensure headers object exists
            if (!config.headers) {
                config.headers = {};
            }
            
            const token = localStorage.getItem('donor_jwt');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
                // Debug log for checkAuth requests
                if (config.url?.includes('checkAuth')) {
                    console.log('[API Interceptor] Adding Authorization header for donor:', {
                        hasToken: !!token,
                        tokenLength: token.length,
                        tokenPreview: token.substring(0, 20) + '...',
                        url: config.url,
                        headerSet: !!config.headers.Authorization
                    });
                }
            } else {
                if (config.url?.includes('checkAuth')) {
                    console.warn('[API Interceptor] No donor token found in localStorage for donor checkAuth request');
                }
            }
        } else {
            // For non-donor endpoints (volunteer/student), ensure we don't add Authorization header
            // They use cookies instead
            if (config.headers?.Authorization && !isDonorEndpoint) {
                // Remove Authorization header if it was set for non-donor endpoints
                delete config.headers.Authorization;
            }
        }
    } catch (error) {
        console.error('[API Interceptor] Error in request interceptor:', error);
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