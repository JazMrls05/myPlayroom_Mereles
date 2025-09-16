import { Injectable } from '@angular/core';
import { createClient, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  clienteSupabase = createClient(environment.supabaseUrl, environment.supabaseKey);

  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor() {

    this.clienteSupabase.auth.getSession().then(({ data }) => {
      this.userSubject.next(data.session?.user ?? null);
    });

    this.clienteSupabase.auth.onAuthStateChange((_event, session) => {
      this.userSubject.next(session?.user ?? null);
    });
  }

async registrar(email: string, username: string, password: string):Promise<{ data: any, error: any }> {

  try {

    const { data, error } = await this.clienteSupabase.auth.signUp({
      email,
      password,
      options: {
      data: { username }}
    });

    if (error) {
      return { data: null, error };
    }

    const userId = data.user?.id;
    if (!userId) {
      return { data: null, error: { message: "No se pudo obtener el ID del usuario" } };
    }

    const { error: aliasError } = await this.clienteSupabase.from("usuarios").insert({ id: userId, username });

    if (aliasError) {
      await this.clienteSupabase.auth.admin.deleteUser(userId);
      return { data: null, error: aliasError };
    }

    return { data, error: null };

  } catch (e: any) {
    console.error("Error en registrar:", e);
    return { data: null, error: e };
  }
}

  loguear(email: string, password: string) {
    return this.clienteSupabase.auth.signInWithPassword({ email, password });
  }

  cerrarSesion() {
    return this.clienteSupabase.auth.signOut();
  }
}
