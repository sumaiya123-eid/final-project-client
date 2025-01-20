import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FaFire } from "react-icons/fa"; // Importing fire icon from react-icons
import useAxiosPublic from "../hooks/useAxiosPublic";

const fetchFeaturedClasses = async () => {
  const axiosPublic = useAxiosPublic();
  const response = await axiosPublic.get("/featured-classes");
  return response.data; // Ensure this returns an array of featured classes
};

const FeaturedClasses = () => {
  const { data: featuredClasses = [], isLoading, isError } = useQuery({
    queryKey: ["featuredClasses"], // Key for the query
    queryFn: fetchFeaturedClasses, // The function to fetch the data
  });

  if (isLoading) return <p className="text-white">Loading...</p>;
  if (isError) return <p className="text-white">Error loading featured classes.</p>;
  if (featuredClasses.length === 0) return <p className="text-white">No featured classes available.</p>;

  return (
    <section className="featured-classes py-10 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold mt-10 mb-16 text-yellow-500 flex items-center justify-center gap-2">Featured Classes <FaFire className="mr-2 text-red-600 animate-pulse text-4xl" /></h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {featuredClasses.map((classItem) => (
            <div
              key={classItem._id}
              className="class-card bg-black border border-yellow-500 shadow-xl rounded-lg p-6 transform transition duration-300 hover:scale-105 hover:shadow-2xl relative"
            >
              {/* Booking Count Badge with Fire Icon */}
              <div className="absolute top-4 left-4 flex items-center bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                <FaFire className="mr-2 text-red-600 animate-pulse text-xl" />
                Booking Count : {classItem.bookingCount}
              </div>

              <img
                src={classItem.image}
                alt={classItem.name}
                className="w-full h-48 object-fit rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold mb-2 text-white">{classItem.name}</h3>
              <p className="text-sm text-white mb-4">{classItem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedClasses;
