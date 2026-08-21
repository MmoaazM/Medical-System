import { Router } from "express";
import {
  createSchedule,
  getSchedules,
  updateSchedule,
  deleteSchedule,
} from "../controllers/schedule.controller";
import { authGuard } from "../middlewares/auth.middleware";

const router = Router();



export default router;
