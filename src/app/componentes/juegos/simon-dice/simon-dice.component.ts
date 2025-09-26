import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-simon-dice',
  imports: [CommonModule,RouterLink],
  templateUrl: './simon-dice.component.html',
  styleUrl: './simon-dice.component.scss'
})
export class SimonDiceComponent {
  botones = ['rojo', 'verde', 'azul', 'amarillo'];
  secuencia: number[] = [];
  jugadorSecuencia: number[] = [];
  resaltado: number | null = null;
  jugando = false;

  vidas = 2;
  puntaje = 0;

  empezarJuego() {
    this.secuencia = [];
    this.jugadorSecuencia = [];
    this.vidas = 2;
    this.puntaje = 0;
    this.jugando = true;
    this.agregarColor();
  }

  agregarColor() {
    const nuevoColor = Math.floor(Math.random() * 4);
    this.secuencia.push(nuevoColor);
    this.mostrarSecuencia();
  }

  async mostrarSecuencia() {
    for (let i = 0; i < this.secuencia.length; i++) {
      this.resaltado = this.secuencia[i];
      await this.delay(600);
      this.resaltado = null;
      await this.delay(200);
    }
  }

  async clickBoton(index: number) {
    if (!this.jugando) return;

    this.jugadorSecuencia.push(index);
    this.resaltado = index;
    await this.delay(300);
    this.resaltado = null;

    const ultima = this.jugadorSecuencia.length - 1;
    if (this.jugadorSecuencia[ultima] !== this.secuencia[ultima]) {
      this.vidas--;
      if (this.vidas === 0) {
        Swal.fire({
          icon: 'error',
          title: '¡Perdiste!',
          text: 'Puntaje final: '+ this.puntaje,
          heightAuto: false
        });
        this.jugando = false;
      } else {
        this.jugadorSecuencia = [];
        this.mostrarSecuencia();
      }
      return;
    }

    // Acierto
    this.puntaje++;

    if (this.jugadorSecuencia.length === this.secuencia.length) {
      this.jugadorSecuencia = [];
      await this.delay(500);
      this.agregarColor();
    }
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
