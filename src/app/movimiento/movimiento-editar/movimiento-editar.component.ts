import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MovimientoService } from '../movimiento.service';
import { Movimiento } from '../movimiento';
import { Reserva } from 'src/app/reserva/reserva';
import { ReservaService } from 'src/app/reserva/reserva.service';
import { EncabezadoComponent } from '../../encabezado-app/encabezado/encabezado.component';

@Component({
  selector: 'app-movimiento-editar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EncabezadoComponent],
  templateUrl: './movimiento-editar.component.html',
  styleUrls: ['./movimiento-editar.component.css']
})
export class MovimientoEditarComponent implements OnInit {

  movimiento: Movimiento;
  listaReservas: Array<Reserva>;
  movimientoForm: FormGroup;
  reservaSeleccionada: number;

  constructor(
    private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private routerPath: Router,
    private toastr: ToastrService,
    private movimientoService: MovimientoService,
    private reservaService: ReservaService
  ) {
    this.movimientoForm = this.formBuilder.group({
      fecha: ["", Validators.required],
      concepto: ["", Validators.required],
      valor: ["", []],
      id_reserva: ["", []]
    });
   }

  ngOnInit() {
    const idMovimiento = parseInt(this.router.snapshot.params['id_movimiento']);
    this.movimientoService.obtenerMovimiento(idMovimiento).subscribe((movimiento) => {
      this.movimiento = movimiento;
      this.reservaSeleccionada = this.movimiento.id_reserva;

      this.reservaService.obtenerReservas(this.movimiento.id_propiedad).subscribe((reservas) => {
        this.listaReservas = reservas;
        this.movimientoForm = this.formBuilder.group({
          fecha: [this.movimiento.fecha, Validators.required],
          concepto: [this.movimiento.concepto, Validators.required],
          valor: [this.movimiento.valor, []],
          id_reserva: [this.reservaSeleccionada, []]
        });
      });
    },
    error => {
      if (error.statusText === "UNAUTHORIZED") {
        this.toastr.error("Error","Su sesión ha caducado, por favor vuelva a iniciar sesión.")
      }
      else if (error.statusText === "UNPROCESSABLE ENTITY") {
        this.toastr.error("Error","No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
      }
      else {
        this.toastr.error("Error","Ha ocurrido un error. " + error.message)
      }
    });
    
  }

  editarMovimiento(movimiento: Movimiento) {
    this.movimientoService.actualizarMovimiento(movimiento, this.movimiento.id).subscribe((movimiento) => {
      this.toastr.success("Confirmation", "Registro editado")
      this.movimientoForm.reset();
      this.routerPath.navigate(['/propiedades/' + movimiento.id_propiedad + '/movimientos']);
    },
    error => {
      if (error.statusText === "UNAUTHORIZED") {
        this.toastr.error("Error","Su sesión ha caducado, por favor vuelva a iniciar sesión.")
      }
      else if (error.statusText === "UNPROCESSABLE ENTITY") {
        this.toastr.error("Error","No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
      }
      else {
        this.toastr.error("Ha ocurrido un error. " + error.error.mensaje)
      }
    });
  }

  cancelarEditarMovimiento() {
    this.routerPath.navigate(['/propiedades/' + this.movimiento.id_propiedad + '/movimientos']);
  }

}
