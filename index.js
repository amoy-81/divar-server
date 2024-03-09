const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

//enable CORS for all domains
app.use(cors({ origin: "*" }));

// json in body
app.use(express.json());

// view engine config
app.set("view engine", "ejs");

// include routes
app.use("/", require("./routes/router"));

app.listen(process.env.PORT, () => {
  console.log(`app listen on port ${process.env.PORT}`);
});
