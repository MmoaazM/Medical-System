import { Router } from "express";
import { validateScheduleCreate, validateScheduleUpdate } from "../middlewares/validations.middleware";
import { authGuard } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import {
  getAllSchedules,
  getDoctorSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from "../controllers/schedule.controller";

const router = Router();

router.get("/", getAllSchedules);
router.get("/doctor/:doctorId", getDoctorSchedules);

router.post("/", 
  authGuard,
  requireRole("Doctor", "Admin"),
  validateScheduleCreate,
  createSchedule 
); 

router.patch("/:id",
  authGuard,
  requireRole("Doctor", "Admin"),
  validateScheduleUpdate,
  updateSchedule 
);

router.delete("/:id",
  authGuard,
  requireRole("Doctor", "Admin"),
  deleteSchedule
);

export default router;

