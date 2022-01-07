import { CellData } from "./types";
import dotenv from "dotenv";
dotenv.config();
import express, { Request } from "express";
const app = express();

app.use(express.json());

const store = Array<CellData>();

app.get("/data", (req, res) => {
  res.send(store);
});

app.post("/data", (req, res) => {
  const body: CellData = req.body;
  store.push(body);
});

app.listen(process.env.PORT, () => {
  console.log("server start");
});
