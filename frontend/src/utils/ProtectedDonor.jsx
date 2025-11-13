import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDonorAuthStore } from '../store/donor/useDonorAuthStore.js';

const ProtectedDonor = ({ children, roles = ['donor'] }) => {
    const navigate = useNavigate();
    const { authenticatedUser, checkAuth } = useDonorAuthStore();
    const [authChecked, setAuthChecked] = React.useState(false);

    React.useEffect(() => {
        const verifyAuth = async () => {
            const isAuth = await checkAuth();
            
            if (!isAuth) {
                navigate('/', { replace: true });
                return;
            }
            
            setAuthChecked(true);
        };

        verifyAuth();
    }, [checkAuth, navigate]);

    React.useEffect(() => {
        if (!authChecked) return;

        const allowedRoles = Array.isArray(roles) ? roles : [roles];
        const userRole = authenticatedUser?.Role?.name;

        if (!userRole || !allowedRoles.includes(userRole)) {
            navigate('/', { replace: true });
        }
    }, [authChecked, authenticatedUser, roles, navigate]);

    if (!authChecked) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Verifying authentication...</p>
                </div>
            </div>
        );
    }

    return <>{ children }</>;
};

export default ProtectedDonor;
