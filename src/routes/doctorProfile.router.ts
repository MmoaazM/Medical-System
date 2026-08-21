import { Router } from "express";
import {
  upsertDoctorProfile,
  getDoctors,
  removeDoctor,
} from "../controllers/doctorProfile.controller";
import { authGuard } from "../middlewares/auth.middleware";

const router = Router();



export default router;
