const { NextResponse } = require("next/server");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


export const GET = async (req) => {
    try {
        const { searchParams } = new URL(req.url);
        let query = '';
        const paramsArray = [...searchParams.entries()];
        let count = 0, size = paramsArray.length
        for (const [name, value] of paramsArray) {
            query += `metadata[\'${name}\']:\'${value}\'`;
            count++;
            if (count < size)
                query += ' AND '
        }

        let data = [];
        if (size != 0) {
            const res = await stripe.products.search({
                query,
            });

            data = res.data;
        } else {
            const res = await stripe.products.search({
                query: 'metadata[\'group\']:\'kickstarter\' OR metadata[\'group\']:\'recommended\' OR metadata[\'group\']:\'superfast\'',
            });

            data = res.data;
        }


        let packages = [], suits = [];

        for (let suit of data) {
            const category = suit.metadata["category"];
            const prodCat = packages.find(p => p.category == category);
            if (prodCat) {
                const metadata = { ...suit.metadata };
                delete metadata.category;
                delete metadata.price;
                delete metadata.group;
                const prObj = {
                    name: suit.name,
                    description: suit.description,
                    features: suit.marketing_features.map(f => f.name),
                    price: parseInt(suit.metadata.price),
                }
                if (Object.keys(metadata).length > 0)
                    prObj.metadata = metadata

                prodCat.products.push(prObj)
            } else {
                const metadata = { ...suit.metadata };
                delete metadata.category;
                delete metadata.price;
                delete metadata.group;
                let products = [];
                const prodObj = {
                    name: suit.name,
                    description: suit.description,
                    features: suit.marketing_features.map(f => f.name),
                    price: parseInt(suit.metadata.price),
                }
                if (Object.keys(metadata).length > 0)
                    prodObj.metadata = metadata
                products.push(prodObj);
                const obj = {
                    category: suit.metadata.category,
                    products
                }
                packages.push(obj)
            }

            const group = suit.metadata["group"];
            const sGp = suits.find(s => s.group == group);
            if (sGp) {
                sGp.totalPrice += parseInt(suit.metadata.price);
                sGp.prices.push(suit.default_price)
                sGp.expectedOutput += ", " + suit.description;
            } else {
                const suitObj = {
                    totalPrice: parseInt(suit.metadata.price),
                    prices: [suit.default_price],
                    group,
                    expectedOutput: suit.description
                }
                suits.push(suitObj)
            }
        }
        return NextResponse.json({ packages, suits }, { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}