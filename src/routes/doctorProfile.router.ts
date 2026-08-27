import { Router } from "express";
import { authGuard } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { 
  validateDoctorCreate,
  validateDoctorUpdate  
} from "../middlewares/validations.middleware";
import {
  getAllDoctors,
  getDoctorById,
  deleteDoctorProfile,
  createDoctorProfile,
  updateDoctorProfile
} from "../controllers/doctorProfile.controller";

const router = Router();
router.get("/", getAllDoctors );

router.get("/:id", getDoctorById );
router.delete("/:id",
  authGuard,
  requireRole("Admin"),
  deleteDoctorProfile
)
router.post("/",
  authGuard ,
  requireRole("Admin") , 
  validateDoctorCreate , 
  createDoctorProfile 
);

router.patch("/:id",
  authGuard ,
  requireRole("Admin", "Doctor") , 
  validateDoctorUpdate , 
  updateDoctorProfile
);



export default router;
