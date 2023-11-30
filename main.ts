import express from "express";
import mongoose from "mongoose";

import { getEmpresa } from "./resolvers/getEmpresa.ts";
import { getEmpresas } from "./resolvers/getEmpresas.ts";
import { postEmpresa } from "./resolvers/postEmpresa.ts";
import { deleteEmpresa } from "./resolvers/deleteEmpresa.ts";

import { getTrabajador } from "./resolvers/getTrabajador.ts";
import { getTrabajadores } from "./resolvers/getTrabajadores.ts";
import { postTrabajador } from "./resolvers/postTrabajador.ts";
import { deleteTrabajador } from "./resolvers/deleteTrabajador.ts";

import { getTarea } from "./resolvers/getTarea.ts";
import { getTareas } from "./resolvers/getTareas.ts";
import { postTarea } from "./resolvers/postTarea.ts";
import { deleteTarea } from "./resolvers/deleteTarea.ts";

import { hire } from "./resolvers/hire.ts";
import { fire } from "./resolvers/fire.ts";

const MONGO_URL = Deno.env.get("MONGO_URL");

if (!MONGO_URL) {
  console.log("No mongo URL found");
  Deno.exit(1);
}

await mongoose.connect(MONGO_URL);

const app = express(); 
app.use(express.json());

app.get("/business/:id", getEmpresa); //Devuelve una empresa segun su id

app.get("/business", getEmpresas); //Devuelve todas las empresas

app.get("/worker/:id", getTrabajador); //Devuelve un trabajador segun su id

app.get("/worker", getTrabajadores); //Devuelve todos los trabajadores

app.get("/task/:id", getTarea); //Devuelve una tarea segun su id

app.get("/task", getTareas); //Devuelve todas las tareas



app.post("/business", postEmpresa); //Crea una empresa segun un nombre y un tipo de entidad

app.post("/worker", postTrabajador); //Crea un trabajador segun un nombre, email, dni y telefono

app.post("/task", postTarea); //Crea una tarea segun un nombre, estado, id de empresa e id de trabajador



app.delete("/business/:id", deleteEmpresa); //Borra una empresa segun su id

app.delete("/worker/:id", deleteTrabajador); //Borra un trabajador segun su id

app.delete("/task/:id", deleteTarea); //Borra una tarea segun su id



app.put("/business/:id/hire/:workerId", hire); //Contrata a un trabajador segun su id y el id de la empresa

app.put("/business/:id/fire/:workerId", fire); //Despide a un trabajador segun su id y el id de la empresa



app.listen(3000, () => { console.log("Funcionando en puerto 3000") });