import { config } from "dotenv";
import { connectDB } from "./db/index.js";
import { app } from "./app.js";
config({
  path: "./.env",
});

connectDB()
  .then((res) => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log("Mongodb connection failed"));
