import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { CartasService } from '../../../servicios/cartas.service';

@Component({
  selector: 'app-mayor-menor',
  standalone:true,
  imports: [MatCardModule, CommonModule, MatButtonModule, RouterLink],
  templateUrl: './mayor-menor.component.html',
  styleUrl: './mayor-menor.component.scss'
})
export class MayorMenorComponent implements OnInit{

  cartaActual:any = null;
  puntaje = 0;
  mensaje = '';
  juegoTerminado = false;

  constructor(private cartasSvc: CartasService){}

  ngOnInit(): void {
    this.iniciarJuego();
  }

  iniciarJuego(){
    this.cartasSvc.nuevaBaraja().subscribe(data => {
      this.cartasSvc.setDeckId(data.deck_id);
      this.puntaje = 0;
      this.mensaje = '';
      this.juegoTerminado = false;
      this.sacarCartaInicial();
    });
  }

  sacarCartaInicial(){
    this.cartasSvc.sacarCarta().subscribe(data => {
      this.cartaActual = data.cards[0];
    });
  }

  adivinar(opcion: 'mayor' | 'menor'){
    if (this.juegoTerminado) return;

    this.cartasSvc.sacarCarta().subscribe(data => {
      const cartaNueva = data.cards[0];

      const valorActual = this.convertirValor(this.cartaActual.value);
      const valorNuevo = this.convertirValor(cartaNueva.value);

      if (valorNuevo === valorActual) {
        this.mensaje = '😮 Las cartas son iguales, no pasa nada...';
      } else if ((opcion === 'mayor' && valorNuevo > valorActual) || 
      (opcion === 'menor' && valorNuevo < valorActual)) {
        this.puntaje++;
        this.mensaje = '✅ Adivinaste!';
      } else {
        this.mensaje = `❌ Fallaste. Fin del juego. Tu puntaje final es ${this.puntaje}`;
        this.juegoTerminado = true;
      }

      this.cartaActual = cartaNueva;

      if (data.remaining === 0 && !this.juegoTerminado) {
        this.mensaje = `🏆 Ganaste! No quedan más cartas. Tu puntaje final es ${this.puntaje}`;
        this.juegoTerminado = true;
      }
    });
  }

  private convertirValor(valor: string): number{
    switch(valor){
      case 'ACE': return 1;
      case 'JACK': return 11;
      case 'QUEEN': return 12;
      case 'KING': return 13;
      default: return parseInt(valor, 10);
    }
  }


}
