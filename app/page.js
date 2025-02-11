'use client';

import Link from 'next/link';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Witaj w Wonderhoyowym Świecie Emu! 🌟✨</h1>
        <p className={styles.description}>
          Gotowy na ekscytujące przygody pełne zabawy? 🎈 Wybierz swoją przygodę i zanurz się w świecie emocji! Wonderhoy!☆
        </p>
        <div className={styles.links}>
          <Link href="/login" className={styles.gameLink}>
            💣 Zagraj w Hazardowego Sapera!
          </Link>
        </div>
      </main>
    </div>
  );
}
