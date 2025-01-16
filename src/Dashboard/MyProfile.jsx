import { useQuery } from '@tanstack/react-query';
import React, { useContext, useState, useEffect } from 'react';
import useAxiosPublic from '../hooks/useAxiosPublic';
import { AuthContext } from '../Provider/AuthProvider';
import Swal from 'sweetalert2';

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

export default function MyProfile() {
  const { user } = useContext(AuthContext);
  console.log(user?.photoURL)
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
                   position: "top-end",
                   icon: "success",
                   title: "Profile updated successfully!",
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

  return (
    <div>
      <form onSubmit={handleProfileUpdate} className="card-body">
        {/* Email Field (Read-only) */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            value={user?.email}
            className="input input-bordered"
            readOnly
          />
        </div>

        {/* Current Profile Image */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Current Image</span>
          </label>
          <img
            key={imageUrl}  // Adding key to force re-render when image URL changes
            src={imageUrl || user?.photoURL} 
            alt="Profile" 
            className="w-20 h-20 rounded-full cursor-pointer"
            onClick={() => document.getElementById('image-upload').click()} // Open file input when image is clicked
          />
          <input
            type="file"
            id="image-upload"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {/* Name Field */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Name</span>
          </label>
          <input
            type="text"
            name="name"
            defaultValue={data?.name}
            className="input input-bordered"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="form-control mt-6">
          <button type="submit" className="btn btn-primary">
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
}
