export interface SancionContenido {
  id: number;
  tipo: 'PUBLICACION' | 'COMENTARIO';
  referenciaId: number;
  motivo: string;
  fecha: string;
  moderador: string;
}
