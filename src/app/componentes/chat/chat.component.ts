import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { SupabaseService } from '../../servicios/supabase.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatInputModule, MatButtonModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  private supabase = inject(SupabaseService);

  mensajes: any[] = [];
  nuevoMensaje: string = '';
  user: any = null;
  pollingSub!: Subscription;

  constructor(private router: Router){}

  ngOnInit() {
    this.supabase.user$.subscribe(u => this.user = u);
    this.traerMensajes();

    // Polling cada 1 segundo
    this.pollingSub = interval(1000).subscribe(() => this.traerMensajes());
  }

  async traerMensajes() {
    const { data, error } = await this.supabase.clienteSupabase
      .from('mensajes')
      .select('id, texto, usuario, created_at')
      .order('created_at', { ascending: true });

    if (!error && data) {
      this.mensajes = data;
    }
  }

  async enviarMensaje() {
    if (!this.user || !this.nuevoMensaje.trim()) return;

    await this.supabase.clienteSupabase.from('mensajes').insert({
      texto: this.nuevoMensaje.trim(),
      usuario: this.user.user_metadata?.username || this.user.email,
    });

    this.scrollAlFinal();
    this.nuevoMensaje = '';
  }

  esMio(mensaje: any): boolean {
    return mensaje.usuario === (this.user?.user_metadata?.username || this.user?.email);
  }

  scrollAlFinal() {
    setTimeout(() => {
      const contenedor = document.getElementById('chat-mensajes');
      if (contenedor) contenedor.scrollTop = contenedor.scrollHeight;
    }, 50);
  }

  ngOnDestroy() {
    if (this.pollingSub) this.pollingSub.unsubscribe();
  }

  volverAlHome(){
    this.router.navigate(['/home']);
  }
}
