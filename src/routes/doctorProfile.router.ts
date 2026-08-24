import { Router } from "express";
import {
  createDoctorProfile,
  updateDoctorProfile,
  getAllDoctors,
  getDoctorById,
} from "../controllers/doctorProfile.controller";
import { authGuard } from "../middlewares/auth.middleware";

const router = Router();
router.get("/", getAllDoctors);
router.get("/:id", getDoctorById);
router.post("/",createDoctorProfile);
router.patch("/:id",updateDoctorProfile);



export default router;
