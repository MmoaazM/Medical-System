import { Request, Response, NextFunction } from "express";

export function validateRegister(req: Request, res: Response, next: NextFunction) {
    const { FullName, email, Email, password, Password, Role, role } = req.body;
    const userEmail = Email || email;
    const userPass = Password || password;
    const userRole = Role || role;

    if (!FullName || !userEmail || !userPass || !userRole) {
        return res.status(400).json({ message: "FullName, Email, Password, and Role are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    if (!["Patient", "Doctor", "Admin"].includes(userRole)) {
        return res.status(400).json({ message: "Role must be Patient, Doctor, or Admin" });
    }

    next();
}

export function validateLogin(req: Request, res: Response, next: NextFunction) {
    const { Email, email, Password, password } = req.body;
    const userEmail = Email || email;
    const userPass = Password || password;

    if (!userEmail || !userPass) {
        return res.status(400).json({ message: "Email and Password are required" });
    }

    next();
}

export function validateDoctorCreate(req: Request, res: Response, next: NextFunction) {
    const {
        user,
        specialty,
        experience,
        clinicAddress,
        consultationFee,
        workingHours,
        availabilityStatus,
    } = req.body;

    if (
        !user ||
        !specialty ||
        !clinicAddress ||
        !workingHours ||
        experience === undefined ||
        consultationFee === undefined
    ) {
        return res.status(400).json({ message: "All fields (user, specialty, experience, clinicAddress, consultationFee, workingHours) are required" });
    }

    if (typeof experience !== "number" || experience < 0) {
        return res.status(400).json({ message: "Experience must be a non-negative number" });
    }

    if (typeof consultationFee !== "number" || consultationFee < 0) {
        return res.status(400).json({ message: "Consultation fee must be a non-negative number" });
    }

    if (availabilityStatus !== undefined && typeof availabilityStatus !== "boolean") {
        return res.status(400).json({ message: "Availability status must be a boolean" });
    }

    next();
}

export function validateDoctorUpdate(req: Request, res: Response, next: NextFunction) {
    const {
        specialty,
        experience,
        clinicAddress,
        consultationFee,
        workingHours,
        availabilityStatus,
    } = req.body;

    if (specialty !== undefined && typeof specialty !== "string") {
        return res.status(400).json({ message: "Specialty must be a string" });
    }

    if (workingHours !== undefined && typeof workingHours !== "string") {
        return res.status(400).json({ message: "WorkingHours must be a string" });
    }

    if (clinicAddress !== undefined && typeof clinicAddress !== "string") {
        return res.status(400).json({ message: "ClinicAddress must be a string" });
    }

    if (experience !== undefined && (typeof experience !== "number" || experience < 0)) {
        return res.status(400).json({ message: "Experience must be a non-negative number" });
    }

    if (consultationFee !== undefined && (typeof consultationFee !== "number" || consultationFee < 0)) {
        return res.status(400).json({ message: "Consultation fee must be a non-negative number" });
    }

    if (availabilityStatus !== undefined && typeof availabilityStatus !== "boolean") {
        return res.status(400).json({ message: "Availability status must be a boolean" });
    }

    next();
}

export function validateTimeSlots(timeSlots: unknown): boolean {
    if (!Array.isArray(timeSlots)) return false;

    const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

    return timeSlots.every((hour) => {
        if (typeof hour !== "object" || hour === null) return false;

        const h = hour as any;
        const start = h.start || h.startTime;
        const end = h.end || h.endTime;
        const available = h.available !== undefined ? h.available : (h.isBooked !== undefined ? !h.isBooked : true);

        if (typeof start !== "string" || typeof end !== "string" || typeof available !== "boolean") {
            return false;
        }

        return timeRegex.test(start) && timeRegex.test(end) && start < end;
    });
}

export function validateScheduleCreate(req: Request, res: Response, next: NextFunction) {
    const {
        doctor,
        day,
        availableTimeSlots,
        availability,
    } = req.body;

    const doctorId = doctor || req.params?.id || (req as any).user?.id;

    if (!doctorId || !day || !availableTimeSlots) {
        return res.status(400).json({ message: "Doctor, day, and availableTimeSlots are required" });
    }

    if (!validateTimeSlots(availableTimeSlots)) {
        return res.status(400).json({ message: "Invalid availableTimeSlots format or start time must be before end time" });
    }

    if (availability !== undefined && typeof availability !== "boolean") {
        return res.status(400).json({ message: "Availability must be boolean" });
    }

    next();
}

export function validateScheduleUpdate(req: Request, res: Response, next: NextFunction) {
    const {
        day,
        availableTimeSlots,
        availability,
    } = req.body;

    if (day !== undefined && typeof day !== "string") {
        return res.status(400).json({ message: "Day must be a string" });
    }

    if (availableTimeSlots !== undefined && !validateTimeSlots(availableTimeSlots)) {
        return res.status(400).json({ message: "Invalid availableTimeSlots format or start time must be before end time" });
    }

    if (availability !== undefined && typeof availability !== "boolean") {
        return res.status(400).json({ message: "Availability must be boolean" });
    }

    next();
}