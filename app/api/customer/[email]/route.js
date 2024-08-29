import { NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export const GET = async (req, { params }) => {
  try {
    const customers = await stripe.customers.search({
      query: `email~\"${params.email}\"`,
    });

    return NextResponse.json(customers, { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
