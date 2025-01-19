import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaUserAlt } from "react-icons/fa";
import useAxiosPublic from "../hooks/useAxiosPublic";

const NewsletterSubscription = () => {
  const axiosPublic = useAxiosPublic();
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubscribe = async () => {
    try {
      if (!formData.name || !formData.email) {
        setMessage("Please fill out all fields.");
        return;
      }

      const response = await axiosPublic.post("/subscribe", formData);
      setMessage(response.data.message || "Subscribed successfully!");
      setFormData({ name: "", email: "" });
    } catch (error) {
      setMessage("Failed to subscribe. Please try again.");
      console.error("Error subscribing:", error);
    }
  };

  return (
    <div className="bg-black text-white py-12 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <motion.h2
          className="text-4xl font-bold text-yellow-400"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Subscribe to Our Newsletter
        </motion.h2>
        <motion.p
          className="text-lg text-gray-300 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Stay updated with the latest news and offers!
        </motion.p>
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <div className="form-control w-full max-w-lg mx-auto space-y-4">
            <div className="relative">
              <FaUserAlt className="absolute top-3 left-3 text-gray-500" />
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleInputChange}
                className="input input-bordered w-full pl-10 bg-gray-800 text-white"
              />
            </div>
            <div className="relative">
              <FaEnvelope className="absolute top-3 left-3 text-gray-500" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className="input input-bordered w-full pl-10 bg-gray-800 text-white"
              />
            </div>
            <button
              className="btn btn-warning w-full hover:scale-105 transition-transform"
              onClick={handleSubscribe}
            >
              Subscribe Now
            </button>
          </div>
          {message && (
            <motion.p
              className={`mt-4 text-lg font-semibold ${
                message.includes("Failed") ? "text-red-400" : "text-green-400"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {message}
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default NewsletterSubscription;
