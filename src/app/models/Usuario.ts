import { Rol } from './Rol';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  password: string;
  rol: Rol;
}
