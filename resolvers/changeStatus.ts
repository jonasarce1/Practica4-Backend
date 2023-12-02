//@ts-ignore //Para evitar que salga rojo lo del express
import {Request, Response} from "express";
import mongoose from "mongoose";

import { TareaModel } from "../db/tarea.ts";

export const changeStatus = async(req:Request<{id:string}>, res:Response<string | {error : unknown}>) => {
    try{
        const id = req.params.id;
        const status = req.query.status;

        const tarea = await TareaModel.findById(id).exec();

        if(!tarea){
            res.status(404).send("No se pudo encontrar la tarea");
            return;
        }

        await TareaModel.findByIdAndUpdate(id, {estado: status}, {runValidators: true}).exec();

        res.status(200).send("Estado de la tarea actualizado correctamente"); 

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


/*export const changeStatus = async(req:Request<{id:string, status:string}>, res:Response<string | {error : unknown}>) => {
    try{
        const id = req.params.id;
        const status = req.params.status;

        const tarea = await TareaModel.findById(id).exec();

        if(!tarea){
            res.status(404).send("No se pudo encontrar la tarea");
            return;
        }

        await TareaModel.findByIdAndUpdate(id, {estado: status}, {runValidators: true}).exec();

        res.status(200).send("Estado de la tarea actualizado correctamente"); 

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
}*/