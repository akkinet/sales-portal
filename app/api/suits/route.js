import dbConnect from "../../utils/dbConnect";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    await dbConnect();

    const pipeline = [
      {
        $group: {
          _id: "$group",
          totalPrice: { $sum: "$price" },
          descriptions: { $push: "$description" },
        },
      },
      {
        $project: {
          _id: 0,
          group: "$_id",
          totalPrice: 1,
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

    return NextResponse.json(suits, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
