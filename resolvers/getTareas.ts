//@ts-ignore //Para evitar que salga rojo lo del express
import {Request, Response} from "express";
import mongoose from "mongoose";

import { TareaModel, TareaModelType } from "../db/tarea.ts";

export const getTareas = async(_req:Request, res:Response<Array<TareaModelType> | {error : unknown}>) => {
    try{
        const tareas = await TareaModel.find({}).populate("empresa")
        .populate({path: "empresa", select: "nombre tipo"}) //Populate para que se vea la empresa y el trabajador
        .populate({path: "trabajador", select: "nombre email dni telefono"})
        .exec(); 
        
        res.status(200).send(tareas);
    }catch(error){
        if(error instanceof mongoose.Error.ValidationError){ //si el error es del modelo de mongoose
            res.status(400).send(error); 
        }else{
            res.status(500).send(error.message);
        } 
    }
}