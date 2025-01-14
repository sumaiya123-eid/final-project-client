import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import Swal from "sweetalert2";
import { AuthContext } from "../Provider/AuthProvider";
import useAxiosPublic from "../hooks/useAxiosPublic";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

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

const BeATrainer = () => {
  const { user } = useContext(AuthContext);
  const { register, handleSubmit, reset, setValue } = useForm();
  const axiosPublic = useAxiosPublic();

  const onSubmit = async (data) => {
    const imageFile = { image: data.profileImage[0] };

    try {
      // Upload image to ImgBB
      const res = await axiosPublic.post(image_hosting_api, imageFile, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        // Prepare trainer data with the image URL
        const trainerData = {
          fullName: data.fullName,
          email: user?.email, // Get email from AuthContext
          age: parseInt(data.age),
          skills: JSON.stringify(data.skills),
          availableDays: JSON.stringify(data.availableDays), 
          availableTime: data.availableTime,
          profileImage: res.data.data.display_url,
          status: "pending",
        };

        // Submit trainer application data to the server
        const trainerRes = await axiosPublic.post("/trainers", trainerData);
        console.log(trainerRes.data)
        if (trainerRes.data.result.insertedId) {
          reset(); // Reset form
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Trainer application submitted successfully!",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    } catch (error) {
      console.error("Error uploading image or submitting data:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong. Please try again.",
      });
    }
  };

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
            {...register("fullName", { required: true })}
            placeholder="Full Name"
            className="input input-bordered w-full"
          />
        </div>

        {/* Email (Read-only) */}
        <div className="form-control w-full my-6">
          <label className="label">
            <span className="label-text">Email (Read-Only)</span>
          </label>
          <input
            type="email"
            value={user?.email || ""}
            readOnly
            className="input input-bordered w-full bg-gray-100"
          />
        </div>

        {/* Age */}
        <div className="form-control w-full my-6">
          <label className="label">
            <span className="label-text">Age*</span>
          </label>
          <input
            type="number"
            {...register("age", { required: true })}
            placeholder="Age"
            className="input input-bordered w-full"
          />
        </div>

        {/* Skills */}
        <div className="form-control w-full my-6">
          <label className="label">
            <span className="label-text">Skills*</span>
          </label>
          <Select
            isMulti
            options={skillOptions}
            onChange={(selectedOptions) => {
              setValue(
                "skills",
                selectedOptions ? selectedOptions.map((opt) => opt.value) : []
              );
            }}
            className="basic-multi-select"
            classNamePrefix="select"
          />
        </div>

        {/* Available Days */}
        <div className="form-control w-full my-6">
          <label className="label">
            <span className="label-text">Available Days*</span>
          </label>
          <Select
            isMulti
            options={dayOptions}
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
            <span className="label-text">Available Time*</span>
          </label>
          <input
            type="text"
            {...register("availableTime", { required: true })}
            placeholder="e.g., 9:00 AM - 5:00 PM"
            className="input input-bordered w-full"
          />
        </div>

        {/* Profile Image */}
        <div className="form-control w-full my-6">
          <label className="label">
            <span className="label-text">Profile Image*</span>
          </label>
          <input
            {...register("profileImage", { required: true })}
            type="file"
            className="file-input w-full max-w-xs"
          />
        </div>

        <button type="submit" className="btn">
          Apply
        </button>
      </form>
    </div>
  );
};

export default BeATrainer;
