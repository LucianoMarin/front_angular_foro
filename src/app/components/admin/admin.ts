import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ForoService } from '../../service/foro';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin.html'
})
export class AdminComponent {
  foroService = inject(ForoService);
  motivoSancion: { [id: number]: string } = {};

  banearPublicacion(pubId: number): void {
    this.foroService.sancionarPublicacion(pubId, this.motivoSancion[pubId] || 'Incumplimiento de normas');
    this.motivoSancion[pubId] = '';
  }

  banearComentario(pubId: number, comId: number): void {
    this.foroService.sancionarComentario(pubId, comId, this.motivoSancion[comId] || 'Comentario inapropiado');
    this.motivoSancion[comId] = '';
  }
}
