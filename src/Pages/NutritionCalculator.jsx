import React, { useState } from 'react';
import { FaCalculator, FaInfoCircle } from 'react-icons/fa';

const NutritionCalculator = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [activityLevel, setActivityLevel] = useState('1.2');
  const [goal, setGoal] = useState('maintenance');
  const [result, setResult] = useState(null);

  const calculateNutrition = () => {
    if (!weight || !height || !age) {
      alert('Please fill in all fields!');
      return;
    }

    // Base Metabolic Rate (BMR) Calculation
    let bmr;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Total Daily Energy Expenditure (TDEE)
    const tdee = bmr * parseFloat(activityLevel);

    // Adjusting for Goals
    let dailyCalories = tdee;
    if (goal === 'weightLoss') dailyCalories -= 500;
    if (goal === 'muscleGain') dailyCalories += 500;

    // Macronutrient Distribution
    const protein = weight * 2; // Protein: 2g per kg of weight
    const fat = dailyCalories * 0.25 / 9; // Fat: 25% of daily calories
    const carbs = (dailyCalories - (protein * 4 + fat * 9)) / 4; // Remaining calories for carbs

    // Setting the result with two decimal places
    setResult({
      dailyCalories: dailyCalories.toFixed(2),
      protein: protein.toFixed(2),
      fat: fat.toFixed(2),
      carbs: carbs.toFixed(2),
    });
  };

  return (
    <div className="bg-black text-yellow-300 min-h-screen flex flex-col items-center p-6">
      <h2 className="text-3xl font-bold mb-6 flex items-center">
        <FaCalculator className="mr-2" />
        Nutrition Calculator
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

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Age</label>
            <input
              type="number"
              className="w-full p-2 rounded-lg bg-gray-800 text-yellow-300 border border-yellow-500 focus:outline-none focus:ring focus:ring-yellow-500"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Gender</label>
            <select
              className="w-full p-2 rounded-lg bg-gray-800 text-yellow-300 border border-yellow-500 focus:outline-none focus:ring focus:ring-yellow-500"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Activity Level</label>
            <select
              className="w-full p-2 rounded-lg bg-gray-800 text-yellow-300 border border-yellow-500 focus:outline-none focus:ring focus:ring-yellow-500"
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value)}
            >
              <option value="1.2">Sedentary</option>
              <option value="1.375">Lightly active</option>
              <option value="1.55">Moderately active</option>
              <option value="1.725">Very active</option>
              <option value="1.9">Super active</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Goal</label>
            <select
              className="w-full p-2 rounded-lg bg-gray-800 text-yellow-300 border border-yellow-500 focus:outline-none focus:ring focus:ring-yellow-500"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            >
              <option value="maintenance">Maintain weight</option>
              <option value="weightLoss">Weight loss</option>
              <option value="muscleGain">Muscle gain</option>
            </select>
          </div>

          <button
            className="w-full bg-yellow-500 text-black font-bold py-2 rounded-lg hover:bg-yellow-600"
            onClick={calculateNutrition}
          >
            Calculate
          </button>
        </div>

        {/* Results Section */}
        {result && (
          <div className="w-full lg:w-1/2 bg-gray-900 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <FaInfoCircle className="mr-2" />
              Results:
            </h3>
            <p>Daily Calories: {result.dailyCalories} kcal</p>
            <p>Protein: {result.protein} g</p>
            <p>Fat: {result.fat} g</p>
            <p>Carbs: {result.carbs} g</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NutritionCalculator;
