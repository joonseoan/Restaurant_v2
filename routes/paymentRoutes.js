const stripe = require("stripe")(process.env.STRIPE);

// Update Later on after setting google OAuth before the orders
// const requireLogin = require('../middleware/requireLogin');

module.exports = app => {
  let totalAmount = 0;

  app.post("/billing", async (req, res) => {
    totalAmount = req.body.amount * 100;

    // console.log("success");
    res.send("success");
  });

  app.post("/billing/credit", async (req, res) => {
    const charge = await stripe.charges.create({
      amount: totalAmount,
      currency: "usd",
      description: "pay for korean restaurant",
      source: req.body.id
    });

    // console.log("charge", charge);

    // Setup after google OAuth login
    // from "passport" m/w
    // const user = await req.user.save();
    // console.log('1. ', user)

    // ***************We can send "user" object to the client by using variable, "user".
    // res.send(user);
    res.send("success");
  });
};
