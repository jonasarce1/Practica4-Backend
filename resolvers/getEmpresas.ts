//@ts-ignore //Para evitar que salga rojo lo del express
import {Request, Response} from "express";
import mongoose from "mongoose";

import { EmpresaModel, EmpresaModelType } from "../db/empresa.ts";

export const getEmpresas = async(_req:Request, res:Response<Array<EmpresaModelType> | {error : unknown}>) => {
    try{
        const empresas = await EmpresaModel.find({})
        .populate({path: "trabajadores", select: "nombre email dni telefono"}) //Populate para que se vean los trabajadores
        .exec(); 
        
        res.status(200).send(empresas);
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