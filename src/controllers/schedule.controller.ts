import { Request, Response } from "express";
import Schedules from "../models/schedule.model";


export async function getAllSchedules(req: Request, res: Response) {
    try {
        const schedules = await Schedules.find() ;
        res.status(200).json(schedules);
        
    } catch (error) {
        res.status(200).json({
            message: "Server error " , 
        });
    }
}

export async function createSchedule(req: Request, res: Response) {
    try {
        const {
            doctor ,
            day ,
            availableTimeSlots ,
            availability ,
        } = req.body ;
        
        const schedule = await Schedules.create({
            doctor ,
            day ,
            availableTimeSlots ,
            availability ,
        });

        res.status(201).json({message: "Schedule created successfully "});

    } catch (error) {
        res.status(500).json({
            message: "Server error ", 
        });
    }
}

export async function updateSchedule(req: Request, res: Response) {
    try {
        const id = req.params.id ; 
        const modifiedData = req.body;

        const schedule = await Schedules.findById(id) ;

        if(!schedule){
            return res.status(404).json({
                message: "Schedule not found ",
            });
        }
        
        await Schedules.findByIdAndUpdate(
            id ,
            modifiedData,
            {runValidators: true }
        );
        
        return res.status(200).json({
            message: "Schedule updated successfully ",
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error ", 
        });
    }
}

export async function deleteSchedule(req: Request, res: Response) {
    try {
        const id = req.params.id

        const schedule = await Schedules.findByIdAndDelete(id) ;

        if(!schedule){
            return res.status(404).json({
                message: "Schedule not found " ,
            })
        }

        res.status(200).json({
            message: "Schedule deleted Successfully",
        })

    } catch (error) {
        res.status(500).json({
            message: "Server error ", 
        });
    }
}
