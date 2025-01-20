import React from "react";
import { FaCalendarAlt, FaCalendarCheck, FaChalkboardTeacher, FaClipboardList, FaHome, FaPlusCircle, FaShoppingCart, FaUserAlt, FaUtensilSpoon } from "react-icons/fa";
import {
  FaBangladeshiTakaSign,
  FaBook,
  FaBookAtlas,
  FaChalkboard,
  FaCommentDots,
  FaComments,
  FaCreativeCommonsBy,
  FaDollarSign,
  FaList,
  FaPhone,
  FaStreetView,
  FaUser,
  FaUsers,
  FaUserTie,
} from "react-icons/fa6";
import { Link, NavLink, Outlet } from "react-router-dom";
import useAdmin from "../hooks/useAdmin";
import useTrainer from "../hooks/useTrainer";

export default function Dashboard() {
  const [isAdmin] = useAdmin();
  const [isTrainer] = useTrainer();

  return (
    <div className="flex">
      <div className="w-[250px] bg-yellow-400 min-h-screen *:text-black *:font-bold">
        <h3 className="flex justify-center font-bold mt-6 ">BISTRO BOSS </h3>
        <h3 className="text-center mb-10">RESTAURANT</h3>
        <ul className="menu">
          {/* Admin-specific options */}
          {isAdmin && (
            <>
              <li>
  <NavLink to="/dashboard/subscribers">
    <FaUsers /> {/* For newsletter subscribers */}
    All Newsletter Subscribers
  </NavLink>
</li>
<li>
  <NavLink to="/dashboard/trainerList">
    <FaUserTie /> {/* For trainers */}
    All Trainers
  </NavLink>
</li>
<li>
  <NavLink to="/dashboard/appliedTrainers">
    <FaClipboardList /> {/* For applied trainers */}
    Applied Trainers
  </NavLink>
</li>
<li>
  <NavLink to="/dashboard/balance">
    <FaDollarSign /> {/* For balance */}
    Balance
  </NavLink>
</li>
<li>
  <NavLink to="/dashboard/addClass">
    <FaChalkboardTeacher /> {/* For adding a new class */}
    Add New Class
  </NavLink>
</li>
<li>
  <NavLink to="/dashboard/addForum">
    <FaComments /> {/* For adding a new forum */}
    Add new Forum
  </NavLink>
</li>

            </>
          )}

          {/* Trainer-specific options */}
          {isTrainer && !isAdmin && (
            <>
              <li>
  <NavLink to="/dashboard/manageSlots">
    <FaCalendarAlt /> {/* For managing slots */}
    Manage Slots
  </NavLink>
</li>
<li>
  <NavLink to="/dashboard/addSlot">
    <FaPlusCircle /> {/* For adding a new slot */}
    Add New Slot
  </NavLink>
</li>
<li>
  <NavLink to="/dashboard/addForum">
    <FaCommentDots /> {/* For adding a new forum */}
    Add New Forum
  </NavLink>
</li>

            </>
          )}

          {/* User-specific options */}
          {!isAdmin && !isTrainer && (
            <>
              <li>
                <Link to="/dashboard/activityLog">
                <FaClipboardList />
                  Activity Log page
                </Link>
              </li>
              <li>
                <Link to="/dashboard/myProfile">
                <FaUserAlt />
                  Profile Page
                </Link>
              </li>
              <li>
                <Link to="/dashboard/myBookedTrainer">
                <FaCalendarCheck />
                  Booked Trainer
                </Link>
              </li>
            </>
          )}
        </ul>

        <div className="divider"></div>

        {/* Common Links */}
        <ul className="menu">
        <li>
  <Link to="/">
    <FaHome /> {/* Home icon */}
    Home
  </Link>
</li>
<li>
  <Link to="/allTrainers">
    <FaUserTie /> {/* For all trainers */}
    All Trainers
  </Link>
</li>
<li>
  <Link to="/allClasses">
    <FaChalkboard /> {/* For all classes */}
    All Classes
  </Link>
</li>
<li>
  <Link to="/allForum">
    <FaComments /> {/* For all forum */}
    All Forum
  </Link>
</li>

        </ul>
      </div>

      <div className="flex-1 bg-black">
        <Outlet />
      </div>
    </div>
  );
}
