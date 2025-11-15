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
        
        // Wait a moment for the backend to process the OAuth
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Handle OAuth success
        const isAuthenticated = await handleOAuthSuccess();
        
        if (isAuthenticated) {
          setStatus('success');
          // Redirect to dashboard after successful OAuth
          setTimeout(() => {
            navigate('/donor/dashboard');
          }, 2000);
        } else {
          setStatus('error');
          setError('OAuth authentication failed');
          // If not authenticated, redirect to login after delay
          setTimeout(() => {
            navigate('/donor/login');
          }, 3000);
        }
      } catch (error) {
        console.error('OAuth success handling failed:', error);
        setStatus('error');
        setError(error.message);
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
