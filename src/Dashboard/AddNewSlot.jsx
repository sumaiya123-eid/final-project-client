import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { AuthContext } from "../Provider/AuthProvider";
import useAxiosPublic from "../hooks/useAxiosPublic";


const skillOptions = [
    { value: "Strength Training", label: "Strength Training" },
    { value: "Cardio", label: "Cardio" },
    { value: "Yoga", label: "Yoga" },
    { value: "Pilates", label: "Pilates" },
  ];

const dayOptions = [
  { value: "Sun", label: "Sunday" },
  { value: "Mon", label: "Monday" },
  { value: "Tue", label: "Tuesday" },
  { value: "Wed", label: "Wednesday" },
  { value: "Thu", label: "Thursday" },
  { value: "Fri", label: "Friday" },
  { value: "Sat", label: "Saturday" },
];

const classOptions = [
  { value: "Yoga", label: "Yoga" },
  { value: "Cardio", label: "Cardio" },
  { value: "Pilates", label: "Pilates" },
  { value: "Strength Training", label: "Strength Training" },
  { value: "Dance", label: "Dance" },
  { value: "Kickboxing", label: "Kickboxing" },
  { value: "Zumba", label: "Zumba" },
  { value: "CrossFit", label: "CrossFit" },
  { value: "Cycling", label: "Cycling" },
  { value: "Swimming", label: "Swimming" },
  { value: "Martial Arts", label: "Martial Arts" },
];

const AddNewSlot = () => {
  const { user } = useContext(AuthContext);
  const { register, handleSubmit, setValue, reset } = useForm();
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();

  const [trainerData, setTrainerData] = useState(null);

  // Fetch trainer data when component mounts
  useEffect(() => {
    if (user?.email) {
      axiosPublic
        .get(`/users/${user.email}`)
        .then((response) => {
          setTrainerData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching trainer data", error);
        });
    }
  }, [user?.email]);

  const onSubmit = async (data) => {
    console.log("Form Data:", data); // Log to check values
  
    try {
      // Prepare slot data to be sent to the backend
      const slotData = {
        availableDays: data.availableDays, // Send selected days
        classes: data.classes, // Send selected classes
        availableTime: data.availableTime, // Send available time
      };
  
      // Send PATCH request
      const response = await axiosSecure.patch(`/trainerSlotUpdate/${user.email}`, slotData);
  
      if (response.data.success) {
        // Update trainerData to reflect the updated availableTime
        setTrainerData((prevData) => ({
          ...prevData,
          availableTime: data.availableTime, // Update the availableTime directly
          availableDays: data.availableDays,
          classes: data.classes,
        }));
  
        reset(); // Reset form fields
  
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: response.data.message || "Slot updated successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error("Error updating slot:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...You do not added anything yet",
        text: "Add new thing to add new slot.",
      });
    }
  };
  

  if (!trainerData) {
    return <p>Loading trainer data...</p>;
  }

  return (
    <div className="w-10/12 mx-auto my-10">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Full Name */}
        <div className="form-control w-full my-6">
          <label className="label">
            <span className="label-text">Full Name*</span>
          </label>
          <input
            type="text"
            value={trainerData.fullName || ""}
            readOnly
            className="input input-bordered w-full bg-gray-100"
          />
        </div>

        {/* Email (Read-only) */}
        <div className="form-control w-full my-6">
          <label className="label">
            <span className="label-text">Email (Read-Only)</span>
          </label>
          <input
            type="email"
            value={trainerData.email || ""}
            readOnly
            className="input input-bordered w-full bg-gray-100"
          />
        </div>

        {/* Age (Read-only) */}
        <div className="form-control w-full my-6">
          <label className="label">
            <span className="label-text">Age (Read-Only)</span>
          </label>
          <input
            type="number"
            value={trainerData.age || ""}
            readOnly
            className="input input-bordered w-full bg-gray-100"
          />
        </div>
        
        {/* skills (Read-only) */}
        <div className="form-control w-full my-6">
  <label className="label">
    <span className="label-text">Skills (Read-Only)</span>
  </label>
  <Select
    isMulti
    options={skillOptions}
    value={trainerData.skills?.map((day) => ({
      value: day,
      label: skillOptions.find((opt) => opt.value === day)?.label,
    }))}
    onChange={() => {}}
    isDisabled={true} // Disable the select input to make it read-only
    className="basic-multi-select"
    classNamePrefix="select"
  />
</div>


        {/* Select Days (Previously Added Days) */}
        <div className="form-control w-full my-6">
          <label className="label">
            <span className="label-text">Select Available Days (Slot Name)</span>
          </label>
          <Select
            isMulti
            options={dayOptions}
            defaultValue={trainerData.availableDays?.map((day) => ({
              value: day,
              label: dayOptions.find((opt) => opt.value === day)?.label,
            }))}
            onChange={(selectedOptions) => {
              setValue("availableDays", selectedOptions ? selectedOptions.map((opt) => opt.value) : []);
            }}
            className="basic-multi-select"
            classNamePrefix="select"
          />
        </div>
        
        {/* Available Time */}
<div className="form-control w-full my-6">
  <label className="label">
    <span className="label-text">Available Time (Slot Time)</span>
  </label>
  <input
    type="text"
    defaultValue={trainerData?.availableTime}
    {...register("availableTime", { required: true })}
    placeholder="e.g., 9:00 AM - 5:00 PM"
    className="input input-bordered w-full"
  />
</div>


        {/* Select Classes */}
        <div className="form-control w-full my-6">
          <label className="label">
            <span className="label-text">Classes*</span>
          </label>
          <Select
            isMulti
            options={classOptions}
            defaultValue={trainerData.classes?.map((className) => ({
              value: className,
              label: classOptions.find((opt) => opt.value === className)?.label,
            }))}
            onChange={(selectedOptions) => {
              setValue("classes", selectedOptions ? selectedOptions.map((opt) => opt.value) : []);
            }}
            className="basic-multi-select"
            classNamePrefix="select"
          />
        </div>

        <button type="submit" className="btn">
          Add Slot
        </button>
      </form>
    </div>
  );
};

export default AddNewSlot;
