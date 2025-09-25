import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartasService {

  private baseUrl = 'https://deckofcardsapi.com/api/deck';
  private deckId: string | null = null;

  constructor(private http: HttpClient) {}

  nuevaBaraja(): Observable<any> {
    return this.http.get(`${this.baseUrl}/new/shuffle/?deck_count=1`);
  }

  setDeckId(id: string){
    this.deckId = id;
  }

  sacarCarta(): Observable<any>{
    if(!this.deckId) throw new Error('No hay deck inicializado');
    return this.http.get(`${this.baseUrl}/${this.deckId}/draw/?count=1`);
  }
}
