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

        //Si el trabajador esta despedido no puede ser despedido de nuevo
        if(trabajador.empresa === null){
            res.status(400).send("El trabajador ya esta despedido");
            return;
        }

        //Aqui actualizo el trabajador en vez de la empresa para evitar conflictos en el middleware hook de hire
        await TrabajadorModel.findOneAndUpdate({_id:workerId}, {$set: {empresa: null}}).exec();

        res.status(200).send("Trabajador despedido correctamente");
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