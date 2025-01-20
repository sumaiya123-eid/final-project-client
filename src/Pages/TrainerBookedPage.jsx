import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  FaBirthdayCake,
  FaClock,
  FaDumbbell,
  FaEnvelope,
  FaFire,
  FaListAlt,
  FaStar,
  FaUserAlt,
} from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";

const TrainerBookedPage = () => {
  const { email } = useParams(); // Access the email from URL params
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedDay = queryParams.get("day"); // Get the selected day from the query string
  const navigate = useNavigate();

  // State to manage the selected membership plan
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Define the pricing for each membership plan
  const membershipPrices = {
    basic: 10,
    standard: 50,
    premium: 100,
  };

  // Fetch trainer details from your API using email
  const axiosSecure = useAxiosSecure();
  const {
    data: trainer,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["trainer", email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/users/${email}`); // Fetch trainer by email
      return data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading trainer details!</div>;

  const handleJoinNow = () => {
    if (selectedPlan) {
      const price = membershipPrices[selectedPlan];

      // Include the trainer's classes in the query string, joining them with a delimiter
      const classes = trainer.classes.join(",");

      navigate(
        `/payment/${email}?plan=${selectedPlan}&price=${price}&day=${selectedDay}&classes=${encodeURIComponent(
          classes
        )}`
      );
    } else {
      alert("Please select a membership plan.");
    }
  };

  return (
    <section className="bg-black py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Trainer Info */}
          <div className="bg-black border border-yellow-500 shadow-lg rounded-lg p-6 space-y-5">
            <img
              src={trainer.profileImage || "/default-avatar.jpg"}
              alt={trainer.fullName}
              className="w-full h-48 object-fit rounded-xl transform transition-transform duration-500 hover:scale-110 p-2"
            />
            <div className="mt-4 space-y-2">
              <h2 className="text-xl font-semibold flex items-center gap-2 justify-start text-yellow-500">
                <FaUserAlt className="text-blue-500" /> Trainer Name :{" "}
                {trainer.fullName}
              </h2>
              <p className="text-yellow-500 text-xl flex items-center gap-2">
                <FaEnvelope className="text-green-500" />{" "}
                <p className="text-yellow-500 font-bold">Email :</p>{" "}
                {trainer.email}
              </p>
              <p className="text-yellow-500 text-xl flex items-center gap-2">
                <FaClock className="text-purple-500" />
                <p className="text-yellow-500 font-bold">Selected Slot :</p>
                {selectedDay}
              </p>
              {/* Classes */}
              <div className="mb-4">
                <h3 className="text-xl font-semibold flex items-center gap-2 text-yellow-500">
                  <FaListAlt className="text-green-500" />{" "}
                  <p className="text-yellow-500 font-bold">Classes :</p>
                </h3>
                <p className="text-yellow-500 text-base">
                  {trainer.classes.length > 0
                    ? trainer.classes.slice(0, 3).join(", ") +
                      (trainer.classes.length > 3 ? ", + more" : "")
                    : "No classes available."}
                </p>
              </div>
            </div>
          </div>

          {/* Membership Plans Cards */}
          <div className="bg-black border border-yellow-500 shadow-lg rounded-lg p-6">
            <h3 className="text-2xl font-bold text-yellow-500 mb-4">
              Select Your Membership
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Basic Membership */}
              <div
                className={`p-6 border border-yellow-500 rounded-lg text-center cursor-pointer shadow-lg transition-all transform hover:scale-105 ${
                  selectedPlan === "basic" ? "bg-blue-100" : "bg-white"
                }`}
                onClick={() => setSelectedPlan("basic")}
              >
                <FaDumbbell className="text-4xl text-blue-600 mb-4" />
                <h4 className="text-xl font-semibold text-gray-800">
                  Basic Membership
                </h4>
                <p className="text-gray-600 mb-4">
                  Access to gym facilities during regular operating hours.
                </p>
                <p className="text-gray-800 font-semibold">
                  Price: ${membershipPrices.basic}
                </p>
              </div>

              {/* Standard Membership */}
              <div
                className={`p-6 border border-yellow-500 rounded-lg text-center cursor-pointer shadow-lg transition-all transform hover:scale-105 ${
                  selectedPlan === "standard" ? "bg-blue-100" : "bg-white"
                }`}
                onClick={() => setSelectedPlan("standard")}
              >
                <FaFire className="text-4xl text-orange-600 mb-4" />
                <h4 className="text-xl font-semibold text-gray-800">
                  Standard Membership
                </h4>
                <p className="text-gray-600 mb-4">
                  All benefits of the Basic Membership.
                </p>
                <p className="text-gray-600 mb-4">
                  Use of cardio and strength training equipment.
                </p>
                <p className="text-gray-800 font-semibold">
                  Price: ${membershipPrices.standard}
                </p>
              </div>

              {/* Premium Membership */}
              <div
                className={`p-6 border border-yellow-500 rounded-lg text-center cursor-pointer shadow-lg transition-all transform hover:scale-105 ${
                  selectedPlan === "premium" ? "bg-blue-100" : "bg-white"
                }`}
                onClick={() => setSelectedPlan("premium")}
              >
                <FaStar className="text-4xl text-yellow-600 mb-4" />
                <h4 className="text-xl font-semibold text-gray-800">
                  Premium Membership
                </h4>
                <p className="text-gray-600 mb-4">
                  All benefits of the Standard Membership.
                </p>
                <p className="text-gray-600 mb-4">
                  Access to group fitness classes, personal training, sauna, and
                  more.
                </p>
                <p className="text-gray-800 font-semibold">
                  Price: ${membershipPrices.premium}
                </p>
              </div>
            </div>

            {/* Join Now Button */}
            <button
              className="mt-6 w-full px-6 py-3 bg-yellow-500 hover:bg-blue-600 text-black font-bold rounded-md"
              onClick={handleJoinNow} // Handle the join now action
            >
              Join Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrainerBookedPage;
