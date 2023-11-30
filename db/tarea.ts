import mongoose from "mongoose";
import { Tarea, Estado} from "../types.ts";
import { TrabajadorModel } from "./trabajador.ts";

const Schema = mongoose.Schema;

const tareaSchema = new Schema({
    nombre:{type: String, required: true},
    estado:{type: Estado, required: true},
    empresa:{type: Schema.Types.ObjectId, required: true, ref: "Empresa"},
    trabajador:{type: Schema.Types.ObjectId, required: true, ref: "Trabajador"}
})

//Validate estado
tareaSchema.path("estado").validate(function(valor: Estado){
    return Object.values(Estado).includes(valor);
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