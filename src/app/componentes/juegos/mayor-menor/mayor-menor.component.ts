import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { Carta } from '../../../modelos/carta';

@Component({
  selector: 'app-mayor-menor',
  imports: [MatCardModule, CommonModule, MatButtonModule, RouterLink],
  templateUrl: './mayor-menor.component.html',
  styleUrl: './mayor-menor.component.scss'
})
export class MayorMenorComponent implements OnInit{

  mazo: Carta[] = [];
  cartaActual!: Carta;
  puntaje: number = 0;
  mensaje: string = '';
  juegoTerminado: boolean = false;

  ngOnInit(): void {
    this.iniciarJuego();
  }

  iniciarJuego(){
    this.mazo = this.generarMazo();
    this.mezclarMazo();
    this.cartaActual = this.mazo.pop()!;
    this.puntaje = 0;
    this.mensaje = '';
    this.juegoTerminado = false;
  }

  generarMazo(): Carta[]{
    const palos = ['♣', '♦', '♥', '♠'];
    const mazo: Carta[] = [];

    for(const palo of palos){
      for(let valor = 1; valor <= 12; valor++){
        mazo.push({valor, palo});
      }
    }
    return mazo;
  }

  mezclarMazo(){
    for (let i = this.mazo.length - 1; i > 0; i--){
      const j = Math.floor(Math.random()*(i+1));
      [this.mazo[i], this.mazo[j]] = [this.mazo[j], this.mazo[i]];
    }
  }

  async adivinar(opcion: 'mayor' | 'menor') {
    if (this.juegoTerminado || this.mazo.length === 0) return;

    const cartaNueva = this.mazo.pop()!;

    const esMayor = cartaNueva.valor > this.cartaActual.valor;
    const esMenor = cartaNueva.valor < this.cartaActual.valor;
    const esIgual = cartaNueva.valor === this.cartaActual.valor;

    
    if (esIgual) {
    this.mensaje = `😮 Las cartas son iguales, no pasa nada...`;
    this.cartaActual = cartaNueva;
    return;
    }

    if ((opcion === 'mayor' && esMayor) ||(opcion === 'menor' && esMenor)) {
      this.puntaje++;
      this.mensaje = `✅ Adivinaste!`;
    } else {
      this.mensaje = `❌ Fallaste. Fin del juego`;
      this.juegoTerminado = true;
    }

    this.cartaActual = cartaNueva;

    if(this.mazo.length === 0 && !this.juegoTerminado) {
      this.mensaje = "🏆 Ganaste! No quedan más cartas";
      this.juegoTerminado = true;
    }
  }

  getColorCarta(carta: Carta): string {
    if (carta.palo === '♦' || carta.palo === '♥') {
      return 'rojo';
    }
    return 'negro';
  }
}
