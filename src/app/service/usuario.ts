import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private http = inject(HttpClient);

  private usuarioApiUrl = 'http://localhost:8082/usuarios';
  private rolApiUrl = 'http://localhost:8082/rol';

  obtenerUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(this.usuarioApiUrl);
  }

  obtenerRoles(): Observable<any[]> {
    return this.http.get<any[]>(this.rolApiUrl);
  }

  login(usuario: string, clave: string): Observable<string> {
    return this.http.post(
      `${this.usuarioApiUrl}/login`,
      { usuario, clave },
      { responseType: 'text' }
    );
  }

  registrar(datos: { usuario?: string; nombre?: string; email?: string; password: string }): Observable<any> {
    const nombreUsuario = (datos.usuario || datos.nombre || datos.email || '').trim();
    const payload = {
      usuario: nombreUsuario,
      clave: datos.password,
      intento: 0,
      rol: { id: 2, nombre: 'ROL_NORMAL' }
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