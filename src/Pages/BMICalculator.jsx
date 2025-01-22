import React, { useState } from 'react';
import { FaCalculator, FaInfoCircle } from 'react-icons/fa';

const BMICalculator = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmiResult, setBmiResult] = useState(null);

  const calculateBMI = () => {
    if (!weight || !height) {
      alert('Please fill in all fields!');
      return;
    }

    const heightInMeters = height / 100; // Convert height from cm to meters
    const bmi = weight / (heightInMeters * heightInMeters); // BMI formula

    let bmiCategory = '';
    if (bmi < 18.5) {
      bmiCategory = 'Underweight';
    } else if (bmi >= 18.5 && bmi < 24.9) {
      bmiCategory = 'Normal weight';
    } else if (bmi >= 25 && bmi < 29.9) {
      bmiCategory = 'Overweight';
    } else {
      bmiCategory = 'Obese';
    }

    setBmiResult({
      bmi: bmi.toFixed(2),
      category: bmiCategory,
    });
  };

  return (
    <div className="bg-black text-yellow-300 min-h-screen flex flex-col items-center p-6">
      <h2 className="text-3xl font-bold mb-6 flex items-center">
        <FaCalculator className="mr-2" />
        BMI Calculator
      </h2>

      <div className="flex flex-col lg:flex-row items-start gap-6 w-full max-w-6xl">
        {/* Form Section */}
        <div className="w-full lg:w-1/2 bg-gray-900 p-6 rounded-lg shadow-lg">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Weight (kg)</label>
            <input
              type="number"
              className="w-full p-2 rounded-lg bg-gray-800 text-yellow-300 border border-yellow-500 focus:outline-none focus:ring focus:ring-yellow-500"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Height (cm)</label>
            <input
              type="number"
              className="w-full p-2 rounded-lg bg-gray-800 text-yellow-300 border border-yellow-500 focus:outline-none focus:ring focus:ring-yellow-500"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>

          <button
            className="w-full bg-yellow-500 text-black font-bold py-2 rounded-lg hover:bg-yellow-600"
            onClick={calculateBMI}
          >
            Calculate
          </button>
        </div>

        {/* Results Section */}
        {bmiResult && (
          <div className="w-full lg:w-1/2 bg-gray-900 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <FaInfoCircle className="mr-2" />
              Results:
            </h3>
            <p>BMI: {bmiResult.bmi}</p>
            <p>Category: {bmiResult.category}</p>
          </div>
        )}
      </div>

      {/* BMI Chart */}
      <div className="mt-6 bg-gray-900 p-6 rounded-lg shadow-lg w-full lg:w-1/2">
        <h3 className="text-xl font-bold mb-4">BMI Categories</h3>
        <table className="w-full text-yellow-300">
          <thead>
            <tr>
              <th className="p-2 text-left">BMI Range</th>
              <th className="p-2 text-left">Category</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2">Less than 18.5</td>
              <td className="p-2">Underweight</td>
            </tr>
            <tr>
              <td className="p-2">18.5 - 24.9</td>
              <td className="p-2">Normal weight</td>
            </tr>
            <tr>
              <td className="p-2">25.0 - 29.9</td>
              <td className="p-2">Overweight</td>
            </tr>
            <tr>
              <td className="p-2">30.0 and above</td>
              <td className="p-2">Obese</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BMICalculator;
