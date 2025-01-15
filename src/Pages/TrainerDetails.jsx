import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../hooks/useAxiosPublic";
import img from "../assets/images/exercise6.jpg";

const TrainerDetails = () => {
  const { email } = useParams();
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  const { data: trainer, isLoading, isError } = useQuery({
    queryKey: ["trainer", email],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`/users/${email}`);
      return data;
    },
  });
  console.log(trainer);

  if (isLoading) {
    return <div>Loading trainer details...</div>;
  }

  if (isError) {
    return <div>Error loading trainer details!</div>;
  }

  // Helper function to handle skills and availableDays
  const parseData = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;  // Already an array
    if (typeof data === "string") return data.split(",");  // Convert string to array
    return [];
  };

  const skills = parseData(trainer.skills);
  const availableDays = parseData(trainer.availableDays);

  return (
    <section className="bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Trainer Info */}
          <div className="bg-white shadow-lg rounded-lg p-6 transition-all transform hover:scale-105 hover:shadow-xl hover:opacity-90 animate__animated animate__fadeIn animate__delay-1s">
            <img
              src={trainer.profileImage || "/default-avatar.jpg"} // Default image fallback
              alt={trainer.fullName}
              className="w-full h-auto rounded-lg shadow-lg mb-6 transition-transform duration-500 transform hover:scale-105"
            />
            <h2 className="text-3xl font-bold text-gray-800">{trainer.fullName}</h2>
            <p className="text-gray-600 mt-2">Age: {trainer.age || "N/A"}</p>
            <p className="text-gray-600 mt-4">Skills: {skills.join(", ")}</p>
            <p className="text-gray-600 mt-4">Available Days: {availableDays.join(", ")}</p>
            <p className="text-gray-600 mt-4">Available Time: {trainer.availableTime || "Not specified"}</p>
          </div>

          {/* Available Slots */}
          <div className="bg-white shadow-lg rounded-lg p-6 transition-all transform hover:scale-105 hover:shadow-xl hover:opacity-90 animate__animated animate__fadeIn animate__delay-2s">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Available Slots</h3>
            <div className="space-y-4">
              {availableDays.length > 0 ? (
                availableDays.map((day, index) => (
                  <button
                    key={index}
                    className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transform transition-transform duration-300 hover:scale-105"
                    onClick={() => navigate(`/trainer-booked/${trainer.email}?day=${day}`)} // Redirect to Trainer Booked page
                  >
                    Book for {day}
                  </button>
                ))
              ) : (
                <p className="text-gray-600">No available slots at the moment.</p>
              )}
            </div>
          </div>
        </div>

        {/* Become a Trainer Section */}
        <div
          className="mt-12 py-20 bg-cover bg-center relative text-center"
          style={{ backgroundImage: `url(${img})` }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div> {/* Overlay */}
          <div className="relative z-10">
            <h4 className="text-3xl font-bold text-white mb-6">Want to be a Trainer?</h4>
            <p className="text-xl text-white mb-6">
              Join our community of trainers and help people achieve their fitness goals!
            </p>
            <button
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md transform transition-all duration-300 hover:scale-110"
              onClick={() => navigate("/become-trainer")} // Redirect to Become a Trainer page
            >
              Become a Trainer
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrainerDetails;
