import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";

const AppliedTrainerDetails = () => {
  const { email } = useParams();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionFeedback, setRejectionFeedback] = useState("");

  const { data: trainer, isLoading, isError } = useQuery({
    queryKey: ["trainerDetails", email],
    queryFn: async () => {
      const response = await axiosSecure.get(`/appliedTrainer/${email}`);
      return response.data;
    },
  });

  const handleApprove = async () => {
    try {
      const result = await axiosSecure.patch(`/approve-trainer/${email}`);
      if (result.data.success) {
        Swal.fire({
          icon: "success",
          title: "Trainer approved successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/dashboard/appliedTrainers"); // Navigate to the list of applied trainers
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

  const handleReject = async () => {
    if (!rejectionFeedback.trim()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please provide feedback before rejecting.",
      });
      return;
    }

    try {
      // Send rejection feedback and change status to rejected
      const result = await axiosSecure.patch(`/reject-trainer/${email}`, {
        feedback: rejectionFeedback,
      });

      if (result.data.success) {
        Swal.fire({
          icon: "success",
          title: "Trainer rejected successfully!",
          showConfirmButton: false,
          timer: 1500,
        });

        // Close modal and navigate to Applied Trainers section
        setIsRejectModalOpen(false);
        navigate("/dashboard/appliedTrainers"); // Navigate to the list of applied trainers
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: result.data.message || "Failed to reject trainer.",
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
      <h2 className="text-4xl text-yellow-500 font-bold mb-6">Trainer Details</h2>
      <div className="mb-6 *:text-white *:text-2xl">
        <p><strong>Name:</strong> {trainer.fullName}</p>
        <p><strong>Email:</strong> {trainer.email}</p>
        <p><strong>Age:</strong> {trainer.age || "Not provided"}</p>
        <p><strong>Available Time:</strong> {trainer.availableTime || "Not provided"}</p>
        <p><strong>Experience:</strong> {trainer.experience || "Not provided"}</p>
        <p><strong>Skills:</strong> {trainer.skills ? trainer.skills.join(", ") : "Not provided"}</p>
        <p><strong>Classes:</strong> {trainer.classes ? trainer.classes.join(", ") : "Not provided"}</p>
        <p><strong>Available Days:</strong> {trainer.availableDays ? trainer.availableDays.join(", ") : "Not provided"}</p>
      </div>

      <div className="flex space-x-4">
        <button
          className="btn btn-success font-bold"
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

        <button
          className="btn bg-red-600 font-bold border-none text-black"
          onClick={() => setIsRejectModalOpen(true)}
        >
          Reject
        </button>
      </div>

      {/* Reject Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
          <div className="modal modal-open">
            <div className="modal-box">
              <h2 className="text-xl font-bold">Reject Trainer</h2>
              <p><strong>Name:</strong> {trainer.fullName}</p>
              <p><strong>Email:</strong> {trainer.email}</p>
              <p><strong>Age:</strong> {trainer.age || "Not provided"}</p>
        <p><strong>Available Time:</strong> {trainer.availableTime || "Not provided"}</p>
              <p><strong>Experience:</strong> {trainer.experience || "Not provided"}</p>
              <p><strong>Skills:</strong> {trainer.skills ? trainer.skills.join(", ") : "Not provided"}</p>
              <p><strong>Classes:</strong> {trainer.classes ? trainer.classes.join(", ") : "Not provided"}</p>
              <p><strong>Available Days:</strong> {trainer.availableDays ? trainer.availableDays.join(", ") : "Not provided"}</p>
              <textarea
                className="textarea textarea-bordered w-full mt-4"
                placeholder="Provide feedback for rejection..."
                value={rejectionFeedback}
                onChange={(e) => setRejectionFeedback(e.target.value)}
                rows="4"
              ></textarea>
              <p className="mt-2 text-sm text-gray-500">Please provide a reason for rejection.</p>
              <div className="modal-action">
                <button
                  className="btn btn-secondary"
                  onClick={() => setIsRejectModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-error"
                  onClick={handleReject}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppliedTrainerDetails;
