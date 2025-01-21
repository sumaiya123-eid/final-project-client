import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import useAxiosPublic from "../hooks/useAxiosPublic";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { Helmet } from "react-helmet-async";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const AddClassPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    image: null,
    description: "",
    additionalInfo: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const axiosPublic=useAxiosPublic()
  const axiosSecure=useAxiosSecure()
  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      image: e.target.files[0],
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.image || !formData.description) {
      Swal.fire({
        icon: "error",
        title: "Missing Fields",
        text: "Class name, image, and description are required.",
      });
      return;
    }

    try {
      setIsLoading(true);

      // Upload image to ImgBB
      const formDataForImage = new FormData();
      formDataForImage.append("image", formData.image);

      const imageRes = await axiosPublic.post(image_hosting_api, formDataForImage);
      const imageData = imageRes.data;

      if (imageData.success) {
        const newClass = {
          name: formData.name,
          image: imageData.data.display_url,
          description: formData.description,
          additionalInfo: formData.additionalInfo,
        };

        // Add the class to the database
        const res = await axiosSecure.post("/classes", newClass);

        if (res.data.success) {
          Swal.fire({
            icon: "success",
            title: "Class Added!",
            text: "The new class has been successfully added.",
          });
          navigate("/allClasses");
        } else {
          Swal.fire({
            icon: "error",
            title: "Failed to Add Class",
            text: res.data.message,
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Image Upload Failed",
          text: "Failed to upload image. Please try again.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container my-5 w-10/12 mx-auto p-6 border border-yellow-500 ">
      <Helmet>
                    <title>FitConnect | Dashboard | Add Class</title>
                  </Helmet>
      <h1 className="text-3xl text-yellow-500 font-semibold mb-6">Add New Class</h1>

      <form onSubmit={handleSubmit}>
        {/* Class Name */}
        <div className="form-control mb-6">
          <label className="label text-white">Class Name*</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        {/* Class Image */}
        <div className="form-control mb-6">
          <label className="label text-white">Class Image*</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file-input w-full"
            required
          />
        </div>

        {/* Description */}
        <div className="form-control mb-6 ">
          <label className="label text-white">Class Description*</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="textarea textarea-bordered w-full"
            rows="4"
            required
          ></textarea>
        </div>

        {/* Additional Info */}
        <div className="form-control mb-6 ">
          <label className="label text-white">Additional Info</label>
          <textarea
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleChange}
            className="textarea textarea-bordered w-full"
            rows="3"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn bg-yellow-500 font-bold border-none text-black" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Class"}
        </button>
      </form>
    </div>
  );
};

export default AddClassPage;
