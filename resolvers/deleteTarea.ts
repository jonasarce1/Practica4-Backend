//@ts-ignore //Para evitar que salga rojo lo del express
import {Request, Response} from "express";
import mongoose from "mongoose";

import { TareaModel } from "../db/tarea.ts";

export const deleteTarea = async(req:Request<{id:string}>, res:Response<string | {error:unknown}>) => {
    try{
        const id = req.params.id;

        const tareaDelete = await TareaModel.findByIdAndDelete(id).exec();

        if(!tareaDelete){
            res.status(404).send("No se pudo encontrar la tarea");
            return;            
        }

        res.status(200).send("Tarea borrada correctamente");
    }catch(error){
        if(error instanceof mongoose.Error.ValidationError){ //si el error es del modelo de mongoose
            res.status(400).send(error); 
        }else{
            res.status(500).send(error.message);
        }
    }
}