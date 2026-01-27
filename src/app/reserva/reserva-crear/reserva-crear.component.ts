import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Reserva } from '../reserva';
import { ReservaService } from '../reserva.service';
import { EncabezadoComponent } from '../../encabezado-app/encabezado/encabezado.component';

@Component({
  selector: 'app-reserva-crear',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EncabezadoComponent],
  templateUrl: './reserva-crear.component.html',
  styleUrls: ['./reserva-crear.component.css']
})
export class ReservaCrearComponent implements OnInit {

  reservaForm: FormGroup;
  idPropiedad: number;

  constructor(
    private formBuilder: FormBuilder,
    private routerPath: Router,
    private router: ActivatedRoute,
    private toastr: ToastrService,
    private reservaService: ReservaService
  ) { }

  ngOnInit() {
    this.idPropiedad = parseInt(this.router.snapshot.params['id']);
    this.reservaForm = this.formBuilder.group({
      nombre: ["", [Validators.required, Validators.minLength(2)]],
      fecha_ingreso: ["", [Validators.required, Validators.minLength(2)]],
      fecha_salida: ["", [Validators.required, Validators.minLength(2)]],
      comision: ["", Validators.required],
      total_reserva: ["", Validators.required],
      plataforma_reserva: ["", [Validators.required, Validators.minLength(2)]],
      numero_personas: [],
      observaciones: []
      });
  }

  crearReserva(reserva: Reserva): void {
    this.reservaService.crearReserva(reserva, this.idPropiedad).subscribe((reserva) => {
      this.toastr.success("Confirmation", "Registro creado")
      this.reservaForm.reset();
      this.routerPath.navigate(['/propiedades/' + this.idPropiedad + '/reservas']);
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
    })

  }

  cancelarCrearReserva(): void {
    this.reservaForm.reset();
    this.routerPath.navigate(['/propiedades/' + this.idPropiedad + '/reservas']);
  }

}
