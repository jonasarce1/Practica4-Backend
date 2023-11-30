//@ts-ignore //Para evitar que salga rojo lo del express
import {Request, Response} from "express";
import mongoose from "mongoose";

import { TrabajadorModel, TrabajadorModelType } from "../db/trabajador.ts";

export const getTrabajadores = async(_req:Request, res:Response<Array<TrabajadorModelType> | {error : unknown}>) => {
    try{
        const trabajadores = await TrabajadorModel.find({}).exec();
        
        res.status(200).send(trabajadores);
    }catch(error){
        if(error instanceof mongoose.Error.ValidationError){ //si el error es del modelo de mongoose
            res.status(400).send(error); 
        }else{
            res.status(500).send(error.message);
        } 
    }
}