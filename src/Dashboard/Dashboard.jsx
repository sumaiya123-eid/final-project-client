import React from "react";
import { FaHome, FaShoppingCart, FaUtensilSpoon } from "react-icons/fa";
import {
  FaBangladeshiTakaSign,
  FaBook,
  FaBookAtlas,
  FaCreativeCommonsBy,
  FaList,
  FaPhone,
  FaStreetView,
  FaUser,
} from "react-icons/fa6";
import { Link, NavLink, Outlet } from "react-router-dom";
import useAdmin from "../hooks/useAdmin";
import useTrainer from "../hooks/useTrainer";

export default function Dashboard() {
  const [isAdmin] = useAdmin();
  const [isTrainer] = useTrainer();

  return (
    <div className="flex">
      <div className="w-[250px] bg-[#D1A054] min-h-screen">
        <h3 className="flex justify-center font-bold mt-6 ">BISTRO BOSS </h3>
        <h3 className="text-center mb-10">RESTAURANT</h3>
        <ul className="menu">
          {/* Admin-specific options */}
          {isAdmin && (
            <>
              <li>
                <NavLink to="/dashboard/adminHome">
                  <FaHome />
                  All Newsletter Subscribers
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/addItems">
                  <FaUtensilSpoon />
                  All Trainers
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/appliedTrainers">
                  <FaList />
                  Applied Trainers
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/bookings">
                  <FaBookAtlas />
                  Balance
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/addClass">
                  <FaUser />
                  Add New Class
                </NavLink>
              </li>
            </>
          )}

          {/* Trainer-specific options */}
          {isTrainer && !isAdmin && (
            <>
              <li>
                <NavLink to="/dashboard/trainerHome">
                  <FaHome />
                  Manage Slots
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/myClasses">
                  <FaBook />
                  Add New slot
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/addForum">
                  <FaList />
                  Add new Forum
                </NavLink>
              </li>
            </>
          )}

          {/* User-specific options */}
          {!isAdmin && !isTrainer && (
            <>
              <li>
                <Link to="/dashboard/userHome">
                  <FaHome />
                  Activity Log page
                </Link>
              </li>
              <li>
                <Link to="/dashboard/myProfile">
                  <FaBook />
                  Profile Page
                </Link>
              </li>
              <li>
                <Link to="/dashboard/bookedTrainer">
                  <FaBangladeshiTakaSign />
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
              <FaHome />
              Home
            </Link>
          </li>
          <li>
            <Link to="/menu">
              <FaList />
              Menu
            </Link>
          </li>
          <li>
            <Link to="/shop/salad">
              <FaShoppingCart />
              Shop
            </Link>
          </li>
          <li>
            <Link to="/contact">
              <FaPhone />
              Contact
            </Link>
          </li>
        </ul>
      </div>

      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
