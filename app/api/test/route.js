const { NextResponse } = require("next/server");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export const GET = async (req) => {
  try {
    const query = {
      AND: [
        { "metadata['group']": 'superfast' },
        {
          OR: [
            { "metadata['category']": 'SEO' },
            { "metadata['category']": 'Landing Page' },
          ],
        },
      ],
    };
    const res = await stripe.products.search({
      query,
    });

    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
