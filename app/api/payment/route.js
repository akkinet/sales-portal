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

        return NextResponse.json(paymentLink, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export const POST = async req => {
    try {
        const prices = await req.json()
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        const line_items = prices.map(p => ({ price: p, quantity: 1 }))
        const paymentLink = await stripe.paymentLinks.create({
            line_items
        });

        return NextResponse.json(paymentLink, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}