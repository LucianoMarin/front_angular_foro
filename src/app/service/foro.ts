import { Injectable } from '@angular/core';
import { Usuario } from '../models/Usuario';
import { Publicacion } from '../models/Publicacion';
import { Rol } from '../models/Rol';
import { SancionContenido } from '../models/SancionContenido';

@Injectable({ providedIn: 'root' })
export class ForoService {
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
    { id: 1, nombre: 'Admin Principal', email: 'admin@foro.cl', password: 'Admin123!', rol: this.roles[0] },
    { id: 2, nombre: 'Camila Soto', email: 'camila@foro.cl', password: 'User1234!', rol: this.roles[1] },
    { id: 3, nombre: 'Matias Rojas', email: 'matias@foro.cl', password: 'User1234!', rol: this.roles[1] }
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
    const encontrado = this.usuarios.find(u => u.email === email && u.password === password);
    if (encontrado) {
      this.usuarioActual = encontrado;
      return true;
    }
    return false;
  }

  logout(): void {
    this.usuarioActual = null;
  }

  registrar(datos: { nombre: string; email: string; password: string }): void {
    const nuevo: Usuario = {
      id: Date.now(),
      nombre: datos.nombre,
      email: datos.email,
      password: datos.password,
      rol: this.roles[1]
    };
    this.usuarios.push(nuevo);
    this.usuarioActual = nuevo;
  }

  actualizarPerfil(nombre: string, password: string): void {
    if (!this.usuarioActual) return;
    this.usuarioActual.nombre = nombre;
    if (password) this.usuarioActual.password = password;
  }

  recuperarPassword(email: string, nuevaPassword: string): boolean {
    const user = this.usuarios.find(u => u.email === email);
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
}
