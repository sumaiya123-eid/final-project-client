import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FaUserAlt,
  FaEnvelope,
  FaBriefcase,
  FaClock,
  FaStar,
  FaRegCalendarAlt,
  FaMoneyBillWaveAlt,
  FaRegCheckCircle,
  FaListAlt,
  FaToolbox,
  FaBirthdayCake,
} from "react-icons/fa";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { AuthContext } from "../Provider/AuthProvider";

const MyBookedTrainer = () => {
  const { user } = useContext(AuthContext); // Get user info from context
  const axiosPublic = useAxiosPublic();

  // Fetch booking and trainer data using the logged-in user's email
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["bookedTrainer", user?.email],
    queryFn: async () => {
      if (!user?.email) {
        throw new Error("User email is not provided.");
      }
      const { data } = await axiosPublic.get(`/booked-trainer/${user.email}`);
      return data; // This contains both booking and trainer details
    },
    enabled: !!user?.email, // Only run the query if user email is available
  });

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <progress className="progress w-56"></progress>
      </div>
    );
  }

  // Show error if something goes wrong with fetching data
  if (isError) {
    return <div className="text-red-500 text-center">Error: {error.message}</div>;
  }

  // If no data is returned, show a message
  if (!data || !data.booking || !data.trainer) {
    return <div className="text-center text-gray-500">No booking or trainer details found.</div>;
  }

  const { booking, trainer } = data;

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white animate__animated animate__fadeInUp">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Booked Trainer Details</h2>

      {/* Trainer Info */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-gray-700 mb-4">Trainer Information</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <FaUserAlt size={24} className="text-blue-500" />
            <p className="text-xl font-medium">Name: {trainer.fullName || "Not available"}</p>
          </div>

          <div className="flex items-center space-x-3">
            <FaEnvelope size={24} className="text-green-500" />
            <p className="text-xl font-medium">Email: {trainer.email || "Not available"}</p>
          </div>

          <div className="flex items-center space-x-3">
            <FaBirthdayCake size={24} className="text-green-500" />
            <p className="text-xl font-medium">Age: {trainer.age || "Not available"}</p>
          </div>

          <div className="flex items-center space-x-3">
            <FaClock size={24} className="text-purple-500" />
            <p className="text-xl font-medium">Available Time: {trainer.availableTime || "Not specified"}</p>
          </div>

          <div className="flex items-center space-x-3">
            <FaToolbox size={24} className="text-orange-500" />
            <p className="text-xl font-medium">Experience: {trainer.experience || "Not specified"}</p>
          </div>
        </div>

        {/* Skills */}
<div>
  <h3 className="text-xl font-medium flex items-center gap-2 text-gray-700">
    <FaStar className="text-yellow-500" /> <p className="text-black">Skills:</p>
  </h3>
  <div className="flex gap-3 flex-wrap">
    {trainer.skills.length > 0 ? (
      trainer.skills.slice(0, 3).map((skill, index) => (
        <button
          key={index}
          className="text-xs font-medium text-white bg-blue-500 px-3 py-1 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          {skill}
        </button>
      ))
    ) : (
      <p className="text-gray-600">No skills available.</p>
    )}
  </div>
</div>

{/* Classes */}
<div>
  <h3 className="text-xl font-medium flex items-center gap-2 text-gray-700">
    <FaListAlt className="text-green-500" /> <p className="text-black">Classes:</p>
  </h3>
  <div className="flex gap-3 flex-wrap">
    {trainer.classes.length > 0 ? (
      trainer.classes.slice(0, 3).map((classItem, index) => (
        <button
          key={index}
          className="text-xs font-medium text-white bg-green-500 px-3 py-1 rounded-lg hover:bg-green-600 transition duration-200"
        >
          {classItem}
        </button>
      ))
    ) : (
      <p className="text-gray-600">No classes available.</p>
    )}
  </div>
</div>

       </div>

      {/* Booking Info */}
      <div className="space-y-6 mt-6">
        <h3 className="text-2xl font-bold text-gray-700 mb-4">Booking Information</h3>
        
        <div className="flex items-center space-x-3">
          <FaRegCheckCircle size={24} className="text-green-500" />
          <p className="text-xl font-medium">Selected Plan: {booking.selectedPlan || "Not available"}</p>
        </div>

        <div className="flex items-center space-x-3">
          <FaRegCalendarAlt size={24} className="text-blue-500" />
          <p className="text-xl font-medium">Selected Day: {booking.selectedDay || "Not available"}</p>
        </div>

        <div className="flex items-center space-x-3">
          <FaMoneyBillWaveAlt size={24} className="text-purple-500" />
          <p className="text-xl font-medium">Price: ${booking.price || "N/A"}</p>
        </div>
      </div>

      {/* Review Button */}
      <div className="mt-6 flex justify-center">
        <button className="btn btn-primary w-full md:w-1/2 py-3 rounded-lg hover:bg-blue-600 transition-all ease-in-out duration-200">
          Leave a Review
        </button>
      </div>
    </div>
  );
};

export default MyBookedTrainer;
