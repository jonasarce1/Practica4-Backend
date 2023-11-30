export enum Estado {
    ToDo,
    InProgress,
    InTest,
    Closed
}

export enum Entidad {
    SA,
    SL,
    SLL,
    SLU,
    SC
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