 import Content from "../models/content.model";
 import { Request,Response } from "express";

export const createContent=async (req:Request,res:Response)=>{
    try {
       
        const newContent= new Content(req.body)
        await newContent.save()
        res.status(201).json({message:" New content created successfully",newContent})
    } catch (error: any) {
        if (error.name === 'ValidationError') {
          // Mongoose validation error
          return res.status(400).json({ message: 'Validation error', details: error.errors });
        }
        if (error.code === 11000) {
          // Duplicate key error (e.g., unique slug)
          return res.status(400).json({ message: 'Duplicate field value', details: error.keyValue });
        }
        // Other/unexpected errors
        res.status(500).json({ message: 'Server error', error: error.message });
      }
 }

