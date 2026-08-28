import { Request, Response } from "express";
import Schedules from "../models/schedule.model";

export async function getAllSchedules(req: Request, res: Response) {
    try {
        const { doctorId, date } = req.query;
        const filter: any = {};
        if (doctorId) filter.doctor = doctorId;
        if (date) filter.day = date;

        const schedules = await Schedules.find(filter).populate("doctor", "FullName Email Role");
        return res.status(200).json(schedules);
    } catch (error) {
        console.error("getAllSchedules Error:", error);
        return res.status(500).json({ message: "Server error retrieving schedules" });
    }
}

export async function getDoctorSchedules(req: Request, res: Response) {
    try {
        const doctorId = req.params.doctorId || req.params.id;
        const { date } = req.query;
        const filter: any = { doctor: doctorId };
        if (date) filter.day = date;

        const schedules = await Schedules.find(filter).populate("doctor", "FullName Email Role");
        return res.status(200).json(schedules);
    } catch (error) {
        console.error("getDoctorSchedules Error:", error);
        return res.status(500).json({ message: "Server error retrieving doctor schedules" });
    }
}

export async function createSchedule(req: Request, res: Response) {
    try {
        const currentUser = (req as any).user || (req as any).User;
        const doctorId = req.body.doctor || req.body.doctorId || currentUser?.id || currentUser?._id;
        const { day, availableTimeSlots, availability } = req.body;

        if (!doctorId || !day || !availableTimeSlots) {
            return res.status(400).json({ message: "doctor, day, and availableTimeSlots are required" });
        }

        const normalizedSlots = availableTimeSlots.map((slot: any) => ({
            start: slot.start || slot.startTime,
            end: slot.end || slot.endTime,
            available: slot.available !== undefined ? slot.available : (slot.isBooked !== undefined ? !slot.isBooked : true)
        }));

        const schedule = await Schedules.create({
            doctor: doctorId,
            day,
            availableTimeSlots: normalizedSlots,
            availability: availability !== undefined ? availability : true,
        });

        return res.status(201).json({
            message: "Schedule created successfully",
            schedule
        });
    } catch (error) {
        console.error("createSchedule Error:", error);
        return res.status(500).json({ message: "Server error creating schedule" });
    }
}

export async function updateSchedule(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const { day, availableTimeSlots, availability } = req.body;

        const schedule = await Schedules.findById(id);
        if (!schedule) {
            return res.status(404).json({ message: "Schedule not found" });
        }

        const updateData: any = {};
        if (day !== undefined) updateData.day = day;
        if (availability !== undefined) updateData.availability = availability;
        if (availableTimeSlots !== undefined) {
            updateData.availableTimeSlots = availableTimeSlots.map((slot: any) => ({
                start: slot.start || slot.startTime,
                end: slot.end || slot.endTime,
                available: slot.available !== undefined ? slot.available : (slot.isBooked !== undefined ? !slot.isBooked : true)
            }));
        }

        const updatedSchedule = await Schedules.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            message: "Schedule updated successfully",
            schedule: updatedSchedule
        });
    } catch (error) {
        console.error("updateSchedule Error:", error);
        return res.status(500).json({ message: "Server error updating schedule" });
    }
}

export async function deleteSchedule(req: Request, res: Response) {
    try {
        const id = req.params.id;

        const schedule = await Schedules.findByIdAndDelete(id);
        if (!schedule) {
            return res.status(404).json({ message: "Schedule not found" });
        }

        return res.status(200).json({ message: "Schedule deleted successfully" });
    } catch (error) {
        console.error("deleteSchedule Error:", error);
        return res.status(500).json({ message: "Server error deleting schedule" });
    }
}

