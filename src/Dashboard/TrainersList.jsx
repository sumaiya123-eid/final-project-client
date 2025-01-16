import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";


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
    try {
      await axiosSecure.patch(`/users/updateRole/${email}`, { role: "member" });  // Changing role to 'member'
      refetch(); // Trigger refetch to update the list after deletion
    } catch (error) {
      console.error("Error deleting trainer:", error);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load trainers.</p>;

  return (
    <div className="w-10/12 mx-auto my-10">
      <h2 className="text-2xl font-bold mb-6">All Trainers</h2>
      {trainers.length > 0 ? (
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 px-4 py-2">Name</th>
              <th className="border border-gray-200 px-4 py-2">Email</th>
              <th className="border border-gray-200 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trainers.map((trainer) => (
              <tr key={trainer.email}>
                <td className="border border-gray-200 px-4 py-2">{trainer.fullName}</td>
                <td className="border border-gray-200 px-4 py-2">{trainer.email}</td>
                <td className="border border-gray-200 px-4 py-2">
                  <button
                    onClick={() => navigate(`/dashboard/trainerDetail/${trainer.email}`)}
                    className="btn btn-primary"
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
