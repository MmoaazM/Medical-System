import { Router } from "express";
import {
  createAppointment,
  getMyAppointments,
  getDoctorAppointments,
  getAllAppointments,
  cancelAppointment,
  updateAppointmentStatus,
} from "../controllers/appointment.controller";
import { authGuard } from "../middlewares/auth.middleware";

const router = Router();



export default router;
