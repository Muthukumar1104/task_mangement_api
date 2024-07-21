const express = require("express");
const serverless = require("serverless-http");
const app = express();
require("dotenv").config();

app.use(express.json());

app.use("/.netlify/functions/api", require("./routes/index-route"));

module.exports.handler = serverless(app);
