import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'ahorcado',
    loadComponent: () => import('../../componentes/juegos/ahorcado/ahorcado.component').then(c => c.AhorcadoComponent)
  },
  {
    path: 'mayor-menor',
    loadComponent: () => import('../../componentes/juegos/mayor-menor/mayor-menor.component').then(c => c.MayorMenorComponent)
  },
  {
      path: 'preguntados',
    loadComponent: () => import('../../componentes/juegos/preguntados/preguntados.component').then(c => c.PreguntadosComponent)
  },
  {
      path: 'simon-dice',
    loadComponent: () => import('../../componentes/juegos/simon-dice/simon-dice.component').then(c => c.SimonDiceComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JuegosRoutingModule { }
