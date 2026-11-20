import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ForoService } from '../../service/foro';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html'
})
export class NavbarComponent {
  foroService = inject(ForoService);
  router = inject(Router);

  salir(): void {
    this.foroService.logout();
    this.router.navigate(['/login']);
  }
}
