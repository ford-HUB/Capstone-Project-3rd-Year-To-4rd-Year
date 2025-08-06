import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/staff/useAuthStore.js';

const ProtectedStaff = ({ children, roles = [] }) => {
    const navigate = useNavigate();
    const { authenticatedStaff, checkAuth } = useAuthStore();
    const [authChecked, setAuthChecked] = React.useState(false);

    React.useEffect(() => {
        const verifyAuth = async () => {
            const isAuth = await checkAuth();
            
            if (!isAuth) {
                navigate('/secret staff/login', { replace: true });
                return;
            }
            
            setAuthChecked(true);
        };

        verifyAuth();
    }, [checkAuth, navigate]);

    React.useEffect(() => {
        if (!authChecked) return;

        const allowedRoles = Array.isArray(roles) ? roles : [roles];
        const userRole = authenticatedStaff?.Role?.name;

        if (!userRole || !allowedRoles.includes(userRole)) {
            navigate('/', { replace: true }); // need pani diri unauthorize redirect route
        }
    }, [authChecked, authenticatedStaff, roles, navigate]);

    if (!authChecked) {
        return null
    }

    return <>{ children }</>;
};

export default ProtectedStaff;