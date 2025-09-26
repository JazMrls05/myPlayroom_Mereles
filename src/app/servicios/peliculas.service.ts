import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pelicula } from '../modelos/pelicula';

@Injectable({
  providedIn: 'root'
})
export class PeliculasService {

  dato: any;

  constructor(private http: HttpClient) {}

  getPeliculas(){
    return this.http.get<Pelicula[]>('https://ghibliapi.vercel.app/films');
  }

  setearDato(valor: any){
    this.dato = valor;
  }

  getDato(){
    return this.dato;
  }
}
