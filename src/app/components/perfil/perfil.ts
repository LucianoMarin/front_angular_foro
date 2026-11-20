import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ForoService } from '../../service/foro';

function passwordSeguraValidator(control: AbstractControl): ValidationErrors | null {
  const valor: string = control.value || '';
  if (!valor) return null;

  const errores: ValidationErrors = {};
  if (valor.length < 8) errores['minLongitud'] = true;
  if (valor.length > 20) errores['maxLongitud'] = true;
  if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(valor)) errores['letrasYNumeros'] = true;
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(valor)) errores['caracterEspecial'] = true;

  return Object.keys(errores).length > 0 ? errores : null;
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './perfil.html'
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
