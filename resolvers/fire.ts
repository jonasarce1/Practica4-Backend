//@ts-ignore //Para evitar que salga rojo lo del express
import {Request, Response} from "express";
import mongoose from "mongoose";

import { EmpresaModel, EmpresaModelType } from "../db/empresa.ts";
import { TrabajadorModel } from "../db/trabajador.ts";

export const fire = async(req:Request<{id:string, workerId:string}>, res:Response<EmpresaModelType | {error : unknown}>) => {
    try{
        const id = req.params.id;
        const workerId = req.params.workerId;

        const empresa = await EmpresaModel.findById(id).exec();

        if(!empresa){
            res.status(404).send("No se pudo encontrar la empresa");
            return;
        }

        const trabajador = await TrabajadorModel.findById(workerId).exec();

        if(!trabajador){
            res.status(404).send("No se pudo encontrar el trabajador");
            return;
        }

        //Las comprobaciones se hacen en el modelo

        await TrabajadorModel.findOneAndUpdate({_id:workerId}, {empresa:null}).exec(); //Actualizamos el trabajador

        res.status(200).send("Trabajador despedido correctamente");
    }catch(error){
        if(error instanceof mongoose.Error.ValidationError){ //si el error es del modelo de mongoose
            res.status(400).send(error); 
        }else{
            res.status(500).send(error.message);
        }
    }
}