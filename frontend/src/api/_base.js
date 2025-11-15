import axios from 'axios'

export const apiInstance = axios.create({
    baseURL: import.meta.env.MODE === 'development' ? import.meta.env.VITE_API_URL : import.meta.env.VITE_BACKEND_PROD,
    withCredentials: true
})

// Interceptor to add JWT token from localStorage ONLY for donor requests
// All other roles (student, volunteer, beneficiary, management, director) use httpOnly cookies
// and should NOT be modified by this interceptor
apiInstance.interceptors.request.use((config) => {
    try {
        const url = config.url || '';
        
        // STRICT: Only process donor endpoints
        // Donor endpoints include:
        // - /api/donor-auth/ (donor authentication)
        // - /api/donor/ (donor profile)
        // - /api/donation/my (donor's donations)
        // - /api/donation/my/history (donor's donation history)
        // - /api/donation/submit-goods (donor submitting goods)
        // - /api/v1/payment/donate-now (donor payment)
        const isDonorEndpoint = url.includes('/api/donor-auth/') || 
                                url.includes('/api/donor/') ||
                                (url.includes('/api/donation/') && 
                                 (url.includes('/my') || 
                                  url.includes('/submit-goods'))) ||
                                url.includes('/api/v1/payment/donate-now');
        
        // ONLY process donor endpoints - all other requests pass through unchanged
        if (isDonorEndpoint) {
            if (!config.headers) {
                config.headers = {};
            }
            
            const token = localStorage.getItem('donor_jwt');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        // For all non-donor endpoints, return config as-is without any modifications
        // This ensures cookie-based authentication works naturally for other roles
        
    } catch (error) {
        // If interceptor fails, return config as-is to not break the request
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