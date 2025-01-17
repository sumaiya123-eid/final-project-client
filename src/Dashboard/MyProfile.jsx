import { useQuery } from '@tanstack/react-query';
import React, { useContext, useState, useEffect } from 'react';
import useAxiosPublic from '../hooks/useAxiosPublic';
import { AuthContext } from '../Provider/AuthProvider';
import Swal from 'sweetalert2';
import { FaUserCircle, FaEdit, FaEnvelope, FaClock } from 'react-icons/fa';

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

export default function MyProfile() {
  const { user } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();

  const { data, refetch } = useQuery({
    queryKey: ['user', user?.email],
    queryFn: async () => {
      const res = await axiosPublic.get(`/users/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email, // Only run query when email exists
  });

  const [newImage, setNewImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(data?.photo || '/default-image.png');

  useEffect(() => {
    if (data?.photo) {
      setImageUrl(data?.photo); // Update imageUrl from the fetched data after reload
    }
  }, [data]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      try {
        const res = await axiosPublic.post(image_hosting_api, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (res.data.success) {
          const newImageUrl = res.data.data.display_url;
          setImageUrl(newImageUrl); // Set the uploaded image URL

          // Optionally append timestamp to avoid browser caching
          setImageUrl(`${newImageUrl}?${new Date().getTime()}`);
          setNewImage(file); // Save the file for later use
        } else {
          alert('Error uploading image');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Error uploading image');
      }
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    const updatedName = e.target.name.value;

    try {
      // Prepare the updated profile data
      const updatedData = {
        fullName: updatedName,
        profileImage: imageUrl, // Use the updated image URL
      };

      // Making a PATCH request to update the user profile with a JSON body
      const res = await axiosPublic.patch(`/users/${user.email}`, updatedData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 200) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Profile updated successfully!',
          showConfirmButton: false,
          timer: 1500,
        });
        refetch(); // Refetch data to ensure the latest data is shown
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  // Format the last login time
  const getLastLoginTime = () => {
    if (user?.metadata?.lastSignInTime) {
      const lastSignInDate = new Date(user.metadata.lastSignInTime);
      return lastSignInDate.toLocaleString(); // Customize the format if needed
    }
    return 'Not available';
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 via-green-400 to-blue-500 flex justify-center items-center p-6 ">
      <div className="w-full max-w-sm bg-black rounded-xl shadow-lg  p-6 space-y-4 animate__animated animate__fadeInUp">
        <div className="flex justify-center mb-4">
          {/* Profile Image Section */}
          <div className="relative ">
          <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-r from-blue-500 via-green-400 to-blue-500 mx-auto">
          <img
              key={imageUrl} // Adding key to force re-render when image URL changes
              src={imageUrl || user?.photoURL}
              alt="Profile"
              className="w-full h-full rounded-full shadow-lg transform transition-transform duration-500 hover:scale-110"
              onClick={() => document.getElementById('image-upload').click()} // Open file input when image is clicked
            />
          </div>
            <input
              type="file"
              id="image-upload"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
            <div className="mt-2 text-center text-blue-400 cursor-pointer" onClick={() => document.getElementById('image-upload').click()}>
              Change Profile
            </div>
          </div>
        </div>

        <form onSubmit={handleProfileUpdate} className="space-y-4">
          {/* Email Field (Read-only) */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-lg font-semibold text-white">
                <FaEnvelope size={20} className="mr-2 text-blue-400" /> Email
              </span>
            </label>
            <input
              type="email"
              value={user?.email}
              className="input input-bordered w-full bg-gray-800 text-white rounded-lg py-2 px-3 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
              readOnly
            />
          </div>

          {/* Name Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-lg font-semibold text-white">
                <FaEdit size={20} className="mr-2 text-blue-400" /> Name
              </span>
            </label>
            <input
              type="text"
              name="name"
              defaultValue={data?.name}
              className="input input-bordered w-full bg-gray-800 text-white rounded-lg py-2 px-3 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Last Login */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-lg font-semibold text-white">
                <FaClock size={20} className="mr-2 text-blue-400" /> Last Login
              </span>
            </label>
            <input
              type="text"
              value={getLastLoginTime()}
              className="input input-bordered w-full bg-gray-800 text-white rounded-lg py-2 px-3 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
              readOnly
            />
          </div>

          {/* Submit Button */}
          <div className="form-control mt-4">
            <button
              type="submit"
              className="btn bg-green-400 w-full py-2 rounded-lg hover:bg-blue-600 transition-all ease-in-out duration-200 text-black font-bold text-base"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
