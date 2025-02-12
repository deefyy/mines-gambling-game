'use client';

import { useState } from 'react';
import { login, signup } from './actions';
import styles from './page.module.css';

export default function LoginPage() {
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  // Opóźnienie (w milisekundach) dla efektu fade-out
  const FADE_OUT_DELAY = 500;

  async function handleLogin(e) {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    setFadeOut(true);

    const formData = new FormData(e.target);
    // Wywołujemy login z Server Actions
    const result = await login(formData);

    if (!result.success) {
      // Jeśli success to false, wyświetlamy wiadomość z servera!
      setErrorMsg(result.message);
      setLoading(false);
      setFadeOut(false);
      return; // Przerywamy dalsze akcje, bo logowanie się nie powiodło
    }

    // Jeśli logowanie się udało, przenosimy użytkownika na /saper
    setTimeout(() => {
      window.location.href = '/saper';
    }, FADE_OUT_DELAY);
  }

  async function handleSignup(e) {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    setFadeOut(true);

    // Używamy tej samej formData, ale w signup
    const formData = new FormData(e.target.form);
    const result = await signup(formData);

    if (!result.success) {
      setErrorMsg(result.message);
      setLoading(false);
      setFadeOut(false);
      return;
    }

    setTimeout(() => {
      window.location.href = '/saper';
    }, FADE_OUT_DELAY);
  }

  return (
    <div className={`${styles.container} ${fadeOut ? styles.fadeOut : ''}`}>
      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner}></div>
        </div>
      )}
      <div className={styles.formWrapper}>
        <form className={styles.form} onSubmit={handleLogin}>
          <label htmlFor="email" className={styles.label}>
            Email:
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={styles.inputField}
          />
          <label htmlFor="password" className={styles.label}>
            Password:
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className={styles.inputField}
          />
          {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
          <button type="submit" className={styles.btn}>
            Log in
          </button>
          <button type="button" onClick={handleSignup} className={styles.btn}>
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
}
