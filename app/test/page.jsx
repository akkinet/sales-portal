'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);   


function CheckoutForm() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    // Create a PaymentIntent on the server
    setIsLoading(true);
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount:   
 1000, // Amount in cents
        currency: 'usd',
      }),
    });

    const { clientSecret } = await response.json();

    // Use clientSecret to initialize the Stripe instance and redirect to Stripe's checkout page
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({
      lineItems: [{
        price: 'price_1PfRPnEeHxYCAOIlYs5tSj90', // Replace with your Stripe Price ID
        quantity: 1,
      }],
      mode: 'subscription',
      successUrl: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
      cancelUrl: 'http://localhost:3000/cancel',
      clientReferenceId: "some_unique_id",
    });

    if (error) {
      // Handle errors here
      console.error(error);
    }

    setIsLoading(false);
  }

  return (
    <button onClick={handleClick} disabled={isLoading}>
      {isLoading ? 'Processing...' : 'Pay with Stripe'}
    </button>
  );
}

export default CheckoutForm