import "dotenv/config";

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);
app.get("/", (request, response) => {
  response.json("Hello world");
});
// app.use("/api", router);
// app.use(errorMiddleware);

const port = process.env.PORT || 5000;

// // respond with "hello world" when a GET request is made to the homepage

// const start = async () => {
//   try {
//     await mongoose.connect(process.env.DB_URL);
//   } catch (error) {
//     console.log("error:", error);
//   }
// };

// start();

app.listen(port, function () {
  console.log("Example app listening on port " + port + "!");
});

export default app;
