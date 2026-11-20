import { Component, inject } from '@angular/core';
import { FormsModule, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ForoService } from '../../service/foro';

@Component({
  selector: 'app-foro',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './foro.html'
})
export class ForoComponent {
  foroService = inject(ForoService);
  fb = inject(FormBuilder);

  categoriaSeleccionada = '';
  textoBusqueda = '';
  nuevoComentario: { [pubId: number]: string } = {};

  formTema = this.fb.group({
    categoria: ['Desarrollo Web', Validators.required],
    titulo: ['', [Validators.required, Validators.minLength(5)]],
    contenido: ['', [Validators.required, Validators.minLength(10)]]
  });

  get publicacionesFiltradas() {
    return this.foroService.publicaciones.filter(p => {
      if (p.baneado) return false;
      const coincideCat = !this.categoriaSeleccionada || p.categoria === this.categoriaSeleccionada;
      const coincideTexto = p.titulo.toLowerCase().includes(this.textoBusqueda.toLowerCase()) ||
                            p.contenido.toLowerCase().includes(this.textoBusqueda.toLowerCase());
      return coincideCat && coincideTexto;
    });
  }

  publicarTema(): void {
    if (this.formTema.invalid) return;
    const { categoria, titulo, contenido } = this.formTema.value;
    this.foroService.crearPublicacion(categoria!, titulo!, contenido!);
    this.formTema.reset({ categoria: 'Desarrollo Web' });
  }

  comentar(pubId: number): void {
    const texto = (this.nuevoComentario[pubId] || '').trim();
    if (!texto) return;
    this.foroService.agregarComentario(pubId, texto);
    this.nuevoComentario[pubId] = '';
  }
}
