import { Outlet } from "react-router-dom";
import Navbar from "../Shared/Navbar";


export default function Root() {
  return (
    <div className="bg-black">
        <Navbar></Navbar>
        <Outlet></Outlet>
    </div>
  )
}
