import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'
import { Zona } from './zona';

@Injectable({
  providedIn: 'root'
})
export class ZonaService {

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  crearZonaPropiedad(zona: Zona, id_propiedad: number): Observable<Zona> {
    return this.http.post<Zona>(`${this.apiUrl}/propiedades/${id_propiedad}/zonas`, zona)
  }

}
