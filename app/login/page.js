'use client';

import { useState } from 'react';
import { login, signup } from './actions';
import styles from './page.module.css';

export default function LoginPage() {
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  // Ustaw opóźnienie (w milisekundach) na efekt fade-out przed przeładowaniem
  const FADE_OUT_DELAY = 500;

  async function handleLogin(e) {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    setFadeOut(true); // Rozpoczynamy animację zanikania!
    const formData = new FormData(e.target);
    try {
      await login(formData);
      // Poczekaj, aż fade-out zakończy się, a następnie przeładuj stronę
      setTimeout(() => {
        window.location.href = '/saper';
      }, FADE_OUT_DELAY);
    } catch (error) {
      setErrorMsg(error.message || 'Błąd logowania');
      setLoading(false);
      setFadeOut(false);
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    setFadeOut(true);
    const formData = new FormData(e.target.form);
    try {
      await signup(formData);
      setTimeout(() => {
        window.location.href = '/saper';
      }, FADE_OUT_DELAY);
    } catch (error) {
      setErrorMsg(error.message || 'Błąd rejestracji');
      setLoading(false);
      setFadeOut(false);
    }
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
