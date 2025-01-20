import React, { useState } from "react";
import { FaEnvelope, FaUserAlt } from "react-icons/fa";
import { Fade } from "react-awesome-reveal";
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
        {/* Title Animation */}
        <Fade duration={1000}>
          <h2 className="text-4xl font-bold text-yellow-400">
            Subscribe to Our Newsletter
          </h2>
        </Fade>

        {/* Description Animation */}
        <Fade duration={1000} delay={500}>
          <p className="text-lg text-gray-300 mt-4">
            Stay updated with the latest news and offers!
          </p>
        </Fade>

        {/* Form Animation */}
        <Fade duration={1000} delay={700}>
          <div className="mt-8">
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

            {/* Message Animation */}
            {message && (
              <Fade duration={1000} delay={200}>
                <p
                  className={`mt-4 text-lg font-semibold ${
                    message.includes("Failed") ? "text-red-400" : "text-green-400"
                  }`}
                >
                  {message}
                </p>
              </Fade>
            )}
          </div>
        </Fade>
      </div>
    </div>
  );
};

export default NewsletterSubscription;
