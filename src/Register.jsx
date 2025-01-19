import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { BiSolidErrorCircle } from "react-icons/bi";
import { AuthContext } from "./Provider/AuthProvider";
import useAxiosPublic from "./hooks/useAxiosPublic";
import Swal from "sweetalert2";


export default function Register() {
  const navigate = useNavigate();
  const axiosPublic=useAxiosPublic()
  const { userRegister, googleLogin, userUpdate, setUser } = useContext(AuthContext);
  const [error, setError] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const name = e.target.name.value;
    const photo = e.target.photo.value;

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

    if (!passwordRegex.test(password)) {
      setError("Length must be at least 6 characters with an uppercase and lowercase letter.");
      return;
    }
    setError('');
    userRegister(email, password)
      .then((result) => {
        return userUpdate(name, photo);
      })
      .then(() => {
        const user = { name, email,photo };
        return axiosPublic.post('/users', user);
      })
      .then((res) => {
        if (res.data.insertedId) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "user has been successfully registered!",
            showConfirmButton: false,
            timer: 1500,
          });
          navigate('/');
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };


  return (
    <div className="min-h-screen p-2 flex items-center justify-center">
      <Toaster />
      <div className="bg-black border border-yellow-500 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-4xl text-center text-yellow-500  font-bold mb-8">Register</h1>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-base font-medium text-white">Name</label>
            <input type="text" name="name" id="name" placeholder="Enter your name" className="input input-bordered w-full mt-1" required />
          </div>
          <div className="mb-4">
            <label htmlFor="photo" className="block text-base font-medium text-white">Photo URL</label>
            <input type="text" name="photo" id="photo" placeholder="Enter your photo URL" className="input input-bordered w-full mt-1" required />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-base font-medium text-white">Email</label>
            <input type="email" name="email" id="email" placeholder="Enter your email" className="input input-bordered w-full mt-1" required />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-base font-medium text-white">Password</label>
            <input type="password" name="password" id="password" placeholder="Enter your password" className="input input-bordered w-full mt-1" required />
            {error && (
              <p className="flex gap-1 text-red-500 font-semibold mt-2">
                <BiSolidErrorCircle size={22} />
                <span className="text-xs">{error}</span>
              </p>
            )}
          </div>
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-yellow-500 font-semibold">Already have an account? <Link to="/login" className="text-yellow-500 font-semibold underline hover:text-indigo-500">Login</Link></p>
          </div>
          <button type="submit" className="btn bg-yellow-500 text-black font-bold border-none text-base w-full py-2 mb-4">Register</button>
        </form>
      </div>
    </div>
  );
}
