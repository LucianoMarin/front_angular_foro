import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ForoService } from '../../service/foro';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.html'
})
export class LoginComponent {
  fb = inject(FormBuilder);
  foroService = inject(ForoService);
  router = inject(Router);
  errorLogin = false;
  mensajeError = 'Credenciales incorrectas.';

  form = this.fb.group({
    usuario: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', Validators.required]
  });

  ingresar(): void {
    if (this.form.invalid) return;
    this.errorLogin = false;

    const usuario = (this.form.value.usuario || '').trim();
    const password = this.form.value.password || '';

    // Intenta primero contra el microservicio de usuarios
    this.foroService.loginConMicroservicio(
      usuario,
      password,
      () => {
        this.router.navigate(['/foro']);
      },
      (msg) => {
        // Respaldo local si el usuario existe en memoria
        if (this.foroService.login(usuario, password)) {
          this.router.navigate(['/foro']);
        } else {
          this.mensajeError = msg || 'Credenciales incorrectas.';
          this.errorLogin = true;
        }
      }
    );
  }
}