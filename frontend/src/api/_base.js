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
        // Donor endpoints include:
        // - /api/donor-auth/ (donor authentication)
        // - /api/donor/ (donor profile)
        // - /api/donation/my (donor's donations)
        // - /api/donation/my/history (donor's donation history)
        // - /api/donation/submit-goods (donor submitting goods)
        // - /api/v1/payment/donate-now (donor payment)
        // Note: Some /api/donation/ endpoints are for director/staff (they use cookies)
        const isDonorEndpoint = config.url?.includes('/api/donor-auth/') || 
                                config.url?.includes('/api/donor/') ||
                                (config.url?.includes('/api/donation/') && 
                                 (config.url?.includes('/my') || 
                                  config.url?.includes('/submit-goods'))) ||
                                config.url?.includes('/api/v1/payment/donate-now');
        
        // For non-donor endpoints (student/volunteer/beneficiary/management/director):
        // - Do NOT add Authorization header
        // - Do NOT modify headers at all
        // - Let them use cookies naturally
        // - Override any global defaults that might interfere
        if (!isDonorEndpoint) {
            // Ensure headers object exists
            if (!config.headers) {
                config.headers = {};
            }
            
            // CRITICAL: Remove Authorization header if it exists (from global defaults or config)
            // This prevents OAuthSuccess from interfering with cookie-based auth for volunteers/students
            if (config.headers.Authorization) {
                delete config.headers.Authorization;
            }
            
            // Also check if global defaults have Authorization and ensure it's not applied
            // Note: We can't delete from defaults here, but we ensure it's not in the request
            if (apiInstance.defaults.headers?.common?.Authorization) {
                // Explicitly set Authorization to undefined to override any defaults
                config.headers.Authorization = undefined;
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