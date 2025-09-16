import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../../servicios/supabase.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  imports: [MatCardModule, MatInputModule, RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = "";
  clave: string = "";

  constructor(private router: Router, private supabase: SupabaseService){}

  acceder(){

    if (!this.email || !this.clave) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Todos los campos son obligatorios.'
    });
    return;
    }

    this.supabase.loguear(this.email,this.clave)
    .then((res) =>{
      if(res.error){
        Swal.fire({
        icon:'error',
        title: 'Error',
        text:'El correo o la clave no son correctos'
        });
      } else{
        this.irA('home');
      }
    })
    .catch((e) => {
      console.log(e);
      Swal.fire({
        icon: 'error',
        title: 'Error al iniciar sesión',
        text: e.message ?? 'Ocurrió un error al iniciar sesión'
      });
    });
  }

  autocompletarAdmin(){
    this.email = 'admin@admin.com';
    this.clave = 'ElAdministrador2025';
  }

  autocompletarJugador1(){
    this.email = 'jugador1@jugador.com';
    this.clave = 'Jugador1_2025';
  }

  irA(path: string){
    this.router.navigateByUrl(path);
  }
}
