const { NextResponse } = require("next/server");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export const POST = async (req) => {
  try {
    const { name, email, products } = await req.json();
    console.log("all data", name, email, products);
    // let pack = [
    //   {
    //     category: "Shopify",
    //     products: [
    //       {
    //         id: "prod_QhAYNoueyQblFB",
    //         name: "Shopify Advanced Package",
    //         description:
    //           "Custom theme setup with advanced design customization, unlimited pages & products, advanced SEO & analytics integration, 5+ advanced apps & plugins, comprehensive training & strategy session, custom checkout process, full mobile optimization.",
    //         features: [
    //           "Advanced Design Customization",
    //           "Custom Domain Setup",
    //           "Inventory Management System",
    //           "Abandoned Cart Recovery",
    //           "Third-Party API Integration",
    //           "Custom Scripts & Coding",
    //         ],
    //         price: 1995,
    //         metadata: {
    //           "Apps Integration": "5+ Advanced Apps",
    //           "Marketing Integration": "Social Media & Email Marketing",
    //           "Mobile Optimization": "Full Optimization & Speed Enhancement",
    //           Pages: "Unlimited Pages",
    //           "Payment Gateway": "Multiple Gateways & Custom Checkout",
    //           Products: "Unlimited Products",
    //           "SEO Setup": "Advanced SEO & Analytics Integration",
    //           Support: "6 Months Priority Support",
    //           Training: "Comprehensive Training & Strategy",
    //         },
    //       },
    //     ],
    //   },
    //   {
    //     category: "Landing Page",
    //     products: [
    //       {
    //         id: "prod_Qcp4SUTv0ZHdaR",
    //         name: "Premium Landing Page",
    //         description: "Comprehensive landing page solution",
    //         features: [
    //           "call to action",
    //           "lead capture forms",
    //           "integration with CRM tools",
    //         ],
    //         price: 845,
    //       },
    //     ],
    //   },
    //   {
    //     category: "SEO",
    //     products: [
    //       {
    //         id: "prod_QcoqHB1fVS3thz",
    //         name: "Blast SEO",
    //         description:
    //           "Optimizing content on your website, Building backlinks and promoting your site and Acquiring high-quality backlinks",
    //         features: [
    //           "On-Page Activities",
    //           "Off-Page Activities",
    //           "Feature 3 - Backlinks",
    //         ],
    //         price: 872,
    //       },
    //     ],
    //   },
    // ];

    // pack = pack.map(p => p.products).flat()
    // .map(p => ({id: p.id, description: p.description, price: p.price}))
    // console.log("my oack", JSON.stringify(pack))

    // return new Response("ok")
    const customers = await stripe.customers.search({
      query: `email:'${email}'`,
    });

    let customer;
    if (customers.data.length == 0) {
      customer = await stripe.customers.create({
        email,
        name,
      });
    } else customer = customers.data[0];
    
    console.log("Customer created:", customer.id);
    
    const invoice = await stripe.invoices.create({
      currency: "usd",
      auto_advance: true,
      customer: customer.id,
      description:
      "Harness the future of innovation and efficiency with our cutting-edge solutions",
    });
    
    console.log("Invoice created:", invoice.id);
    
    for (const item of products) {
      // const invoiceItem = await stripe.invoiceItems.create({
        //   currency: "usd",
        //   description: "(created by Stripe Shell)",
        //   invoice: invoice.id,
        //   customer: customer.id,
        //   price: "price_1PqyyQEeHxYCAOIl853H7ceq",
        //   quantity: 1,
        // });
        const invoiceItem = await stripe.invoiceItems.create({
          description: item.description,
          invoice: invoice.id,
          quantity: 1,
          customer: customer.id,
          currency: 'usd',
          price_data: {
            currency: 'usd',
            product: item.id,
            unit_amount: item.price * 100,
          },
        });
      console.log("Invoice item created:", invoiceItem.id);
    }
    
    const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);
    
    console.log("Invoice finalized and sent:", finalizedInvoice.id);

    return NextResponse.json(finalizedInvoice, { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
