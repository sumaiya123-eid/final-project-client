import React, { useState, useEffect, useContext } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

import { AuthContext } from "../Provider/AuthProvider";
import useAxiosPublic from "../hooks/useAxiosPublic";

const stripePromise = loadStripe(import.meta.env.VITE_Payment_Gateway_PK);

const PaymentPage = () => {
  const { email } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedPlan = queryParams.get("plan");
  const selectedDay = queryParams.get("day");
  const classes = queryParams.get("classes")?.split(",") || []; 
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();

  const [selectedClasses, setSelectedClasses] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  const membershipPrices = {
    basic: 10,
    standard: 50,
    premium: 100,
  };

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.displayName || "",
        email: user.email || "",
        phone: "",
      });
    }
  }, [user]);

  const stripe = useStripe();
  const elements = useElements();

  const createPaymentIntent = async (amount) => {
    try {
      const response = await axiosPublic.post("/create-payment-intent", { amount });
      return response.data.clientSecret;
    } catch (error) {
      Swal.fire("Error", "Failed to create payment intent. Try again later.", "error");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.phone || selectedClasses.length === 0) {
      Swal.fire("Missing Information", "Please select at least one class and provide all details.", "error");
      return;
    }

    if (!stripe || !elements) {
      Swal.fire("Stripe Error", "Stripe is not properly initialized.", "error");
      return;
    }

    setLoading(true); 

    const cardElement = elements.getElement(CardElement);
    const paymentIntentSecret = await createPaymentIntent(membershipPrices[selectedPlan] * 100);

    const { error, paymentIntent } = await stripe.confirmCardPayment(paymentIntentSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: formData.name,
          email: formData.email,
        },
      },
    });

    setLoading(false); 

    if (error) {
      Swal.fire("Payment Error", error.message, "error");
    } else if (paymentIntent.status === "succeeded") {
      const bookingData = {
        trainerEmail: email,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        selectedPlan,
        selectedDay,
        selectedClasses, 
        price: membershipPrices[selectedPlan],
        paymentIntentId: paymentIntent.id,
      };

      try {
        const response = await axiosPublic.post("/save-booking", bookingData);
        if (response.data.message === "Booking saved successfully and class booking count updated.") {
          Swal.fire("Success", "Booking and payment successful!", "success").then(() =>
            navigate("/dashboard/myBookedTrainer")
          );
        }
      } catch (error) {
        Swal.fire("Error", "Failed to save booking. Try again.", "error");
      }
    }
  };

  const handleClassSelection = (cls) => {
    setSelectedClasses((prevClasses) =>
      prevClasses.includes(cls)
        ? prevClasses.filter((item) => item !== cls) 
        : [...prevClasses, cls] 
    );
  };

  return (
    <section className="bg-black py-10">
      <h3 className="text-3xl text-yellow-500 font-bold text-center mb-8">Payment Page</h3>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-3xl font-bold mb-4">Booking Details</h2>
          <div className="mb-6">
            <p><strong>Trainer Email:</strong> {email}</p>
            <p><strong>Slot:</strong> {selectedDay}</p>
            <p><strong>Package:</strong> {selectedPlan}</p>
            <p><strong>Price:</strong> ${membershipPrices[selectedPlan]}</p>
          </div>

          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">Select Classes <p className="font-normal text-base">(You have to choose multiple or at least one class to book the Trainer)</p></h3>
          <ul className="mb-6">
            {classes.map((cls, index) => (
              <li key={index}>
                <input
                  type="checkbox"
                  id={`class-${index}`}
                  name="selectedClasses"
                  value={cls}
                  checked={selectedClasses.includes(cls)}
                  onChange={() => handleClassSelection(cls)}
                />
                <label htmlFor={`class-${index}`} className="ml-2">{cls}</label>
              </li>
            ))}
          </ul>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-base font-semibold text-black">Your Name</label>
              <input
                type="text"
                value={formData.name}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
            <div className="mb-4">
              <label className="block text-base font-semibold text-black">Your Email</label>
              <input
                type="email"
                value={formData.email}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
            <div className="mb-6">
              <label className="block text-base font-semibold text-black">Your Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-6">
              <label className="block text-base font-semibold text-black">Card Information</label>
              <CardElement className="w-full p-2 border border-gray-300 rounded-md" />
            </div>

            <button
              type="submit"
              disabled={loading || !stripe}
              className="w-full px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-md"
            >
              {loading ? (
                <span>Processing...</span> 
              ) : (
                "Confirm Booking"
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default function StripePaymentPage() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentPage />
    </Elements>
  );
}
