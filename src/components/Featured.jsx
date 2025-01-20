import React from "react";
import { FaDumbbell, FaAppleAlt, FaUsers, FaHeartbeat } from "react-icons/fa";
import { Slide } from "react-awesome-reveal";

const Featured = () => {
  const features = [
    {
      icon: <FaDumbbell className="text-white text-5xl" />,
      title: "Personalized Workouts",
      description: "Customized fitness plans tailored to your goals and fitness level.",
    },
    {
      icon: <FaAppleAlt className="text-white text-5xl" />,
      title: "Nutrition Guidance",
      description: "Healthy meal plans to complement your workouts and support your health.",
    },
    {
      icon: <FaUsers className="text-white text-5xl" />,
      title: "Community Support",
      description: "Join a community of like-minded individuals to keep you motivated.",
    },
    {
      icon: <FaHeartbeat className="text-white text-5xl" />,
      title: "Health Tracking",
      description: "Monitor your progress with advanced health and fitness tracking tools.",
    },
  ];

  return (
    <section className="bg-black py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <h2 className="text-3xl font-bold mb-6">Why Choose Us?</h2>
        <p className="text-yellow-400 text-lg mb-12">
          Explore the key features that make our platform the best choice for your fitness journey.
        </p>
        <Slide direction="up" cascade damping={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-yellow-500 p-6 shadow-lg rounded-lg flex flex-col items-center text-center hover:bg-yellow-600 transition duration-300"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-white">{feature.description}</p>
              </div>
            ))}
          </div>
        </Slide>
      </div>
    </section>
  );
};

export default Featured;
