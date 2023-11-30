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
    tareas:[{type: Schema.Types.ObjectId, required: false, ref: "Tarea", default: null, unique:true}] //Empieza sin tareas
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

//Middleware hook para update (hire y fire)
trabajadorSchema.post("findOneAndUpdate", async function (trabajador:TrabajadorModelType) {
    //Si el trabajador es despedido (endpoint de fire) se queda sin empresa, se quita de la lista de trabajadores de la empresa, y se borran todas sus tareas
    if(!trabajador.empresa){
        await EmpresaModel.findByIdAndUpdate(trabajador.empresa, {$pull: {trabajadores: trabajador._id}});
        await TrabajadorModel.findByIdAndUpdate(trabajador._id, {$pull: {tareas: trabajador._id}});
        await TareaModel.deleteMany({trabajador: trabajador._id});
    }
    //Si le han contratado (endpoint de hire) se anyade a la lista de trabajadores de la empresa
    if(trabajador.empresa){
        //Si la empresa ya tiene a un trbajador con ese id no se anyade
        const empresa = await EmpresaModel.findById(trabajador.empresa);
        if(empresa){
            if(empresa.trabajadores){
                if(empresa.trabajadores.includes(trabajador._id)){
                    return;
                }
            }
        }
        
        await EmpresaModel.findByIdAndUpdate(trabajador.empresa, {$push: {trabajadores: trabajador._id}});
    }
})

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