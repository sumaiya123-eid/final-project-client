import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { FaGoogle } from "react-icons/fa";
import { AuthContext } from "./Provider/AuthProvider";
import useAxiosPublic from "./hooks/useAxiosPublic";
import Swal from "sweetalert2";

export default function Login() {
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  const { userLogin, googleLogin } = useContext(AuthContext);

  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    userLogin(email, password)
      .then((result) => {
        console.log(result.user);
        e.target.reset();
        navigate("/");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const handleGoogle = () => {
    googleLogin()
      .then((result) => {
        console.log("Google login successful", result.user);
        const userInfo = {
          email: result.user?.email,
          name: result.user?.displayName,
        };
        axiosPublic.post("/users", userInfo).then((res) => {
          if (res.data.insertedId) {
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "user has been successfully registered!",
              showConfirmButton: false,
              timer: 1500,
            });
          }
          console.log(res.data);
          navigate("/");
        });
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <div className="min-h-screen p-2 flex items-center justify-center">
      <Toaster />
      <div className="bg-black border border-yellow-500 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-4xl text-center text-yellow-500 font-bold mb-8">
          Login
        </h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-base font-medium text-white"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              className="input input-bordered w-full mt-1"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-base font-medium text-white"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              className="input input-bordered w-full mt-1"
              required
            />
          </div>
          <div className="flex justify-between items-center mb-6">
            <Link
              to="/forgetPassword"
              className="text-sm text-yellow-500 font-semibold hover:text-indigo-500"
            >
              Forgot password?
            </Link>
            <p className="text-sm text-yellow-500 font-semibold">
              New here?{" "}
              <Link
                to="/register"
                className="text-yellow-500 font-semibold underline hover:text-indigo-500"
              >
                Register
              </Link>
            </p>
          </div>
          <button
            type="submit"
            className="btn bg-yellow-500 border-none font-bold text-black text-base w-full py-2 mb-4"
          >
            Login
          </button>
          <button
            type="button"
            onClick={handleGoogle}
            className="btn btn-outline bg-white font-bold w-full py-2 flex items-center justify-center"
          >
            <FaGoogle className="mr-2" /> Sign in with Google
          </button>
        </form>
      </div>
    </div>
  );
}
