//@ts-ignore //Para evitar que salga rojo lo del express
import {Request, Response} from "express";
import mongoose from "mongoose";

import { TrabajadorModel, TrabajadorModelType } from "../db/trabajador.ts";

export const getTrabajador = async(req:Request<{id:string}>, res:Response<TrabajadorModelType | {error : unknown}>) => {
    try{
        const id = req.params.id;

        const trabajador = await TrabajadorModel.findById(id).populate("empresa").populate("tareas").exec(); //Populate para que se vea la empresa y las tareas

        if(!trabajador){
            res.status(404).send("No se pudo encontrar el trabajador");
            return;
        }

        res.status(200).send(trabajador); 
    }catch(error){
        if(error instanceof mongoose.Error.ValidationError){ //si el error es del modelo de mongoose
            res.status(400).send(error); 
        }else{
            res.status(500).send(error.message);
        }
    }
}