import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../Provider/AuthProvider";
import useAxiosSecure from "./useAxiosSecure";



const useTrainer = () => {
    const { user, loading } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
  
    const { data: isTrainer = false, isPending: isTrainerLoading } = useQuery({
      queryKey: [user?.email, 'isTrainer'],
      enabled: !loading && !!user?.email,
      queryFn: async () => {
        try {
          const res = await axiosSecure.get(`/users/trainer/${user.email}`);
          return res.data?.trainer ?? false; // Default to false if undefined
        } catch (error) {
          console.error('Error fetching trainer data:', error);
          return false; // Return a default value on error
        }
      },
    });
  
    return [isTrainer, isTrainerLoading];
  };
  

export default useTrainer;