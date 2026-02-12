import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../../services/authService';

const PublicRoute = ({ children }) => {
  return !isAuthenticated() ? children : <Navigate to="/dashboard" />;
};

export default PublicRoute;