import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useContext } from "react";
import { AuthContext } from "../Provider/AuthProvider";
import useAxiosSecure from "../hooks/useAxiosSecure"; // Custom hook for Axios
import { useQuery } from "@tanstack/react-query"; // Import useQuery from React Query

const AddForum = () => {
  const { user } = useContext(AuthContext); // Get logged-in user info
  
  const [forumData, setForumData] = useState({
    title: "",
    content: "",
    role: "", // Initially empty role
    email: user?.email || "",
    createdAt: "", // To store the created date
  });
  const axiosSecure = useAxiosSecure(); // Get axiosSecure instance

  // Fetch the user's role from the backend
  const { data: userRole, error, isLoading } = useQuery({
    queryKey: ["userRole", user?.email], // Cache key based on the user email
    queryFn: async () => {
      const response = await axiosSecure.get(`/users/${user?.email}`); // Send email to backend
      return response.data.role; // Return the role from the response
    },
    enabled: !!user?.email, // Only fetch if the user has an email
  });

  useEffect(() => {
    if (userRole) {
      setForumData((prevData) => ({
        ...prevData,
        role: userRole, // Set the fetched role to the forumData state
      }));
    }
  }, [userRole]); // Effect runs when userRole changes
  console.log(user.email)
  // Function to send the POST request for creating a forum post
  const createForumPost = async (forumData) => {
    const response = await axiosSecure.post("/forums", forumData); // Use axiosSecure to make the POST request
    return response.data; // Return the response from the API
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add current date to createdAt field
    const currentDate = new Date().toISOString(); // ISO 8601 format for the date
    const updatedForumData = { ...forumData, createdAt: currentDate }; // Add createdAt

    try {
      const data = await createForumPost(updatedForumData); // Send forum data with createdAt
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Forum Created!",
          text: "Your forum post has been created successfully.",
        });
        setForumData({ title: "", content: "", role: "", email: user?.email, createdAt: "" }); // Reset form
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.message || "An error occurred while creating the forum post.",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // Show loading state
  }

  if (error) {
    return <div>Error fetching user role</div>; // Handle error
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-8 text-yellow-500">Create a Forum Post</h1>
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-black border border-yellow-500 p-6 shadow-md rounded-lg">
        <div className="mb-4">
          <label className="block text-base font-semibold text-white">Title</label>
          <input
            type="text"
            name="title"
            value={forumData.title}
            onChange={(e) => setForumData({ ...forumData, title: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-base font-semibold text-white">Content</label>
          <textarea
            name="content"
            value={forumData.content}
            onChange={(e) => setForumData({ ...forumData, content: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            rows="5"
          />
        </div>
        <button
          type="submit"
          className="w-full px-6 py-3 bg-yellow-500 hover:bg-blue-600 text-black font-bold rounded-md"
        >
          Post Forum
        </button>
      </form>
    </div>
  );
};

export default AddForum;
