//@ts-ignore //Para evitar que salga rojo lo del express
import {Request, Response} from "express";
import mongoose from "mongoose";

import { TrabajadorModel, TrabajadorModelType } from "../db/trabajador.ts";

export const getTrabajadores = async(_req:Request, res:Response<Array<TrabajadorModelType> | {error : unknown}>) => {
    try{
        const trabajadores = await TrabajadorModel.find({})
        .populate({path: "empresa", select: "nombre tipo"})
        .populate({path: "tareas", select: "nombre estado"})
        .exec(); //Populate para que se vea la empresa y las tareas        


        res.status(200).send(trabajadores);
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