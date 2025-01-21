import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { Helmet } from "react-helmet-async";

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
      <Helmet>
                    <title>FitConnect | Dashboard | Applied Trainer</title>
                  </Helmet>
      <h2 className="text-2xl text-yellow-500 font-bold mb-6">Applied Trainers</h2>
      {appliedTrainers.length > 0 ? (
        <table className="table-auto w-full bg-y border-collapse border border-gray-200">
          <thead>
            <tr className="bg-yellow-500">
              <th className="border border-gray-200 px-4 py-2">Name</th>
              <th className="border border-gray-200 px-4 py-2">Email</th>
              <th className="border border-gray-200 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appliedTrainers.map((trainer) => (
              <tr key={trainer.email}>
                <td className="border border-gray-200 px-4 py-2 text-white">{trainer.fullName}</td>
                <td className="border border-gray-200 px-4 py-2 text-white">{trainer.email}</td>
                <td className="border border-gray-200 px-4 py-2 text-white flex justify-center">
                  <button
                    onClick={() => navigate(`/dashboard/appliedTrainerDetail/${trainer.email}`)}
                    className="btn bg-white text-black"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-white">No trainer applications available.</p>
      )}
    </div>
  );
};

export default AppliedTrainers;
