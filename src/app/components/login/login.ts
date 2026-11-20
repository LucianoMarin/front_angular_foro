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

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  ingresar(): void {
    if (this.form.invalid) return;
    const { email, password } = this.form.value;
    if (this.foroService.login(email!, password!)) {
      this.router.navigate(['/foro']);
    } else {
      this.errorLogin = true;
    }
  }
}
