import React from 'react';
import { useActionData, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/management/useAuthStore.js';

const ProtectedManagement = ({ children, roles = [] }) => {
    const navigate = useNavigate()
    const { authenticatedManagement, checkAuth } = useAuthStore()
    const [authChecked, setAuthChecked] = React.useState(false)

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
        const userRole = authenticatedManagement?.Role?.name;
        console.log(userRole)

        if (!userRole || !allowedRoles.includes(userRole)) {
            navigate('/', { replace: true }); // need pani diri custom unauthorize redirect route
        }
    }, [authChecked, authenticatedManagement, roles, navigate]);

    if (!authChecked) {
        return null
    }

    return <>{ children }</>;
};

export default ProtectedManagement;