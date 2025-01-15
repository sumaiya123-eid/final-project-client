import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../hooks/useAxiosPublic";
import Swal from "sweetalert2";

const AppliedTrainerDetails = () => {
  const { email } = useParams(); // Access the email from the URL
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  // Fetch trainer details based on the email parameter
  const { data: trainer, isLoading, isError } = useQuery({
    queryKey: ["trainerDetails", email],
    queryFn: async () => {
      const response = await axiosPublic.get(`/users/${email}`);
      return response.data;
    },
  });

  const handleApprove = async () => {
    try {
      const result = await axiosPublic.patch(`/approve-trainer/${email}`);
      if (result.data.success) {
        Swal.fire({
          icon: "success",
          title: "Trainer approved successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/admin/applied-trainers"); // Navigate to the list of applied trainers
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: result.data.message || "Failed to approve trainer.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.message || "Something went wrong!",
      });
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading trainer details.</p>;

  return (
    <div className="w-10/12 mx-auto my-10">
      <h2 className="text-2xl font-bold mb-6">Trainer Details</h2>
      <div className="mb-6">
        <p><strong>Name:</strong> {trainer.fullName}</p>
        <p><strong>Email:</strong> {trainer.email}</p>
        <p><strong>Phone:</strong> {trainer.phone || "Not provided"}</p>
        <p><strong>Address:</strong> {trainer.address || "Not provided"}</p>
        <p><strong>Experience:</strong> {trainer.experience || "Not provided"}</p>
        <p><strong>Skills:</strong> {trainer.skills ? trainer.skills.join(", ") : "Not provided"}</p>
      </div>

      <div className="flex space-x-4">
        <button
          className="btn btn-success"
          onClick={() => {
            Swal.fire({
              title: "Are you sure?",
              text: "You are about to approve this trainer.",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Yes, approve!",
            }).then((result) => {
              if (result.isConfirmed) {
                handleApprove();
              }
            });
          }}
        >
          Approve
        </button>
        <button className="btn btn-danger">Reject</button>
      </div>
    </div>
  );
};

export default AppliedTrainerDetails;
