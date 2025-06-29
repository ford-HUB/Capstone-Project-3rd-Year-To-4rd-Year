import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthHooks } from '../hooks/staff/useAuthHooks.js';
import { toast } from 'react-hot-toast';

const StaffRequestToken = ({ children }) => {
    const { token } = useParams();
    const { verifyStaffRequestToken } = useAuthHooks();
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [verified, setVerified] = React.useState(false);

    React.useEffect(() => {
    const verifyToken = async () => {
        try {
            setLoading(true);
            const response = await verifyStaffRequestToken(token);
            
            if (response?.valid) {
                // Additional expiration check on client side
                const now = new Date();
                const expiresAt = new Date(response.expireAt);
                
                if (now > expiresAt) {
                    const errorMsg = 'This invitation link has expired';
                    setError(errorMsg);
                    toast.error(errorMsg);
                    setTimeout(() => navigate('/'), 3000);
                    return;
                }

                setVerified(true);
                toast.success(response.message);
            } else {
                const errorMsg = response?.message || 'Invalid or expired token';
                setError(errorMsg);
                toast.error(errorMsg);
                setTimeout(() => navigate('/'), 3000);
            }
            } catch (err) {
                const errorMsg = err.response?.data?.message || 'Verification failed';
                setError(errorMsg);
                toast.error(errorMsg);
                setTimeout(() => navigate('/'), 3000);
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, [token, navigate, verifyStaffRequestToken])

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <p className="text-lg">Verifying your token...</p>
                    <p className="text-sm text-gray-500 mt-2">Please wait while we validate your invitation</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-md mx-auto flex flex-col justify-center items-center h-screen text-center">
                <div className="bg-red-100 text-3xl text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
                <p className="text-gray-600">Redirecting to home page...</p>
            </div>
        );
    }

    if (verified) {
        return React.cloneElement(children, { permissionToken: token });
    }

    return null;
};

export default StaffRequestToken;