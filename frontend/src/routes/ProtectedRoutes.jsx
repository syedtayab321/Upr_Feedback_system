import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProfile } from './../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // If we have a token but user is not authenticated, try to fetch profile
    if (!isAuthenticated && localStorage.getItem('token')) {
      dispatch(fetchProfile());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    // Redirect if not authenticated after loading
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }

    // Redirect if user doesn't have required role
    if (!isLoading && isAuthenticated && requiredRole && user?.role !== requiredRole) {
      navigate('/unauthorized', { replace: true });
    }
  }, [isLoading, isAuthenticated, user, requiredRole, navigate]);

  if (isLoading || (!isAuthenticated && localStorage.getItem('token'))) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 scrollbar-transparent">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 border-t-primary-600"></div>
      </div>
    );
  }

  return isAuthenticated ? children : null;
};

export default ProtectedRoute;