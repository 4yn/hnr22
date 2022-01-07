import { CellData } from "./types";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import mockData from "./mocks"

const app = express();

const corsOptions = {
  origin: "http://localhost:3001",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

const store = [...mockData];

app.get("/data", (req, res) => {
  res.json(store);
});

app.post("/data", (req, res) => {
  console.log(req, req.body);
  const body: CellData = req.body;
  store.push(body);
  console.log(store);
  res.send();
});

app.listen(process.env.PORT, () => {
  console.log("server start");
});
