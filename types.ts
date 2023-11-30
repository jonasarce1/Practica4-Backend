export enum Estado {
    ToDo = "ToDo", //Ha de ser asi ya que lo que se ejecuta es js (no tipado) y mongoose no puede poner tipo Enum
    InProgress = "InProgress",
    InTest = "InTest",
    Closed = "Closed"
}

export enum Entidad {
    SA = "SA",
    SL = "SL",
    SLL = "SLL",
    SLU = "SLU",
    SC = "SC"
}

export type Empresa = {
    id: string,
    nombre: string,
    tipo: Entidad,
    trabajadores: Array<Omit<Trabajador, "empresa" | "tareas">> 
}

export type Trabajador = {
    id: string,
    nombre: string,
    email: string,
    dni: string,
    telefono: string,
    empresa: Omit<Empresa, "trabajadores">,
    tareas: Array<Omit<Tarea, "empresa" | "trabajador">>
}

export type Tarea = {
    id: string,
    nombre:string,
    estado: Estado,
    empresa: Omit<Empresa, "trabajadores">,
    trabajador: Omit<Trabajador, "tareas">
}