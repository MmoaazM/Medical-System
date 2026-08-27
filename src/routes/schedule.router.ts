import { Router } from "express";
import { validateScheduleCreate , validateScheduleUpdate } from "../middlewares/validations.middleware";
import { authGuard } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import {
  getAllSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from "../controllers/schedule.controller";

const router = Router();
router.get("/" , getAllSchedules ); 

router.post("/:id" , 
  authGuard,
  requireRole("Doctor") ,
  validateScheduleCreate,
  createSchedule 
); 

router.patch("/:id",
  authGuard,
  requireRole("Doctor") ,
  validateScheduleUpdate,
  updateSchedule 
);

router.delete("/:id",
  authGuard,
  requireRole("Doctor"),
  deleteSchedule
);


export default router;
