import mongoose from "mongoose";
import { Empresa, Entidad } from "../types.ts";
import { TrabajadorModel } from "./trabajador.ts";

const Schema = mongoose.Schema;

const empresaSchema = new Schema ({
    nombre: {type: String, required: true},
    tipo: {type: String, required: true, enum: Object.values(Entidad)}, //enum para que solo se puedan meter los valores del enum
    trabajadores: [{type: Schema.Types.ObjectId, required:false, ref:"Trabajador", default: null, unique:true}] //Empieza sin trabajadores, y no puede haber dos empresas con el mismo trabajador
})

//Validate del tipo de empresa
empresaSchema.path("tipo").validate(function(valor: Entidad) {
    return Object.values(Entidad).includes(valor);
})

//Validate numero de trabajadores (no puede haber mas de 10 trabajadores)
empresaSchema.path("trabajadores").validate(function (trabajadores:Array<mongoose.Schema.Types.ObjectId>) {
    if(trabajadores){
        return trabajadores.length <= 10;
    }
    return true;
})

//Middleware hook si la empresa se borra se despiden a todos los trabajadores y se les borran todas las tareas
empresaSchema.post("findOneAndDelete", async function (empresa:EmpresaModelType) {
    if(empresa && empresa.trabajadores){ //si la empresa existe y tiene trabajadores
        try {
            await TrabajadorModel.updateMany(
                { _id: { $in: empresa.trabajadores } },
                { $set: { empresa: null }, $pull: { tareas: { $exists: true } } }
            );
        } catch (error) {
            console.error("Error al actualizar trabajadores:", error);
        }
    }
})

//Exports
export type EmpresaModelType = mongoose.Document & Omit<Empresa, "id" | "trabajadores"> & {
    trabajadores: Array<mongoose.Schema.Types.ObjectId> | null;
}

export const EmpresaModel = mongoose.model<EmpresaModelType>("Empresa", empresaSchema);