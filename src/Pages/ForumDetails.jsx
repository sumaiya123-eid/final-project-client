import React from "react";
import { FaArrowRight, FaInfoCircle, FaUserShield, FaUserTie } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const ForumDetails = () => {
  const { id } = useParams(); // Get the post id from the URL
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  // Fetching data with Tanstack query using object syntax
  const { data: post, isLoading, isError } = useQuery({
    queryKey: ["forumPost", id],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`/forum/${id}`);
      return data;
    },
    onError: () => {
      Swal.fire("Error", "Error fetching the post", "error");
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <progress className="progress w-56"></progress>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="flex justify-center items-center h-screen text-red-800">
        Error loading post!
      </div>
    );
  }

  // Render Role Badge
  const renderRoleBadge = (role) => {
    let badgeClass = "";
    let badgeText = "";
    let icon = null;

    if (role === "trainer") {
      badgeClass = "bg-green-600 text-white text-xs";
      badgeText = "Trainer";
      icon = <FaUserTie className="mr-1 text-gray-300" />;
    } else if (role === "admin") {
      badgeClass = "bg-red-600 text-white text-xs";
      badgeText = "Admin";
      icon = <FaUserShield className="mr-1 text-yellow-300" />;
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
    <div className="max-w-4xl mx-auto p-5 h-screen">
      <div className="post-card bg-yellow-500 rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-black">Author : {post.email}</div>
          {renderRoleBadge(post.role)}
        </div>
        
        {/* Post Title */}
        <h2 className="text-3xl font-semibold flex items-center mb-4 text-gray-900">
          <FaInfoCircle className="text-black mr-2" />Title : {post.title}
        </h2>

        {/* Content */}
        <p className="text-black text-base mb-4"><span className="font-bold">Content :</span> {post.content}</p>

        {/* Post Date */}
        <p className="text-black text-base mb-4">
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

        {/* Navigation Link to Forum */}
        <p className="mt-6 text-sm font-semibold text-white bg-black px-4 py-2 rounded-lg shadow-md">
          If you want to vote on this post, visit{" "}
          <Link
            to="/allForum"
            className="text-yellow-300 font-bold hover:underline flex items-center space-x-2"
          >
            <span>Here</span>
            <FaArrowRight className="text-yellow-300" />
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForumDetails;
