import multer from "multer";
import { app } from "../app";

const upload = multer({ dest: "uploads/" });



// app.get("/", upload.single)