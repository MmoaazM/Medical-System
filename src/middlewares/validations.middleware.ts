import { Request, Response, NextFunction } from "express";
import { deflateRawSync } from "node:zlib";

export function validateDoctorCreate( req: Request, res: Response, next: NextFunction ) {
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
        consultationFee === undefined ||
        availabilityStatus === undefined
    ) {
        return res.status(400).json({ message: "All fields are required", });
    }

    if (typeof experience !== "number" || experience < 0) {
        return res.status(400).json({ message: "Experience must be a non-negative number", });
    }

    if ( typeof consultationFee !== "number" || consultationFee < 0 ) {
        return res.status(400).json({ message: "Consultation fee must be a non-negative number", });
    }

    if (typeof availabilityStatus !== "boolean") {
        return res.status(400).json({ message: "Availability status must be a boolean", });
    }

    next();
}

export function validateDoctorUpdate( req: Request, res: Response, next: NextFunction ) {
    const {
        specialty,
        experience,
        clinicAddress,
        consultationFee,
        workingHours,
        availabilityStatus,
    } = req.body;

    if(specialty !== undefined && typeof specialty !== "string" )
        return res.status(400).json({message: "Specialty must be a string " ,}) ;
    

    if(workingHours !== undefined && typeof workingHours !== "string" )
        return res.status(400).json({message: "WorkingHours must be a string " ,}) ;
    

    if(clinicAddress !== undefined && typeof clinicAddress !== "string")
        return res.status(400).json({message: "ClinicAddress must be a string " ,}) ;
    

    if ( experience !== undefined ) {
        if(typeof experience !== "number" || experience < 0)
            return res.status(400).json({ message: "Experience must be a non-negative number", });
    }

    if ( consultationFee !== undefined ) {
        if(typeof consultationFee !== "number" || consultationFee < 0 )
            return res.status(400).json({ message: "Consultation fee must be a non-negative number", });
    }

    if ( availabilityStatus !== undefined && typeof availabilityStatus !== "boolean") {
        return res.status(400).json({ message: "Availability status must be a boolean", });
    }

    next();
}

export function validateScheduleCreate( req: Request, res: Response, next: NextFunction ) {
    const {
        doctor,
        day ,
        availableTimeSlots ,
        availability ,
    } = req.body ;

    if(
        !doctor||
        !day ||
        !availableTimeSlots ||
        availability === undefined
    ) {
        return res.status(400).json({ message: "All fields are required "}) ;
    }
    
    if(!Array.isArray(availableTimeSlots)){
        return res.status(400).json({ message: "AvailableTimeSlots must be an array "}) ;
    }
    
    if(typeof availability !== "boolean" ){
        return res.status(400).json({ message: "Availability must be boolean "}) ;
    }
    
    next();
}

export function validateScheduleUpdate( req: Request, res: Response , next: NextFunction){
    const {
        day ,
        availableTimeSlots ,
        availability ,
    } = req.body ;
    
    if(day !== undefined && typeof day !== "string"){
        return res.status(400).json({message: "day must be a string " ,}) ;
    }
    
    if( availableTimeSlots !== undefined && !Array.isArray(availableTimeSlots)){
        return res.status(400).json({message: "AvailableTimeSlots must be an array " ,}) ;
    }
    
    if( availability !== undefined && typeof availability !== "boolean" ){
        return res.status(400).json({ message: "Availability must be boolean ", }) ;
    }

    next(); 
}