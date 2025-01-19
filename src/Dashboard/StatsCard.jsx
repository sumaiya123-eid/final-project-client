// StatsCard.js
import React, { useEffect, useState } from "react";
import { FaDollarSign, FaUsers, FaClipboardList } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { motion } from "framer-motion";

const StatsCard = () => {
  const axiosPublic = useAxiosPublic();
  const [stats, setStats] = useState({});
  
  // Fetch stats from the /stats endpoint
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const response = await axiosPublic.get("/stats");
      return response.data;
    },
  });

  useEffect(() => {
    if (data) {
      setStats(data);
    }
  }, [data]);

  if (isLoading) {
    return <div className="text-center text-yellow-400">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="text-center text-red-600">
        Failed to load stats. {error.message}
      </div>
    );
  }

  return (
    <div className="bg-black text-white py-12 px-6  flex items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
        {/* Total Revenue Card */}
        <motion.div
          className="card bg-yellow-400 text-black shadow-xl transform hover:scale-105 transition-transform"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="card-body p-6">
            <div className="flex items-center">
              <FaDollarSign className="text-3xl text-black mr-4" />
              <h2 className="text-xl font-bold">Total Balance</h2>
            </div>
            <p className="text-2xl text-center font-semibold mt-2">${stats.totalRevenue}</p>
          </div>
        </motion.div>

        {/* Total Subscribers Card */}
        <motion.div
          className="card bg-black text-yellow-400 shadow-xl transform hover:scale-105 transition-transform"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="card-body p-6">
            <div className="flex items-center">
              <FaUsers className="text-3xl text-yellow-400 mr-4" />
              <h2 className="text-xl font-bold">Total Subscribers</h2>
            </div>
            <p className="text-2xl text-center font-semibold mt-2">{stats.subscribers}</p>
          </div>
        </motion.div>

        {/* Total Members Card */}
        <motion.div
          className="card bg-yellow-400 text-black shadow-xl transform hover:scale-105 transition-transform"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="card-body p-6">
            <div className="flex items-center">
              <FaClipboardList className="text-3xl text-black mr-4" />
              <h2 className="text-xl font-bold">Total Members</h2>
            </div>
            <p className="text-2xl text-center font-semibold mt-2">{stats.member}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StatsCard;
