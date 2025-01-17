import { useContext } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { AuthContext } from "../Provider/AuthProvider";


export default function PrivateRoute({children}) {
    const location=useLocation();
    
    const {user,loading} = useContext(AuthContext)
    if(loading){
        return <div className="flex justify-center items-center"><span className="loading loading-spinner loading-lg"></span></div>
    }
    if(user){
        return children
    }
  return (
    <Navigate to="/login" state={location?.pathname}></Navigate>
  )
}
