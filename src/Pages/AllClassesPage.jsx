import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import { FaChevronLeft, FaChevronRight, FaInfoCircle, FaChalkboardTeacher } from "react-icons/fa";

const fetchClasses = async (page, search) => {
  const axiosPublic = useAxiosPublic();
  const response = await axiosPublic.get(`/classes?page=${page}&search=${search}`);
  return response.data;
};

const AllClassesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Fetch classes using useQuery
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["classes", currentPage],
    queryFn: () => fetchClasses(currentPage, search),
    keepPreviousData: true,
  });

  if (isLoading) return <div className="text-center my-10 text-yellow-500">Loading...</div>;
  if (isError) return <div className="text-center text-red-500 my-10">Error: {error.message}</div>;

  const handleTrainerClick = (trainerEmail) => {
    navigate(`/users/${trainerEmail}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    refetch(); // Refetch data for the new page
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    refetch(); // Refetch data when the search input changes
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= data.totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`btn btn-sm ${
            i === currentPage ? "bg-yellow-500 text-black" : "bg-gray-800 text-yellow-500"
          } hover:bg-yellow-400 mx-1`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="bg-black w-10/12 mx-auto min-h-screen py-10 px-4">
      <h1 className="text-3xl font-bold text-yellow-500 text-center mb-8">All Classes</h1>

      {/* Search Box */}
      <div className="mb-6 text-center">
        <input
          type="text"
          className="input w-6/12  input-bordered bg-white text-black placeholder-black border-yellow-500 focus:ring-yellow-500"
          placeholder="Search Classes"
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.classes.map((classItem) => (
          <div
            key={classItem._id}
            className="class-card *:text-yellow-500 bg-black border border-yellow-500 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105 p-4"
          >
            <div className="relative">
              <img
                src={classItem.image}
                alt={classItem.name}
                className="w-full h-48 object-fit rounded-t-lg"
              />
              <div className="absolute top-2 left-2 bg-black text-yellow-500 text-xs px-3 py-1 rounded-full shadow">
                Trainers: {classItem.trainers.length}
              </div>
            </div>
            <h2 className="text-xl font-semibold mt-4 flex items-center text-black">
              <FaInfoCircle className="mr-2" /> {classItem.name}
            </h2>
            <p className="text-black text-sm mt-2 mb-2">
              <strong>Description: </strong> {classItem.description}
            </p>
            <p className="text-black text-sm mb-4">
              <strong>Additional Info: </strong> {classItem.additionalInfo}
            </p>
            <h3 className="font-semibold text-black flex items-center">
              <FaChalkboardTeacher className="text-yellow-500 mr-2" /> Trainers:
            </h3>
            {classItem.trainers && classItem.trainers.length > 0 ? (
              <div className="flex items-center mt-3 space-x-2">
                {classItem.trainers.slice(0, 5).map((trainer, index) => (
                  <div
                    key={index}
                    className="relative group"
                    onClick={() => handleTrainerClick(trainer.email)}
                  >
                    <img
                      src={trainer.profileImage}
                      alt={trainer.name}
                      className="w-12 h-12 rounded-full border-2 border-yellow-500 cursor-pointer group-hover:scale-125 transition duration-300"
                    />
                    <div className="absolute z-20 left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition duration-300 bg-yellow-500 text-black py-1 px-2 rounded shadow">
                      {trainer.name}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-black text-sm mt-3">
                <FaChalkboardTeacher className="text-black mr-2 inline" />
                No trainers available for this class.
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination mt-8 flex justify-center items-center space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="btn btn-sm bg-gray-800 text-yellow-500 hover:bg-yellow-500 hover:text-black flex items-center"
        >
          <FaChevronLeft className="mr-1" /> Previous
        </button>
        {renderPageNumbers()}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === data.totalPages}
          className="btn btn-sm bg-gray-800 text-yellow-500 hover:bg-yellow-500 hover:text-black flex items-center"
        >
          Next <FaChevronRight className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default AllClassesPage;
