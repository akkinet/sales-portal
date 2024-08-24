const { NextResponse } = require("next/server");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


export const POST = async (req) => {
    try {
        const { name, email, address, phone } = await req.json();
        const customer = await stripe.customers.create({
            name,
            email,
            phone,
            address: JSON.parse(address)
        });

        return NextResponse.json(customer, { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
