import React, { useContext } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { AuthContext } from "../Provider/AuthProvider";
import Swal from "sweetalert2";

const ManageSlots = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  // Fetch the available slots using useQuery with correct queryKey and queryFn
  const {
    data: slots = {},
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["slots", user?.email],
    queryFn: async () => {
      const response = await axiosSecure.get(`/slots/${user?.email}`);
      return response.data;
    },
  });

  // Mutation for deleting a slot
  const deleteSlotMutation = useMutation({
    mutationFn: async (slotId) => {
      await axiosSecure.delete(`/slots/${slotId}`);
    },
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      console.error("Error deleting slot:", error.message);
    },
  });

  // Mutation for deleting available day from userCollection
  const deleteAvailableDayMutation = useMutation({
    mutationFn: async (dayToDelete) => {
      await axiosSecure.delete(`/availableDay/${user?.email}`, {
        data: { dayToDelete },
      });
    },
    onSuccess: () => {
      refetch(); // Refetch to update the available days
    },
    onError: (error) => {
      console.error("Error deleting available day:", error.message);
    },
  });

  const deleteSlot = (slotId) => {
    Swal.fire({
      title: `Are you sure you want to delete this particular slot?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with deleting the slot
        deleteSlotMutation.mutate(slotId);
  
        // Show success alert after the deletion
        Swal.fire("Deleted!", `${slotId} has been deleted.`, "success");
      }
    });
  };
  
  const deleteAvailableDay = (day) => {
    Swal.fire({
      title: `Are you sure you want to delete ${day}?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with deleting the available day
        deleteAvailableDayMutation.mutate(day);
  
        // Show success alert after the deletion
        Swal.fire("Deleted!", `${day} has been deleted.`, "success");
      }
    });
  };

  if (isLoading) return <p>Loading slots...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Slots</h2>
      {slots?.availableDays?.length === 0 ? (
        <p>No available days for this trainer</p>
      ) : (
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Available Day</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Plan</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {slots?.availableDays?.map((day) => (
              <React.Fragment key={day}>
                {/* Row for available day */}
                <tr className="font-bold text-lg">
                  <td colSpan="7">
                    <div className="flex justify-between">
                      <span>{day}</span>
                      <button
                        onClick={() => deleteAvailableDay(day)}
                        className="btn btn-error btn-sm"
                      >
                        Delete Day
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Booked slots for the day */}
                {slots?.bookedSlots?.[day]?.length > 0 ? (
                  slots?.bookedSlots[day]?.map((slot) => (
                    <tr key={slot._id}>
                      <td></td>
                      <td>{slot.name}</td>
                      <td>{slot.email}</td>
                      <td>{slot.phone}</td>
                      <td>{slot.selectedPlan}</td>
                      <td>{slot.price}</td>
                      <td>
                        <button onClick={() => deleteSlot(slot._id)} className="btn btn-danger">
                          Delete Slot
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">No bookings for this day</td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageSlots;
