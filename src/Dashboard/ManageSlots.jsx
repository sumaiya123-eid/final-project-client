import React, { useContext } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { AuthContext } from "../Provider/AuthProvider";
import Swal from "sweetalert2";
import { FaCross } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";
import { Helmet } from "react-helmet-async";

const ManageSlots = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

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
      <Helmet>
                    <title>FitTrick | Dashboard | Manage Slots</title>
                  </Helmet>
      <h2 className="text-3xl font-bold mb-4 text-yellow-500">Manage Slots</h2>
      {slots?.availableDays?.length === 0 ? (
        <p>No available days for this trainer</p>
      ) : (
        <table className="table w-full">
          <thead className="bg-yellow-500 text-black">
            <tr>
              <th>Available Day</th>
              <th>Name</th>
              <th>Email</th>
              <th>Selected Classes</th>
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
                <tr className="font-bold bg-white mx-auto text-lg text-black">
                  <td colSpan="7">
                    <div className="flex justify-between">
                      <span >{day}</span>
                      <button
                        onClick={() => deleteAvailableDay(day)}
                        className="btn bg-red-600 border-none text-black font-bold btn-sm"
                      >
                        Delete Slot
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Booked slots for the day */}
                {slots?.bookedSlots?.[day]?.length > 0 ? (
                  slots?.bookedSlots[day]?.map((slot) => (
                    
                    <tr key={slot._id}>
                      <td></td>
                      <td className="text-white">{slot.name}</td>
                      <td className="text-white">{slot.email}</td>
                      <td className="text-white">
    {Array.isArray(slot.selectedClasses) && slot.selectedClasses.length > 0
      ? slot.selectedClasses.join(", ")
      : "No classes selected"}
  </td>
                      <td className="text-white">{slot.phone}</td>
                      <td className="text-white">{slot.selectedPlan}</td>
                      <td className="text-white">{slot.price}</td>
                      <td>
                        <button onClick={() => deleteSlot(slot._id)} className="">
                        <RxCross1 className="text-red-600 font-bold" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-white">No bookings for this day</td>
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
