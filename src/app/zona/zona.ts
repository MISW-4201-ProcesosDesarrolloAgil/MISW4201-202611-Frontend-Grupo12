export class Zona {
  nombre_zona: string;
  descripcion?: string;

  public constructor(nombre_zona: string, descripcion?: string) {
    this.nombre_zona = nombre_zona;
    this.descripcion = descripcion;
  }
}
