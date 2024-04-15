import { config } from "dotenv";
import { connectDB } from "./db/index.js";
import { app } from "./app.js";
config({
  path: "./.env",
});

const portValue = process.env.PORT || 8000;

connectDB()
  .then((res) => {
    app.listen(portValue, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log("Mongodb connection failed"));
