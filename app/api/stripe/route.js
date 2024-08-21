const { NextResponse } = require("next/server");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    let count = 0;
    let query = "";
    const category = searchParams.get("category")?.split(",") || [];
    const group = searchParams.get("group")?.split(",") || [];
    const catSize = category.length;
    const grpSize = group.length;
    for (const value of category) {
      query += `metadata['category']:\'${value}\'`;
      count++;
      if (count < catSize) query += " OR ";
    }
    count = 0

    let data = [];
    if ((catSize > 0 && grpSize == 0) || (catSize == 0 && grpSize > 0)) {
      for (const value of group) {
        query += `metadata['group']:\'${value}\'`;
        count++;
        if (count < grpSize) query += " OR ";
      }
      const res = await stripe.products.search({
        query,
      });

      data = res.data;
    } else if (catSize > 0 && grpSize > 0) {
      const res = await stripe.products.search({
        query,
      });

      data = res.data.filter(d => group.includes(d.metadata["group"]));
    }
    else {
      const res = await stripe.products.search({
        query:
          "metadata['group']:'kickstarter' OR metadata['group']:'recommended' OR metadata['group']:'superfast'",
      });

      data = res.data;
    }

    let packages = [],
      suits = [];

    for (let suit of data) {
      const category = suit.metadata["category"];
      const prodCat = packages.find((p) => p.category == category);
      if (prodCat) {
        const metadata = { ...suit.metadata };
        delete metadata.category;
        delete metadata.price;
        delete metadata.group;
        const prObj = {
          name: suit.name,
          description: suit.description,
          features: suit.marketing_features.map((f) => f.name),
          price: parseInt(suit.metadata.price),
        };
        if (Object.keys(metadata).length > 0) prObj.metadata = metadata;

        prodCat.products.push(prObj);
      } else {
        const metadata = { ...suit.metadata };
        delete metadata.category;
        delete metadata.price;
        delete metadata.group;
        let products = [];
        const prodObj = {
          name: suit.name,
          description: suit.description,
          features: suit.marketing_features.map((f) => f.name),
          price: parseInt(suit.metadata.price),
        };
        if (Object.keys(metadata).length > 0) prodObj.metadata = metadata;
        products.push(prodObj);
        const obj = {
          category: suit.metadata.category,
          products,
        };
        packages.push(obj);
      }

      const group = suit.metadata["group"];
      const sGp = suits.find((s) => s.group == group);
      if (sGp) {
        sGp.totalPrice += parseInt(suit.metadata.price);
        sGp.prices.push(suit.default_price);
        sGp.expectedOutput += ", " + suit.description;
      } else {
        const suitObj = {
          totalPrice: parseInt(suit.metadata.price),
          prices: [suit.default_price],
          group,
          expectedOutput: suit.description,
        };
        suits.push(suitObj);
      }
    }
    return NextResponse.json({ packages, suits }, { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
