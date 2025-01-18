import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
// import { AuthContext } from "../provider/AuthProvider";
import { FaCartShopping } from "react-icons/fa6";
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
    <div className="navbar bg-yellow-500 *:text-white">
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
              <Link to="/contact">Contact Us</Link>
            </li>
            {
            user && isAdmin && <li className="text-white "><Link to="/dashboard/appliedTrainers">Dashboard</Link></li>
        }

          {
            user && isTrainer && <li className="text-white "><Link to="/dashboard/addForum">Dashboard</Link></li>
        }
        {
            user && !isAdmin && !isTrainer && <li className="text-white"><Link to="/dashboard/myBookedTrainer">Dashboard</Link></li>
        }
          </ul>
        </div>
        <a className="btn btn-ghost text-xl transition-transform transform hover:scale-110"><FaDumbbell className="text-black text-5xl" /><p className="font-bold text-2xl">Fit<span className="text-black"> Trick</span></p></a>
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
            user && isAdmin && <li className="text-black font-bold"><Link to="/dashboard/appliedTrainers">Dashboard</Link></li>
        }

          {
            user && isTrainer && <li className="text-black font-bold"><Link to="/dashboard/addForum">Dashboard</Link></li>
        }
        {
            user && !isAdmin && !isTrainer && <li className="text-black font-bold"><Link to="/dashboard/myBookedTrainer">Dashboard</Link></li>
        }
        </ul>
      </div>
      <div className="navbar-end">
        {user ? (
          <div className="flex items-center gap-4 relative group">
            <img
              className="w-10 rounded-full group-hover:ring-4 group-hover:ring-[#7D0DC3] transition-all"
              src={currentUser?.photo || user?.photoURL}
              alt="User"
            />
            <button
              onClick={userLogOut}
              className="px-4 py-3 bg-[#7D0DC3] text-white text-sm rounded-md"
            >
              Log Out
            </button>
            <div className="hidden md:flex absolute top-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black text-white w-28 px-3 py-3 rounded-md text-base z-10">
              <p className="text-center">{currentUser?.name}</p>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link to="/login" className="btn">
              Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
