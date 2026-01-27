import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Movimiento } from '../movimiento';
import { Reserva } from 'src/app/reserva/reserva';
import { ReservaService } from 'src/app/reserva/reserva.service';
import { EnumsService } from 'src/app/enums.service';
import { TipoMovimiento } from 'src/app/enums';
import { MovimientoService } from '../movimiento.service';
import { EncabezadoComponent } from '../../encabezado-app/encabezado/encabezado.component';

@Component({
  selector: 'app-movimiento-crear',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EncabezadoComponent],
  templateUrl: './movimiento-crear.component.html',
  styleUrls: ['./movimiento-crear.component.css']
})
export class MovimientoCrearComponent implements OnInit {

  movimientoForm: FormGroup;
  idPropiedad: number;
  listaReservas: Array<Reserva>;
  tiposMovimiento: Array<TipoMovimiento>;

  constructor(
    private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private routerPath: Router,
    private toastr: ToastrService,
    private enumService: EnumsService,
    private movimientoService: MovimientoService,
    private reservaService: ReservaService
  ) {
    this.movimientoForm = this.formBuilder.group({
      fecha: ["", Validators.required],
      concepto: ["", Validators.required],
      valor: ["", Validators.required],
      id_reserva: [null, []],
      tipo_movimiento: [null, Validators.required]
    });
   }

  ngOnInit() {
    this.idPropiedad = parseInt(this.router.snapshot.params['id']);

    this.reservaService.obtenerReservas(this.idPropiedad).subscribe((reservas) => {
      this.listaReservas = reservas;

      this.enumService.tiposMovimiento().subscribe((tiposMovimiento) => {
        this.tiposMovimiento = tiposMovimiento;

        this.movimientoForm = this.formBuilder.group({
          fecha: ["", Validators.required],
          concepto: ["", Validators.required],
          valor: ["", Validators.required],
          id_reserva: [null, []],
          tipo_movimiento: [null, Validators.required]
        });
    });
  });
  }

  crearMovimiento(movimiento: Movimiento) {
    this.movimientoService.crearMovimiento(movimiento, this.idPropiedad).subscribe((movimiento) => {
      this.toastr.success("Confirmation", "Registro creado")
      this.movimientoForm.reset();
      this.routerPath.navigate(['/propiedades/' + this.idPropiedad + '/movimientos']);
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

  cancelarCrearMovimiento() {
    this.routerPath.navigate(['/propiedades/' + this.idPropiedad + '/movimientos']);
  }

}
