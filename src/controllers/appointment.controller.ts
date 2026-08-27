import { Request, Response } from "express";
import doctorProfileModel from "../models/doctorProfile.model";
import userModel from "../models/user.model";
import scheduleModel from "../models/schedule.model";
import appointmentModel, { IAppointment, AppointmentStatus } from "../models/appointment.model";

export async function createAppointment(req: Request, res: Response) {
    try {
        const patientId = req.user._id;
        const { doctorId, appointmentDate, timeSlot, notes } = req.body;

        const doctor = await userModel.findOne({ _id: doctorId });
        if (!doctor) {
            return res.status(404).json({ message: "Doctor Not Found" });
        }
        if (doctor.Role !== "Doctor") {
            return res.status(400).json({ message: "This Person is not a doctor" })
        }


        const patient = await userModel.findOne({ _id: patientId });
        if (!patient) {
            return res.status(404).json({ message: "Patient Not Found" });
        }
        if (patient.Role !== "Patient") {
            return res.status(400).json({ message: "This Person is not a Patient" })
        }

        const schedule = await scheduleModel.findOne({ doctor: doctorId, day: appointmentDate })
        if (!schedule) {
            return res.status(404).json({ message: "Schedule Not Found for This Doctor" });
        }

        const requiredTimeSlot = schedule.availableTimeSlots.find(t => t.startTime === timeSlot.startTime && t.endTime === timeSlot.endTime);
        if (!requiredTimeSlot) {
            return res.status(404).json({ message: "Time Slot Not Found" });
        }
        if (requiredTimeSlot.isBooked) {
            return res.status(400).json({ message: "This Time Slot Is Already Booked, Choose Another One" });
        }

        const newAppointment: IAppointment = {
            doctor: doctor._id,
            patient: patient._id,
            schedule: schedule._id,
            appointmentDate,
            timeSlot: {
                startTime: requiredTimeSlot.startTime,
                endTime: requiredTimeSlot.endTime
            },
            status: "Pending"
        }

        if (notes !== undefined && notes.trim() !== "") {
            newAppointment.notes = notes.trim();
        }

        const createdAppointment = await appointmentModel.create(newAppointment);

        requiredTimeSlot.isBooked = true;
        await schedule.save();
        return res.status(201).json(createdAppointment);

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
        const patientId = req.user._id;

        const patientAppointments = await appointmentModel.find({ patient: patientId })
            .populate("doctor", "FullName Email")
            .populate("patient", "FullName")
            .populate("schedule");

        if (patientAppointments.length === 0) {
            return res.status(200).json({ message: "You Don't Have Any Appointments" })
        }

        res.status(200).json(patientAppointments);


    } catch (error) {
        console.error(`error : ${error}`)
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getDoctorAppointments(req: Request, res: Response) {
    try {
        const doctorId = req.params.id;

        const doctor = await userModel.findOne({ _id: doctorId });
        if (doctor?.Role !== "Doctor") {
            return res.status(404).json({ message: "This User Is not a Doctor" });
        }

        const doctorAppointments = await appointmentModel.find({ doctor: doctorId })
            .populate("doctor", "FullName")
            .populate("patient", "FullName Email")
            .populate("schedule")

        if (doctorAppointments.length === 0) {
            return res.status(200).json({ message: "This Doctor Doesn't have Appointments" })
        }

        res.status(200).json(doctorAppointments);
    } catch (error) {
        console.error(`error : ${error}`)
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getAllAppointments(req: Request, res: Response) {
    try {
        const allAppointments = await appointmentModel.find()
            .populate("doctor", "FullName Email")
            .populate("patient", "FullName")
            .populate("schedule");

        if (allAppointments.length === 0) {
            return res.status(200).json({ message: "There isn't any Appointments" })
        }

        res.status(200).json(allAppointments);

    } catch (error) {
        console.error(`error : ${error}`)
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function cancelAppointment(req: Request, res: Response) {
    try {
        const appointmentId = req.params.id;
        const userId = req.user?._id;

        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment Not Found" });
        }

        const isPatient = appointment.patient.toString() === userId?.toString();
        const isDoctor = appointment.doctor.toString() === userId?.toString();
        const isAdmin = req.user?.Role === "Admin";

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
            const slot = schedule.availableTimeSlots.find(
                (t: any) => t.startTime === appointment.timeSlot.startTime && t.endTime === appointment.timeSlot.endTime
            );
            if (slot) {
                slot.isBooked = false;
                await schedule.save();
            }
        }

        appointment.status = "Cancelled";
        await appointment.save();

        return res.status(200).json({ message: "Appointment cancelled successfully" });

    } catch (error) {
        console.error(`error : ${error}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


export async function updateAppointmentStatus(req: Request, res: Response) {
    try {
        const appointmentId = req.params.id;
        const { status, notes } = req.body;
        const userId = req.user?._id;

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
        const isAdmin = req.user?.Role === "Admin";

        if (!isPatient && !isDoctor && !isAdmin) {
            return res.status(403).json({ message: "You are not authorized to update this appointment" });
        }

        // Free schedule slot if status is changed to Cancelled from another status
        if (status === "Cancelled" && appointment.status !== "Cancelled") {
            const schedule = await scheduleModel.findById(appointment.schedule);
            if (schedule) {
                const slot = schedule.availableTimeSlots.find(
                    (t: any) => t.startTime === appointment.timeSlot.startTime && t.endTime === appointment.timeSlot.endTime
                );
                if (slot) {
                    slot.isBooked = false;
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

