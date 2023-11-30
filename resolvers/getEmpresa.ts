//@ts-ignore //Para evitar que salga rojo lo del express
import {Request, Response} from "express";
import mongoose from "mongoose";

import { EmpresaModel, EmpresaModelType } from "../db/empresa.ts";

export const getEmpresa = async(req:Request<{id:string}>, res:Response<EmpresaModelType | {error : unknown}>) => {
    try{
        const id = req.params.id;

        const empresa = await EmpresaModel.findById(id).exec();

        if(!empresa){
            res.status(404).send("No se pudo encontrar la empresa");
            return;
        }

        res.status(200).send(empresa.populate("trabajadores")); //Populate para que se vean los trabajadores
    }catch(error){
        if(error instanceof mongoose.Error.ValidationError){ //si el error es del modelo de mongoose
            res.status(400).send(error.errors.message); 
        }else{
            res.status(500).send(error.message);
        }
    }
}