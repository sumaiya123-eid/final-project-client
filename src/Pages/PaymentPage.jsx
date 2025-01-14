import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import withStripe from "./WithStripe";

// Load your Stripe publishable key
const stripePromise = loadStripe(import.meta.env.VITE_Payment_Gateway_PK);

const PaymentPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedPlan = queryParams.get("plan");
  const selectedDay = queryParams.get("day");
  const navigate = useNavigate();

  const [paymentIntentClientSecret, setPaymentIntentClientSecret] = useState(
    sessionStorage.getItem("paymentIntentClientSecret") || null
  );
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const axiosPublic = useAxiosPublic();

  const membershipPrices = {
    basic: 10,
    standard: 50,
    premium: 100,
  };

  const stripe = useStripe();
  const elements = useElements();

  const { data: trainerDetails, isLoading, isError } = useQuery({
    queryKey: ["trainer", id],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`/trainers/${id}`);
      return data;
    },
  });

  useEffect(() => {
    if (selectedPlan && membershipPrices[selectedPlan] && !paymentIntentClientSecret) {
      const fetchPaymentIntent = async () => {
        const amount = membershipPrices[selectedPlan] * 100; // Stripe expects the amount in cents
        try {
          const response = await axiosPublic.post("/create-payment-intent", { amount });
          if (response.data?.clientSecret) {
            setPaymentIntentClientSecret(response.data.clientSecret);
            sessionStorage.setItem("paymentIntentClientSecret", response.data.clientSecret); // Persist the clientSecret in sessionStorage
          }
        } catch (error) {
          console.error("Error fetching payment intent:", error.message);
        }
      };

      fetchPaymentIntent();
    }
  }, [selectedPlan, paymentIntentClientSecret]);

  useEffect(() => {
    // If the paymentIntentClientSecret is updated, ensure the stripe elements are ready
    if (paymentIntentClientSecret && stripe && elements) {
      console.log("Stripe and Elements are initialized, ready for payment.");
    }
  }, [paymentIntentClientSecret, stripe, elements]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !paymentIntentClientSecret) {
      console.error("Stripe, elements, or paymentIntentClientSecret missing.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      console.error("CardElement missing.");
      return;
    }

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(paymentIntentClientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: formData.name,
            email: formData.email,
          },
        },
      });

      if (error) {
        console.error("Payment Error:", error.message);
      } else if (paymentIntent.status === "succeeded") {
        setPaymentSuccess(true);
        console.log("Payment Successful:", paymentIntent);
        // Optionally, you can navigate to a success page or show a confirmation message
      }
    } catch (err) {
      console.error("Payment Exception:", err.message);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading trainer details!</div>;

  return (
    <section className="bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Payment Details</h2>
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
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-600">Your Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
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

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-600">Credit Card Details</label>
              <CardElement className="p-3 border border-gray-300 rounded-md" />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
            >
              {paymentSuccess ? "Payment Successful" : "Pay Now"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default withStripe(PaymentPage);
