import { Navigate } from 'react-router-dom';
import { useUserStore } from '../../../storage/storage';
const ProtectedRoute = ({ children }) => {
    const user = useUserStore((state) => state.user);
    return user ? children : <Navigate to="/" replace/>;
};
export default ProtectedRoute;
