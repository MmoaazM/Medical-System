import { Request, Response } from "express";
import doctorProfileModel from "../models/doctorProfile.model";
import userModel from "../models/user.model";
import scheduleModel from "../models/schedule.model";
import appointmentModel, { IAppointment } from "../models/appointment.model";

export async function createAppointment(req: Request, res: Response) {
    try {
        const { doctorId, patientId, appointmentDate, timeSlot, notes } = req.body;

        const doctor = await userModel.findOne({ _id: doctorId });
        if (!doctor) {
            return res.status(404).json({ message: "Doctor Not Found" });
        }
        if (doctor.role !== "Doctor") {
            return res.status(400).json({ message: "This Person is not a doctor" })
        }


        const patient = await userModel.findOne({ _id: patientId });
        if (!patient) {
            return res.status(404).json({ message: "Patient Not Found" });
        }
        if (patient.role !== "Patient") {
            return res.status(400).json({ message: "This Person is not a Patient" })
        }

        const schedule = await scheduleModel.findOne({ doctor: doctorId, date: appointmentDate })
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

        requiredTimeSlot.isBooked = true;
        await schedule.save();

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
        return res.status(201).json(createdAppointment);

    } catch (error) {
        console.error(`error : ${error}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getMyAppointments(req: Request, res: Response) {
    try {
        const patientId = req.user._id;

        const patientAppointments = await appointmentModel.find({ patient: patientId })
            .populate("doctor", "name", "email")
            .populate("patient", "name")
            .populate("schedule");

        if (!patientAppointments) {
            return res.status(200).json({ message: "You Don't Have Any Appointments" })
        }

        res.status(200).json(patientAppointments);


    } catch (error) {
        console.error(`error : ${error}`)
    }
}

export async function getDoctorAppointments(req: Request, res: Response) {
    try {

    } catch (error) {
        console.error(`error : ${error}`)
    }
}

export async function getAllAppointments(req: Request, res: Response) {
    try {

    } catch (error) {
        console.error(`error : ${error}`)
    }
}

export async function cancelAppointment(req: Request, res: Response) {
    try {

    } catch (error) {
        console.error(`error : ${error}`)
    }
}


export async function updateAppointmentStatus(req: Request, res: Response) {
    try {

    } catch (error) {
        console.error(`error : ${error}`)
    }
}
