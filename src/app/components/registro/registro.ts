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
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, passwordSeguraValidator]]
  });

  registrar(): void {
    if (this.form.invalid) return;
    this.foroService.registrar(this.form.value as { nombre: string; email: string; password: string });
    this.router.navigate(['/foro']);
  }
}
