import { CellData } from "./types";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import mockData from "./mocks"
import egress from "./egress"

const app = express();

// const corsOptions = {
//   origin: "http://localhost:3001",
//   optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
// };

// app.use(cors(corsOptions));

app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

const store = [...mockData];

app.get("/api/data", (req, res) => {
  if (!!req.query && !!req.query.skip) {
    res.json(store.slice(parseInt(req.query.skip)))
  } else {
    res.json(store);
  }
});

app.post("/api/data", (req, res) => {
  console.log(req, req.body);
  const body: CellData = req.body;
  body.timestamp = (new Date()).getTime().toString()
  store.push(body);
  // console.log(store);
  res.send();
});

app.get("/api/script", (req, res) => {
  res.contentType("text/plain")
  res.send(egress)
})

app.listen(process.env.PORT, () => {
  console.log("server start");
});
