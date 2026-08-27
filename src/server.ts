import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import connectDB from "./config/db";
import authRoutes from "./routes/auth.router";
import appointmentRoutes from "./routes/appointment.router";
import doctorRouter from "./routes/doctorProfile.router";
import scheduleRouter from "./routes/schedule.router";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { swaggerSpec } from "./config/swagger";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// Swagger Docs
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/doctors", doctorRouter);
app.use("/api/doctors", scheduleRouter);

// Error Handler
app.use(errorHandler);

connectDB();

app.listen(PORT, () => {
    console.log(`Medical Appointment System API running on port ${PORT}`);
    console.log(`Swagger Docs available at http://localhost:${PORT}/api/docs`);
});

export default app;
