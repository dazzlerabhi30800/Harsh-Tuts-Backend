import express from "express";
const app = express();
import { config } from "dotenv";
import { connectDB } from "./db/index";
config({
  path: "./.env",
});

connectDB();

app.listen(process.env.PORT, () => {
  console.log("server is running on port 4000");
});
