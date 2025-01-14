import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Load Stripe outside of your component to avoid re-initializing it
const stripePromise = loadStripe(import.meta.env.VITE_Payment_Gateway_PK);
// console.log(import.meta.env.VITE_Payment_Gateway_PK)
const withStripe = (Component) => {
  return function WrappedComponent(props) {
    return (
      <Elements stripe={stripePromise}>
        <Component {...props} />
      </Elements>
    );
  };
};

export default withStripe;
