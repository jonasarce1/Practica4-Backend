//@ts-ignore //Para evitar que salga rojo lo del express
import {Request, Response} from "express";
import mongoose from "mongoose";

import { EmpresaModel, EmpresaModelType } from "../db/empresa.ts";

export const deleteEmpresa = async(req:Request<{id:string}>, res:Response<string | {error:unknown}>) => {
    try{
        const id = req.params.id;

        const empresaDelete = await EmpresaModel.findByIdAndDelete(id).exec();

        if(!empresaDelete){
            res.status(404).send("No se pudo encontrar la empresa");
            return;            
        }

        res.status(200).send("Empresa borrada correctamente");
    }catch(error){
        if(error instanceof mongoose.Error.ValidationError){ //si el error es del modelo de mongoose
            res.status(400).send(error); //No se si se puede mandar el error.message
        }else{
            res.status(500).send(error.message);
        }
    }
}