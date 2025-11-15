import axios from 'axios'

export const apiInstance = axios.create({
    baseURL: import.meta.env.MODE === 'development' ? import.meta.env.VITE_API_URL : import.meta.env.VITE_BACKEND_PROD,
    withCredentials: true // Required for httpOnly cookies
})

// Note: We rely on httpOnly cookies for JWT authentication
// The token is automatically sent with requests via withCredentials: true
// No need to manually attach tokens from storage (which would be insecure)