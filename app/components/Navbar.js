'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Stan ładowania!

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false); // Gdy magia autoryzacji się zakończy, przestajemy ładować!
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAuth();
    });

    checkAuth();
    return () => subscription?.unsubscribe();
  }, []);

  // Jeśli dane jeszcze się ładują, pokazujemy czarodziejski spinner!
  if (loading) {
    return (
      <nav className={`${styles.navbar} ${styles.loadingNavbar}`}>
        <div className={styles.spinner}></div>
      </nav>
    );
  }

  // Gdy już mamy świeże dane, pokazujemy pełną, magiczną nawigację!
  return (
    <nav className={styles.navbar}>
      <ul>
        <li><Link href="/">🏠 Strona Główna</Link></li>
        {user ? (
          <>
            <li><Link href="/saper">💣 Saper</Link></li>
            <li><Link href="/account">😎Konto</Link></li>
            <li>
              <form action="/auth/signout" method="POST">
                <button className={styles.logoutButton} type="submit">
                  🗿Wyloguj
                </button>
              </form>
            </li>
          </>
        ) : (
          <li><Link href="/login">🔑Zaloguj</Link></li>
        )}
      </ul>
    </nav>
  );
}
