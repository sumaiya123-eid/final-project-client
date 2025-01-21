import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
// import { AuthContext } from "../provider/AuthProvider";
import { AuthContext } from "../Provider/AuthProvider";
import useAdmin from "../hooks/useAdmin";
import useTrainer from "../hooks/useTrainer";
import useUser from "../hooks/useDbUser";
import { FaDumbbell } from "react-icons/fa";


export default function Navbar() {
  const { user, userLogOut } = useContext(AuthContext);
  const [currentUser]=useUser()
  console.log(currentUser)
  const [isAdmin] = useAdmin();
  const [isTrainer] = useTrainer();
  return (
    <div className="navbar p-4 bg-yellow-400 *:text-white">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-black rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/allTrainers">All Trainer</Link>
            </li>
            <li>
              <Link to="/allClasses">All Classes</Link>
            </li>
            <li>
              <Link to="/allForum">All Forum</Link>
            </li>
            {
            user && isAdmin && <li className="text-white "><Link to="/dashboard/subscribers">Dashboard</Link></li>
        }

          {
            user && isTrainer && <li className="text-white "><Link to="/dashboard/activityLog">Dashboard</Link></li>
        }
        {
            user && !isAdmin && !isTrainer && <li className="text-white"><Link to="/dashboard/myBookedTrainer">Dashboard</Link></li>
        }
          </ul>
        </div>
        <a className="btn btn-ghost text-xl transition-transform transform hover:scale-110"><FaDumbbell className="text-black text-5xl" /><p className="font-bold text-2xl hidden md:block">Fit<span className="text-black"> Trick</span></p></a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal flex gap-5 items-center px-1">
        <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-black font-bold underline"
                : "text-black font-bold"
            }
          >
            Home
          </NavLink>
        <NavLink
            to="/allTrainers"
            className={({ isActive }) =>
              isActive
                ? "text-black font-bold underline"
                : "text-black font-bold"
            }
          >
            All Trainer
          </NavLink>
        <NavLink
            to="/allClasses"
            className={({ isActive }) =>
              isActive
                ? "text-black font-bold underline"
                : "text-black font-bold"
            }
          >
            All Classes
          </NavLink>
        <NavLink
            to="/allForum"
            className={({ isActive }) =>
              isActive
                ? "text-black font-bold underline"
                : "text-black font-bold"
            }
          >
            All Forum
          </NavLink>
          {
            user && isAdmin && <li className="text-black font-bold"><Link to="/dashboard/subscribers">Dashboard</Link></li>
        }

          {
            user && isTrainer && <li className="text-black font-bold"><Link to="/dashboard/addForum">Dashboard</Link></li>
        }
        {
            user && !isAdmin && !isTrainer && <li className="text-black font-bold"><Link to="/dashboard/activityLog">Dashboard</Link></li>
        }
        </ul>
      </div>
      <div className="navbar-end">
      {user ? (
  <div className="flex items-center gap-4 relative group">
    {/* User Profile Image */}
    <img
      className="w-10 h-10 rounded-full group-hover:ring-4 group-hover:ring-[#7D0DC3] transition-all"
      src={currentUser?.photo || user?.photoURL}
      alt="User"
    />
    {/* Log Out Button */}
    <button
      onClick={userLogOut}
      className="px-4 py-3 bg-black text-white text-sm rounded-md"
    >
      Log Out
    </button>
    <div className="hidden absolute top-14 -left-36 md:flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white shadow-lg rounded-lg w-64 py-6 z-10">
      <p className="text-black font-bold text-xl mb-4">My Profile</p>
      <div className="relative w-16 h-16 mb-2">
  <img
    className="w-16 h-16 rounded-full border-2 border-[#7D0DC3]"
    src={currentUser?.photo || user?.photoURL}
    alt="User"
  />
  <span className="absolute -bottom-2 -right-2 bg-[#7D0DC3] text-white text-xs font-semibold px-1  rounded-full shadow-lg">
    {currentUser?.role || "Member"}
  </span>
</div>
      <p className="font-semibold text-gray-800">{currentUser?.name || "User Name"}</p>
      <p className="text-sm text-gray-500">{currentUser?.email || "user@example.com"}</p>
    </div>
  </div>
) : (
  <div className="flex gap-2">
    <Link to="/login" className="btn bg-black text-white border-none">
      Login
    </Link>
  </div>
)}

      </div>
    </div>
  );
}
