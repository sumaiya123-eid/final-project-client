import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { FaArrowRight, FaChalkboardTeacher, FaInfoCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import bg from "../assets/images/newsletter-bg.jpg"
import { Link, useNavigate } from "react-router-dom";
const TrainerSection = () => {
    const navigate=useNavigate()
  const axiosPublic = useAxiosPublic();

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
        <h2 className="text-4xl font-bold text-yellow-500 mb-8 text-center drop-shadow-lg">
          Meet Our Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainers
            .filter((trainer) => trainer.role === "trainer")
            .slice(0, 3)
            .map((trainer) => (
              <motion.div
                key={trainer._id}
                className="bg-yellow-400 shadow-xl rounded-lg p-4 flex flex-col items-start text-left transition-all transform hover:scale-105 hover:shadow-2xl hover:translate-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative mx-auto">
                  {/* Centered Profile Image */}
                  <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-r from-yellow-500 to-yellow-600 mx-auto">
                    <img
                      src={trainer.profileImage || "/default-avatar.jpg"}
                      alt={trainer.fullName}
                      className="w-full h-full rounded-full shadow-lg transform transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-center text-black mt-4"> Trainer Name :    {trainer.fullName}
                </h3>
                <p className="text-sm text-gray-800 text-center mt-2">
                  <FaChalkboardTeacher className="inline mr-2 text-black" /> <span className="text-black font-bold">Areas of expertise : </span> {trainer.skills.join(", ") || "No skills listed"}
                </p>
                <p className="text-sm text-gray-800 mt-4"> <span className="text-black font-bold">Biography : </span> {trainer.biography}</p>
                <div className="mt-4">
                  <motion.button
                    className="btn bg-black w-full text-white border-none"
                    onClick={() => navigate(`/users/${trainer.email}`)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaInfoCircle className="mr-2" />
                    View Profile
                  </motion.button>
                </div>
              </motion.div>
            ))}
        </div>
        <div className="flex justify-end mt-3">
        <Link to="/allTrainers">
        <button className="bg-yellow-500 btn border-none text-black font-bold flex items-center gap-1">See all Trainers <FaArrowRight></FaArrowRight></button>
        </Link>
        </div>
      </div>
    </section>
  );
};

export default TrainerSection;
