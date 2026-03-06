export class IngresoEgreso {
  id: number;
  fecha: Date;
  concepto: string;
  valor: number;
  tipo_movimiento: 'INGRESO' | 'EGRESO';
  id_propiedad: number;
  id_reserva?: number;

  constructor(
    id: number,
    fecha: Date,
    concepto: string,
    valor: number,
    tipo_movimiento: 'INGRESO' | 'EGRESO',
    id_propiedad: number,
    id_reserva?: number
  ) {
    this.id = id;
    this.fecha = fecha;
    this.concepto = concepto;
    this.valor = valor;
    this.tipo_movimiento = tipo_movimiento;
    this.id_propiedad = id_propiedad;
    this.id_reserva = id_reserva;
  }
}
