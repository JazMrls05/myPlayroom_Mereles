import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../../servicios/supabase.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ MatCardModule, RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  user$:Observable<any>;
  
  constructor(private supabase: SupabaseService, private router: Router){
    this.user$ = this.supabase.user$;
  }

  async salir(){
    await this.supabase.cerrarSesion();
    this.router.navigate(['/login']);
  }
  
}
