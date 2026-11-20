import { Comentario } from './Comentario';

export interface Publicacion {
  id: number;
  categoria: string;
  titulo: string;
  contenido: string;
  autor: string;
  fecha: string;
  baneado: boolean;
  comentarios: Comentario[];
}
