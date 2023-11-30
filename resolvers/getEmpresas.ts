//@ts-ignore //Para evitar que salga rojo lo del express
import {Request, Response} from "express";
import mongoose from "mongoose";

import { EmpresaModel, EmpresaModelType } from "../db/empresa.ts";

export const getEmpresas = async(_req:Request, res:Response<Array<EmpresaModelType> | {error : unknown}>) => {
    try{
        const empresas = await EmpresaModel.find({}).populate("trabajadores").exec(); //Populate para que se vean los trabajadores
        
        res.status(200).send(empresas);
    }catch(error){
        if(error instanceof mongoose.Error.ValidationError){ //si el error es del modelo de mongoose
            res.status(400).send(error); //Asi para mandar solo el texto del error de mongoose
        }else{
            res.status(500).send(error.message);
        } 
    }
}