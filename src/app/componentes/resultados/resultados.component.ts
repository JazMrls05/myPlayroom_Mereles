import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SupabaseService } from '../../servicios/supabase.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButton, MatButtonModule } from "@angular/material/button";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-resultados',
  imports: [MatTableModule, CommonModule, MatFormFieldModule, 
    MatPaginatorModule, MatInputModule, MatSelectModule, 
    MatButtonModule, RouterLink],
  templateUrl: './resultados.component.html',
  styleUrl: './resultados.component.scss'
})
export class ResultadosComponent implements OnInit{
  displayedColumns: string[] = ['alias', 'juego', 'puntaje', 'fecha'];
  dataSource = new MatTableDataSource<any>([]);
  todosLosDatos: any[] = [];
  juegosDisponibles: string[] = [];
  
  filtroSeleccionado: string = '';
  juegoSeleccionado: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    const usuario = await this.supabaseService.obtenerUsuarioActual();
    if (usuario) {
      const resultados = await this.supabaseService.obtenerPuntajes(usuario.id);
      this.todosLosDatos = resultados;
      this.dataSource.data = resultados;
      this.dataSource.paginator = this.paginator;

      this.juegosDisponibles = Array.from(new Set(resultados.map(r => r.juego)));
    }
  }

  aplicarFiltro() {
    if (this.filtroSeleccionado === '') {
      this.dataSource.data = this.todosLosDatos;
      this.juegoSeleccionado = null;
      return;
    }

    if (this.filtroSeleccionado === 'juego' && this.juegoSeleccionado) {
      this.dataSource.data = this.todosLosDatos.filter(d => d.juego === this.juegoSeleccionado);
    } else if (this.filtroSeleccionado === 'puntaje') {
      this.dataSource.data = [...this.todosLosDatos].sort((a,b) => b.puntaje - a.puntaje);
    } else if (this.filtroSeleccionado === 'fecha') {
      this.dataSource.data = [...this.todosLosDatos].sort((a,b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    }
  }

  obtenerColor(juego: string): string {
    switch (juego.toLowerCase()) {
      case 'ahorcado': return '#f3de68ff';
      case 'mayor o menor': return '#8bf368';
      case 'simon dice': return '#f368f3';
      default: return '#68adf3';
    }
  }
}
