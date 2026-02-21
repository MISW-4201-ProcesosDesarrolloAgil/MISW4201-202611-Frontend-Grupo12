import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EncabezadoComponent } from '../../encabezado-app/encabezado/encabezado.component';
import { ElementoZona } from '../elemento-zona';
import { ElementoZonaService } from '../elemento-zona.service';
import { Zona } from 'src/app/zona/zona';
import { ZonaService } from 'src/app/zona/zona.service';

@Component({
  selector: 'app-elemento-zona-crear',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EncabezadoComponent],
  templateUrl: './elemento-zona-crear.component.html',
  styleUrls: ['./elemento-zona-crear.component.css']
})
export class ElementoZonaCrearComponent implements OnInit {

  elementoZonaForm: FormGroup;
  idPropiedad: number;
  zonasPropiedad: Zona[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private routerPath: Router,
    private router: ActivatedRoute,
    private toastr: ToastrService,
    private elementoZonaService: ElementoZonaService,
    private zonaService: ZonaService
  ) { }

  ngOnInit() {
    this.idPropiedad = parseInt(this.router.snapshot.params['id']);
    sessionStorage.setItem('activePropiedadId', String(this.idPropiedad));

    this.elementoZonaForm = this.formBuilder.group({
      id_zona: [null, Validators.required],
      nombre_elemento: ["", [Validators.required, Validators.minLength(2)]],
      descripcion: ["", []],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      fecha_registro: ["", Validators.required]
    });

    this.zonaService.obtenerZonasPropiedad(this.idPropiedad).subscribe((respuestaZonas: any) => {
      const zonas = Array.isArray(respuestaZonas)
        ? respuestaZonas
        : Array.isArray(respuestaZonas?.zonas)
          ? respuestaZonas.zonas
          : Array.isArray(respuestaZonas?.data)
            ? respuestaZonas.data
            : [];

      this.zonasPropiedad = zonas.map((zona: any) => ({
        ...zona,
        id: zona.id ?? zona.id_zona ?? zona.zona_id,
        nombre_zona: zona.nombre_zona ?? zona.nombre
      }));
    },
    error => {
      this.toastr.error("Error", "No fue posible cargar las zonas de la propiedad.")
    });
  }

  crearElementoZona(elementoZona: ElementoZona): void {
    this.elementoZonaService.crearElementoZona(elementoZona, this.idPropiedad).subscribe(() => {
      this.toastr.success("Confirmation", "Elemento de zona creado")
      this.elementoZonaForm.reset();
      this.routerPath.navigate(['/propiedades']);
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

  cancelarCrearElementoZona(): void {
    this.elementoZonaForm.reset();
    this.routerPath.navigate(['/propiedades']);
  }
}
