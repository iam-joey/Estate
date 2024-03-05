import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
const app = express();
dotenv.config();
mongoose
  .connect(process.env.MONOGO_URL)
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.log(err);
  });
app.listen(3000, () => {
  console.log("Server is running on port 3000!");
});
