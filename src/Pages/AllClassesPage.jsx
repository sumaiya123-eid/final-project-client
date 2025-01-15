import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import useAxiosPublic from '../hooks/useAxiosPublic';
import { useQuery } from '@tanstack/react-query';


const fetchClasses = async (page) => {
  const axiosPublic = useAxiosPublic();
  const response = await axiosPublic.get(`/classes?page=${page}`);
  return response.data;
};

const AllClassesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["classes", currentPage],
    queryFn: () => fetchClasses(currentPage),
    keepPreviousData: true,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  const handleTrainerClick = (trainerEmail) => {
    navigate(`/users/${trainerEmail}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container my-10">
      <h1 className="text-2xl font-semibold mb-6">All Classes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.classes.map((classItem) => (
          <div key={classItem._id} className="class-card border p-4 rounded-lg shadow">
            <img
              src={classItem.image}
              alt={classItem.name}
              className="w-full h-48 object-cover mb-4"
            />
            <h2 className="text-xl font-semibold">{classItem.name}</h2>
            <p className="mb-4">{classItem.description}</p>
            <h3 className="font-semibold mt-4">Trainers:</h3>
            <ul>
              {classItem.trainers.slice(0, 5).map((trainer, index) => (
                <li key={index} className="flex items-center mt-2">
                  <img
                    src={trainer.profileImage}
                    alt={trainer.name}
                    className="w-10 h-10 rounded-full mr-3 cursor-pointer"
                    onClick={() => handleTrainerClick(trainer.email)}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="pagination mt-6 flex justify-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="btn mr-2"
        >
          Previous
        </button>
        <span className="mr-2">{`Page ${currentPage} of ${data.totalPages}`}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === data.totalPages}
          className="btn"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllClassesPage;
