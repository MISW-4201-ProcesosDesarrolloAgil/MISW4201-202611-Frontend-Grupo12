import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Usuario } from './usuario';

import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  login(usuario: string, contrasena: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { "usuario": usuario, "contrasena": contrasena });
  }

  registro(usuario: string, contrasena: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signin`, { "usuario": usuario, "contrasena": contrasena })  }

}
