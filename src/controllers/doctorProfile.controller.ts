import { Request, Response } from "express";
import Doctors from "../models/doctorProfile.model";

export async function getAllDoctors(req: Request, res: Response) {
    try {
        const doctors = await Doctors.find() ;
        res.status(200).json(doctors)

    }catch(error) {
        res.status(500).json({ 
            message: "Server error " ,
        })
    }
}

export async function getDoctorById( req:Request, res:Response ) {
    try {
        const id = req.params.id;
        const doctor = await Doctors.findById(id);

        if(!doctor){
            return res.status(404).json({ message: "Doctor not found",});
        }
        
        return res.status(200).json(doctor) ;

    }catch(error) {
        res.status(500).json({
            message: "Server error " , 
        });
    }
}

export async function createDoctorProfile( req: Request, res: Response) {
    try {
        const {
            user,
            specialty,
            experience,
            clinicAddress,
            consultationFee,
            workingHours,
            availabilityStatus
        } = req.body;

        const doctor = await Doctors.create({
            user,
            specialty,
            experience,
            clinicAddress,
            consultationFee,
            workingHours,
            availabilityStatus
        });
        res.status(201).json({message: "Doctor created successfully"});

    } catch(error) {
        res.status(500).json({
            message: "Server error " , 
        });
    }
}

export async function updateDoctorProfile(req: Request, res: Response) {
    try{
        const id = req.params.id;
        const modifiedData = req.body;

        const doctor = await Doctors.findById(id) ;

        if(!doctor){
            return res.status(404).json({ message: "Doctor not found " ,});
        }

        await Doctors.findByIdAndUpdate(
            id,
            modifiedData,
            {runValidators: true },
        );

        return res.status(200).json({
            message: "Doctor updated successfully ",
        });

    }catch(error){
        res.status(500).json({
            message: "Server error " , 
        });
    }
}

export async function deleteDoctorProfile(req:Request, res:Response ){
    try {
        const id = req.params.id;

        const doctor = await Doctors.findByIdAndDelete(id) ;

        if(!doctor){
            return res.status(404).json({
                message: "Doctor not found ",
            });
        }

        return res.status(200).json({
            message: "Doctor deleted successfully ",
        });
        
    } catch (error) {
        res.status(500).json({
            message: "Server error " , 
        });
    }
}