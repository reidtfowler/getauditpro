const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { amount, email } = JSON.parse(event.body);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount || 39900,
      currency: 'usd',
      receipt_email: email,
      metadata: {
        product: 'Content Audit & 90-Day Strategy Pack',
        source: 'AuditPro'
      }
    });

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ clientSecret: paymentIntent.client_secret })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};