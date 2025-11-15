import axios from 'axios'

export const apiInstance = axios.create({
    baseURL: import.meta.env.MODE === 'development' ? import.meta.env.VITE_API_URL : import.meta.env.VITE_BACKEND_PROD,
    withCredentials: true
})

// Interceptor to add JWT token from localStorage ONLY for donor requests
// DO NOT modify requests for: student, volunteer, beneficiary, management, director
// These roles use httpOnly cookies for authentication, not Authorization headers
apiInstance.interceptors.request.use((config) => {
    try {
        // STRICT: Only process donor endpoints - ignore all other endpoints completely
        const isDonorEndpoint = config.url?.includes('/api/donor-auth/') || 
                                config.url?.includes('/api/donor/');
        
        // For non-donor endpoints (student/volunteer/beneficiary/management/director):
        // - Do NOT add Authorization header
        // - Do NOT modify headers at all
        // - Let them use cookies naturally
        // - Override any global defaults that might interfere
        if (!isDonorEndpoint) {
            // Only remove Authorization if it exists from global defaults
            // This prevents OAuthSuccess from interfering with other roles
            if (config.headers?.Authorization || apiInstance.defaults.headers?.common?.Authorization) {
                if (!config.headers) {
                    config.headers = {};
                }
                // Remove Authorization header to prevent conflicts with cookie auth
                delete config.headers.Authorization;
            }
            // Return early - don't process non-donor endpoints
            return config;
        }
        
        // ONLY process donor endpoints from here
        if (isDonorEndpoint) {
            // Ensure headers object exists
            if (!config.headers) {
                config.headers = {};
            }
            
            const token = localStorage.getItem('donor_jwt');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
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