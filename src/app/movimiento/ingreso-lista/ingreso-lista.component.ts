import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IngresoEgresoService, IngresoEgresoResponse } from '../ingreso-egreso.service';
import { PropiedadService } from '../../propiedad/propiedad.service';
import { EncabezadoComponent } from '../../encabezado-app/encabezado/encabezado.component';

@Component({
  selector: 'app-ingreso-lista',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, EncabezadoComponent],
  templateUrl: './ingreso-lista.component.html',
  styleUrls: ['./ingreso-lista.component.css']
})
export class IngresoListaComponent implements OnInit {

  ingresos: any[] = [];
  nombrePropiedad: string = '';
  total: number = 0;
  cantidad: number = 0;
  idPropiedad: number = 0;
  mesSeleccionado: number = 0;
  anioSeleccionado: number = 0;
  cargando: boolean = false;

  constructor(
    private routerPath: Router,
    private router: ActivatedRoute,
    private toastr: ToastrService,
    private ingresoEgresoService: IngresoEgresoService,
    private propiedadService: PropiedadService
  ) {}

  ngOnInit() {
    this.idPropiedad = parseInt(this.router.snapshot.params['id']);
    sessionStorage.setItem('activePropiedadId', String(this.idPropiedad));
    this.cargarNombrePropiedad();
    this.cargarIngresos();
  }

  cargarNombrePropiedad() {
    this.propiedadService.darPropiedad(this.idPropiedad).subscribe(
      (propiedad: any) => {
        this.nombrePropiedad = propiedad.nombre_propiedad;
      },
      error => {
        this.toastr.error('No pudimos cargar la propiedad', 'Error');
      }
    );
  }

  cargarIngresos() {
    this.cargando = true;
    // Solo enviar mes y anio si están > 0 (filtro activo)
    const mes = this.mesSeleccionado > 0 ? this.mesSeleccionado : undefined;
    const anio = this.anioSeleccionado > 0 ? this.anioSeleccionado : undefined;
    
    this.ingresoEgresoService.obtenerIngresos(this.idPropiedad, mes, anio)
      .subscribe(
        (respuesta: IngresoEgresoResponse) => {
          this.ingresos = respuesta.ingresos || [];
          this.total = respuesta.total;
          this.cantidad = respuesta.cantidad;
          this.cargando = false;
        },
        error => {
          this.cargando = false;
          if (error.statusText === "UNAUTHORIZED") {
            this.toastr.error("Su sesión ha caducado, por favor vuelva a iniciar sesión.", "Error");
          } else if (error.statusText === "UNPROCESSABLE ENTITY") {
            this.toastr.error("No hemos podido identificarlo, por favor vuelva a iniciar sesión.", "Error");
          } else {
            this.toastr.error("Ha ocurrido un error. " + error.message, "Error");
          }
        }
      );
  }

  cambiarMes() {
    this.cargarIngresos();
  }

  cambiarAnio() {
    this.cargarIngresos();
  }

  volver() {
    this.routerPath.navigate(['/propiedades']);
  }

  get meses() {
    return [
      { id: 0, nombre: 'Todos los meses' },
      { id: 1, nombre: 'Enero' },
      { id: 2, nombre: 'Febrero' },
      { id: 3, nombre: 'Marzo' },
      { id: 4, nombre: 'Abril' },
      { id: 5, nombre: 'Mayo' },
      { id: 6, nombre: 'Junio' },
      { id: 7, nombre: 'Julio' },
      { id: 8, nombre: 'Agosto' },
      { id: 9, nombre: 'Septiembre' },
      { id: 10, nombre: 'Octubre' },
      { id: 11, nombre: 'Noviembre' },
      { id: 12, nombre: 'Diciembre' }
    ];
  }

  get anios() {
    const anioActual = new Date().getFullYear();
    return [
      { id: 0, nombre: 'Todos los años' },
      { id: anioActual - 2, nombre: (anioActual - 2).toString() },
      { id: anioActual - 1, nombre: (anioActual - 1).toString() },
      { id: anioActual, nombre: anioActual.toString() },
      { id: anioActual + 1, nombre: (anioActual + 1).toString() },
      { id: anioActual + 2, nombre: (anioActual + 2).toString() }
    ];
  }

  trackByFn(index: number, item: any): number {
    return item.id;
  }
}
