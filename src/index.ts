import express, { Response, Request } from "express";
import { config } from "dotenv";

config({});

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.listen(process.env.PORT, () => {
  console.log("server is running on port " + process.env.PORT);
});
