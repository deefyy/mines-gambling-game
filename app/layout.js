import Navbar from './components/Navbar';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body>
        <Navbar />
        <main className="content"> 
          {children}
        </main>
      </body>
    </html>
  );
}
