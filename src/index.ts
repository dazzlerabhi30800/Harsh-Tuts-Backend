import express, { Response, Request } from "express";
import { config } from "dotenv";

config({});

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.get("/send", (req: Request, res: Response) => {
  res.send("Send Page");
});

app.get("/twitter", (req: Request, res: Response) => {
  res.send("Twitter Page");
});

app.listen(process.env.PORT, () => {
  console.log("server is running on port " + process.env.PORT);
});
