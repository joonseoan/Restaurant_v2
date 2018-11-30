console.log("starting mongoose.js");

const mongoose = require("mongoose");
require("../restaurant_configs/config");

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);
