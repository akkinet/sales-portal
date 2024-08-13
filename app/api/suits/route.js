import dbConnect from "@/app/utils/dbConnect";
import Product from "@/models/product";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const { searchParams } = new URL(req.url);
    await dbConnect();

    const pipeline = [
      {
        $group: {
          _id: "$group",
          totalPrice: { $sum: "$price" },
          descriptions: { $push: "$description" },
          prices: { $push: "$price_id" },
        },
      },
      {
        $project: {
          _id: 0,
          group: "$_id",
          totalPrice: 1,
          prices: 1,
          expectedOutput: {
            $reduce: {
              input: "$descriptions",
              initialValue: "",
              in: {
                $concat: [
                  "$$value",
                  { $cond: [{ $eq: ["$$value", ""] }, "", ", "] },
                  "$$this",
                ],
              },
            },
          },
        },
      },
    ];

    let mappedPipeline = pipeline.map((p) => Object.keys(p)[0]);

    for (const [name, value] of searchParams.entries()) {
      if (mappedPipeline.indexOf("$match") == -1) {
        pipeline.unshift({
          $match: {},
        });

        mappedPipeline.unshift("$match");
      }
      if (value != "null" && value != "")
        pipeline[0]["$match"][name] = { $in: value.split(",") };
    }

    const suits = await Product.aggregate(pipeline);

    for (const suit of suits) {
      const line_items = suit.prices.map(i => ({ price: i, quantity: 1 }))
      const paymentLink = await stripe.paymentLinks.create({
        line_items
      });
      suit.paymentLink = paymentLink.url;
    }

    return NextResponse.json(suits, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
