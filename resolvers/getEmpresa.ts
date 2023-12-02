//@ts-ignore //Para evitar que salga rojo lo del express
import {Request, Response} from "express";
import mongoose from "mongoose";

import { EmpresaModel, EmpresaModelType } from "../db/empresa.ts";

export const getEmpresa = async(req:Request<{id:string}>, res:Response<EmpresaModelType | {error : unknown}>) => {
    try{
        const id = req.params.id;

        const empresa = await EmpresaModel.findById(id)
        .populate({path: "trabajadores", select: "nombre email dni telefono"}) //Populate para que se vean los trabajadores
        .exec(); 
        
        if(!empresa){
            res.status(404).send("No se pudo encontrar la empresa");
            return;
        }

        res.status(200).send(empresa); 
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