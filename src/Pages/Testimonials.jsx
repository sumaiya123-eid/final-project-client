import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FaArrowRight } from "react-icons/fa";
import useAxiosPublic from "../hooks/useAxiosPublic";
import ReactStars from "react-rating-stars-component";
import { Swiper, SwiperSlide } from "swiper/react"; // Import Swiper and SwiperSlide
import "swiper/swiper-bundle.css"; // Corrected import for Swiper styles

// Fetch all reviews using TanStack Query
const Testimonials = () => {
  const axiosPublic = useAxiosPublic();

  // Fetch all reviews from the API
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const { data } = await axiosPublic.get("/reviews"); // Fetching all reviews
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
    return <div className="text-red-500 text-center">Error: {error.message}</div>;
  }

  if (!data || data.length === 0) {
    return <div className="text-center text-gray-500">No reviews found.</div>;
  }

  return (
    <div className="md:w-10/12 mx-auto mt-12 p-2 md:p-10 bg-black animate__animated animate__fadeInUp rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-yellow-500 my-4 text-center">Customer Testimonials</h2>

      {/* Swipe Right to See More Reviews */}
      <div className="flex justify-center items-center mb-6">
        <p className="text-xl font-semibold text-white mr-3">Swipe right to see more reviews</p>
        <FaArrowRight size={40} className="text-white animate-pulse cursor-pointer" />
      </div>

      <Swiper
        spaceBetween={20} // Space between slides
        loop={true} // Enable looping
        breakpoints={{
          // Responsive design for different screen sizes
          640: {
            slidesPerView: 1, // 1 slide on mobile screens
          },
          768: {
            slidesPerView: 2, // 2 slides on tablet screens
          },
          1024: {
            slidesPerView: 3, // 3 slides on desktop screens
          },
        }}
      >
        {data.map((review) => (
          <SwiperSlide key={review._id}>
            <div className="border-2 h-64 border-yellow-600 rounded-lg p-6 shadow-xl bg-black transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl">
              <div className="flex items-center mb-3">
                <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center">
                  <p className="text-xl font-semibold text-white">
                    {review.userId.charAt(0).toUpperCase()}
                  </p>
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-white">{review.userId}</p>
                </div>
              </div>
              <div className="mb-3">
                <ReactStars
                  count={5}
                  size={24}
                  value={review.rating}
                  isHalf={true}
                  edit={false}
                  activeColor="#ffd700"
                />
              </div>
              <p className="text-white text-xs flex gap-1 items-center mb-2"><p className="text-yellow-500">Trainer Email :</p>{review.trainerEmail}</p>
              <p className="text-yellow-500">{review.feedback}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Testimonials;
