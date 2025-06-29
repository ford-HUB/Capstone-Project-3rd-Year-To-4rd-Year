import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/participant/useAuth';

const ProtectedStudent = ({ children, roles }) => {
    const navigate = useNavigate();
    const { authenticatedUser, checkAuth } = useAuth();
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
            navigate('/', { replace: true }); // need pani diri unauthorize redirect route
        }
    }, [authChecked, authenticatedUser, roles, navigate]);

    if (!authChecked) {
        return null
    }

    return <>{ children }</>;
};

export default ProtectedStudent;