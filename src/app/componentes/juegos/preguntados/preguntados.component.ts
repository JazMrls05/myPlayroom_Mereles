import { Component, OnInit } from '@angular/core';
import { Pelicula } from '../../../modelos/pelicula';
import { PeliculasService } from '../../../servicios/peliculas.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-preguntados',
  imports: [MatCardModule, MatButtonModule, RouterLink,CommonModule, MatSnackBarModule],
  templateUrl: './preguntados.component.html',
  styleUrl: './preguntados.component.scss'
})
export class PreguntadosComponent implements OnInit{

  peliculasDisponibles: Pelicula[] = [];
  peliculasLista: Pelicula[] = [];
  peliculaActual!: Pelicula;
  opciones: string[] = [];
  puntaje: number = 0;
  opcionSeleccionada: string | null = null;
  esCorrecta: boolean = false;
  indiceActual = 0;
  contadorPelis = 0;

  traducciones: { [tituloOriginal: string]: string } = {
    "Spirited Away": "El viaje de Chihiro",
    "My Neighbor Totoro": "Mi vecino Totoro",
    "Princess Mononoke": "La princesa Mononoke",
    "Castle in the Sky": "El castillo en el cielo",
    "Grave of the Fireflies": "La tumba de las luciérnagas",
    "Kiki's Delivery Service": "Kiki, entregas a domicilio",
    "Only Yesterday": "Recuerdos del ayer",
    "Pom Poko": "Pompoko, la guerra de los mapaches",
    "Whisper of the Heart": "Susurros del corazón",
    "My Neighbors the Yamadas": "Mis vecinos los Yamada",
    "The Cat Returns": "El regreso del gato",
    "Howl's Moving Castle": "El increíble castillo vagabundo",
    "Tales from Earthsea": "Cuentos de terramar",
    "From Up on Poppy Hill": "La colina de las amapolas",
    "The Wind Rises": "se levanta viento",
    "The Tale of the Princess Kaguya": "El cuento de la princesas Kaguya",
    "When Marnie Was There": "El recuerdo de Marnie",
    "The Red Turtle": "la tortuga roja",
    "Earwig and the Witch": "Earwig y la bruja",
};

  constructor(private peliculaSvc: PeliculasService, private snackBar: MatSnackBar){}

  ngOnInit(): void {
    this.cargarPeliculas();
  }

  cargarPeliculas(){
    this.peliculaSvc.getPeliculas().subscribe((data: Pelicula[]) => {
      this.peliculasLista = data.filter(c => c.movie_banner);
      this.peliculasDisponibles = [...this.peliculasLista];
      this.pasarImagen();
    });
  }

  getTituloTraducido(titulo: string): string {
  return this.traducciones[titulo] || titulo; 
}

  async pasarImagen(){
    this.opcionSeleccionada = null;
    this.esCorrecta = false;

    if (this.peliculasDisponibles.length === 0) {
      Swal.fire({
              icon:'success',
              title:'¡Juego terminado!',
              text:'Tu puntaje final es: '+ this.puntaje,
              confirmButtonText:'Aceptar',
              heightAuto: false
        })
      return;
    }

    const indiceAleatorio = Math.floor(Math.random() * this.peliculasDisponibles.length);
    this.peliculaActual = this.peliculasDisponibles.splice(indiceAleatorio, 1)[0];

    const peliculasIncorrectas = this.peliculasLista
    .filter(c => c.title !== this.peliculaActual.title)
    .sort(() => 0.5 - Math.random())
    .slice(0,3);

    this.opciones = [...peliculasIncorrectas.map(c => c.title), this.peliculaActual.title]
    .sort(() => 0.5 - Math.random());
  }

  verificarRespuesta(opcion: string){
    this.opcionSeleccionada = opcion;
    this.esCorrecta = (opcion === this.peliculaActual.title);

    if(this.esCorrecta){
      this.puntaje++;
    }

    if((this.esCorrecta || !this.esCorrecta) && !(this.peliculasDisponibles.length === 0)){
      this.contadorPelis++;
    }
    setTimeout(() => this.pasarImagen(),1200);
  }
}
