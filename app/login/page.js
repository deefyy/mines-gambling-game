'use client';

import { useState } from 'react';
import { login, signup } from './actions';
import styles from './page.module.css';

export default function LoginPage() {
  const [errorMsg, setErrorMsg] = useState('');

  // Handler logowania – po sukcesie przeładujemy stronę!
  async function handleLogin(e) {
    e.preventDefault();
    setErrorMsg('');
    const formData = new FormData(e.target);
    try {
      await login(formData);
      // Wymuś pełne przeładowanie strony – jak eksplozja fajerwerków!
      window.location.href = '/saper';
    } catch (error) {
      setErrorMsg(error.message || 'Błąd logowania');
    }
  }

  // Handler rejestracji – podobnie jak przy logowaniu, pełne przeładowanie strony po sukcesie!
  async function handleSignup(e) {
    e.preventDefault();
    setErrorMsg('');
    // Uzyskujemy formularz poprzez właściwość .form przycisku
    const formData = new FormData(e.target.form);
    try {
      await signup(formData);
      window.location.href = '/saper';
    } catch (error) {
      setErrorMsg(error.message || 'Błąd rejestracji');
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        {/* Obsługa logowania przez onSubmit */}
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
          {/* Przyciski rejestracji mają typ "button", aby nie wywoływać onSubmit formularza */}
          <button type="button" onClick={handleSignup} className={styles.btn}>
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
}
