import { Router } from "express";
import {
  createAppointment,
  getMyAppointments,
  getDoctorAppointments,
  getPatientAppointments,
  getAllAppointments,
  cancelAppointment,
  updateAppointmentStatus,
} from "../controllers/appointment.controller";
import { authGuard } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";


const appointmentRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     AppointmentTimeSlot:
 *       type: object
 *       required:
 *         - startTime
 *         - endTime
 *       properties:
 *         startTime:
 *           type: string
 *           description: Appointment start time (HH:mm format)
 *           example: "09:00"
 *         endTime:
 *           type: string
 *           description: Appointment end time (HH:mm format)
 *           example: "09:30"
 *     Appointment:
 *       type: object
 *       required:
 *         - doctor
 *         - patient
 *         - schedule
 *         - appointmentDate
 *         - timeSlot
 *         - status
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated appointment ID
 *           example: "64dfa5b12c98d7001a999999"
 *         doctor:
 *           type: string
 *           description: Doctor's User ID
 *           example: "64dfa5b12c98d7001a123400"
 *         patient:
 *           type: string
 *           description: Patient's User ID
 *           example: "64dfa5b12c98d7001a123401"
 *         schedule:
 *           type: string
 *           description: Schedule ID associated with this appointment
 *           example: "64dfa5b12c98d7001a123499"
 *         appointmentDate:
 *           type: string
 *           description: Date of appointment (YYYY-MM-DD)
 *           example: "2026-09-01"
 *         timeSlot:
 *           $ref: '#/components/schemas/AppointmentTimeSlot'
 *         status:
 *           type: string
 *           enum: [Pending, Confirmed, Completed, Cancelled]
 *           default: Pending
 *           description: Current status of the appointment
 *           example: "Pending"
 *         notes:
 *           type: string
 *           description: Optional notes for the appointment
 *           example: "Routine checkup"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Appointment scheduling and management endpoints
 */

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Create a new appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - doctorId
 *               - patientId
 *               - appointmentDate
 *               - timeSlot
 *             properties:
 *               doctorId:
 *                 type: string
 *                 description: ID of the doctor
 *                 example: "64dfa5b12c98d7001a123400"
 *               patientId:
 *                 type: string
 *                 description: ID of the patient
 *                 example: "64dfa5b12c98d7001a123401"
 *               appointmentDate:
 *                 type: string
 *                 description: Date of the appointment (YYYY-MM-DD)
 *                 example: "2026-09-01"
 *               timeSlot:
 *                 $ref: '#/components/schemas/AppointmentTimeSlot'
 *               status:
 *                 type: string
 *                 enum: [Pending, Confirmed, Completed, Cancelled]
 *                 default: Pending
 *                 example: "Pending"
 *               notes:
 *                 type: string
 *                 example: "Routine checkup"
 *     responses:
 *       201:
 *         description: Appointment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Appointment created successfully"
 *                 appointment:
 *                   $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Bad request - Missing fields or invalid role
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       404:
 *         description: Doctor, Patient, or Schedule not found
 */
appointmentRouter.post("/", authGuard, requireRole("Patient", "Admin"), createAppointment);

/**
 * @swagger
 * /appointments/patient/{id}:
 *   get:
 *     summary: Get appointments for a patient by patient ID
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Patient User ID
 *     responses:
 *       200:
 *         description: List of patient appointments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 appointments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Appointment'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Patient not found
 */
appointmentRouter.get("/me", authGuard, getMyAppointments);

/**
 * @swagger
 * /appointments/doctor/{id}:
 *   get:
 *     summary: Get appointments for a doctor by doctor ID
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Doctor User ID
 *     responses:
 *       200:
 *         description: List of doctor appointments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 appointments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Appointment'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Doctor not found
 */
appointmentRouter.get("/doctor/:id", authGuard, getDoctorAppointments);

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Get all appointments
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All appointments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 appointments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Appointment'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires admin or staff privileges
 */
appointmentRouter.get("/patient/:id", authGuard, requireRole("Doctor", "Admin"), getPatientAppointments);

appointmentRouter.get("/", authGuard, requireRole("Admin"), getAllAppointments);

/**
 * @swagger
 * /appointments/{id}:
 *   delete:
 *     summary: Cancel an appointment by ID
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *     responses:
 *       200:
 *         description: Appointment cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Appointment cancelled successfully"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Appointment not found
 */
appointmentRouter.delete("/:id", authGuard, cancelAppointment);

/**
 * @swagger
 * /appointments/{id}:
 *   patch:
 *     summary: Update appointment status by ID
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, Confirmed, Completed, Cancelled]
 *                 example: "Confirmed"
 *               notes:
 *                 type: string
 *                 example: "Rescheduled by doctor request"
 *     responses:
 *       200:
 *         description: Appointment status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Appointment status updated successfully"
 *                 appointment:
 *                   $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Bad request - Invalid status transition
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Appointment not found
 */
appointmentRouter.patch("/:id", authGuard, updateAppointmentStatus);

export default appointmentRouter;
