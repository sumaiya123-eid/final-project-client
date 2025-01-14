import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { FaDumbbell, FaFire, FaStar } from "react-icons/fa"; // Importing icons from react-icons
import { useQuery } from "@tanstack/react-query";

const TrainerBookedPage = () => {
  const { id } = useParams(); // Access the trainerId from URL params
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

  // Fetch trainer details from your API
  const axiosPublic = useAxiosPublic();
  const { data: trainer, isLoading, isError } = useQuery({
    queryKey: ["trainer", id],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`/trainers/${id}`);
      return data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading trainer details!</div>;

  const handleJoinNow = () => {
    if (selectedPlan) {
      // Get the price from the selected plan
      const price = membershipPrices[selectedPlan];
      
      // Redirect to the payment page with the selected plan, trainer ID, and selectedSlot
      navigate(`/payment/${id}?plan=${selectedPlan}&price=${price}&day=${selectedDay}`);
    } else {
      alert("Please select a membership plan.");
    }
  };

  return (
    <section className="bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Trainer Info */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <img
              src={trainer.profileImage || "/default-avatar.jpg"}
              alt={trainer.fullName}
              className="w-full h-auto rounded-lg shadow-lg mb-6"
            />
            <h2 className="text-3xl font-bold text-gray-800">{trainer.fullName}</h2>
            <p className="text-gray-600 mt-2">Slot: {selectedDay}</p>
          </div>

          {/* Membership Plans Cards */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Select Your Membership</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Basic Membership */}
              <div
                className={`p-6 border rounded-lg text-center cursor-pointer shadow-lg transition-all transform hover:scale-105 ${
                  selectedPlan === "basic" ? "bg-blue-100" : "bg-white"
                }`}
                onClick={() => setSelectedPlan("basic")}
              >
                <FaDumbbell className="text-4xl text-blue-600 mb-4" />
                <h4 className="text-xl font-semibold text-gray-800">Basic Membership</h4>
                <p className="text-gray-600 mb-4">Access to gym facilities during regular operating hours.</p>
                <p className="text-gray-800 font-semibold">Price: ${membershipPrices.basic}</p>
              </div>

              {/* Standard Membership */}
              <div
                className={`p-6 border rounded-lg text-center cursor-pointer shadow-lg transition-all transform hover:scale-105 ${
                  selectedPlan === "standard" ? "bg-blue-100" : "bg-white"
                }`}
                onClick={() => setSelectedPlan("standard")}
              >
                <FaFire className="text-4xl text-orange-600 mb-4" />
                <h4 className="text-xl font-semibold text-gray-800">Standard Membership</h4>
                <p className="text-gray-600 mb-4">All benefits of the Basic Membership.</p>
                <p className="text-gray-600 mb-4">Use of cardio and strength training equipment.</p>
                <p className="text-gray-800 font-semibold">Price: ${membershipPrices.standard}</p>
              </div>

              {/* Premium Membership */}
              <div
                className={`p-6 border rounded-lg text-center cursor-pointer shadow-lg transition-all transform hover:scale-105 ${
                  selectedPlan === "premium" ? "bg-blue-100" : "bg-white"
                }`}
                onClick={() => setSelectedPlan("premium")}
              >
                <FaStar className="text-4xl text-yellow-600 mb-4" />
                <h4 className="text-xl font-semibold text-gray-800">Premium Membership</h4>
                <p className="text-gray-600 mb-4">All benefits of the Standard Membership.</p>
                <p className="text-gray-600 mb-4">Access to group fitness classes, personal training, sauna, and more.</p>
                <p className="text-gray-800 font-semibold">Price: ${membershipPrices.premium}</p>
              </div>
            </div>

            {/* Join Now Button */}
            <button
              className="mt-6 w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
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
