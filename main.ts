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



app.post("/business", postEmpresa); //Crea una empresa segun un nombre y un tipo de entidad

app.post("/worker", postTrabajador); //Crea un trabajador segun un nombre, email, dni y telefono



app.delete("/business/:id", deleteEmpresa); //Borra una empresa segun su id

app.delete("/worker/:id", deleteTrabajador); //Borra un trabajador segun su id





app.listen(3000, () => { console.log("Funcionando en puerto 3000") });