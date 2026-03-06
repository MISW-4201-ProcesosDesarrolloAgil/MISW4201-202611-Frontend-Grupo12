import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { UsuarioModule } from './usuario/usuario.module';
import { PropiedadModule } from './propiedad/propiedad.module';
import { ReservaModule } from './reserva/reserva.module';
import { MovimientoModule } from './movimiento/movimiento.module';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppComponent,
    UsuarioModule,
    PropiedadModule,
    ReservaModule,
    MovimientoModule,
    ToastrModule.forRoot({
      timeOut: 7000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    BrowserAnimationsModule
  ],
  providers: []
})
export class AppModule { }
