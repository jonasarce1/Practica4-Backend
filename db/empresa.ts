import mongoose from "mongoose";
import { Empresa, Entidad } from "../types.ts";
import { TrabajadorModel } from "./trabajador.ts";

const Schema = mongoose.Schema;

const empresaSchema = new Schema ({
    nombre: {type: String, required: true},
    tipo: {type: Entidad, required: true},
    trabajadores: {type: Schema.Types.ObjectId, required:false, ref:"Trabajador"}
})

//Validate del tipo de empresa
empresaSchema.path("tipo").validate(function(valor: Entidad) {
    return Object.values(Entidad).includes(valor);
})

//Validate numero de trabajadores (no puede haber mas de 10 trabajadores)
empresaSchema.path("trabajadores").validate(function (trabajadores:Array<mongoose.Schema.Types.ObjectId>) {
    return trabajadores.length <= 10;
})

//Middleware hook si la empresa se borra se borran todos los trabajadores
empresaSchema.post("findOneAndDelete", async function (empresa:EmpresaModelType) {
    await TrabajadorModel.deleteMany({empresa: empresa._id});
})

//Exports
export type EmpresaModelType = mongoose.Document & Omit<Empresa, "id" | "trabajadores"> & {
    trabajadores: Array<mongoose.Schema.Types.ObjectId> | null;
}

export const EmpresaModel = mongoose.model<EmpresaModelType>("Empresa", empresaSchema);