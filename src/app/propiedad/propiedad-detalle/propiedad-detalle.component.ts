import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { PropiedadService } from '../propiedad.service';
import { ReservaService } from '../../reserva/reserva.service';
import { ZonaService } from '../../zona/zona.service';
import { ElementoZonaService } from '../../elemento-zona/elemento-zona.service';
import { Propiedad } from '../propiedad';
import { Reserva } from '../../reserva/reserva';
import { EncabezadoComponent } from '../../encabezado-app/encabezado/encabezado.component';

export interface ElementoDetalle {
  id: number;
  nombre_elemento: string;
  descripcion?: string;
  cantidad: number;
  fecha_registro?: string;
}

export interface ZonaDetalle {
  id: number;
  nombre_zona: string;
  descripcion?: string;
  elementos: ElementoDetalle[];
}

@Component({
  selector: 'app-propiedad-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule, EncabezadoComponent],
  templateUrl: './propiedad-detalle.component.html',
  styleUrls: ['./propiedad-detalle.component.css']
})
export class PropiedadDetalleComponent implements OnInit {
  propiedad!: Propiedad;
  reservas: Reserva[] = [];
  zonas: ZonaDetalle[] = [];
  propiedadId!: number;
  cargando = true;
  error = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly propiedadService: PropiedadService,
    private readonly reservaService: ReservaService,
    private readonly zonaService: ZonaService,
    private readonly elementoZonaService: ElementoZonaService
  ) {}

  ngOnInit(): void {
    this.propiedadId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarPropiedad();
    this.cargarReservas();
    this.cargarZonas();
  }

  cargarPropiedad(): void {
    this.propiedadService.darPropiedad(this.propiedadId).subscribe({
      next: (propiedad) => {
        this.propiedad = propiedad;
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudo cargar la información de la propiedad.';
        this.cargando = false;
      }
    });
  }

  cargarReservas(): void {
    this.reservaService.obtenerReservas(this.propiedadId).subscribe({
      next: (reservas) => { this.reservas = reservas; },
      error: () => { this.reservas = []; }
    });
  }

  cargarZonas(): void {
    this.zonaService.obtenerZonasPropiedad(this.propiedadId).pipe(
      switchMap((zonas: any[]) => {
        if (!zonas || zonas.length === 0) return of([]);
        return forkJoin(
          zonas.map(z =>
            this.elementoZonaService.obtenerElementosZona(z.id).pipe(
              switchMap(elementos => of({ ...z, elementos }))
            )
          )
        );
      })
    ).subscribe({
      next: (zonas: any) => { this.zonas = zonas; },
      error: () => { this.zonas = []; }
    });
  }

  formatearNombreZona(nombre: string): string {
    return nombre.replaceAll('_', ' ');
  }

  etiquetaElementos(zona: ZonaDetalle): string {
    const n = zona.elementos.length;
    return `${n} elemento${n === 1 ? '' : 's'}`;
  }
  estadoReserva(reserva: Reserva): string {
    const hoy = new Date();
    const salida = new Date(reserva.fecha_salida);
    const ingreso = new Date(reserva.fecha_ingreso);
    if (salida < hoy) {
      return 'Completada';
    } else if (ingreso <= hoy && hoy <= salida) {
      return 'En curso';
    } else {
      return 'Confirmada';
    }
  }

  claseBadgeReserva(reserva: Reserva): string {
    const estado = this.estadoReserva(reserva);
    switch (estado) {
      case 'Completada': return 'badge-completada';
      case 'En curso':   return 'badge-en-curso';
      default:           return 'badge-confirmada';
    }
  }

  volverAPropiedades(): void {
    this.router.navigate(['/propiedades']);
  }
}
