import React, { useState, useEffect, useContext } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

import { AuthContext } from "../Provider/AuthProvider";
import useAxiosPublic from "../hooks/useAxiosPublic";

// Stripe public key
const stripePromise = loadStripe(import.meta.env.VITE_Payment_Gateway_PK);

const PaymentPage = () => {
  const { email } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedPlan = queryParams.get("plan");
  const selectedDay = queryParams.get("day");
  const navigate = useNavigate();

  const { user } = useContext(AuthContext); // Get logged-in user info
  const axiosPublic = useAxiosPublic();

  const { data: trainerDetails, isLoading, isError } = useQuery({
    queryKey: ["trainer", email],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`/users/${email}`);
      return data;
    },
  });

  const membershipPrices = {
    basic: 10,
    standard: 50,
    premium: 100,
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.displayName || "",
        email: user.email || "",
        phone: "",
      });
    }
  }, [user]);

  // Stripe hooks
  const stripe = useStripe();
  const elements = useElements();

  // Function to create Payment Intent
  const createPaymentIntent = async (amount) => {
    try {
      const response = await axiosPublic.post('/create-payment-intent', { amount });
      return response.data.clientSecret;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error Creating Payment Intent",
        text: error.message,
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.phone) {
      Swal.fire({
        icon: "error",
        title: "Missing Phone Number",
        text: "Please provide your phone number.",
      });
      return;
    }

    if (!stripe || !elements) {
      Swal.fire({
        icon: "error",
        title: "Stripe is not loaded",
        text: "Please try again later.",
      });
      return;
    }

    const cardElement = elements.getElement(CardElement);
    
    const paymentIntentSecret = await createPaymentIntent(membershipPrices[selectedPlan] * 100); // Amount in cents

    const { error, paymentIntent } = await stripe.confirmCardPayment(paymentIntentSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: formData.name,
          email: formData.email,
        },
      },
    });

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: error.message,
      });
    } else if (paymentIntent.status === 'succeeded') {
      // Payment succeeded, save the booking
      const bookingData = {
        trainerEmail: email,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        selectedPlan,
        selectedDay,
        price: membershipPrices[selectedPlan],
        paymentIntentId: paymentIntent.id,
      };

      try {
        const response = await axiosPublic.post("/save-booking", bookingData);
        if (response.data?.message === "Booking saved successfully") {
          Swal.fire({
            icon: "success",
            title: "Booking & Payment Successful!",
            text: "Your booking and payment has been saved successfully.",
          }).then(() => {
            navigate("/success");
          });
        } else {
          throw new Error("Booking failed. Please try again.");
        }
      } catch (error) {
        console.error("Booking Error:", error.message);
        Swal.fire({
          icon: "error",
          title: "Booking Failed",
          text: error.message,
        });
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading trainer details!</div>;

  return (
    <section className="bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Booking Details</h2>
          <div className="mb-6">
            <p><strong>Trainer Name:</strong> {trainerDetails.fullName}</p>
            <p><strong>Slot:</strong> {selectedDay}</p>
            <p><strong>Package:</strong> {selectedPlan}</p>
            <p><strong>Price:</strong> ${membershipPrices[selectedPlan]}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-600">Your Name</label>
              <input
                type="text"
                value={formData.name}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-600">Your Email</label>
              <input
                type="email"
                value={formData.email}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-600">Your Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Stripe Card Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-600">Card Information</label>
              <CardElement className="w-full p-2 border border-gray-300 rounded-md" />
            </div>

            <button
              type="submit"
              disabled={!stripe}
              className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
            >
              Confirm Booking
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
