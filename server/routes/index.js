const express = require("express");
const app = express();

app.use(require("./student"));

module.exports = app;
