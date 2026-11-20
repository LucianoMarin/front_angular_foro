import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ForoService } from '../../service/foro';

@Component({
  selector: 'app-foro',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './foro.html'
})
export class ForoComponent implements OnInit {
  public foroService = inject(ForoService);
  private fb = inject(FormBuilder);

  categoriaSeleccionada = '';
  textoBusqueda = '';
  nuevoComentario: { [pubId: number]: string } = {};

  formTema = this.fb.group({
    categoria: ['', Validators.required],
    titulo: ['', [Validators.required, Validators.minLength(3)]],
    contenido: ['', [Validators.required, Validators.minLength(5)]]
  });

  get publicacionesFiltradas() {
    const texto = this.textoBusqueda.trim().toLowerCase();

    return this.foroService.publicaciones.filter(pub => {
      if (pub.baneado) return false;
      if (this.categoriaSeleccionada && pub.categoria !== this.categoriaSeleccionada) {
        return false;
      }
      if (texto) {
        const coincideTitulo = pub.titulo.toLowerCase().includes(texto);
        const coincideContenido = pub.contenido.toLowerCase().includes(texto);
        const coincideAutor = pub.autor.toLowerCase().includes(texto);
        return coincideTitulo || coincideContenido || coincideAutor;
      }
      return true;
    });
  }

  ngOnInit(): void {
    if (this.foroService.categorias.length > 0 && !this.formTema.value.categoria) {
      this.formTema.patchValue({ categoria: this.foroService.categorias[0] });
    }
  }

  publicarTema(): void {
    if (this.formTema.invalid) return;

    const { categoria, titulo, contenido } = this.formTema.getRawValue();
    const catFinal = categoria || this.foroService.categorias[0];

    this.foroService.crearPublicacion(catFinal, titulo!.trim(), contenido!.trim());

    this.formTema.reset({
      categoria: catFinal,
      titulo: '',
      contenido: ''
    });
  }

  comentar(pubId: number): void {
    const texto = (this.nuevoComentario[pubId] || '').trim();
    if (!texto) return;

    this.foroService.agregarComentario(pubId, texto);
    this.nuevoComentario[pubId] = '';
  }
}