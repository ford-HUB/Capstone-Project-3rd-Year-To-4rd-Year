import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBeneficiaryAuthStore } from '../store/beneficiary/useBeneficiaryAuthStore.js';

const ProtectedBeneficiary = ({ children, roles }) => {
    const navigate = useNavigate();
    const { authenticatedUser, checkAuth } = useBeneficiaryAuthStore();
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
            console.log('Unauthorized access: User role', userRole, 'not in allowed roles', allowedRoles);
            navigate('/', { replace: true }); // Redirect to home for unauthorized access
        }
    }, [authChecked, authenticatedUser, roles, navigate]);

    if (!authChecked) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Verifying access...</p>
                </div>
            </div>
        );
    }

    return <>{ children }</>;
};

export default ProtectedBeneficiary;
