//@ts-ignore //Para evitar que salga rojo lo del express
import {Request, Response} from "express";
import mongoose from "mongoose";

import { TrabajadorModel, TrabajadorModelType } from "../db/trabajador.ts";

export const getTrabajador = async(req:Request<{id:string}>, res:Response<TrabajadorModelType | {error : unknown}>) => {
    try{
        const id = req.params.id;

        const trabajador = await TrabajadorModel.findById(id)
        .populate({path: "empresa", select: "nombre tipo"}) //Populate para que se vea la empresa y las tareas con los campos que queremos
        .populate({path: "tareas", select: "nombre estado"})
        .exec(); 

        if(!trabajador){
            res.status(404).send("No se pudo encontrar el trabajador");
            return;
        }

        res.status(200).send(trabajador); 
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