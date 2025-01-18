import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { useQuery, useMutation } from "@tanstack/react-query";
import { FaChevronLeft, FaChevronRight, FaInfoCircle } from "react-icons/fa";
import Swal from "sweetalert2";
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
  const [userVote, setUserVote] = useState({});
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["forums", currentPage],
    queryFn: () => fetchPosts(currentPage),
    keepPreviousData: true,
  });

  const mutation = useMutation({
    mutationFn: ({ postId, voteType, userEmail }) => voteOnPost({ postId, voteType, userEmail }),
    onSuccess: (data) => {
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Vote Registered!",
          text: "Your vote has been successfully recorded.",
        });
        setUserVote((prevVotes) => ({
          ...prevVotes,
          [data.postId]: data.newVote, // Update user vote
        }));
      }
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.message || "An error occurred while voting.",
      });
    },
  });

  if (isLoading) return <div className="text-center my-10">Loading...</div>;
  if (isError) return <div className="text-center text-red-500 my-10">Error: {error.message}</div>;

  const handlePostClick = (postId) => {
    navigate(`/forums/${postId}`);
  };

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
    const userEmail = "user@example.com"; // Get user email from your auth system
    mutation.mutate({ postId, voteType, userEmail });
  };

  return (
    <div className="container mx-auto my-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Forum</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.posts.map((post) => (
          <div
            key={post._id}
            className="post-card bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105 p-4"
            onClick={() => handlePostClick(post._id)}
          >
            <h2 className="text-xl font-semibold mt-4 flex items-center">
              <FaInfoCircle className="text-blue-500 mr-2" /> {post.title}
            </h2>
            <p className="text-gray-600 text-sm mt-2 mb-2">
              <strong>Content: </strong> {post.content}
            </p>
            <p className="text-gray-600 text-sm mb-4">
              <strong>Created At: </strong>
              {new Date(post.createdAt) instanceof Date && !isNaN(new Date(post.createdAt))
                ? new Intl.DateTimeFormat("en-US", {
                    weekday: "short", year: "numeric", month: "short", day: "numeric",
                  }).format(new Date(post.createdAt))
                : "Invalid Date"}
            </p>

            <div className="flex space-x-4">
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent post click
                  handleVote(post._id, "upvote");
                }}
                className="btn btn-sm btn-success"
              >
                Upvote
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent post click
                  handleVote(post._id, "downvote");
                }}
                className="btn btn-sm btn-danger"
              >
                Downvote
              </button>
            </div>

            {post.role && (
              <p className="text-gray-500 text-sm">
                <strong>Role: </strong>{post.role}
              </p>
            )}
            {post.email && (
              <p className="text-gray-500 text-sm">
                <strong>Email: </strong>{post.email}
              </p>
            )}
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
