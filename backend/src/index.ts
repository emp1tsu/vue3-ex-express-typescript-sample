import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { createRouter } from "./router";

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = 3000;

app.use("/", createRouter()); // add

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/`);
});
