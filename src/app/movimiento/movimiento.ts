export class Movimiento {
    valor: number;
    id_propiedad: number;
    id: number;
    id_reserva: number;
    fecha: Date;
    tipo_movimiento: string;
    concepto: string;

    public constructor(id: number, id_reserva: number, id_propiedad: number, valor: number, fecha: Date,
        tipo_movimiento: string, concepto: string) {
            this.id = id;
            this.id_reserva = id_reserva;
            this.id_propiedad = id_propiedad;
            this.valor = valor;
            this.fecha = fecha;
            this.tipo_movimiento = tipo_movimiento;
            this.concepto = concepto;
        }
}
