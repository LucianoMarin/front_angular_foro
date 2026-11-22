import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/Usuario';
import { Publicacion } from '../models/Publicacion';
import { Rol } from '../models/Rol';
import { SancionContenido } from '../models/SancionContenido';
import { UsuarioService } from './usuario';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ForoService {
  private http = inject(HttpClient);
  private usuarioService = inject(UsuarioService);
  private authService = inject(AuthService);

  private foroApiUrl = environment.apiUrl;

  usuarioActual: Usuario | null = null;

  roles: Rol[] = [
    { id: 1, nombre: 'ADMIN' },
    { id: 2, nombre: 'USUARIO' }
  ];

  categorias: string[] = [
    'Desarrollo Web',
    'Ciberseguridad',
    'Videojuegos',
    'Inteligencia Artificial',
    'Comunidad y Off-Topic'
  ];

  usuarios: Usuario[] = [
    { id: 1, nombre: 'Admin Principal', email: 'admin@foro.cl', correo: 'admin@foro.cl', password: 'Admin123!', rol: this.roles[0] },
    { id: 2, nombre: 'Camila Soto', email: 'camila@foro.cl', correo: 'camila@foro.cl', password: 'User1234!', rol: this.roles[1] },
    { id: 3, nombre: 'Matias Rojas', email: 'matias@foro.cl', correo: 'matias@foro.cl', password: 'User1234!', rol: this.roles[1] }
  ];

  publicaciones: Publicacion[] = [
    {
      id: 101,
      categoria: 'Desarrollo Web',
      titulo: 'Como estructurar microservicios en Spring Boot',
      contenido: 'Busco consejos sobre arquetipos y separacion de capas en proyectos empresariales.',
      autor: 'Camila Soto',
      fecha: '2026-11-20',
      baneado: false,
      comentarios: [
        { id: 1, autor: 'Matias Rojas', contenido: 'Usa controller, service, repository y model.', fecha: '2026-11-20', baneado: false }
      ]
    },
    {
      id: 102,
      categoria: 'Videojuegos',
      titulo: 'Recomendaciones de juegos independientes',
      contenido: 'Que titulos recomiendan jugar este fin de semana.',
      autor: 'Matias Rojas',
      fecha: '2026-11-20',
      baneado: false,
      comentarios: []
    }
  ];

  sanciones: SancionContenido[] = [];

  login(email: string, password: string): boolean {
    const encontrado = this.usuarios.find(
      u => (u.email === email || u.correo === email) && u.password === password
    );
    if (encontrado) {
      this.usuarioActual = encontrado;
      return true;
    }
    return false;
  }

  loginConMicroservicio(
    identificador: string,
    clave: string,
    onSuccess?: () => void,
    onError?: (msg: string) => void
  ): void {
    this.authService.login({ username: identificador, password: clave }).subscribe({
      next: () => {
        this.usuarioService.obtenerUsuarios().subscribe({
          next: (lista) => {
            const encontrado = lista.find(u => u.usuario === identificador);
            this.usuarioActual = encontrado
              ? {
                  id: encontrado.id,
                  nombre: encontrado.usuario,
                  email: encontrado.usuario,
                  correo: encontrado.usuario,
                  rol: encontrado.rol
                }
              : {
                  nombre: identificador,
                  email: identificador,
                  correo: identificador,
                  rol: { nombre: 'ROL_NORMAL' }
                };
            onSuccess?.();
          },
          error: () => {
            this.usuarioActual = { nombre: identificador, email: identificador, correo: identificador };
            onSuccess?.();
          }
        });
      },
      error: (err) => {
        onError?.(err?.error?.error || 'Error al conectar con el microservicio de usuarios');
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.usuarioActual = null;
  }

  registrar(datos: { nombre: string; email: string; password: string }): void {
    const nuevo: Usuario = {
      id: Date.now(),
      nombre: datos.nombre,
      email: datos.email,
      correo: datos.email,
      password: datos.password,
      rol: this.roles[1]
    };
    this.usuarios.push(nuevo);
    this.usuarioActual = nuevo;

    this.usuarioService.registrar(datos).subscribe({
      next: (creado) => {
        if (creado?.id) nuevo.id = creado.id;
      },
      error: () => {}
    });
  }

  actualizarPerfil(nombre: string, password: string): void {
    if (!this.usuarioActual) return;
    this.usuarioActual.nombre = nombre;
    if (password) this.usuarioActual.password = password;

    const userId = this.usuarioActual.id;
    if (typeof userId === 'number') {
      this.usuarioService
        .actualizarUsuario(userId, {
          usuario: nombre,
          clave: password || this.usuarioActual.password || '1234',
          intento: 0,
          rol: this.usuarioActual.rol
        })
        .subscribe({
          next: () => {},
          error: () => {}
        });
    }
  }

  recuperarPassword(email: string, nuevaPassword: string): boolean {
    const user = this.usuarios.find(u => u.email === email || u.correo === email);
    if (user) {
      user.password = nuevaPassword;
      return true;
    }
    return false;
  }

  crearPublicacion(categoria: string, titulo: string, contenido: string): void {
    if (!this.usuarioActual) return;
    this.publicaciones.unshift({
      id: Date.now(),
      categoria,
      titulo,
      contenido,
      autor: this.usuarioActual.nombre,
      fecha: new Date().toISOString().split('T')[0],
      baneado: false,
      comentarios: []
    });
  }

  agregarComentario(pubId: number, contenido: string): void {
    if (!this.usuarioActual) return;
    const pub = this.publicaciones.find(p => p.id === pubId);
    if (pub) {
      pub.comentarios.push({
        id: Date.now(),
        autor: this.usuarioActual.nombre,
        contenido,
        fecha: new Date().toISOString().split('T')[0],
        baneado: false
      });
    }
  }

  sancionarPublicacion(pubId: number, motivo: string): void {
    const pub = this.publicaciones.find(p => p.id === pubId);
    if (!pub) return;
    pub.baneado = !pub.baneado;
    if (pub.baneado && this.usuarioActual) {
      this.sanciones.unshift({
        id: Date.now(),
        tipo: 'PUBLICACION',
        referenciaId: pub.id,
        motivo: motivo || 'Incumplimiento de normas',
        fecha: new Date().toISOString().split('T')[0],
        moderador: this.usuarioActual.nombre
      });
    }
  }

  sancionarComentario(pubId: number, comId: number, motivo: string): void {
    const pub = this.publicaciones.find(p => p.id === pubId);
    const com = pub?.comentarios.find(c => c.id === comId);
    if (!com) return;
    com.baneado = !com.baneado;
    if (com.baneado && this.usuarioActual) {
      this.sanciones.unshift({
        id: Date.now(),
        tipo: 'COMENTARIO',
        referenciaId: com.id,
        motivo: motivo || 'Incumplimiento de normas',
        fecha: new Date().toISOString().split('T')[0],
        moderador: this.usuarioActual.nombre
      });
    }
  }

  getPublicacionesApi(): Observable<Publicacion[]> {
    return this.http.get<Publicacion[]>(`${this.foroApiUrl}/publicaciones`);
  }

  crearPublicacionApi(pub: Partial<Publicacion>): Observable<Publicacion> {
    return this.http.post<Publicacion>(`${this.foroApiUrl}/publicaciones`, pub);
  }
}