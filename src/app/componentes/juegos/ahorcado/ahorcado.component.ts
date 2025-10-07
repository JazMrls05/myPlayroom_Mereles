import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../servicios/supabase.service';

@Component({
  selector: 'app-ahorcado',
  imports: [ MatCardModule, CommonModule,MatButtonModule ],
  templateUrl: './ahorcado.component.html',
  styleUrl: './ahorcado.component.scss'
})
export class AhorcadoComponent implements OnInit{

  palabrasDisponibles: string[] = ['JUGUEMOS','ANGULAR', 'MODULOS','PROGRAMACION','PROMOCION',
    'COMPONENTES','ANIMACIONES','LABORATORIO','TERMINAL','TYPESCRIPT','EPICO','ASOMBROSO','PALABRAS',
    'APLICACION','CODIGO','SIMULADOR', 'PAGINA', 'SOFTWARE', 'COMPUTADORA'];
  letrasAdivinadas: string[] = [];
  letrasErradas: string[] = [];
  letrasDisponibles: string[] = [];
  palabraOculta:string = '';
  maxIntentos = 6;
  puntaje: number = 0;
  mejorPuntaje: number = 0;

  constructor(private router: Router, private supabase: SupabaseService){}

  ngOnInit(): void {
    this.letrasDisponibles = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
    this.palabraOculta = this.obtenerPalabraRandom(); 
  }

async seleccionarLetra(letra: string) {
  if (this.letrasAdivinadas.includes(letra) || this.letrasErradas.includes(letra)) return;

  if (this.palabraOculta.includes(letra)) {
    this.letrasAdivinadas.push(letra);

    if (this.juegoGanado()) {
      this.puntaje += 10;

      await this.supabase.guardarPuntaje('Ahorcado', 10);

      if (this.puntaje > this.mejorPuntaje) {
        this.mejorPuntaje = this.puntaje;
      }

      this.reiniciarJuego();
    }

  } else {
    this.letrasErradas.push(letra);

    if (this.juegoPerdido()) {
      
      await this.supabase.guardarPuntaje('Ahorcado', this.puntaje);

      this.puntaje = 0;
      this.reiniciarJuego();
    }
  }
}

  obtenerPalabraRandom(): string {
    const index = Math.floor(Math.random() * this.palabrasDisponibles.length);
    return this.palabrasDisponibles[index];
  }

  letraMostrada(letra: string): string {
    return this.letrasAdivinadas.includes(letra) ? letra : '_';
  }

  juegoPerdido(): boolean {
    return this.letrasErradas.length >= this.maxIntentos;
  }

  juegoGanado(): boolean {
    return this.palabraOculta.split('').every(l => this.letrasAdivinadas.includes(l));
  }

  reiniciarJuego() {
    this.letrasAdivinadas = [];
    this.letrasErradas = [];
    this.letrasDisponibles = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
    this.palabraOculta = this.obtenerPalabraRandom();

  }

  salirDelJuego() {
      this.router.navigate(['/home']);
  }
}
