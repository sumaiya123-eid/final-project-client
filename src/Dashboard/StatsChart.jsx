import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../hooks/useAxiosPublic";

const StatsChart = () => {
  const axiosPublic = useAxiosPublic();
  const [chartData, setChartData] = useState([]);
  
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
      setChartData([
        { name: "Subscribers", value: data.subscribers },
        { name: "Paid Members", value: data.member },
      ]);
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

  // Define colors for the chart sections
  const COLORS = ["#FFBB28", "#E53935"];

  return (
    <div className="bg-black text-white pb-10 px-6 flex items-center justify-center">
      <div className="max-w-3xl text-center">
        <h2 className="text-3xl font-bold text-yellow-400 mb-2">
          Subscribers vs Paid Members
        </h2>
        <PieChart width={400} height={400}>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            label
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    </div>
  );
};

export default StatsChart;
