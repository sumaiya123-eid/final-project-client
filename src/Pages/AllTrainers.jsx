import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa"; // Import specific icons
import useAxiosPublic from "../hooks/useAxiosPublic";

const AllTrainers = () => {
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  // Fetching trainers data with react-query
  const { data: trainers = [], isLoading, isError } = useQuery({
    queryKey: ["trainers"],
    queryFn: async () => {
      const { data } = await axiosPublic.get("/users");
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading trainers!</div>;
  }

  return (
    <section className="bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Trainers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {trainers
            .filter((trainer) => trainer.role === "trainer") // Only show approved trainers
            .map((trainer) => (
              <div
                key={trainer._id} // use _id or unique id field from DB
                className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center"
              >
                <img
                  src={trainer.profileImage|| "/default-avatar.jpg"} // fallback image if profileImageUrl is missing
                  alt={trainer.fullName}
                  className="w-32 h-32 rounded-full object-cover mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-800">{trainer.fullName}</h3>
                <p className="text-gray-600">Experience: {trainer.age} years</p>
                <p className="text-green-600">{trainer.availableSlots} slots available</p>
                <div className="flex space-x-4 mt-4">
                  {/* Static Social Icons */}
                  <a
                    href="https://facebook.com"
                    className="text-gray-500 hover:text-gray-800"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaFacebook size={24} />
                  </a>
                  <a
                    href="https://twitter.com"
                    className="text-gray-500 hover:text-gray-800"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaTwitter size={24} />
                  </a>
                  <a
                    href="https://instagram.com"
                    className="text-gray-500 hover:text-gray-800"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaInstagram size={24} />
                  </a>
                </div>
                <button
                  className="mt-6 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
                  onClick={() => navigate(`/users/${trainer.email}`)} // Adjusted for MongoDB _id
                >
                  Know More
                </button>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default AllTrainers;
