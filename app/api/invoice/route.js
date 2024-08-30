import { NextResponse } from "next/server";
import sendMail from "../../utils/sendMail";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export const POST = async (req) => {
  try {
    const { name, email, products, coupon } = await req.json();
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

    const invoiceObj = {
      currency: "usd",
      auto_advance: true,
      due_date,
      customer: customer.id,
      description:
        "Harness the future of innovation and efficiency with our cutting-edge solutions",
      collection_method: "send_invoice",
    }

    if(coupon)
      invoiceObj.discounts = [{coupon}]

    const invoice = await stripe.invoices.create(invoiceObj);

    console.log("Invoice created:", invoice.id);

    for (const item of products) {
      const invoiceItem = await stripe.invoiceItems.create({
        description: item.description,
        invoice: invoice.id,
        quantity: item.quantity,
        customer: customer.id,
        currency: "usd",
        discountable: true,
        price_data: {
          currency: "usd",
          product: item.id,
          unit_amount: item.price * 100,
        },
      });
      console.log("Invoice item created:", invoiceItem.id);
    }

    const sentInvoice = await stripe.invoices.sendInvoice(invoice.id);
    console.log(sentInvoice);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border: 1px solid #dddddd;
            border-radius: 8px;
        }
        .header {
            text-align: center;
            padding: 10px 0;
        }
        .header h1 {
            margin: 0;
            color: #333333;
        }
        .content {
            padding: 20px 0;
        }
        .content p {
            font-size: 16px;
            line-height: 1.5;
            color: #555555;
        }
        .invoice-details {
            margin: 20px 0;
            padding: 10px;
            border: 1px solid #dddddd;
            border-radius: 8px;
            background-color: #f9f9f9;
        }
        .invoice-details h2 {
            margin-top: 0;
            color: #333333;
        }
        .invoice-details p {
            margin: 5px 0;
        }
        .payment-link {
            text-align: center;
            margin: 20px 0;
        }
        .payment-link a {
            display: inline-block;
            background-color: #28a745;
            color: #ffffff;
            padding: 15px 25px;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
        }
        .footer {
            text-align: center;
            padding: 10px 0;
            font-size: 14px;
            color: #999999;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Invoice from Hexerve Solution</h1>
        </div>
        <div class="content">
            <p>Dear, ${customer.name}</p>
            <p>Please find the details of your invoice below. We appreciate your prompt payment.</p>

            <div class="invoice-details">
                <h2>Invoice Details</h2>
                <p><strong>Invoice Number:</strong> ${invoice.id}</p>
                <p><strong>Date of Issue:</strong> ${new Date()}</p>
                <p><strong>Due Date:</strong> ${new Date(
                  sentInvoice.due_date * 1000
                ).toLocaleString()}</p>
                <p><strong>Amount Due:</strong> ${
                  parseInt(sentInvoice.amount_due) / 100
                }</p>
            </div>

            <div class="payment-link">
                <a href=${
                  sentInvoice.hosted_invoice_url
                } target="_blank">Pay Invoice</a>
            </div>

            <p>If you have any questions or need further assistance, feel free to contact us at hexerve@gmail.com.</p>

            <p>Thank you for your business!</p>
        </div>
        <div class="footer">
            <p>&copy; 2017 Hexerve Solution. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

    sendMail(email, "Hexerve's Invoice", html);

    return NextResponse.json(sentInvoice, { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
