import { FaArrowLeft } from "react-icons/fa6";
import { Link } from "react-router-dom";


export default function ErrorPage() {
    return (
      <div className="flex flex-col justify-center items-center text-center text-black">
        <h1 className="text-5xl font-bold mt-28">404</h1>
        <p className="text-2xl font-semibold text-gray-500 mt-5">Oppss...Error!!! <br /> Page is not found</p>
        <div className="mt-5">
        <Link to="/" className="btn btn-neutral"><FaArrowLeft></FaArrowLeft>Go Back to Home</Link>
        </div>
      </div>
    )
  }
  