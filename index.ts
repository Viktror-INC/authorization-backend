import "dotenv/config";
import router from "./src/router";
import errorMiddleware from "./src/middleware/error-middleware";

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: "yoursecret",
    cookie: {
      sameSite: "none",
    },
  })
);

app.use(
  cors({
    credentials: true,
    origin: [process.env.CLIENT_URL, process.env.PROD_URL],
  })
);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
  );
  next();
});

app.get("/", (request, response) => {
  response.json("Hello world");
});
app.use("/api", router);
app.use(errorMiddleware);

const port = process.env.PORT || 5000;

// // respond with "hello world" when a GET request is made to the homepage

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
  } catch (error) {
    console.log("error:", error);
  }
};

start();

app.listen(port, function () {
  console.log("Example app listening on port " + port + "!");
});

export default app;
