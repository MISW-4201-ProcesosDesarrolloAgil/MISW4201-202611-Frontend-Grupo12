export class Zona {
  id?: number;
  nombre_zona: string;
  descripcion?: string;

  public constructor(nombre_zona: string, descripcion?: string, id?: number) {
    this.id = id;
    this.nombre_zona = nombre_zona;
    this.descripcion = descripcion;
  }
}
