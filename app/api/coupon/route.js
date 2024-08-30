const { NextResponse } = require("next/server");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export const GET = async (req) => {
  try {
    let coupons = await stripe.coupons.list();
    coupons = coupons.data.map((d) => ({
      id: d.id,
      name: d.name,
      percent_off: d.percent_off,
    }));
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
