import dbConnect from "../../utils/dbConnect";
import Product from "../../../models/product";
import { NextResponse } from "next/server";

export const GET = async (req) => {
    try {
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        // const allProducts = await stripe.products.list();
        await dbConnect()

        // for (let p of allProducts.data) {
        //     const proToUp = await Product.findOne({name: p.name})
        //     if(proToUp){
        //         proToUp.product_id = p.id;
        //         proToUp.price_id = p.default_price;
        //         await proToUp.save()
        //     }
        // }

        const allProducts = await Product.find()

        for (let p of allProducts) {
            p.price = (p.price/100).toFixed(2)
            await p.save()
        }

        return NextResponse.json({ message: "updated" }, { status: 200 })
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}