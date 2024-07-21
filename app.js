const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db-config");
require("dotenv").config();

connectDB();

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Success!");
});

app.use("/api", require("./routes/index-route"));

const Port = process.env.port || 4000;
app.listen(Port, () => {
  console.log(`Application running successfully on ${Port}`);
});
