const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const routes = require("./routes/routes.js");


//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// router
app.use(process.env.BASE_URL, routes);

//test api
app.get("/", (req, res) => {
  res.json({ message: "hello from api" });
});

app.use("*", (req, res, next) => {
  return res.status(404).json({
    statusCode: 404,
    response: "resource not found",
  });
});

//port
const PORT = process.env.PORT || 3000;

//server
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
