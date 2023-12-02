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

//Validate nombre (que no este vacio y que tenga sentido)
trabajadorSchema.path("nombre").validate(function (nombre:string) {
    return nombre.length > 0 && nombre.length < 100;
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
        if(tareas.length > 10){
            throw new mongoose.Error.ValidationError(new mongoose.Error('El trabajador no puede tener mas de 10 tareas'));
        }
    }
    return true;
})

//Middleware hook para fire, cuando el trabajador no tiene empresa, se borran todas sus tareas
trabajadorSchema.post("findOneAndUpdate", async function (trabajadorPrev: TrabajadorModelType) { //trabajadorPrev es el trabajador antes de actualizar
    const trabajadorAct = await TrabajadorModel.findById(trabajadorPrev._id).exec(); //trabajadorAct es el trabajador actualizado
    if (trabajadorAct && !trabajadorAct.empresa) {
        //actualizamos la empresa que tenga el trabajador
        await EmpresaModel.updateOne(
            { trabajadores: trabajadorAct._id },
            { $pull: { trabajadores: trabajadorAct._id } }
        );
        await TareaModel.deleteMany({ trabajador: trabajadorAct._id });
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