import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaBirthdayCake,
  FaListAlt,
  FaUserAlt,
  FaClock,
  FaEnvelope,
  FaStar,
  FaToolbox,
} from "react-icons/fa"; // Import specific icons
import useAxiosPublic from "../hooks/useAxiosPublic";

const AllTrainers = () => {
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  const {
    data: trainers = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["trainers"],
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

  return (
    <section className="bg-black py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-yellow-500 mb-12 text-center drop-shadow-lg">
          Meet Our Trainers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainers
            .filter((trainer) => trainer.role === "trainer")
            .map((trainer) => (
              <div
              key={trainer._id}
              className="bg-black border-2 border-yellow-500 shadow-xl rounded-lg p-4 flex flex-col items-start text-left transition-all transform hover:scale-105 hover:shadow-2xl hover:translate-y-2"
            >
              <div className="relative mx-auto">
                {/* Centered Profile Image */}
                <div className="w-32 h-32 rounded-full p-1 bg-yellow-500 mx-auto">
                  <img
                    src={trainer.profileImage || "/default-avatar.jpg"}
                    alt={trainer.fullName}
                    className="w-full h-full rounded-full shadow-lg transform transition-transform duration-500 hover:scale-110"
                  />
                </div>
              </div>
            
              {/* Social Media Links */}
              <div className="flex mx-auto space-x-4 mt-4">
                <a
                  href="https://facebook.com"
                  className="text-blue-600 hover:text-blue-800 transition-transform transform hover:scale-150"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebook size={20} />
                </a>
                <a
                  href="https://twitter.com"
                  className="text-blue-400 hover:text-blue-600 transition-transform transform hover:scale-150"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTwitter size={20} />
                </a>
                <a
                  href="https://instagram.com"
                  className="text-pink-600 hover:text-pink-800 transition-transform transform hover:scale-150"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram size={20} />
                </a>
              </div>
            
              <div className="mt-4 space-y-2">
                <h2 className="text-xl font-semibold flex items-center gap-2 justify-start text-yellow-500">
                  <FaUserAlt className="text-blue-500" /> {trainer.fullName}
                </h2>
                <p className="text-yellow-500 text-base flex items-center gap-2">
                  <FaBirthdayCake className="text-red-500" /> <p className="text-yellow-500 font-bold">Age :</p>{" "}
                  {trainer.age || "N/A"}
                </p>
                <p className="text-yellow-500 text-base flex items-center gap-2">
                  <FaEnvelope className="text-green-500" /> <p className="text-yellow-500 font-bold">Email :</p> {trainer.email}
                </p>
                <p className="text-yellow-500 text-base flex items-center gap-2">
                  <FaClock className="text-purple-500" /> <p className="text-yellow-500 font-bold">Available Time :</p>{" "}
                  {trainer.availableTime || "Not specified"}
                </p>
                <p className="text-yellow-500 text-base flex items-center gap-2">
                  <FaToolbox className="text-orange-500" /> <p className="text-yellow-500 font-bold">Experience :</p>{" "}
                  {trainer.experience || "Not specified"}
                </p>
            
                {/* Skills */}
                <div className="mb-4">
                  <h3 className="text-base font-semibold flex items-center gap-2 text-yellow-500">
                    <FaStar className="text-yellow-500" /> <p className="text-yellow-500 font-bold">Skills :</p>
                  </h3>
                  <p className="text-yellow-500 text-base">
                    {trainer.skills.length > 0
                      ? trainer.skills.slice(0, 3).join(", ") +
                        (trainer.skills.length > 3 ? ", + more" : "")
                      : "No skills available."}
                  </p>
                </div>
            
                {/* Classes */}
                <div className="mb-4">
                  <h3 className="text-base font-semibold flex items-center gap-2 text-yellow-500">
                    <FaListAlt className="text-green-500" /> <p className="text-yellow-500 font-bold">Classes :</p>
                  </h3>
                  <p className="text-yellow-500 text-base">
                    {trainer.classes.length > 0
                      ? trainer.classes.slice(0, 3).join(", ") +
                        (trainer.classes.length > 3 ? ", + more" : "")
                      : "No classes available."}
                  </p>
                </div>
              </div>
            
              {/* Know More Button */}
              <div className="flex justify-start mt-4">
                <button
                  className="px-4 py-2 bg-yellow-500 text-black font-bold rounded-md shadow-md hover:from-green-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
                  onClick={() => navigate(`/users/${trainer.email}`)}
                >
                  Know More
                </button>
              </div>
            </div>
            
            
            ))}
        </div>
      </div>
    </section>
  );
};

export default AllTrainers;
