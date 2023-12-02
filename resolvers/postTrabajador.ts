//@ts-ignore //Para evitar que salga rojo lo del express
import {Request, Response} from "express";
import mongoose from "mongoose";

import { TrabajadorModel, TrabajadorModelType } from "../db/trabajador.ts";

export const postTrabajador = async(req:Request<TrabajadorModelType>, res:Response<string | {error:unknown}>) => {
    try{
        const {nombre, email, dni, telefono} = req.body;

        const trabajador = new TrabajadorModel({nombre, email, dni, telefono});

        await trabajador.save();

        res.status(201).send("Trabajador creado correctamente");
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