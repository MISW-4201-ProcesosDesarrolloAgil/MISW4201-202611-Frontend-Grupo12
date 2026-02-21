export class ElementoZona {
  id_zona: number;
  nombre_elemento: string;
  descripcion?: string;
  cantidad: number;
  fecha_registro: string;

  public constructor(
    id_zona: number,
    nombre_elemento: string,
    descripcion: string | undefined,
    cantidad: number,
    fecha_registro: string
  ) {
    this.id_zona = id_zona;
    this.nombre_elemento = nombre_elemento;
    this.descripcion = descripcion;
    this.cantidad = cantidad;
    this.fecha_registro = fecha_registro;
  }
}
