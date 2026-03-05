import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EncabezadoAppModule } from '../encabezado-app/encabezado-app.module';
import { PropiedadListaComponent } from './propiedad-lista/propiedad-lista.component';
import { PropiedadCrearComponent } from './propiedad-crear/propiedad-crear.component';
import { PropiedadEditarComponent } from './propiedad-editar/propiedad-editar.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    EncabezadoAppModule,
    PropiedadListaComponent,
    PropiedadCrearComponent,
    PropiedadEditarComponent
  ],
  exports: [
    PropiedadListaComponent,
    PropiedadCrearComponent,
    PropiedadEditarComponent
  ]
})
export class PropiedadModule { }
