import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  FaChevronLeft,
  FaChevronRight,
  FaArrowUp,
  FaArrowDown,
  FaInfoCircle,
  FaUserTie,
  FaUserShield,
} from "react-icons/fa";
import { AuthContext } from "../Provider/AuthProvider";

// Function to fetch posts
const fetchPosts = async (page) => {
  const axiosPublic = useAxiosPublic();
  const response = await axiosPublic.get(`/forums?page=${page}`);
  return response.data;
};

// Function to vote on a post
const voteOnPost = async ({ postId, voteType, userEmail }) => {
  const axiosPublic = useAxiosPublic();
  const response = await axiosPublic.patch("/forums/vote", {
    postId,
    voteType,
    userEmail,
  });
  return response.data;
};

const ForumPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [userVotes, setUserVotes] = useState({});
  const { user } = useContext(AuthContext); // Get user from AuthContext
  const navigate = useNavigate();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["forums", currentPage],
    queryFn: () => fetchPosts(currentPage),
    keepPreviousData: true,
  });

  const mutation = useMutation({
    mutationFn: ({ postId, voteType, userEmail }) => voteOnPost({ postId, voteType, userEmail }),
    onSuccess: () => {
      // Refetch the data to ensure the UI gets updated
      refetch();
    },
  });

  if (isLoading) return <div className="text-center my-10">Loading...</div>;
  if (isError) return <div className="text-center text-red-500 my-10">Error: {error.message}</div>;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= data.totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`btn btn-sm ${i === currentPage ? "btn-primary" : "btn-outline"} mx-1`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  const handleVote = (postId, voteType) => {
    if (!user) {
      Swal.fire({
        title: "Login Required",
        text: "You need to log in to vote on posts.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login"); // Redirect to login page
        }
      });
      return;
    }

    const userEmail = user.email;
    const previousVote = userVotes[postId];
    let action = voteType;
    if (previousVote === voteType) {
      action = "remove";
    }
    mutation.mutate({ postId, voteType: action, userEmail });
  };

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
      <span className={`inline-flex items-center px-2 py-1 text-sm font-semibold rounded-full ${badgeClass}`}>
        {icon}
        {badgeText}
      </span>
    );
  };

  return (
    <div className="container mx-auto my-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Forum</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.posts.map((post) => (
          <div
            key={post._id}
            className="post-card bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105 p-5 flex flex-col h-full"
          >
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">{post.email}</div> {/* Author email */}
              {renderRoleBadge(post.role)}
            </div>
            <h2 className="text-xl font-semibold mt-3 flex items-center">
              <FaInfoCircle className="text-blue-500 mr-2" /> {post.title}
            </h2>
            <p className="text-gray-600 text-sm mt-2 mb-4 break-words flex-grow">
              <strong>Content: </strong> {post.content}
            </p>

            <p className="text-gray-500 text-xs mb-4">
              <strong>Posted on: </strong>
              {new Date(post.createdAt) instanceof Date && !isNaN(new Date(post.createdAt))
                ? new Intl.DateTimeFormat("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }).format(new Date(post.createdAt))
                : "Invalid Date"}
            </p>

            {/* Vote buttons */}
            <div className="flex space-x-4 items-center mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleVote(post._id, "upvote");
                }}
                className={`btn btn-sm flex items-center ${userVotes[post._id] === "upvote" ? "btn-success" : "btn-outline-success"}`}
              >
                <FaArrowUp className="mr-1" /> {post.votesSummary?.upvotes || 0}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleVote(post._id, "downvote");
                }}
                className={`btn btn-sm flex items-center ${userVotes[post._id] === "downvote" ? "btn-danger" : "btn-outline-danger"}`}
              >
                <FaArrowDown className="mr-1" /> {post.votesSummary?.downvotes || 0}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination mt-8 flex justify-center items-center space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="btn btn-sm btn-outline flex items-center"
        >
          <FaChevronLeft className="mr-1" /> Previous
        </button>
        {renderPageNumbers()}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === data.totalPages}
          className="btn btn-sm btn-outline flex items-center"
        >
          Next <FaChevronRight className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default ForumPage;
