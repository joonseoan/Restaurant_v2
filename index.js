const express = require("express");
const bodyParser = require("body-parser");

require("./restaurant_configs/config"); // because of PORT.

const app = express();
app.use(bodyParser.json());

require("./routes/guestbookRoutes")(app);
require("./routes/paymentRoutes")(app);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  const path = require("path");

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 9000;
app.listen(PORT);

module.exports = { app };
