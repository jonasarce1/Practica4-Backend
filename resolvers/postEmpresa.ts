//@ts-ignore //Para evitar que salga rojo lo del express
import {Request, Response} from "express";
import mongoose from "mongoose";

import { EmpresaModel, EmpresaModelType } from "../db/empresa.ts";

export const postEmpresa = async(req:Request<EmpresaModelType>, res:Response<string | {error:unknown}>) => {
    try{
        const {nombre, tipo} = req.body;

        const empresa = new EmpresaModel({nombre, tipo});

        await empresa.save();

        res.status(201).send("Empresa creada correctamente");
    }catch(error){
        if(error instanceof mongoose.Error.ValidationError){ //si el error es del modelo de mongoose
            res.status(400).send(error); //Manda todo el error de validacion
        }else{
            res.status(500).send(error.message);
        }
    }
}