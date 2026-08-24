import { Request, Response } from "express";
import Doctor from "../models/doctorProfile.model";

export async function getAllDoctors(req: Request, res: Response) {
    try {
        const doctors = await Doctor.find() ;
        res.status(200).send(doctors)
    }catch(error) {
        res.status(500).json({ message: "Failed to get all doctors " , error})
    }
}

export async function getDoctorById( req:Request, res:Response ) {
    try {
        const id = req.params.id;
        const doctor = await Doctor.findById(id);
        if(doctor)
            res.status(200).json(doctor) ;
        else 
            res.status(404).json({message: "Explorer not found",})
    }catch(error) {
        res.status(500).json({ message:  "Failed to get doctor by id",})
    }
}

export async function createDoctorProfile(req: Request, res: Response){
    try {
        const { 
            user,
            specialty,
            experience,
            clinicAddress,
            consultationFee,
            workingHours,
            availabilityStatus
        } = req.body ;
        //validations
        if (
        !user ||
        !specialty ||
        !clinicAddress ||
        !workingHours ||
        experience === undefined ||
        consultationFee === undefined ||
        availabilityStatus === undefined
        ) {
            return res.status(400).json({message: "All fields are required",});
        }

        if (experience < 0) {
            return res.status(400).json({ message: "Experience cannot be negative",});
        }

        if (consultationFee < 0) {
            return res.status(400).json({ message: "Consultation fee cannot be negative", });
        }
        const doctor = new Doctor({
            user,
            specialty,
            experience,
            clinicAddress,
            consultationFee,
            workingHours,
            availabilityStatus,
        });
        await doctor.save() ;
        res.status(201).json(doctor);
    }catch(error) {
        res.status(500).json({ message: "Failed to create doctor profile ", error });
    }
}

export async function updateDoctorProfile(req: Request, res: Response) {
    try{
        const id = req.params.id;
        const { user,
            specialty,
            experience,
            clinicAddress,
            consultationFee,
            workingHours,
            availabilityStatus
        } = req.body ;
        
        //validations
        if (
            !user ||
            !specialty ||
            !clinicAddress ||
            !workingHours ||
            experience === undefined ||
            consultationFee === undefined ||
            availabilityStatus === undefined
        ) {
            return res.status(400).json({message: "All fields are required",});
        }
        
        if (experience < 0) {
            return res.status(400).json({ message: "Experience cannot be negative",});
        }
        
        if (consultationFee < 0) {
            return res.status(400).json({ message: "Consultation fee cannot be negative", });
        }
        const doctor = new Doctor({
            user,
            specialty,
            experience,
            clinicAddress,
            consultationFee,
            workingHours,
            availabilityStatus,
        });
        await Doctor.findByIdAndUpdate(id,doctor) ;
        
            
    }catch(error){
        res.status(500).json({ message:  "Failed to get doctor by id "})
    }
}
