import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'
import { ElementoZona } from './elemento-zona';

@Injectable({
  providedIn: 'root'
})
export class ElementoZonaService {

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  crearElementoZona(elementoZona: ElementoZona, id_propiedad: number): Observable<ElementoZona> {
    const payload = {
      nombre_elemento: elementoZona.nombre_elemento,
      descripcion: elementoZona.descripcion,
      cantidad: Number(elementoZona.cantidad),
      fecha_registro: this.normalizarFechaRegistro(elementoZona.fecha_registro)
    };

    return this.http.post<ElementoZona>(
      `${this.apiUrl}/zonas/${elementoZona.id_zona}/elementos`,
      payload
    )
  }

  private normalizarFechaRegistro(fechaRegistro: string): string {
    const fecha = new Date(fechaRegistro);
    return Number.isNaN(fecha.getTime()) ? fechaRegistro : fecha.toISOString();
  }
}
