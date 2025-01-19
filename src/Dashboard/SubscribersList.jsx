import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FaSpinner } from "react-icons/fa";
import useAxiosPublic from "../hooks/useAxiosPublic";

const SubscribersList = () => {
  const axiosPublic = useAxiosPublic();

  // Fetch subscribers
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["subscribers"],
    queryFn: async () => {
      const response = await axiosPublic.get("/subscribers");
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-yellow-400 text-4xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-400 font-semibold">
        Failed to load subscribers. {error.message}
      </div>
    );
  }

  return (
    <div className="bg-black text-white py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-yellow-400 text-center mb-8">
          Newsletter Subscribers
        </h2>
        <div className="overflow-x-auto">
          <table className="table w-full border-collapse border border-yellow-400">
            <thead>
              <tr className="bg-yellow-400 text-black">
                <th className="p-3 border border-white">#</th>
                <th className="p-3 border border-white">Name</th>
                <th className="p-3 border border-white">Email</th>
                <th className="p-3 border border-white">Subscribed At</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((subscriber, index) => (
                  <tr
                    key={subscriber._id}
                    className="bg-black hover:bg-gray-700 text-white"
                  >
                    <td className="p-3 text-center border border-white">
                      {index + 1}
                    </td>
                    <td className="p-3 border border-white">
                      {subscriber.name}
                    </td>
                    <td className="p-3 border border-white">
                      {subscriber.email}
                    </td>
                    <td className="p-3 border border-white">
                      {new Date(subscriber.subscribedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-3 border border-gray-700">
                    No subscribers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubscribersList;
