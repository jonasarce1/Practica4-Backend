import express from "express";
import mongoose from "mongoose";

import { getEmpresa } from "./resolvers/getEmpresa.ts";
import { postEmpresa } from "./resolvers/postEmpresa.ts";
import { deleteEmpresa } from "./resolvers/deleteEmpresa.ts";

const MONGO_URL = Deno.env.get("MONGO_URL");

if (!MONGO_URL) {
  console.log("No mongo URL found");
  Deno.exit(1);
}

await mongoose.connect(MONGO_URL);

const app = express(); 
app.use(express.json());

app.get("/business/:id", getEmpresa); //Devuelve una empresa segun su id

app.post("/business", postEmpresa); //Crea una empresa segun un nombre y un tipo de entidad

app.delete("/business/:id", deleteEmpresa); //Borra una empresa segun su id




app.listen(3000, () => { console.log("Funcionando en puerto 3000") });