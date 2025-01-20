import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";


const TrainersList = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  // Fetching all trainers with React Query
  const { data: trainers = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["trainers"],  // Use `queryKey` instead of the array argument
    queryFn: async () => {
      const response = await axiosSecure.get("/trainers"); // Make sure /trainers returns all trainers
      return response.data;
    },
  });

  // Function to delete a trainer and change their role to Member
  const handleDelete = async (email) => {
    const confirmation = await Swal.fire({
      title: "Are you sure?",
      text: "This action will change the user's role to 'member'.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, proceed!",
      cancelButtonText: "Cancel",
    });
  
    if (confirmation.isConfirmed) {
      try {
        await axiosSecure.patch(`/users/updateRole/${email}`, { role: "member" }); // Changing role to 'member'
        refetch(); // Trigger refetch to update the list after deletion
        Swal.fire("Success!", "The user's role has been updated to 'member'.", "success");
      } catch (error) {
        console.error("Error deleting trainer:", error);
        Swal.fire("Error!", "There was an issue updating the user's role.", "error");
      }
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load trainers.</p>;

  return (
    <div className=" w-10/12 mx-auto mt-10 min-h-screen">
       <Helmet>
                    <title>FitTrick | Dashboard | All Trainers</title>
                  </Helmet>
      <h2 className="text-2xl text-yellow-500 font-bold mb-6">All Trainers</h2>
      {trainers.length > 0 ? (
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-yellow-500">
              <th className="border border-gray-200 px-4 py-2">Name</th>
              <th className="border border-gray-200 px-4 py-2">Email</th>
              <th className="border border-gray-200 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trainers.map((trainer) => (
              <tr key={trainer.email}>
                <td className="border border-gray-200 px-4 py-2 text-white">{trainer.fullName}</td>
                <td className="border border-gray-200 px-4 py-2 text-white">{trainer.email}</td>
                <td className="border flex justify-center gap-10 border-gray-200 px-4 py-2 text-white">
                  <button
                    onClick={() => navigate(`/users/${trainer.email}`)}
                    className="btn bg-yellow-500 text-black font-bold border-none"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => handleDelete(trainer.email)}  // Trigger delete
                    className="btn btn-danger ml-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No trainers available.</p>
      )}
    </div>
  );
};

export default TrainersList;
