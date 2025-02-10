// login/actions.js
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
    throw new Error('Błąd logowania');
  }
  revalidatePath('/', 'layout');
  return { success: true };
}

// Dodaj tę funkcję, aby umożliwić rejestrację!
export async function signup(formData) {
  const supabase = await createClient();
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  };
  const { error } = await supabase.auth.signUp(data);
  if (error) {
    throw new Error('Błąd rejestracji');
  }
  revalidatePath('/', 'layout');
  return { success: true };
}
