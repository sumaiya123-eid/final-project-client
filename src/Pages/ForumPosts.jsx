import React from "react";
import { FaInfoCircle, FaUserShield, FaUserTie } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../hooks/useAxiosPublic"; // Assuming this is where axiosPublic is defined
import Swal from "sweetalert2";

const ForumPosts = () => {
  const axiosPublic = useAxiosPublic();

  const {
    data: forum = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["forum"],
    queryFn: async () => {
      const { data } = await axiosPublic.get("/latest-forum");
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
        Error loading forum posts!
      </div>
    );
  }

  const renderRoleBadge = (role) => {
    let badgeClass = "";
    let badgeText = "";
    let icon = null;

    if (role === "trainer") {
      badgeClass = "bg-green-600 text-white text-xs"; // Adjusted size
      badgeText = "Trainer";
      icon = <FaUserTie className="mr-1 text-gray-300" />; // Silver icon
    } else if (role === "admin") {
      badgeClass = "bg-red-600 text-white text-xs"; // Adjusted size
      badgeText = "Admin";
      icon = <FaUserShield className="mr-1 text-yellow-300" />; // Yellow icon
    } else {
      return null;
    }

    return (
      <span
        className={`inline-flex items-center px-2 py-1 text-sm font-semibold rounded-full ${badgeClass}`}
      >
        {icon}
        {badgeText}
      </span>
    );
  };

  return (
    <div className="forum-posts my-20 w-11/12 rounded-md mx-auto p-8 bg-yellow-400">
      <h2 className="text-3xl text-center mt-10 mb-12 text-black font-semibold">Latest Forum Posts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {forum.slice(0, 6).map((post, index) => (
          <div
            key={index}
            className="card bg-yellow-200 border-2 border-yellow-600 rounded-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 p-5 flex flex-col h-full"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold text-gray-800">Author : {post.email}</div>
              {renderRoleBadge(post.role)}
            </div>
            <h2 className="text-xl flex items-center font-bold mb-3">
              <FaInfoCircle className="text-black mr-2" /> Title : {post.title}
            </h2>
            <p className="text-gray-800 text-base mb-4 flex-grow break-words">
              <strong>Content: </strong> {post.content}
            </p>

            <p className="text-gray-700 text-base mb-4">
              <strong>Posted on: </strong>
              {new Date(post.createdAt) instanceof Date &&
              !isNaN(new Date(post.createdAt))
                ? new Intl.DateTimeFormat("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }).format(new Date(post.createdAt))
                : "Invalid Date"}
            </p>

            <div className="card-actions justify-end mt-4">
              <a
                href={`/forumDetails/${post._id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-black text-white border-none btn-sm hover:scale-105 transition-all"
              >
                Read More
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForumPosts;
