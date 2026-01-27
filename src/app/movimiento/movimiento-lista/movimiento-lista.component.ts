import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MovimientoService } from '../movimiento.service';
import { Movimiento } from '../movimiento';
import { EncabezadoComponent } from '../../encabezado-app/encabezado/encabezado.component';

@Component({
  selector: 'app-movimiento-lista',
  standalone: true,
  imports: [CommonModule, EncabezadoComponent],
  templateUrl: './movimiento-lista.component.html',
  styleUrls: ['./movimiento-lista.component.css']
})
export class MovimientoListaComponent implements OnInit {


  idPropiedad: number;
  ingresos: Array<Movimiento> = [];
  egresos: Array<Movimiento> = [];
  movimientos: Array<Movimiento>;

  constructor(
    private routerPath: Router,
    private router: ActivatedRoute,
    private toastr: ToastrService,
    private movimientoService: MovimientoService
  ) { }

  ngOnInit() {
    this.idPropiedad = parseInt(this.router.snapshot.params['id']);
    this.movimientoService.obtenerMovimientos(this.idPropiedad).subscribe((movimientos) => {
      this.movimientos = movimientos;

      this.ingresos = this.movimientos.filter(movimiento => movimiento.tipo_movimiento == 'INGRESO');
      this.egresos = this.movimientos.filter(movimiento => movimiento.tipo_movimiento == 'EGRESO');
    },
    error => {
      if (error.statusText === "UNAUTHORIZED") {
        this.toastr.error("Error", "Su sesión ha caducado, por favor vuelva a iniciar sesión.")
      }
      else if (error.statusText === "UNPROCESSABLE ENTITY") {
        this.toastr.error("Error", "No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
      }
      else {
        this.toastr.error("Error","Ha ocurrido un error. ");
      }
    });
  }

  crearMovimiento() {
    this.routerPath.navigate(['/propiedades/' + this.idPropiedad + '/movimientos/crear']);
  }

  editarMovimiento(idIngreso: number):void {
    this.routerPath.navigate(['propiedades/' + this.idPropiedad + '/movimientos/editar/' + idIngreso]);
  }

  borrarMovimiento(idMovimiento: number) {
    this.movimientoService.eliminarMovimiento(idMovimiento).subscribe((movimiento) => {
    this.toastr.success("Registro eliminado de la lista")
    this.ngOnInit();
    },
    error => {
      if (error.statusText === "UNAUTHORIZED") {
        this.toastr.error("Error", "Su sesión ha caducado, por favor vuelva a iniciar sesión.")
      }
      else if (error.statusText === "UNPROCESSABLE ENTITY") {
        this.toastr.error("Error", "No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
      }
      else {
        this.toastr.error("","Ha ocurrido un error. " + error.error.mensaje)
      }
    });  
  }

}
