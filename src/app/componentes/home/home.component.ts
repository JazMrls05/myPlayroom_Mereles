import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { MatCardModule } from "@angular/material/card";
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom, Observable } from 'rxjs';
import { SupabaseService } from '../../servicios/supabase.service';

@Component({
  selector: 'app-home',
  imports: [NavbarComponent, MatCardModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  user$:Observable<any>;

  constructor(private supabase: SupabaseService ,private router: Router, private snackBar: MatSnackBar){
    this.user$ = this.supabase.user$;
  } 

  async jugar(nombreJuego: string): Promise<void> {
    const user = await firstValueFrom(this.supabase.user$);

    if (!user) {
      this.snackBar.open('📢Ey! Tenés que iniciar sesión para jugar ' + nombreJuego, 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['snackbar-aviso']
      });
      return;
      }

      switch (nombreJuego) {
        case 'Ahorcado':
          this.router.navigate(['/juegos/ahorcado']);
          break;
        case 'Mayor o menor':
          this.router.navigate(['/juegos/mayor-menor']);
          break;
        default:
          this.snackBar.open('Juego no encontrado', 'Cerrar', {
            duration: 2000
          });
          break;
      }
    };
}


