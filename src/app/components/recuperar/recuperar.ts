import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ForoService } from '../../service/foro';
import { passwordSeguraValidator } from '../../validators/password.validator';

@Component({
  selector: 'app-recuperar',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './recuperar.html'
})
export class RecuperarComponent {
  fb = inject(FormBuilder);
  foroService = inject(ForoService);
  mensaje = '';

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    nuevaPassword: ['', [Validators.required, passwordSeguraValidator]]
  });

  cambiar(): void {
    if (this.form.invalid) return;
    const { email, nuevaPassword } = this.form.value;
    const ok = this.foroService.recuperarPassword(email!, nuevaPassword!);
    this.mensaje = ok ? 'Contrasena actualizada. Ya puedes iniciar sesion.' : 'Correo no encontrado.';
  }
}
