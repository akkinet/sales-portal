const { NextResponse } = require("next/server");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export const GET = async (req) => {
  try {
    const coupons = await stripe.coupons.list();
    return NextResponse.json(coupons, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      {
        status: 500,
      }
    );
  }
};
