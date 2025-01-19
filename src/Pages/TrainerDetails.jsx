import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { FaBirthdayCake, FaClock, FaEnvelope, FaStar, FaUserAlt, FaArrowRight, FaListAlt } from "react-icons/fa";
import { FaRegUser, FaToolbox } from "react-icons/fa6";
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

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen text-lg font-semibold">Loading trainer details...</div>;
  }

  if (isError || !trainer || trainer.status !== "approved") {
    return (
      <div className="flex items-center justify-center h-screen text-lg text-red-500 font-semibold">
        Error: Unable to load trainer details or trainer is not approved.
      </div>
    );
  }

  // Helper function to handle skills and availableDays
  const parseData = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === "string") return data.split(",");
    return [];
  };

  const skills = parseData(trainer.skills);
  const availableDays = parseData(trainer.availableDays);

  return (
    <section className="bg-black  py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trainer Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="card shadow-xl bg-yellow-500 p-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
            <div className="relative">
              <div className="rounded-full p-1 bg-black w-48 h-48 mx-auto">
                <img
                  src={trainer.profileImage || "/default-avatar.jpg"}
                  alt={trainer.fullName}
                  className="w-full h-full rounded-full shadow-lg transform transition-transform duration-500 hover:scale-110"
                />
              </div>
            </div>
            <div className="mt-4 space-y-2 *:text-black font-semibold text-center">
              <h2 className="text-2xl font-semibold flex items-center gap-2 justify-center text-gray-800">
                <FaUserAlt className="text-blue-500" /> {trainer.fullName}
              </h2>
              <p className="text-gray-600 text-sm flex items-center justify-center gap-2">
                <FaBirthdayCake className="text-red-500" /> Age : {trainer.age || "N/A"}
              </p>
              <p className="text-gray-600 text-sm flex items-center justify-center gap-2">
                <FaEnvelope className="text-green-500" /> Email : {trainer.email}
              </p>
              <p className="text-gray-600 text-sm flex items-center justify-center gap-2">
                <FaClock className="text-purple-500" /> Available Time : {trainer.availableTime || "Not specified"}
              </p>
              <p className="text-gray-600 text-sm flex items-center justify-center gap-2">
                <FaToolbox className="text-orange-500" /> Experience : {trainer.experience || "Not specified"}
              </p>
              <div className="mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-black mb-2">
                  <FaStar className="text-black" /> Skills :
                </h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {skills.length > 0 ? (
                    skills.map((skill, index) => (
                      <button
                        key={index}
                        className="btn btn-sm bg-blue-500 hover:bg-blue-600 text-black border-black rounded-md shadow-md px-4 py-1 transition-transform duration-200 hover:scale-105"
                      >
                        {skill}
                      </button>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No skills available.</p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-black mb-2">
                  <FaListAlt className="text-green-500" /> Classes :
                </h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {trainer.classes.length > 0 ? (
                    trainer.classes.map((classItem, index) => (
                      <button
                        key={index}
                        className="btn btn-sm bg-green-500 hover:bg-green-600 text-black border-black rounded-md shadow-md px-4 py-1 transition-transform duration-200 hover:scale-105"
                      >
                        {classItem}
                      </button>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No classes available.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

           {/* Available Slots */}
           <div className="card bg-yellow-500 shadow-xl p-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Available Slots</h3>
            {availableDays.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {availableDays.map((day, index) => (
                  <div
                    key={index}
                    className="relative group p-6 rounded-lg border border-black shadow-md bg-gradient-to-r from-indigo-100 to-purple-100 hover:from-purple-200 hover:to-pink-200 transform transition-transform duration-300 hover:scale-105"
                    onClick={() => navigate(`/trainer-booked/${trainer.email}?day=${day}`)} // Navigate when card is clicked
                  >
                    <h4 className="text-lg font-bold text-gray-700">{day}</h4>
                    <button
                      className="absolute top-2 right-2 bg-green-500 text-black font-bold px-4 py-2 rounded-md text-sm transform transition-all duration-300 hover:scale-110"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent bubbling to the card's onClick handler
                        navigate(`/trainer-booked/${trainer.email}?day=${day}`);
                      }}
                    >
                      Book Now
                    </button>
                    <p className="text-gray-600 mt-4">
                      Slots available for <span className="font-semibold">{day}</span>. Don't miss out!
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center">No available slots at the moment.</p>
            )}
          </div>
        </div>

        {/* Become a Trainer Section */}
        <div
          className="mt-16 py-20 bg-cover bg-center relative text-center rounded-lg shadow-lg transform transition-all duration-500 hover:scale-105"
          style={{ backgroundImage: `url(${img})` }}
        >
          <div className="absolute inset-0 bg-black opacity-60 rounded-lg"></div> {/* Overlay */}
          <div className="relative z-10">
            <h4 className="text-4xl font-bold text-white mb-4 animate__animated animate__fadeInUp">
              Want to be a Trainer?
            </h4>
            <p className="text-xl text-gray-300 mb-6 animate__animated animate__fadeInUp animate__delay-1s">
              Join our community of trainers and help people achieve their fitness goals!
            </p>
            <button
              className="btn bg-yellow-500 border-2 border-black text-black font-bold px-6 py-3 rounded-full transform transition-all duration-300 hover:scale-105 animate__animated animate__fadeInUp animate__delay-2s"
              onClick={() => navigate("/become-trainer")}
            >
              <FaRegUser className="mr-2" />
              Become a Trainer
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrainerDetails;
