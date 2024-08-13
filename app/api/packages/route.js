import dbConnect from "../../utils/dbConnect";
import Product from "@/models/product";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);

    const pipeline = [
      {
        $group: {
          _id: "$category", // Group by category
          products: {
            $push: {
              // Create an array of products within each category
              name: "$name",
              description: "$description",
              features: "$features",
              price: "$price",
            },
          },
        },
      },
      {
        $project: {
          // Rename _id to category for better readability
          _id: 0,
          category: "$_id",
          products: 1,
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

    const packages = await Product.aggregate(pipeline);

    return NextResponse.json(packages, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
