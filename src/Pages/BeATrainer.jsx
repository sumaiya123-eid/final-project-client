import React, { useContext, useEffect, useState } from "react";
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

  const [classOptions, setClassOptions] = useState([]);

  useEffect(() => {
    // Fetch available classes from the server
    const fetchClasses = async () => {
      try {
        const res = await axiosPublic.get("/class");
        if (res.data) {
          const options = res.data.map((cls) => ({
            value: cls.name,
            label: cls.name,
          }));
          setClassOptions(options);
        }
      } catch (error) {
        console.error("Error fetching class options:", error);
      }
    };
    fetchClasses();
  }, [axiosPublic]);

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
        // Prepare user application data
        const userData = {
          fullName: user?.displayName,
          email: user?.email, // From AuthContext
          age: parseInt(data.age),
          skills: data.skills, // Already formatted as an array
          availableDays: data.availableDays, // Already formatted as an array
          availableTime: data.availableTime,
          biography: data.biography,
          profileImage: res.data.data.display_url,
          role: "requested", // Set role to requested for application
          classes: data.classes, // Selected classes
          experience: data.experience, // Experience field
        };

        // Submit the application to the server
        const userRes = await axiosPublic.patch(
          `/users/apply/${user?.email}`,
          userData
        );

        if (userRes.data.success) {
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
      console.error("Error submitting application:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="w-10/12 mx-auto mt-10">
      <h3 className="text-yellow-500 font-bold text-center text-3xl">Be a Trainer</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Full Name */}
        <div className="form-control w-full my-6 ">
          <label className="label">
            <span className="label-text text-white">Full Name*</span>
          </label>
          <input
            type="text"
            value={user?.displayName || ""} // Set the value from the user context
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
            value={user?.email || ""}
            readOnly
            className="input input-bordered w-full bg-gray-100"
          />
        </div>

        {/* Age */}
        <div className="form-control w-full my-6">
          <label className="label">
            <span className="label-text text-white">Age*</span>
          </label>
          <input
            type="number"
            {...register("age", { required: true })}
            placeholder="Age"
            className="input input-bordered w-full"
          />
        </div>

         {/* Profile Image */}
         <div className="form-control w-full my-6">
          <label className="label">
            <span className="label-text text-white">Profile Image*</span>
          </label>
          <input
            {...register("profileImage", { required: true })}
            type="file"
            className="file-input w-full max-w-xs"
          />
        </div>

        {/* Skills */}
        <div className="form-control w-full my-6">
          <label className="label">
            <span className="label-text text-white">Skills*</span>
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
            <span className="label-text text-white">Available Days (Slot Name)*</span>
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
            <span className="label-text text-white">Available Time*</span>
          </label>
          <input
            type="text"
            {...register("availableTime", { required: true })}
            placeholder="e.g., 9:00 AM - 5:00 PM"
            className="input input-bordered w-full"
          />
        </div>

        <div className="form-control w-full my-6">
          <label className="label">
            <span className="label-text text-white">Biography*</span>
          </label>
          <input
            type="text"
            {...register("biography", { required: true })}
            placeholder="Biography"
            className="input input-bordered w-full"
          />
        </div>


        {/* Classes */}
        <div className="form-control w-full my-6">
          <label className="label">
            <span className="label-text text-white">Classes*</span>
          </label>
          <Select
            isMulti
            options={classOptions}
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

        {/* Experience */}
        <div className="form-control w-full my-6">
          <label className="label">
            <span className="label-text text-white">Experience*</span>
          </label>
          <textarea
            {...register("experience", { required: true })}
            placeholder="Describe your experience"
            className="textarea textarea-bordered w-full"
          />
        </div>

        <button type="submit" className="btn bg-yellow-500 font-bold text-black border-none mb-6">
          Apply
        </button>
      </form>
    </div>
  );
};

export default BeATrainer;
