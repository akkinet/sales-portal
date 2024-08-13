import { NextResponse } from 'next/server';

export const GET = async req => {
    try {
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

        const paymentLink = await stripe.paymentLinks.create({
            line_items: [
                {
                    price: 'price_1PlZPtEeHxYCAOIlCpQthzFe',
                    quantity: 1,
                },
            ],
            after_completion: {
                type: 'redirect',
                redirect: {
                    url: 'https://example.com',
                },
            },
        });

        return NextResponse.json(paymentLink, {status: 200})
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
} 