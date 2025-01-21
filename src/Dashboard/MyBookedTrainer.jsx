import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FaUserAlt,
  FaEnvelope,
  FaBriefcase,
  FaClock,
  FaRegCalendarAlt,
  FaMoneyBillWaveAlt,
  FaRegCheckCircle,
  FaListAlt,
  FaToolbox,
  FaBirthdayCake,
  FaStar,
} from "react-icons/fa";
import { AuthContext } from "../Provider/AuthProvider";
import ReactStars from "react-rating-stars-component";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { Helmet } from "react-helmet-async";

const MyBookedTrainer = () => {
  const { user } = useContext(AuthContext); // Get user info from context
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const [isModalOpen, setModalOpen] = useState(false); // Modal state
  const [reviewData, setReviewData] = useState({ rating: 0, feedback: "" }); // Review data state

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

  // If no trainer is booked, show a message instead of an error
  if (!data || !data.booking || !data.trainer) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">No trainer booked yet.</p>
      </div>
    );
  }

  const { booking, trainer = { skills: [], classes: [] } } = data;

  // Handle form submission
  const handleReviewSubmit = async () => {
    if (!user?.email) {
      Swal.fire("Error", "User email is missing. Cannot submit review.", "error");
      return;
    }

    try {
      const payload = {
        userId: user.email, // Use the user's email as the identifier
        trainerEmail: trainer.email,
        rating: reviewData.rating,
        feedback: reviewData.feedback,
      };
      console.log("Submitting Payload:", payload);

      const response = await axiosSecure.post("/reviews", payload);
      Swal.fire("Success", "Your review has been submitted!", "success");

      // Clear the modal content and close it after successful submission
      setReviewData({ rating: 0, feedback: "" });
      setModalOpen(false); // Close the modal
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed to submit review", "error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-black text-white animate__animated animate__fadeInUp">
      <Helmet>
                    <title>FitTrick | Dashboard | Booked Trainer</title>
                  </Helmet>
      <h2 className="text-3xl font-semibold text-yellow-500 mb-6 text-center">Booked Trainer Details</h2>

      {/* Trainer Info */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-yellow-400 mb-4">Trainer Information</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <FaUserAlt size={24} className="text-yellow-500" />
            <p className="text-xl font-medium">Name: {trainer.fullName || "Not available"}</p>
          </div>

          <div className="flex items-center space-x-3">
            <FaEnvelope size={24} className="text-yellow-500" />
            <p className="text-xl font-medium">Email: {trainer.email || "Not available"}</p>
          </div>
          <div className="flex items-center space-x-3">
            <FaBirthdayCake size={24} className="text-yellow-500" />
            <p className="text-xl font-medium">Age: {trainer.age || "Not available"}</p>
          </div>

          <div className="flex items-center space-x-3">
            <FaClock size={24} className="text-yellow-500" />
            <p className="text-xl font-medium">Available Time: {trainer.availableTime || "Not specified"}</p>
          </div>

          <div className="flex items-center space-x-3">
            <FaToolbox size={24} className="text-yellow-500" />
            <p className="text-xl font-medium">Experience: {trainer.experience || "Not specified"}</p>
          </div>
        </div>

        {/* Skills */}
        <div>
          <h3 className="text-xl font-medium flex items-center gap-2 text-yellow-400">
            <FaStar className="text-yellow-500" /> <p className="text-white">Skills:</p>
          </h3>
          <div className="flex gap-3 flex-wrap">
  {trainer.skills?.length > 0 ? (
    trainer.skills.map((skill, index) => (
      <button
        key={index}
        className="text-xs font-medium text-black bg-yellow-500 px-3 py-1 rounded-lg hover:bg-yellow-600 transition duration-200"
      >
        {skill}
      </button>
    ))
  ) : (
    <p className="text-gray-600">No skills available.</p>
  )}
</div>

        </div>

         {/* slots */}
         <div>
          <h3 className="text-xl font-medium flex items-center gap-2 text-yellow-400">
            <FaStar className="text-yellow-500" /> <p className="text-white">Slots:</p>
          </h3>
          <div className="flex gap-3 flex-wrap">
  {trainer.availableDays?.length > 0 ? (
    trainer.availableDays.map((slot, index) => (
      <button
        key={index}
        className="text-xs font-medium text-black bg-yellow-500 px-3 py-1 rounded-lg hover:bg-yellow-600 transition duration-200"
      >
        {slot}
      </button>
    ))
  ) : (
    <p className="text-gray-600">No slot available.</p>
  )}
</div>

        </div>

        {/* Classes */}
        <div>
          <h3 className="text-xl font-medium flex items-center gap-2 text-yellow-400">
            <FaListAlt className="text-yellow-500" /> <p className="text-white">Classes:</p>
          </h3>
          <div className="flex gap-3 flex-wrap">
  {trainer.classes?.length > 0 ? (
    trainer.classes.map((classItem, index) => (
      <button
        key={index}
        className="text-xs font-medium text-black bg-yellow-500 px-3 py-1 rounded-lg hover:bg-yellow-600 transition duration-200"
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
        <h3 className="text-2xl font-bold text-yellow-400 mb-4">Booking Information</h3>

        <div className="flex items-center space-x-3">
          <FaRegCheckCircle size={24} className="text-yellow-500" />
          <p className="text-xl font-medium">Selected Plan: {booking.selectedPlan || "Not available"}</p>
        </div>

        <div className="flex items-center space-x-3">
          <FaRegCalendarAlt size={24} className="text-yellow-500" />
          <p className="text-xl font-medium">Selected Slot: {booking.selectedDay || "Not available"}</p>
        </div>

        <div className="flex items-center space-x-3">
          <FaMoneyBillWaveAlt size={24} className="text-yellow-500" />
          <p className="text-xl font-medium">Price: ${booking.price || "N/A"}</p>
        </div>
      </div>

      {/* Review Button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => setModalOpen(true)}
          className="btn bg-yellow-500 text-black w-full md:w-1/2 py-3 border-none rounded-lg hover:bg-yellow-600 transition-all ease-in-out duration-200"
        >
          Leave a Review
        </button>
      </div>

      {/* Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold text-yellow-500 mb-4">Leave a Review</h2>
            <textarea
              value={reviewData.feedback}
              onChange={(e) =>
                setReviewData((prev) => ({ ...prev, feedback: e.target.value }))
              }
              className="w-full h-24 p-2 border border-yellow-500 rounded-md mb-4 text-black"
              placeholder="Write your feedback..."
            ></textarea>
            <div className="flex items-center justify-between mb-4">
              <p className="font-medium text-black">Rating:</p>
              <ReactStars
                count={5}
                size={40}
                value={reviewData.rating}
                onChange={(newRating) =>
                  setReviewData((prev) => ({ ...prev, rating: newRating }))
                }
                activeColor="#ffd700"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setModalOpen(false)}
                className="btn bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleReviewSubmit}
                className="btn bg-yellow-500 text-black px-4 py-2 rounded-lg"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookedTrainer;
