import { Request, Response } from "express";
import userModel from "../models/user.model";
import scheduleModel from "../models/schedule.model";
import appointmentModel, { AppointmentStatus } from "../models/appointment.model";

export async function createAppointment(req: Request, res: Response) {
    try {
        const currentUser = (req as any).user || (req as any).User;
        const patientId = currentUser?._id || currentUser?.id || req.body.patientId;
        const { doctorId, appointmentDate, timeSlot, notes } = req.body;

        if (!patientId) {
            return res.status(401).json({ message: "Unauthorized: Patient identity missing" });
        }

        if (!doctorId || !appointmentDate || !timeSlot) {
            return res.status(400).json({ message: "Missing required fields: doctorId, appointmentDate, and timeSlot are required" });
        }

        const slotStart = timeSlot.startTime || timeSlot.start;
        const slotEnd = timeSlot.endTime || timeSlot.end;

        if (!slotStart || !slotEnd) {
            return res.status(400).json({ message: "Invalid timeSlot: startTime and endTime are required" });
        }

        const doctor = await userModel.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor Not Found" });
        }
        if (doctor.Role !== "Doctor") {
            return res.status(400).json({ message: "This Person is not a doctor" });
        }

        const patient = await userModel.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: "Patient Not Found" });
        }
        if (patient.Role !== "Patient" && patient.Role !== "Admin" && patient.Role !== "Doctor") {
            return res.status(400).json({ message: "Invalid user role" });
        }


        let schedule = await scheduleModel.findOne({ doctor: doctorId, day: appointmentDate });
        if (!schedule) {
            const schedules = await scheduleModel.find({ doctor: doctorId });
            schedule = schedules.find((s: any) =>
                s.day === appointmentDate ||
                s.availableTimeSlots.some((t: any) => (t.start === slotStart || t.startTime === slotStart) && (t.end === slotEnd || t.endTime === slotEnd))
            ) || null;
        }

        if (!schedule) {
            return res.status(404).json({ message: "Schedule Not Found for This Doctor on this date" });
        }

        const requiredTimeSlot: any = schedule.availableTimeSlots.find(
            (t: any) => (t.start === slotStart || t.startTime === slotStart) && (t.end === slotEnd || t.endTime === slotEnd)
        );


        if (!requiredTimeSlot) {
            return res.status(404).json({ message: "Time Slot Not Found" });
        }
        if (requiredTimeSlot.available === false) {
            return res.status(400).json({ message: "This Time Slot Is Already Booked, Choose Another One" });
        }

        const createdAppointment = await appointmentModel.create({
            doctor: doctor._id,
            patient: patient._id,
            schedule: schedule._id,
            appointmentDate,
            timeSlot: {
                startTime: slotStart,
                endTime: slotEnd
            },
            status: "Pending",
            notes: notes && typeof notes === "string" && notes.trim() !== "" ? notes.trim() : undefined
        });

        requiredTimeSlot.available = false;
        await schedule.save();

        return res.status(201).json({
            message: "Appointment created successfully",
            appointment: createdAppointment
        });

    } catch (error: any) {
        console.error(`error : ${error}`);
        if (error.code === 11000) {
            return res.status(400).json({ message: "This Time Slot Is Already Booked, Choose Another One" });
        }
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getMyAppointments(req: Request, res: Response) {
    try {
        const currentUser = (req as any).user || (req as any).User;
        const userId = currentUser?._id || currentUser?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const patientAppointments = await appointmentModel.find({ patient: userId })
            .populate("doctor", "FullName Email Role")
            .populate("patient", "FullName Email Role")
            .populate("schedule");

        return res.status(200).json({
            appointments: patientAppointments
        });
    } catch (error) {
        console.error(`error : ${error}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getDoctorAppointments(req: Request, res: Response) {
    try {
        const doctorId = req.params.id;

        const doctor = await userModel.findById(doctorId);
        if (!doctor || doctor.Role !== "Doctor") {
            return res.status(404).json({ message: "This User Is not a Doctor" });
        }

        const doctorAppointments = await appointmentModel.find({ doctor: doctorId })
            .populate("doctor", "FullName Email Role")
            .populate("patient", "FullName Email Role")
            .populate("schedule");

        return res.status(200).json({
            appointments: doctorAppointments
        });
    } catch (error) {
        console.error(`error : ${error}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getPatientAppointments(req: Request, res: Response) {
    try {
        const patientId = req.params.id;

        const patient = await userModel.findById(patientId);
        if (!patient || patient.Role !== "Patient") {
            return res.status(404).json({ message: "This User Is not a Patient" });
        }

        const patientAppointments = await appointmentModel.find({ patient: patientId })
            .populate("doctor", "FullName Email Role")
            .populate("patient", "FullName Email Role")
            .populate("schedule");

        return res.status(200).json({
            appointments: patientAppointments
        });
    } catch (error) {
        console.error(`error : ${error}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getAllAppointments(req: Request, res: Response) {
    try {
        const allAppointments = await appointmentModel.find()
            .populate("doctor", "FullName Email Role")
            .populate("patient", "FullName Email Role")
            .populate("schedule");

        return res.status(200).json({
            appointments: allAppointments
        });
    } catch (error) {
        console.error(`error : ${error}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getAppointmentById(req: Request, res: Response) {
    try {
        const appointmentId = req.params.id;
        const currentUser = (req as any).user || (req as any).User;
        const userId = currentUser?._id || currentUser?.id;

        const appointment = await appointmentModel.findById(appointmentId)
            .populate("doctor", "FullName Email Role")
            .populate("patient", "FullName Email Role")
            .populate("schedule");

        if (!appointment) {
            return res.status(404).json({ message: "Appointment Not Found" });
        }

        const isPatient = (appointment.patient as any)?._id?.toString() === userId?.toString();
        const isDoctor = (appointment.doctor as any)?._id?.toString() === userId?.toString();
        const isAdmin = currentUser?.Role === "Admin" || currentUser?.role === "Admin";

        if (!isPatient && !isDoctor && !isAdmin) {
            return res.status(403).json({ message: "You are not authorized to view this appointment" });
        }

        return res.status(200).json(appointment);
    } catch (error) {
        console.error(`error : ${error}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function cancelAppointment(req: Request, res: Response) {
    try {
        const appointmentId = req.params.id;
        const currentUser = (req as any).user || (req as any).User;
        const userId = currentUser?._id || currentUser?.id;

        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment Not Found" });
        }

        const isPatient = appointment.patient.toString() === userId?.toString();
        const isDoctor = appointment.doctor.toString() === userId?.toString();
        const isAdmin = currentUser?.Role === "Admin" || currentUser?.role === "Admin";

        if (!isPatient && !isDoctor && !isAdmin) {
            return res.status(403).json({ message: "You are not authorized to cancel this appointment" });
        }

        if (appointment.status === "Cancelled") {
            return res.status(400).json({ message: "Appointment is already cancelled" });
        }

        if (appointment.status === "Completed") {
            return res.status(400).json({ message: "Cannot cancel a completed appointment" });
        }

        const schedule = await scheduleModel.findById(appointment.schedule);
        if (schedule) {
            const slot: any = schedule.availableTimeSlots.find(
                (t: any) =>
                    (t.start === appointment.timeSlot?.startTime || t.startTime === appointment.timeSlot?.startTime) &&
                    (t.end === appointment.timeSlot?.endTime || t.endTime === appointment.timeSlot?.endTime)
            );
            if (slot) {
                slot.available = true;
                await schedule.save();
            }
        }

        appointment.status = "Cancelled";
        await appointment.save();

        return res.status(200).json({
            message: "Appointment cancelled successfully",
            appointment
        });

    } catch (error) {
        console.error(`error : ${error}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function updateAppointmentStatus(req: Request, res: Response) {
    try {
        const appointmentId = req.params.id;
        const { status, notes } = req.body;
        const currentUser = (req as any).user || (req as any).User;
        const userId = currentUser?._id || currentUser?.id;

        const validStatuses: AppointmentStatus[] = ["Pending", "Confirmed", "Completed", "Cancelled"];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid appointment status" });
        }

        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment Not Found" });
        }

        const isPatient = appointment.patient.toString() === userId?.toString();
        const isDoctor = appointment.doctor.toString() === userId?.toString();
        const isAdmin = currentUser?.Role === "Admin" || currentUser?.role === "Admin";

        if (!isPatient && !isDoctor && !isAdmin) {
            return res.status(403).json({ message: "You are not authorized to update this appointment" });
        }

        if (status === "Cancelled" && appointment.status !== "Cancelled") {
            const schedule = await scheduleModel.findById(appointment.schedule);
            if (schedule) {
                const slot: any = schedule.availableTimeSlots.find(
                    (t: any) =>
                        (t.start === appointment.timeSlot?.startTime || t.startTime === appointment.timeSlot?.startTime) &&
                        (t.end === appointment.timeSlot?.endTime || t.endTime === appointment.timeSlot?.endTime)
                );
                if (slot) {
                    slot.available = true;
                    await schedule.save();
                }
            }
        }

        if (status) {
            appointment.status = status;
        }

        if (notes !== undefined && notes.trim() !== "") {
            appointment.notes = notes.trim();
        }

        await appointment.save();

        return res.status(200).json({
            message: "Appointment status updated successfully",
            appointment
        });

    } catch (error) {
        console.error(`error : ${error}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
