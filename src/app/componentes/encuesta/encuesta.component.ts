import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardContent, MatCardModule, MatCardTitle } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SupabaseService } from '../../servicios/supabase.service';
import { JuegosRoutingModule } from "../../modulos/juegos/juegos-routing.module";
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-encuesta',
  imports: [MatCardModule, MatCardTitle, MatCardContent, RouterLink,
    MatFormFieldModule, MatInputModule, MatRadioModule,
    FormsModule, ReactiveFormsModule, MatCheckboxModule,
    MatRadioModule, MatSnackBarModule, MatButtonModule, CommonModule, JuegosRoutingModule],
  templateUrl: './encuesta.component.html',
  styleUrl: './encuesta.component.scss'
})
export class EncuestaComponent {
  encuestaForm: FormGroup;

  constructor(private fBuilder: FormBuilder, private supabase:SupabaseService, private snackBar: MatSnackBar){
    this.encuestaForm = this.fBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      edad: ['', Validators.compose([
        Validators.required , Validators.min(18), Validators.max(99)
      ])],
      telefono: ['', Validators.required],
      experiencia: ['', Validators.required],
      aspectos: this.fBuilder.group({
        estetica: [false],
        juegos:[false],
        interfaz:[false],
        nada:[false],
      }, { validators: this.validarAlMenosUnCheckbox }),
      sugerencia:['', Validators.required]
    });
      const aspectosGroup = this.encuestaForm.get('aspectos') as FormGroup;

      aspectosGroup.get('nada')?.valueChanges.subscribe((valorNada) => {
      if (valorNada) {
        aspectosGroup.patchValue({
          estetica: false,
          juegos: false,
          interfaz: false
        }, { emitEvent: false });
      }
    });

    ['estetica', 'juegos', 'interfaz'].forEach(campo => {
      aspectosGroup.get(campo)?.valueChanges.subscribe((valor) => {
        if (valor) {
          aspectosGroup.get('nada')?.setValue(false, { emitEvent: false });
        }
      });
    });
  }

  async enviarEncuesta(){
    if (this.encuestaForm.valid){
      const datos = this.encuestaForm.value;

      try{
        await this.supabase.guardarEncuesta(datos);
        Swal.fire({
              icon:'success',
              title:'¡Encuesta realizada!',
              text:'Gracias por compartirnos tu opinión :)',
              confirmButtonText:'Aceptar',
              heightAuto: false
              });
        this.encuestaForm.reset();
      } catch (error){
        console.error('Error al enviar la encuesta', error);
        Swal.fire({
              icon:'error',
              title:'Error',
              text:'Algo salió mal al cargar la encuesta',
              confirmButtonText:'Aceptar',
              heightAuto: false
              });
      }
    }
    else{
      this.encuestaForm.markAllAsTouched();
      this.snackBar.open('Completá todos los campos!!', 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      });
    }
  }

  validarAlMenosUnCheckbox(control: FormGroup) {
  const valores = Object.values(control.value);
  const algunoSeleccionado = valores.some(val => val === true);
  return algunoSeleccionado ? null : { requerido: true };
  }
}
