//@ts-ignore //Para evitar que salga rojo lo del express
import {Request, Response} from "express";
import mongoose from "mongoose";

import { TareaModel, TareaModelType } from "../db/tarea.ts";

export const postTarea = async(req:Request<TareaModelType>, res:Response<string | {error:unknown}>) => {
    try{
        const {nombre, estado, empresa, trabajador} = req.body;

        const tarea = new TareaModel({nombre, estado, empresa, trabajador}); 

        await tarea.save(); //Aqui saltaran los errores de validacion en caso de que los haya

        res.status(201).send("Tarea creada correctamente");
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