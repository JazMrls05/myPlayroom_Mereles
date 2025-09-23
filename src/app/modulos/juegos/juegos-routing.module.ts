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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JuegosRoutingModule { }
