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

const AddNewSlot = () => {
  const { user } = useContext(AuthContext);
  const { register, handleSubmit, setValue, reset } = useForm();
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();

  const [trainerData, setTrainerData] = useState(null);
  const [classOptions, setClassOptions] = useState([]);

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

  // Fetch class options from the server
  useEffect(() => {
    axiosPublic
      .get("/class")
      .then((response) => {
        const options = response.data.map((cls) => ({
          value: cls.name,
          label: cls.name,
        }));
        setClassOptions(options);
      })
      .catch((error) => {
        console.error("Error fetching class options:", error);
      });
  }, []);

  const onSubmit = async (data) => {
    try {
      const slotData = {
        availableDays: data.availableDays,
        classes: data.classes,
        availableTime: data.availableTime,
      };

      const response = await axiosSecure.patch(
        `/trainerSlotUpdate/${user.email}`,
        slotData
      );

      if (response.data.success) {
        setTrainerData((prevData) => ({
          ...prevData,
          availableTime: data.availableTime,
          availableDays: data.availableDays,
          classes: data.classes,
        }));

        reset();

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
        title: "Oops...You have not added anything yet",
        text: "Add new details to update the slot.",
      });
    }
  };

  if (!trainerData) {
    return <p>Loading trainer data...</p>;
  }

  return (
    <div className="w-10/12 mx-auto my-10">
      <h2 className="text-3xl text-yellow-500 font-bold">Add New Slot</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Full Name */}
        <div className="form-control w-full my-6">
          <label className="label">
            <span className="label-text text-white">Full Name*</span>
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
            <span className="label-text text-white">Email (Read-Only)</span>
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
            <span className="label-text text-white">Age (Read-Only)</span>
          </label>
          <input
            type="number"
            value={trainerData.age || ""}
            readOnly
            className="input input-bordered w-full bg-gray-100"
          />
        </div>

        {/* Skills (Read-only) */}
        <div className="form-control w-full my-6">
          <label className="label">
            <span className="label-text text-white">Skills (Read-Only)</span>
          </label>
          <Select
            isMulti
            options={skillOptions}
            value={trainerData.skills?.map((skill) => ({
              value: skill,
              label: skillOptions.find((opt) => opt.value === skill)?.label,
            }))}
            isDisabled
            className="basic-multi-select"
            classNamePrefix="select"
          />
        </div>

        {/* Select Available Days */}
        <div className="form-control w-full my-6">
          <label className="label">
            <span className="label-text text-white">Select Available Days</span>
          </label>
          <Select
            isMulti
            options={dayOptions}
            defaultValue={trainerData.availableDays?.map((day) => ({
              value: day,
              label: dayOptions.find((opt) => opt.value === day)?.label,
            }))}
            onChange={(selectedOptions) => {
              setValue(
                "availableDays",
                selectedOptions ? selectedOptions.map((opt) => opt.value) : []
              );
            }}
            className="basic-multi-select"
            classNamePrefix="select"
          />
        </div>

        {/* Available Time */}
        <div className="form-control w-full my-6">
          <label className="label">
            <span className="label-text text-white">Available Time</span>
          </label>
          <input
            type="text"
            defaultValue={trainerData.availableTime || ""}
            {...register("availableTime", { required: true })}
            placeholder="e.g., 9:00 AM - 5:00 PM"
            className="input input-bordered w-full"
          />
        </div>

        {/* Select Classes */}
        <div className="form-control w-full my-6">
          <label className="label">
            <span className="label-text text-white">Classes*</span>
          </label>
          <Select
  isMulti
  options={classOptions} // Dynamically fetched options
  defaultValue={trainerData.classes?.map((className) => ({
    value: className,
    label: className, // Use the className directly as the label
  }))}
  onChange={(selectedOptions) => {
    setValue(
      "classes",
      selectedOptions ? selectedOptions.map((opt) => opt.value) : []
    );
  }}
  className="basic-multi-select"
  classNamePrefix="select"
/>

        </div>

        <button type="submit" className="btn bg-yellow-500 border-none text-black font-bold">
          Add Slot
        </button>
      </form>
    </div>
  );
};

export default AddNewSlot;
