import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { EncabezadoAppModule } from '../encabezado-app/encabezado-app.module';
import { MovimientoListaComponent } from './movimiento-lista/movimiento-lista.component';
import { MovimientoEditarComponent } from './movimiento-editar/movimiento-editar.component';
import { MovimientoCrearComponent } from './movimiento-crear/movimiento-crear.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EncabezadoAppModule
  ],
  declarations: [
    MovimientoListaComponent,
    MovimientoEditarComponent,
    MovimientoCrearComponent
  ],
  exports: [
    MovimientoListaComponent,
    MovimientoEditarComponent,
    MovimientoCrearComponent
  ]
})
export class MovimientoModule { }
