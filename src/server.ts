import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db";
import doctorRouter from "./routes/doctorProfile.router";
import scheduleRouter from "./routes/schedule.router";
import doctorProfileModel from "./models/doctorProfile.model";
import cookieParser from "cookie-parser" 

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT || 3000;

connectDB();  

app.use("/doctors", doctorRouter );
app.use("/doctors", scheduleRouter );


app.listen(PORT, () => {
    console.log(`Medical Appointment System API running on port ${PORT}`);
});


module.exports = app;
