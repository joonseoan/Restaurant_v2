//console.log('starting config.js');

const env = process.env.NODE_ENV || "development";

// console.log('process.env.*****', env);

// const keys = require("./dev");
// console.log();
// const keys = require('./dev');
const { mongoURI, stripeSecretKey } = require("./dev");

if (env === "production") {
  process.env.MONGODB_URI = require("./prod");
} else if (env === "development") {
  process.env.PORT = 9000;
  process.env.MONGODB_URI = mongoURI;
  process.env.STRIPE = stripeSecretKey;
} else if (env === "test") {
  process.env.PORT = 9000;
  process.env.MONGODB_URI = "mongodb://localhost:27017/guestsTest";
}
