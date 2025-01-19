import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  FaEye,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaBirthdayCake,
  FaUserAlt,
  FaClock,
  FaEnvelope,
  FaStar,
  FaToolbox,
  FaListAlt,
  FaExclamationCircle,
  FaTimes,
} from "react-icons/fa"; // Import specific icons
import useAxiosPublic from "../hooks/useAxiosPublic";

const ActivityLog = () => {
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [rejectionFeedback, setRejectionFeedback] = useState("");
  const [loadingFeedback, setLoadingFeedback] = useState(false); // For modal loading feedback
  const [selectedTrainer, setSelectedTrainer] = useState(null); // Selected trainer email

  const {
    data: trainerStatus = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["trainerStatus"],
    queryFn: async () => {
      const { data } = await axiosPublic.get("/users");
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <progress className="progress w-56"></progress>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        Error loading trainers!
      </div>
    );
  }

  const handleRejectionClick = async (email) => {
    setSelectedTrainer(email); // Set the selected trainer
    setLoadingFeedback(true);
    setModalOpen(true);

    try {
      const { data } = await axiosPublic.get(`/users/${email}`); // Fetch rejection feedback
      setRejectionFeedback(
        data.rejectionFeedback || "No rejection feedback provided."
      );
    } catch (error) {
      console.error("Error fetching rejection feedback:", error);
      setRejectionFeedback("Failed to load rejection feedback.");
    } finally {
      setLoadingFeedback(false);
    }
  };

  return (
    <section className="bg-black py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-white mb-8 text-center drop-shadow-lg">
          Activity Log
        </h2>
        <div className="overflow-x-auto">
          <table className="table w-full text-center text-white font-bold">
            <thead className="*:text-yellow-400 *:font-bold">
              <tr>
                <th>Profile</th>
                <th>Name</th>
                <th>Age</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trainerStatus
                .filter(
                  (trainer) =>
                    trainer.status === "pending" ||
                    trainer.status === "rejected"
                )
                .map((trainer) => (
                  <tr key={trainer._id}>
                    <td>
                      <div className="w-12 h-12 rounded-full p-1 bg-gradient-to-r from-blue-500 via-green-400 to-blue-500 mx-auto">
                        <img
                          src={trainer.profileImage || "/default-avatar.jpg"}
                          alt={trainer.fullName}
                          className="w-full h-full rounded-full shadow-lg"
                        />
                      </div>
                    </td>
                    <td>{trainer.fullName}</td>
                    <td>{trainer.age || "N/A"}</td>
                    <td>{trainer.email}</td>
                    <td>{trainer.status}</td>
                    <td className="flex justify-center items-center">
                      <button
                        className="bg-white text-blue-600 p-2 rounded-full shadow-md hover:bg-blue-600 hover:text-white transition-colors duration-300"
                        onClick={() => handleRejectionClick(trainer.email)}
                      >
                        <FaEye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Modal for Rejection Feedback */}
        {modalOpen && (
          <div className="fixed inset-0 bg-yellow-200 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-black rounded-lg p-6 w-96">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                {selectedTrainer
                  ? `Feedback for ${selectedTrainer}`
                  : "Trainer Feedback"}
                <FaExclamationCircle size={20} className="text-red-500" />
              </h3>
              <div className="mt-4 text-gray-600">
                {loadingFeedback ? (
                  <div className="flex justify-center items-center">
                    <progress className="progress w-28"></progress>
                  </div>
                ) : (
                  // Check if the trainer's status is pending
                  <p
                    className={`text-${
                      trainerStatus.find(
                        (trainer) => trainer.email === selectedTrainer
                      )?.status === "pending"
                        ? "yellow"
                        : "red"
                    }-500`}
                  >
                    {trainerStatus.find(
                      (trainer) => trainer.email === selectedTrainer
                    )?.status === "pending"
                      ? "Pending"
                      : rejectionFeedback}
                  </p>
                )}
              </div>
              <div className="flex justify-end mt-6">
                <button
                  className="btn rounded-full p-3 bg-red-500 text-white hover:bg-red-600"
                  onClick={() => setModalOpen(false)}
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ActivityLog;
