import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Provider/AuthProvider";
import useAdmin from "../hooks/useAdmin";
import useTrainer from "../hooks/useTrainer";


const AdminOrTrainerRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext); // User and loading state from context
  const [isAdmin, isAdminLoading] = useAdmin(); // Hook to check admin role
  const [isTrainer, isTrainerLoading] = useTrainer(); // Hook to check trainer role
  const location = useLocation(); // Current location for redirecting back

  // Show a loading indicator while any of the role checks are in progress
  if (loading || isAdminLoading || isTrainerLoading) {
    return <progress className="progress w-56"></progress>;
  }

  // Allow access if the user is either an admin or a trainer
  if (user && (isAdmin || isTrainer)) {
    return children;
  }

  // Redirect unauthorized users to the login page
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default AdminOrTrainerRoute;
