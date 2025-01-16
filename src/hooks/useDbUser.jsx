import { useQuery } from "@tanstack/react-query";
import { useContext } from "react"; // Don't forget to import useContext
import { AuthContext } from "../Provider/AuthProvider";
import useAxiosPublic from "./useAxiosPublic";

const useUser = () => {
    const { user, loading } = useContext(AuthContext); // Make sure user and loading are being pulled correctly from AuthContext
    const axiosPublic = useAxiosPublic();

    const { data: currentUser, error } = useQuery({
        queryKey: [user?.email, 'user'], // Query key with email and 'user'
        enabled: !loading && !!user?.email, // Ensure the query runs only when the user is loaded
        queryFn: async () => {
            const res = await axiosPublic.get(`/users/${user.email}`); // Corrected URL
            return res.data;
        }
    });

    return [currentUser, error];
};

export default useUser;
