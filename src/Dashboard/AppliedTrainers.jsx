import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";

const AppliedTrainers = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  // Fetching applied trainers with React Query
  const { data: appliedTrainers = [], isLoading, isError } = useQuery({
    queryKey: ["appliedTrainers"],
    queryFn: async () => {
      const response = await axiosSecure.get("/appliedTrainer");
      console.log(response.data); // Add this to verify the data
      return response.data;
    },
  });
  

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load applied trainers.</p>;

  return (
    <div className="w-10/12 mx-auto my-10">
      <h2 className="text-2xl font-bold mb-6">Applied Trainers</h2>
      {appliedTrainers.length > 0 ? (
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 px-4 py-2">Name</th>
              <th className="border border-gray-200 px-4 py-2">Email</th>
              <th className="border border-gray-200 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appliedTrainers.map((trainer) => (
              <tr key={trainer.email}>
                <td className="border border-gray-200 px-4 py-2">{trainer.fullName}</td>
                <td className="border border-gray-200 px-4 py-2">{trainer.email}</td>
                <td className="border border-gray-200 px-4 py-2">
                  <button
                    onClick={() => navigate(`/dashboard/appliedTrainerDetail/${trainer.email}`)}
                    className="btn btn-primary"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No trainer applications available.</p>
      )}
    </div>
  );
};

export default AppliedTrainers;
