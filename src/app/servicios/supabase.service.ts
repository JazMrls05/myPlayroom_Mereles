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

  async obtenerUsuarioActual() {
    const { data } = await this.clienteSupabase.auth.getUser();
    return data.user;
  }
  
//#region AUTH
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
//#endregion

//#region ENCUESTA
  async guardarEncuesta(datosEncuesta: any): Promise<void> {
    
    const { data: { user } } = await this.clienteSupabase.auth.getUser();
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const datos = {
      uid: user.id,
      usuario: user.user_metadata?.["username"],
      ...datosEncuesta,
      fecha: new Date()
    };

    const { error } = await this.clienteSupabase.from('encuestas').insert(datos);
    if (error) {
      console.error('Error al guardar la encuesta:', error);
      throw error;
      }
  }
//#endregion

//#region PUNTAJE
async guardarPuntaje(juego: string, puntaje: number): Promise<void> {
  if (puntaje <= 0) return;

  const { data: { user } } = await this.clienteSupabase.auth.getUser();
  if (!user) throw new Error('Usuario no autenticado');

  // Busco si ya existe un puntaje igual para este juego (mismo valor)
  const { data: existingRecords, error: selectError } = await this.clienteSupabase
    .from('puntajes')
    .select('*')
    .eq('uid', user.id)
    .eq('juego', juego)
    .eq('puntaje', puntaje)
    .order('fecha', { ascending: false }) // ordena del más nuevo al más viejo
    .limit(1); // me quedo solo con el último

  if (selectError) throw selectError;

  const fechaActual = new Date();

  if (existingRecords && existingRecords.length > 0) {
    // 🟡 Puntaje ya existe → actualizar solo ese registro específico
    const ultimo = existingRecords[0];
    const { error: updateError } = await this.clienteSupabase
      .from('puntajes')
      .update({ fecha: fechaActual })
      .eq('id', ultimo.id); // actualiza solo ese id, no todos

    if (updateError) throw updateError;
    console.log(`Se actualizó la fecha del puntaje ${puntaje}.`);
  } 
  else {
    // 🆕 Puntaje distinto → insertar nuevo registro
    const { error: insertError } = await this.clienteSupabase.from('puntajes').insert({
      uid: user.id,
      alias: user.user_metadata?.["username"],
      juego,
      puntaje,
      fecha: fechaActual
    });

    if (insertError) throw insertError;
    console.log(`Nuevo puntaje (${puntaje}) guardado correctamente.`);
  }
}


  async obtenerPuntajes(uid: string) {
    const { data, error } = await this.clienteSupabase
      .from('puntajes')
      .select('*')
      .eq('uid', uid)
      .order('puntaje', { ascending: false }); 

    if (error) throw error;

    return data ?? [];
  }
//endregion


}
