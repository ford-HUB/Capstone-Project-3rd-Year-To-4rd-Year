import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDonorAuthStore } from '../../store/donor/useDonorAuthStore.js';
import { Heart, CheckCircle, AlertCircle } from 'lucide-react';
import { apiInstance } from '../../api/_base.js';

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const { handleOAuthSuccess } = useDonorAuthStore();
  const [status, setStatus] = React.useState('processing');
  const [error, setError] = React.useState(null);

  useEffect(() => {
    const processOAuthSuccess = async () => {
      try {
        setStatus('processing');
        
        // Extract token from URL hash
        const hash = window.location.hash || '';
        const tokenMatch = hash.match(/token=([^&]+)/);
        
        if (tokenMatch && tokenMatch[1]) {
          const token = decodeURIComponent(tokenMatch[1]);
          
          console.log('OAuth: Token extracted from URL, storing in localStorage');
          
          // Store token in localStorage
          localStorage.setItem('donor_jwt', token);
          
          // Set token in axios defaults for immediate use
          apiInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          console.log('OAuth: Token stored and Authorization header set');
          
          // Remove token from URL for security
          if (window.history?.replaceState) {
            const cleanUrl = window.location.pathname + window.location.search;
            window.history.replaceState(null, '', cleanUrl);
          }
          
          // Verify token is stored
          const storedToken = localStorage.getItem('donor_jwt');
          if (!storedToken || storedToken !== token) {
            console.error('OAuth: Token not properly stored in localStorage');
            setStatus('error');
            setError('Failed to store authentication token. Please try again.');
            setTimeout(() => {
              navigate('/donor/login');
            }, 3000);
            return;
          }
          
          // Small delay to ensure token is properly set
          await new Promise(resolve => setTimeout(resolve, 200));
          
          // Verify authentication by calling checkAuth
          console.log('OAuth: Calling handleOAuthSuccess to verify authentication');
          console.log('OAuth: Token in localStorage before API call:', !!localStorage.getItem('donor_jwt'));
          const isAuthenticated = await handleOAuthSuccess();
          console.log('OAuth: Authentication result:', isAuthenticated);
          
          if (isAuthenticated) {
            setStatus('success');
            // Redirect to dashboard after successful OAuth
            setTimeout(() => {
              navigate('/donor/dashboard');
            }, 2000);
          } else {
            setStatus('error');
            setError('OAuth authentication failed. Please try again.');
            // Clear token if auth failed
            localStorage.removeItem('donor_jwt');
            delete apiInstance.defaults.headers.common['Authorization'];
            // If not authenticated, redirect to login after delay
            setTimeout(() => {
              navigate('/donor/login');
            }, 3000);
          }
        } else {
          // No token in URL - check if we have one in localStorage
          const savedToken = localStorage.getItem('donor_jwt');
          if (savedToken) {
            apiInstance.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
            const isAuthenticated = await handleOAuthSuccess();
            
            if (isAuthenticated) {
              setStatus('success');
              setTimeout(() => {
                navigate('/donor/dashboard');
              }, 2000);
            } else {
              setStatus('error');
              setError('OAuth authentication failed. Please try again.');
              localStorage.removeItem('donor_jwt');
              delete apiInstance.defaults.headers.common['Authorization'];
              setTimeout(() => {
                navigate('/donor/login');
              }, 3000);
            }
          } else {
            setStatus('error');
            setError('No authentication token found. Please try logging in again.');
            setTimeout(() => {
              navigate('/donor/login');
            }, 3000);
          }
        }
      } catch (error) {
        console.error('OAuth success handling failed:', error);
        setStatus('error');
        setError(error.message || 'Authentication failed. Please try again.');
        localStorage.removeItem('donor_jwt');
        delete apiInstance.defaults.headers.common['Authorization'];
        setTimeout(() => {
          navigate('/donor/login');
        }, 3000);
      }
    };

    processOAuthSuccess();
  }, [handleOAuthSuccess, navigate]);

  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>;
      case 'success':
        return <CheckCircle className="w-12 h-12 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-12 h-12 text-red-600" />;
      default:
        return <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'processing':
        return 'Processing OAuth authentication...';
      case 'success':
        return 'Authentication successful! Redirecting to dashboard...';
      case 'error':
        return `Authentication failed: ${error}`;
      default:
        return 'Processing...';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gray-100 p-4 rounded-full">
              {getStatusIcon()}
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            OAuth Authentication
          </h1>
          
          <p className="text-gray-600 mb-6">
            {getStatusMessage()}
          </p>
          
          {status === 'error' && (
            <div className="mt-4">
              <button
                onClick={() => navigate('/donor/login')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OAuthSuccess;
