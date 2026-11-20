import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordSeguraValidator(control: AbstractControl): ValidationErrors | null {
  const valor: string = control.value || '';
  if (!valor) return null;

  const errores: ValidationErrors = {};
  if (valor.length < 8) errores['minLongitud'] = true;
  if (valor.length > 20) errores['maxLongitud'] = true;
  if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(valor)) errores['letrasYNumeros'] = true;
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(valor)) errores['caracterEspecial'] = true;

  return Object.keys(errores).length > 0 ? errores : null;
}
