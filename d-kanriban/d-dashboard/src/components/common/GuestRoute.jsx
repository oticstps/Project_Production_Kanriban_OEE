import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const GuestRoute = ({ children }) => {
  const { user } = useAuth();

  if (user) {
    // Redirect authenticated users away from auth pages
    return <Navigate to="/manhour" replace />;
  }

  return children;
};

export default GuestRoute;