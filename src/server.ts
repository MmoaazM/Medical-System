import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./config/db";

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

connectDB();




app.listen(PORT, () => {
    console.log(`Medical Appointment System API running on port ${PORT}`);
  });


module.exports = app;
