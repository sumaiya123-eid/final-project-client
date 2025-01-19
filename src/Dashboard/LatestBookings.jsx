import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FaSpinner } from "react-icons/fa";
import useAxiosPublic from "../hooks/useAxiosPublic";

const LatestBookings = () => {
  const axiosPublic = useAxiosPublic();

  // Fetch latest bookings
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["latestBookings"],
    queryFn: async () => {
      const response = await axiosPublic.get("/latest-booking");
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
        Failed to load booking transactions. {error.message}
      </div>
    );
  }

  return (
    <div className="bg-black text-white py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-yellow-400 text-center mb-8">
          Latest Booking Transactions
        </h2>
        <div className="overflow-x-auto">
          <table className="table w-full border-collapse border border-yellow-400">
            <thead>
              <tr className="bg-yellow-400 text-black">
                <th className="p-3 border border-black">#</th>
                <th className="p-3 border border-black">Name</th>
                <th className="p-3 border border-black">Email</th>
                <th className="p-3 border border-black">Plan</th>
                <th className="p-3 border border-black">Day</th>
                <th className="p-3 border border-black">Price ($)</th>
                <th className="p-3 border border-black">Payment ID</th>
                <th className="p-3 border border-black">Date</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((transaction, index) => (
                  <tr
                    key={transaction._id}
                    className="bg-black hover:bg-gray-700 text-white"
                  >
                    <td className="p-3 text-center border border-gray-700">
                      {index + 1}
                    </td>
                    <td className="p-3 border border-gray-700">
                      {transaction.name}
                    </td>
                    <td className="p-3 border border-gray-700">
                      {transaction.email}
                    </td>
                    <td className="p-3 border border-gray-700">
                      {transaction.selectedPlan}
                    </td>
                    <td className="p-3 border border-gray-700">
                      {transaction.selectedDay}
                    </td>
                    <td className="p-3 border border-gray-700">
                      {transaction.price}
                    </td>
                    <td className="p-3 border border-gray-700">
                      {transaction.paymentIntentId}
                    </td>
                    <td className="p-3 border border-gray-700">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center p-3 border border-gray-700">
                    No transactions found.
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

export default LatestBookings;
