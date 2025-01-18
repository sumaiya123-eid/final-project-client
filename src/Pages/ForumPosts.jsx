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
      badgeClass = "bg-green-400 text-white text-xs"; // Adjusted size
      badgeText = "Trainer";
      icon = <FaUserTie className="mr-1 text-gray-300" />; // Silver icon
    } else if (role === "admin") {
      badgeClass = "bg-red-400 text-white text-xs"; // Adjusted size
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
    <div className="forum-posts p-8">
      <h2 className="text-3xl font-semibold text-center mb-6 text-primary">Latest Forum Posts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {forum.slice(0, 6).map((post, index) => (
          <div
            key={index}
            className="card bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-105 p-5 flex flex-col h-full"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-600">{post.email}</div>{" "}
              {renderRoleBadge(post.role)}
            </div>
            <h2 className="text-xl font-semibold flex items-center text-primary mb-3">
              <FaInfoCircle className="text-blue-500 mr-2" /> {post.title}
            </h2>
            <p className="text-gray-600 text-sm mb-4 flex-grow break-words">
              <strong>Content: </strong> {post.content}
            </p>

            <p className="text-gray-500 text-xs mb-4">
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
                className="btn btn-primary btn-sm hover:scale-105 transition-all"
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
