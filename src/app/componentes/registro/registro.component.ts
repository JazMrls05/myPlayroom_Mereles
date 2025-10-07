import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { SupabaseService } from '../../servicios/supabase.service';

@Component({
  selector: 'app-registro',
  imports: [ MatCardModule, FormsModule, MatFormFieldModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent {

  email: string = '';
  clave: string = '';
  alias: string = '';

  constructor(private supabase: SupabaseService, private router: Router){}

async validarRegistro() {
  // Trim de los campos
  this.alias = this.alias.trim();
  this.email = this.email.trim();
  this.clave = this.clave.trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(this.email)) {
    this.swalError('El correo electrónico no es válido.');
    return;
  }

  if (this.clave.length < 6) {
    this.swalError('La contraseña debe tener al menos 6 caracteres.');
    return;
  }

  if (!this.alias) {
    this.swalError('El alias no puede estar vacío.');
    return;
  }

  try {
    const resultado = await this.supabase.registrar(this.email, this.alias, this.clave);

    if (resultado.error) {
      if (resultado.error.code === "user_already_exists") {
        this.swalError("Ese correo ya está registrado.");
      } else if (resultado.error.code === "23505") {
        this.swalError("Ese alias ya está en uso");
      } else {
        this.swalError(resultado.error.message || "Error en el registro");
      }
      return;
    }

    Swal.fire({
      icon: 'success',
      title: '¡Registro exitoso!',
      text: 'Tu cuenta se creó correctamente',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then(() => {
      this.router.navigate(['home']);
    });

  } catch (e) {
    this.swalError('Algo salió mal al registrar');
    console.error(e);
  }
}

  swalError(mensaje: string){
    return Swal.fire({
    icon: "error",
    title: "Error",
    text: mensaje
  });
  }

}
