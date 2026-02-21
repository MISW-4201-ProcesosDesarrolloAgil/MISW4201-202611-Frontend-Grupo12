import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { EncabezadoAppModule } from '../encabezado-app/encabezado-app.module';
import { ZonaCrearComponent } from './zona-crear/zona-crear.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EncabezadoAppModule,
    ZonaCrearComponent
  ],
  exports: [
    ZonaCrearComponent
  ]
})
export class ZonaModule { }
