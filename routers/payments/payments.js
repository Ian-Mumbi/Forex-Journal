const express = require('express')
const paypal = require('paypal-rest-sdk')

const router = new express.Router()

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id: process.env.PAYPAY_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

router.get('/pay', ( req, res ) =>  res.render('payments/payments.ejs'))

router.post("/pay", (req, res) => {
  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "http://localhost:3002/success",
      cancel_url: "http://localhost:3002/cancel",
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: "Journal App",
              price: "20.00",
              currency: "USD",
            },
          ],
        },
        amount: {
          currency: "USD",
          total: "20.00",
        },
        description: "Official Enterprise version Forex Journal Application",
      },
    ],
  };

  paypal.payment.create(create_payment_json, ( error, payment ) => {
    if (error) {
      console.log(error);
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === "approval_url") {
          res.redirect(payment.links[i].href);
        }
      }
    }
  });
});

router.get("/success", (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: "USD",
          total: "20.00",
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
      throw new Error(error);
    } else {
      console.log(JSON.stringify(payment));
      res.send("success");
    }
  });
});

router.get("/cancel", (req, res) => res.send("Cancelled"));

module.exports = router