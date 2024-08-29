const { NextResponse } = require("next/server");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export const POST = async (req) => {
  try {
    const { name, email, products } = await req.json();
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
    const due_date = new Date();
    due_date.setDate(due_date.getDate() + 2);

    const invoice = await stripe.invoices.create({
      currency: "usd",
      auto_advance: true,
      due_date,
      customer: customer.id,
      description:
        "Harness the future of innovation and efficiency with our cutting-edge solutions",
      collection_method: "send_invoice",
    });

    console.log("Invoice created:", invoice.id);

    for (const item of products) {
      const invoiceItem = await stripe.invoiceItems.create({
        description: item.description,
        invoice: invoice.id,
        quantity: item.quantity,
        customer: customer.id,
        currency: "usd",
        price_data: {
          currency: "usd",
          product: item.id,
          unit_amount: item.price * 100,
        },
      });
      console.log("Invoice item created:", invoiceItem.id);
    }

    const sentInvoice = await stripe.invoices.sendInvoice(invoice.id);

    return NextResponse.json(sentInvoice, { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
