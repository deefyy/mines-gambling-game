'use client';

import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <ul>
        <li><Link href="/">🏠 Strona Główna</Link></li>
        <li><Link href="/saper">💣 Hazardowy Saper Emu</Link></li>
        <li><Link href="/login">login</Link></li>
        <li><Link href="/account">account</Link></li>
        <li><Link href="/signout">signout</Link></li>
      </ul>
    </nav>
  );
}
