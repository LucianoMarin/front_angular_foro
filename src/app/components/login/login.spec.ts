import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h2>Login</h2>
    <input [(ngModel)]="usuario" placeholder="Usuario" />
    <input [(ngModel)]="clave" type="password" placeholder="Contraseña" />
    <button (click)="onLogin()">Entrar</button>
  `
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  usuario = '';
  clave = '';

  onLogin(): void {
    const credentials = {
      username: this.usuario,
      password: this.clave
    };

    this.authService.login(credentials).subscribe({
      next: () => {
        this.router.navigate(['/entidades']);
      },
      error: () => {
        alert('Credenciales inválidas');
      }
    });
  }
}