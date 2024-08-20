import dbConnect from "../../../utils/dbConnect";
import Product from "../../../../models/product";

export const POST = async (req, { params }) => {
    try {
        const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
        const stripeProduct = await stripe.products.retrieve(params.product);
        const stripePrice = await stripe.prices.retrieve(stripeProduct.default_price);
        const metadata = stripeProduct.metadata;
        const category = metadata.category;
        const group = metadata.group;
        delete metadata.category;
        delete metadata.group;

        await dbConnect()
        await Product.create({
            name: stripeProduct.name,
            category,
            group,
            description: stripeProduct.description,
            features: stripeProduct.marketing_features.map(f => f.name),
            price: (stripePrice.unit_amount_decimal / 100).toFixed(2),
            product_id: params.product,
            price_id: stripeProduct.default_price,
            metadata
        })

        return new Response(JSON.stringify({ success: true }), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}