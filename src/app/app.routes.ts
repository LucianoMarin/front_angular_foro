import { Routes } from '@angular/router';
import { ForoComponent } from './components/foro/foro';
import { LoginComponent } from './components/login/login';
import { RegistroComponent } from './components/registro/registro';
import { RecuperarComponent } from './components/recuperar/recuperar';
import { PerfilComponent } from './components/perfil/perfil';
import { AdminComponent } from './components/admin/admin';

export const routes: Routes = [
  { path: '', redirectTo: 'foro', pathMatch: 'full' },
  { path: 'foro', component: ForoComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'recuperar', component: RecuperarComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: 'foro' }
];
