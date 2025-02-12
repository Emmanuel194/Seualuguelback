import express from "express";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes";
import cors from "cors";
import pool from "../src/db/db";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;

pool
  .getConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MySQL", error);
  });
