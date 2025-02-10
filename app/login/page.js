'use client';

import { login, signup } from './actions';
import styles from './page.module.css';

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <form className={styles.form}>
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
          <button formAction={login} className={styles.btn}>
            Log in
          </button>
          <button formAction={signup} className={styles.btn}>
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
}
