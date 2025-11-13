import React from "react";
import { useAuthStore } from "../store/director/useAuthStore.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ProtectedDirector = ({ children }) => {
  const navigate = useNavigate();
  const { authenticatedDirector, checkAuth } = useAuthStore();
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const authChecker = async () => {
      try {
        const isAuthenticated = await checkAuth();
        if (!isAuthenticated) {
          navigate('/one-secret/login', { replace: true });
        }
      } catch (err) {
        if (err.response?.status === 429) {
          toast.error("Too many attempts! Please wait a few minutes.");
        } else {
          setError("Authentication failed. Please try again.");
        }
      }
    };
    authChecker();
  }, [checkAuth, navigate]);

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (!authenticatedDirector) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedDirector