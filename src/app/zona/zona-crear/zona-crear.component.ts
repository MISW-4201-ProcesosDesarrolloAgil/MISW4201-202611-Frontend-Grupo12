import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EnumsService } from 'src/app/enums.service';
import { ZonaPosible } from 'src/app/enums';
import { EncabezadoComponent } from '../../encabezado-app/encabezado/encabezado.component';
import { Zona } from '../zona';
import { ZonaService } from '../zona.service';

@Component({
  selector: 'app-zona-crear',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EncabezadoComponent],
  templateUrl: './zona-crear.component.html',
  styleUrls: ['./zona-crear.component.css']
})
export class ZonaCrearComponent implements OnInit {

  zonaForm: FormGroup;
  idPropiedad: number;
  listaZonasPosibles: ZonaPosible[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private routerPath: Router,
    private router: ActivatedRoute,
    private toastr: ToastrService,
    private zonaService: ZonaService,
    private enumService: EnumsService
  ) { }

  ngOnInit() {
    this.idPropiedad = parseInt(this.router.snapshot.params['id']);
    sessionStorage.setItem('activePropiedadId', String(this.idPropiedad));

    this.zonaForm = this.formBuilder.group({
      nombre_zona: [null, Validators.required],
      descripcion: ["", []]
    });

    this.enumService.zonasPosibles().subscribe((zonasPosibles) => {
      this.listaZonasPosibles = zonasPosibles;
    });
  }

  crearZona(zona: Zona): void {
    this.zonaService.crearZonaPropiedad(zona, this.idPropiedad).subscribe(() => {
      this.toastr.success("Confirmation", "Zona creada")
      this.zonaForm.reset({
        nombre_zona: null,
        descripcion: ""
      });
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

  cancelarCrearZona(): void {
    this.zonaForm.reset();
    this.routerPath.navigate(['/propiedades']);
  }

}
