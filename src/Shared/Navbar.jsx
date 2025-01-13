import { useContext } from "react";
import { Link } from "react-router-dom";
// import { AuthContext } from "../provider/AuthProvider";
import { FaCartShopping } from "react-icons/fa6";
import { AuthContext } from "../Provider/AuthProvider";
// import useCart from "../hooks/useCart";
// import useAdmin from "../hooks/useAdmin";

export default function Navbar() {
  const { user, userLogOut } = useContext(AuthContext);
//   const [cart]=useCart();
//   const [isAdmin] = useAdmin();
  return (
    <div className="navbar bg-black fixed z-10 bg-opacity-30 *:text-white">
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
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/menu">Our Menu</Link>
            </li>
            <li>
              <Link to="/shop/salad">Our Shop</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
            <li>
              <a>Item 3</a>
            </li>
          </ul>
        </div>
        <a className="btn btn-ghost text-xl">Bistro Boss</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal flex items-center px-1">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/menu">Our Menu</Link>
          </li>
          <li>
            <Link to="/shop/salad">Our Shop</Link>
          </li>
          <li>
            <Link to="/contact">Contact Us</Link>
          </li>
          {/* <li>
            <Link to='/dashboard/cart'>
              <button className="btn">
              <div className="text-xl"><FaCartShopping></FaCartShopping></div>
                <div className="badge badge-secondary">+{cart.length}</div>
              </button>
            </Link>
          </li> */}
          {/* {
            user && isAdmin && <li><Link to="/dashboard/adminHome">Dashboard</Link></li>
        }
        {
            user && !isAdmin && <li><Link to="/dashboard/userHome">Dashboard</Link></li>
        } */}
        </ul>
      </div>
      <div className="navbar-end">
        {user ? (
          <div className="flex items-center gap-4 relative group">
            <img
              className="w-10 rounded-full group-hover:ring-4 group-hover:ring-[#7D0DC3] transition-all"
              src={user?.photoURL}
              alt="User"
            />
            <button
              onClick={userLogOut}
              className="px-4 py-3 bg-[#7D0DC3] text-white text-sm rounded-md"
            >
              Log Out
            </button>
            <div className="hidden md:flex absolute top-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black text-white w-28 px-3 py-3 rounded-md text-base z-10">
              <p className="text-center">{user?.displayName}</p>
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
