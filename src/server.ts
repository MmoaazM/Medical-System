import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db";
import authRoutes from "./routes/auth.router";
import appointmentRoutes from "./routes/appointment.router";
import { errorHandler } from "./middlewares/errorHandler.middleware";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use(errorHandler);

connectDB();




app.listen(PORT, () => {
    console.log(`Medical Appointment System API running on port ${PORT}`);
  });


module.exports = app;
