import { config } from "dotenv";
import { connectDB } from "./db/index";
import { app } from "./app";
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
