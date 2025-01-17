import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Provider/AuthProvider";
import useTrainer from "../hooks/useTrainer";


const TrainerRoute = ({children}) => {
    const {user,loading} = useContext(AuthContext); 
    const [isTrainer, isTrainerLoading] = useTrainer();
    const location = useLocation();

    if(loading || isTrainerLoading){
        return <progress className="progress w-56"></progress>
    }

    if (user && isTrainer) {
        return children;
    }
    return <Navigate to="/login" state={{from: location}} replace></Navigate>
};

export default TrainerRoute;