import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../service/usuario';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class RegistroComponent {
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);

  cargando = signal(false);
  errorMensaje = signal<string | null>(null);
  exitoMensaje = signal<string | null>(null);

  form = this.fb.group({
    usuario: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(20),
      this.validarLetrasYNumeros,
      this.validarCaracterEspecial
    ]]
  });

  registrar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.errorMensaje.set(null);
    this.exitoMensaje.set(null);

    const datos = {
      usuario: this.form.value.usuario!,
      password: this.form.value.password!
    };

    this.usuarioService.registrar(datos).subscribe({
      next: () => {
        this.cargando.set(false);
        this.exitoMensaje.set('Usuario registrado con éxito. Redirigiendo al login...');
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.cargando.set(false);
        
        if (err.status === 400) {
          this.errorMensaje.set('El nombre de usuario ya existe o los datos son inválidos.');
        } else {
          this.errorMensaje.set('Ocurrió un error al conectar con el servidor.');
        }
      }
    });
  }

  private validarLetrasYNumeros(control: AbstractControl): ValidationErrors | null {
    const valor = control.value;
    if (!valor) return null;
    
    const tieneLetras = /[a-zA-Z]/.test(valor);
    const tieneNumeros = /[0-9]/.test(valor);
    
    return (tieneLetras && tieneNumeros) ? null : { letrasYNumeros: true };
  }

  private validarCaracterEspecial(control: AbstractControl): ValidationErrors | null {
    const valor = control.value;
    if (!valor) return null;
    
    const tieneEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(valor);
    
    return tieneEspecial ? null : { caracterEspecial: true };
  }
}