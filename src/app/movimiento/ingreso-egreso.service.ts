import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

export interface IngresoEgresoResponse {
  ingresos?: any[];
  egresos?: any[];
  total: number;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  obtenerIngresos(idPropiedad: number, mes?: number, anio?: number): Observable<IngresoEgresoResponse> {
    let url = `${this.apiUrl}/propiedades/${idPropiedad}/ingresos`;
    const params = new URLSearchParams();
    
    if (mes !== undefined && mes !== null) {
      params.append('mes', String(mes));
    }
    if (anio !== undefined && anio !== null) {
      params.append('anio', String(anio));
    }
    
    const queryString = params.toString();
    if (queryString) {
      url = `${url}?${queryString}`;
    }
    
    return this.http.get<IngresoEgresoResponse>(url);
  }

  obtenerEgresos(idPropiedad: number, mes?: number, anio?: number): Observable<IngresoEgresoResponse> {
    let url = `${this.apiUrl}/propiedades/${idPropiedad}/egresos`;
    const params = new URLSearchParams();
    
    if (mes !== undefined && mes !== null) {
      params.append('mes', String(mes));
    }
    if (anio !== undefined && anio !== null) {
      params.append('anio', String(anio));
    }
    
    const queryString = params.toString();
    if (queryString) {
      url = `${url}?${queryString}`;
    }
    
    return this.http.get<IngresoEgresoResponse>(url);
  }
}
