import mongoose from "mongoose";
import { Trabajador } from "../types.ts";
import { TareaModel } from "./tarea.ts";
import { EmpresaModel } from "./empresa.ts";

const Schema = mongoose.Schema;

const trabajadorSchema = new Schema({
    nombre:{type: String, required:true},
    email:{type: String, required: true, unique: true},
    dni:{type: String, required: true, unique: true},
    telefono:{type: String, required: true, unique: true},
    empresa:{type: Schema.Types.ObjectId, required: false, ref: "Empresa", default: null}, //Empieza sin empresa
    tareas:[{type: Schema.Types.ObjectId, required: false, ref: "Tarea", default: null}] //Empieza sin tareas
})

//Validate email
trabajadorSchema.path("email").validate(function(valor: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor); //Expresion regular para validar el email, esto indica que el email tiene que tener un @ y un . algo
})

//Validate dni
trabajadorSchema.path("dni").validate(function(valor: string) {
    return /^[0-9]{8}[A-Z]$/.test(valor); //Expresion regular para validar el dni, ha de tener 8 digitos del 0-9 y una letra A-Z
})

//Validate telefono
trabajadorSchema.path("telefono").validate(function(valor: string) {
    return /^[0-9]{9}$/.test(valor); //Expresion regular para validar el dni, ha de tener 9 digitos
})

//Validate tareas (no puede tener mas de 10 tareas)
trabajadorSchema.path("tareas").validate(function (tareas:Array<mongoose.Schema.Types.ObjectId>) {
    if(tareas){
        return tareas.length <= 10;
    }
})

//Middleware hook para hire y fire
trabajadorSchema.post("findOneAndUpdate", async function (trabajador: TrabajadorModelType) {
    if(trabajador.empresa === null){ //Si el trabajador esta despedido
        await TareaModel.deleteMany({trabajador: trabajador._id}); //Borramos todas sus tareas
        await EmpresaModel.findOneAndUpdate({_id:trabajador.empresa}, {$pull: {trabajadores: trabajador._id}}); //Borramos al trabajador de la lista de trabajadores de la empresa
        throw new Error("ADIOS");
    }else{ //Si el trabajador esta contratado
        await EmpresaModel.findOneAndUpdate({_id:trabajador.empresa}, {$push: {trabajadores: trabajador._id}}); //Añadimos al trabajador a la lista de trabajadores de la empresa
        throw new Error("HOLA");
    }
});


//Middleware hook, si el trabajador se borra, las tareas se borran y se borra de la lista de trabajadores asociados a la empresa
trabajadorSchema.post("findOneAndDelete", async function (trabajador:TrabajadorModelType) {
    await TareaModel.deleteMany({trabajador: trabajador._id});
})

//Exports
export type TrabajadorModelType = mongoose.Document & Omit<Trabajador, "id" | "empresa" | "tareas"> & {
    empresa: mongoose.Schema.Types.ObjectId;
    tareas: Array<mongoose.Schema.Types.ObjectId>;
}

export const TrabajadorModel = mongoose.model<TrabajadorModelType>("Trabajador", trabajadorSchema);