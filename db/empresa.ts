import mongoose from "mongoose";
import { Empresa, Entidad } from "../types.ts";
import { TrabajadorModel } from "./trabajador.ts";
import { TareaModel } from "./tarea.ts";

const Schema = mongoose.Schema;

const empresaSchema = new Schema ({
    nombre: {type: String, required: true, unique: true}, //No suele haber dos empresas con el mismo nombre
    tipo: {type: String, required: true, enum: Object.values(Entidad)}, //enum para que solo se puedan meter los valores del enum
    trabajadores: [{type: Schema.Types.ObjectId, required:false, ref:"Trabajador", default: null}] //Empieza sin trabajadores, y no puede haber dos empresas con el mismo trabajador
})

//Validate nombre (que no este vacio y que tenga sentido)
empresaSchema.path("nombre").validate(function (nombre:string) {
    return nombre.length > 0 && nombre.length < 100;
})

//Validate del tipo de empresa
empresaSchema.path("tipo").validate(function(valor: Entidad) {
    return Object.values(Entidad).includes(valor);
})

//Validate numero de trabajadores (no puede haber mas de 10 trabajadores)
empresaSchema.path("trabajadores").validate(function (trabajadores:Array<mongoose.Schema.Types.ObjectId>) {
    if(trabajadores){
        if(trabajadores.length > 10){
            throw new Error('La empresa no puede tener mas de 10 trabajadores');
        }
    }
    return true;
})

//Middleware hook para hire, cuando se actualizan los trabajadores de una empresa, se actualiza la empresa de los trabajadores
empresaSchema.post("findOneAndUpdate", async function (doc: EmpresaModelType) {
    const empresa = await EmpresaModel.findById(doc._id).exec(); // Accede a la empresa actualizada

    if (empresa && empresa.trabajadores && empresa.trabajadores.length < 10) {
        await TrabajadorModel.updateMany({_id:{$in: empresa.trabajadores}}, {$set:{empresa: empresa._id}});
        return;
    }

    throw new Error('La empresa no puede tener mas de 10 trabajadores');
});

//Middleware hook, si la empresa se borra se despiden a todos los trabajadores y se les borran todas las tareas
empresaSchema.post("findOneAndDelete", async function (empresa:EmpresaModelType) {
    if(empresa && empresa.trabajadores){ //si la empresa existe y tiene trabajadores
        try {
            await TrabajadorModel.updateMany({_id:{$in: empresa.trabajadores}}, {$set:{empresa: null}, $pull:{tareas: {$exists: true}}});
            await TareaModel.deleteMany({ empresa: empresa._id });
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