//@ts-ignore //Para evitar que salga rojo lo del express
import {Request, Response} from "express";
import mongoose from "mongoose";

import { TareaModel, TareaModelType } from "../db/tarea.ts";

export const getTarea = async(req:Request<{id:string}>, res:Response<TareaModelType | {error:unknown}>) => {
    try{
        const id = req.params.id;

        const tarea = await TareaModel.findById(id)
        .populate({path: "empresa", select: "nombre tipo"}) //Populate para que se vea la empresa y el trabajador
        .populate({path: "trabajador", select: "nombre email dni telefono"})
        .exec(); 

        if(!tarea){
            res.status(404).send("No se pudo encontrar la tarea");
            return;            
        }

        res.status(200).json(tarea);
    }catch(error){
        if (error instanceof mongoose.Error.ValidationError) {
            const validationErrors = Object.keys(error.errors).map(
                (key) => error.errors[key].message
            );
            res.status(400).send("Error de validacion: " + validationErrors.join(", ")); //Si hay mas de un error de validacion, se separan por comas
        } else {
            res.status(500).send(error.message);
        }
    }
}