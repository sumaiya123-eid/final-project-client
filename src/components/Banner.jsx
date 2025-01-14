import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";

import img1 from '../assets/images/exercise1.jpg';
import img2 from '../assets/images/exercise2.png';
import img3 from '../assets/images/exercise3.png';
import img4 from '../assets/images/exercise4.png';

const Banner = () => {
  const navigate = useNavigate();

  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const slides = [
    {
      img: img1,
      heading: "Transform Your Fitness Journey",
      description: "Start your path to a healthier and happier you with expert guidance.",
      buttonText: "Join Now",
      buttonLink: "/classes",
    },
    {
      img: img2,
      heading: "Empower Your Mind & Body",
      description: "Unlock the power of balanced workouts and mindfulness practices.",
      buttonText: "Explore Classes",
      buttonLink: "/classes",
    },
    {
      img: img3,
      heading: "Achieve Your Goals",
      description: "Reach your personal best with tailored fitness programs.",
      buttonText: "Get Started",
      buttonLink: "/classes",
    },
    {
      img: img4,
      heading: "Community & Growth",
      description: "Connect with a vibrant community of like-minded individuals.",
      buttonText: "Learn More",
      buttonLink: "/classes",
    },
  ];

  return (
    <section className="w-full bg-gray-100 overflow-hidden">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index} className="relative">
            <img
              src={slide.img}
              className="w-full h-[400px] md:h-[500px] object-fit rounded-xl opacity-90"
              alt={`Slide ${index + 1}`}
            />
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40 rounded-xl"></div>
            <div className="absolute flex flex-col items-center justify-center top-0 left-0 w-full h-full text-white z-10 text-center px-4 md:px-10">
              <h2 className="text-2xl md:text-4xl font-bold mb-4">{slide.heading}</h2>
              <p className="text-sm md:text-lg mb-6">{slide.description}</p>
              <button
                onClick={() => navigate(slide.buttonLink)}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-md"
              >
                {slide.buttonText}
              </button>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default Banner;
