import React from "react";
import aboutImage from '../assets/images/exercise5.jpg';

const About = () => {
  return (
    <section className="bg-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">About Us</h2>
          <p className="text-gray-600 text-lg mb-6">
            We are dedicated to empowering individuals to achieve their fitness and wellness goals. 
            With a focus on personalized guidance, innovative tools, and a supportive community, 
            we make your journey enjoyable and rewarding.
          </p>
          <ul className="text-gray-600 space-y-3">
            <li>🌟 Trusted by thousands of members worldwide.</li>
            <li>🌟 Expert trainers and nutritionists to guide you.</li>
            <li>🌟 Cutting-edge tools for health tracking and progress monitoring.</li>
          </ul>
          <button
            className="mt-6 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-md"
          >
            Learn More
          </button>
        </div>
        {/* Image */}
        <div>
          <img
            src={aboutImage}
            alt="About Us"
            className="w-full h-auto object-cover rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default About;
