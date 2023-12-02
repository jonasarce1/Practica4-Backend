//@ts-ignore //Para evitar que salga rojo lo del express
import {Request, Response} from "express";
import mongoose from "mongoose";

import { EmpresaModel, EmpresaModelType } from "../db/empresa.ts";

export const postEmpresa = async(req:Request<EmpresaModelType>, res:Response<string | {error:unknown}>) => {
    try{
        const {nombre, tipo} = req.body;

        const empresa = new EmpresaModel({nombre, tipo});

        //No hace falta comprobar ya que comprobamos desde el modelo

        await empresa.save();

        res.status(201).send("Empresa creada correctamente");
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