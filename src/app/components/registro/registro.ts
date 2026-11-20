import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ForoService } from '../../service/foro';
import { passwordSeguraValidator } from '../../validators/password.validator';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './registro.html'
})
export class RegistroComponent {
  fb = inject(FormBuilder);
  foroService = inject(ForoService);
  router = inject(Router);

  form = this.fb.group({
    usuario: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, passwordSeguraValidator]]
  });

  registrar(): void {
    if (this.form.invalid) return;
    const usuario = (this.form.value.usuario || '').trim();
    const password = this.form.value.password || '';

    this.foroService.registrar({
      nombre: usuario,
      email: usuario,
      password
    });

    this.router.navigate(['/foro']);
  }
}