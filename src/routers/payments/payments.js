const express = require('express')
const paypal = require('paypal-rest-sdk')

const router = new express.Router()

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id: process.env.PAYPAY_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

router.get('/pay', ( req, res ) =>  res.render('payments/payments.ejs'))

router.get("/buy", (req, res) => {
  const create_payment_json = {
    intent: "authorize",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "http://localhost:3002/success",
      cancel_url: "http://localhost:3002/cancel",
    },
    transactions: [
      {
        amount: {
          total: 39.0,
          currency: "USD",
        },
        description: " Forex Journal Application ",
      },
    ],
  };

  createPay(create_payment_json).then(( transaction ) => {
    let id = transaction.id
    let links = transaction.links
    let counter = links.length

    while (counter--) {
      if (links[counter].method == "REDIRECT") {
        // redirect to paypal where user approves the transaction
        return res.redirect(links[counter].href);
      }
    }
  }).catch(( e ) => {
    console.log(e)
    res.send({ error: 'Error has occurred' })
  })
});

router.get("/success", (req, res) => {
  console.log('QUERY IN SUCCESS ROUTE ', req.query)
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: "USD",
          total: "39.00",
        },
      },
    ],
  };

  paypal.payment.execute(paymentId, execute_payment_json, function (
    error,
    payment
  ) {
    if (error) {
      console.log(error.response);
      return res.redirect('/cancel');
    } else {
      console.log('STRINGIFIED PAYMENT ', JSON.stringify(payment));
      return res.render("payments/success.ejs");
    }
  });
});

router.get("/cancel", (req, res) => {
  console.log("QUERY IN ERROR ROUTE ", req.query);
  res.render("payments/err.ejs");
});

const createPay = (payment) => {
  return new Promise((resolve, reject) => {
    paypal.payment.create(payment, function (err, payment) {
      if (err) {
        reject(err);
      } else {
        resolve(payment);
      }
    });
  });
};	

module.exports = router