import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Banco, TipoMovimiento } from './enums';

@Injectable({
  providedIn: 'root'
})
export class EnumsService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  bancos(): Observable<Banco[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    })
    return this.http.get<Banco[]>(`${this.apiUrl}/bancos`, { headers: headers });
  }

  tiposMovimiento(): Observable<TipoMovimiento[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    })
    return this.http.get<Banco[]>(`${this.apiUrl}/tipo-movimientos`, { headers: headers });
  }

}
