//@ts-ignore //Para evitar que salga rojo lo del express
import {Request, Response} from "express";
import mongoose from "mongoose";

import { TrabajadorModel } from "../db/trabajador.ts";

export const deleteTrabajador = async(req:Request<{id:string}>, res:Response<string | {error:unknown}>) => {
    try{
        const id = req.params.id;

        const trabajadorDelete = await TrabajadorModel.findByIdAndDelete(id).exec();

        if(!trabajadorDelete){
            res.status(404).send("No se pudo encontrar el trabajador");
            return;            
        }

        res.status(200).send("Trabajador borrado correctamente");
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