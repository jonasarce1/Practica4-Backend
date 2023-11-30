import mongoose from "mongoose";
import { Tarea, Estado} from "../types.ts";
import { TrabajadorModel, TrabajadorModelType } from "./trabajador.ts";
import { EmpresaModelType } from "./empresa.ts";

const Schema = mongoose.Schema;

const tareaSchema = new Schema({
    nombre:{type: String, required: true},
    estado:{type: String, required: true, enum: Object.values(Estado)}, //enum para que solo se puedan meter los valores del enum
    empresa:{type: Schema.Types.ObjectId, required: true, ref: "Empresa"},
    trabajador:{type: Schema.Types.ObjectId, required: true, ref: "Trabajador"}
})

//Validate estado
tareaSchema.path("estado").validate(function(valor: Estado){
    //Si el estado es closed, se borra la tarea (aunque esto es en el caso de que se cree una tarea con el estado closed, que no deberia pasar)
    if(valor === Estado.Closed){
        TareaModel.findByIdAndDelete(this._id);
        return false;
    }
    return Object.values(Estado).includes(valor);
})

//Validate empresa y trabajador, si la empresa y el trabajador no coinciden, no se crea la tarea
tareaSchema.path("empresa").validate(async function (valor: EmpresaModelType) {
    const trabajador = await TrabajadorModel.findById(this.trabajador);
    if(trabajador){
        return trabajador.empresa === valor._id;
    }
    return false;
})

//Validate numero de tareas (no puede haber mas de 10 tareas)
tareaSchema.path("trabajador").validate(function (trabajador:TrabajadorModelType) {
    if(trabajador.tareas){ //Si tiene tareas el trabajador (para no dar error en caso de que no tenga tareas)
        return trabajador.tareas.length <= 10;
    }
    return true;
})

//Middleware hook estado closed (si el estado de la tarea es closed, esta se borra)
tareaSchema.post("findOneAndUpdate", async function (tarea:TareaModelType) {
    if(tarea.estado === Estado.Closed){
        await TareaModel.findByIdAndDelete(tarea._id);
    }
})

//Middleware hook si la tarea se borra, se borra de la lista de tareas asociadas a los trabajadores
tareaSchema.post("findOneAndDelete", async function (tarea:TareaModelType) {
    await TrabajadorModel.updateMany({tareas: tarea._id}, {$pull: {tareas: tarea._id}});
})

//Exports
export type TareaModelType = mongoose.Document & Omit<Tarea, "id" | "empresa" | "trabajador"> & {
    empresa: mongoose.Schema.Types.ObjectId;
    trabajador: mongoose.Schema.Types.ObjectId;
}

export const TareaModel = mongoose.model<TareaModelType>("Tarea", tareaSchema);