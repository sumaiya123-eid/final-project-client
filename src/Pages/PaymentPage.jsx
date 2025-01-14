import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
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

  const [paymentIntentClientSecret, setPaymentIntentClientSecret] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const axiosPublic = useAxiosPublic();
  
  const stripe = useStripe();
  const elements = useElements();

  const { data: trainerDetails, isLoading, isError } = useQuery({
    queryKey: ["trainer", id],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`/trainers/${id}`);
      return data;
    },
  });

  const membershipPrices = {
    basic: 10,
    standard: 50,
    premium: 100,
  };

  useEffect(() => {
    if (selectedPlan && membershipPrices[selectedPlan] && !paymentIntentClientSecret) {
      const fetchPaymentIntent = async () => {
        const amount = membershipPrices[selectedPlan] * 100; // Stripe expects amount in cents
        try {
          const response = await axiosPublic.post("/create-payment-intent", { amount });
          if (response.data?.clientSecret) {
            setPaymentIntentClientSecret(response.data.clientSecret);
          }
        } catch (error) {
          console.error("Error fetching payment intent:", error.message);
        }
      };
      fetchPaymentIntent();
    }
  }, [selectedPlan]);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Basic validation for required fields
    if (!formData.name || !formData.email || !formData.phone) {
      Swal.fire({
        icon: "error",
        title: "Form Incomplete",
        text: "Please fill out all fields.",
      });
      return;
    }
  
    // Check if Stripe, Elements, or PaymentIntentSecret are not available
    if (!stripe || !elements || !paymentIntentClientSecret) {
      console.error("Stripe, elements, or paymentIntentClientSecret missing.");
      return;
    }
  
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      console.error("CardElement missing.");
      return;
    }
  
    // Confirm the card payment
    const { error, paymentIntent } = await stripe.confirmCardPayment(paymentIntentClientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
      },
    });
  
    // Handle payment error
    if (error) {
      console.error("Payment Error:", error.message);
      Swal.fire({
        icon: 'error',
        title: 'Payment Failed',
        text: error.message,
      });
    } 
    // Payment successful
    else if (paymentIntent.status === "succeeded") {
      console.log("Payment Successful:", paymentIntent);
  
      // Prepare payment data to send to backend
      const paymentData = {
        paymentIntentId: paymentIntent.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        amount: membershipPrices[selectedPlan] * 100, // Amount in cents
        selectedPlan,
        selectedDay,
        trainerId: id, // Pass trainer ID
      };
  
      // Send payment data to backend
      const response = await axiosPublic.post("/save-payment", paymentData);
  
      // Handle backend response
      if (response.data?.message === 'Payment and booking saved successfully') {
        Swal.fire({
          icon: 'success',
          title: 'Payment Successful!',
          text: `Your payment of $${membershipPrices[selectedPlan]} was successful.`,
        }).then(() => {
          // Reset form data and navigate to success page
          setFormData({
            name: "",
            email: "",
            phone: "",
          });
          navigate("/success");
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Payment Saving Failed',
          text: 'There was an issue saving your payment information.',
        });
      }
    } 
    // Payment failed
    else {
      Swal.fire({
        icon: 'error',
        title: 'Payment Failed',
        text: 'The payment could not be processed.',
      });
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
              Pay Now
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default withStripe(PaymentPage);
