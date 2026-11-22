import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private http = inject(HttpClient);

  private usuarioApiUrl = `${environment.apiUrl}/usuarios`;
  private rolApiUrl = `${environment.apiUrl}/rol`;

  obtenerUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(this.usuarioApiUrl);
  }

  obtenerRoles(): Observable<any[]> {
    return this.http.get<any[]>(this.rolApiUrl);
  }

  registrar(datos: { usuario?: string; nombre?: string; email?: string; password: string }): Observable<any> {
    const nombreUsuario = (datos.usuario || datos.nombre || datos.email || '').trim();
    const payload = {
      usuario: nombreUsuario,
      clave: datos.password,
      intento: 0
    };
    return this.http.post<any>(`${this.usuarioApiUrl}/registrar`, payload);
  }

  actualizarUsuario(
    id: number,
    payload: { usuario: string; clave?: string; intento?: number; rol?: any }
  ): Observable<any> {
    return this.http.put<any>(`${this.usuarioApiUrl}/${id}`, payload);
  }

  eliminarUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.usuarioApiUrl}/${id}`);
  }
}