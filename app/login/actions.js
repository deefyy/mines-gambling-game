'use server'

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';

export async function login(formData) {
  const supabase = await createClient();
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    // Zwracamy obiekt z informacją o niepowodzeniu i wiadomością
    return {
      success: false,
      message: 'Błąd logowania! Sprawdź poprawność danych i spróbuj ponownie!'
    };
  }
  
  // Jeśli wszystko OK, revalidujemy i zwracamy success
  revalidatePath('/', 'layout');
  return {
    success: true,
    message: 'Zalogowano pomyślnie! Wonderhoy!☆'
  };
}

export async function signup(formData) {
  const supabase = await createClient();
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return {
      success: false,
      message: 'Błąd rejestracji! Możliwe, że email jest zajęty lub hasło za słabe!'
    };
  }

  revalidatePath('/', 'layout');
  return {
    success: true,
    message: 'Rejestracja zakończona sukcesem!'
  };
}
