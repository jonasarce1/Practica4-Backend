//@ts-ignore //Para evitar que salga rojo lo del express
import {Request, Response} from "express";
import mongoose from "mongoose";

import { TareaModel, TareaModelType } from "../db/tarea.ts";

export const getTarea = async(req:Request<{id:string}>, res:Response<TareaModelType | {error:unknown}>) => {
    try{
        const id = req.params.id;

        const tarea = await TareaModel.findById(id).populate("empresa").populate("trabajador").exec(); //Populate para que se vea la empresa y el trabajador

        if(!tarea){
            res.status(404).send("No se pudo encontrar la tarea");
            return;            
        }

        res.status(200).json(tarea);
    }catch(error){
        if(error instanceof mongoose.Error.ValidationError){ //si el error es del modelo de mongoose
            res.status(400).send(error); 
        }else{
            res.status(500).send(error.message);
        }
    }
}