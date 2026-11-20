import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ForoService } from '../../service/foro';
import { passwordSeguraValidator } from '../../validators/password.validator';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './perfil.component.html'
})
export class PerfilComponent implements OnInit {
  fb = inject(FormBuilder);
  foroService = inject(ForoService);
  router = inject(Router);
  guardado = false;

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [passwordSeguraValidator]]
  });

  ngOnInit(): void {
    if (!this.foroService.usuarioActual) {
      this.router.navigate(['/login']);
      return;
    }
    this.form.patchValue({ nombre: this.foroService.usuarioActual.nombre });
  }

  guardar(): void {
    if (this.form.invalid) return;
    this.foroService.actualizarPerfil(this.form.value.nombre!, this.form.value.password || '');
    this.guardado = true;
  }
}
