'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client'; // <-- Twój plik z createBrowserClient
import styles from './page.module.css';

// Tworzymy instancję klienta Supabase dla przeglądarki
const supabase = createClient();

function generateBoard(size, bombCount) {
  // Twój kod generujący planszę
  const board = Array.from({ length: size }, (_, i) => ({
    id: i,
    isBomb: false,
    revealed: false,
  }));

  let placedBombs = 0;
  while (placedBombs < bombCount) {
    const index = Math.floor(Math.random() * size);
    if (!board[index].isBomb) {
      board[index].isBomb = true;
      placedBombs++;
    }
  }
  return board;
}

export default function HazardSaperPage() {
  const boardSize = 25;
  
  // Dodajemy stan na saldo
  const [balance, setBalance] = useState(0);

  const [bombCount, setBombCount] = useState(boardSize - 1);
  const [betAmount, setBetAmount] = useState(100);
  const [board, setBoard] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [winAmount, setWinAmount] = useState(0);
  const [bombMultiplier, setBombMultiplier] = useState(1);
  const [revealedCount, setRevealedCount] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const [inputBombCount, setInputBombCount] = useState(boardSize - 1);
  const [inputBet, setInputBet] = useState(100);

  // ------------------------------------------------------------------
  // 1. Pobieramy aktualne saldo użytkownika z Supabase
  // ------------------------------------------------------------------
  useEffect(() => {
    async function fetchUserBalance() {
      // Pobieramy sesję
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error('Błąd sesji:', sessionError);
        return;
      }

      // Jeżeli nie ma zalogowanego usera
      if (!session) {
        console.warn('Użytkownik nie jest zalogowany.');
        return;
      }

      const userId = session.user.id;

      // Zapytanie do tabeli user_money
      const { data, error } = await supabase
        .from('user_money')
        .select('money')
        .eq('user_id', userId)
        .single();
      if (error) {
        console.error('Błąd pobrania salda:', error);
        return;
      }

      setBalance(data?.money || 0);
    }

    fetchUserBalance();
  }, []);

  // ------------------------------------------------------------------
  // 2. Aktualizacja stanu konta w bazie (pomocnicza funkcja)
  // ------------------------------------------------------------------
  async function updateUserBalance(newBalance) {
    // Pobieramy aktualną sesję
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      console.warn('Brak zalogowanego użytkownika.');
      return;
    }

    const userId = session.user.id;

    const { error } = await supabase
      .from('user_money')
      .update({ money: newBalance })
      .eq('user_id', userId);

    if (error) {
      console.error('Błąd aktualizacji salda:', error);
    } else {
      // Udana aktualizacja w bazie -> zmieniamy stan lokalny
      setBalance(newBalance);
    }
  }

  // ------------------------------------------------------------------
  // 3. Resetujemy grę z nowymi ustawieniami
  // ------------------------------------------------------------------
  const resetGame = (bombs = bombCount) => {
    const newBoard = generateBoard(boardSize, bombs);
    setBoard(newBoard);
    setGameOver(false);
    setRevealedCount(0);
    setWinAmount(0);
  };

  // ------------------------------------------------------------------
  // 4. Mnożnik bomb (bez zmian)
  // ------------------------------------------------------------------
  const calculateBombMultiplier = (bombs) => {
    const minMultiplier = 1.1;
    const maxMultiplier = 4.0;
    return (
      minMultiplier +
      (bombs / (boardSize - 1)) ** 4 * (maxMultiplier - minMultiplier)
    );
  };

  // ------------------------------------------------------------------
  // 5. Odkrycie pola (logika gry)
  // ------------------------------------------------------------------
  const handleReveal = (index) => {
    if (gameOver) return;

    const newBoard = [...board];
    const cell = newBoard[index];
    if (cell.revealed) return;

    cell.revealed = true;

    if (cell.isBomb) {
      setWinAmount(0);
      setGameOver(true);
      newBoard.forEach(item => {
        if (item.isBomb) item.revealed = true;
      });
      setBoard(newBoard);
      return;
    }

    const newRevealedCount = revealedCount + 1;
    setRevealedCount(newRevealedCount);

    const newWinAmount = betAmount * (Math.pow(bombMultiplier, newRevealedCount) - 1);
    setWinAmount(newWinAmount.toFixed(2));
    setBoard(newBoard);
  };

  // ------------------------------------------------------------------
  // 6. Wypłacenie wygranej
  // ------------------------------------------------------------------
  const handleCashOut = async () => {
    if (!gameOver && revealedCount > 0) {
      const cashOut = parseFloat(winAmount);
      const newBalance = balance + cashOut;
      await updateUserBalance(newBalance);
      setGameOver(true);
    }
  };

  // ------------------------------------------------------------------
  // 7. Rozpoczęcie nowej gry
  // ------------------------------------------------------------------
  const startOrNewGame = async (e) => {
    e.preventDefault();
    const bombs = parseInt(inputBombCount, 10);
    if (isNaN(bombs) || bombs < 1 || bombs > boardSize - 1) {
      alert(`Podaj liczbę bomb z zakresu od 1 do ${boardSize - 1}`);
      return;
    }
    const newBet = parseFloat(inputBet);
    if (isNaN(newBet) || newBet <= 0) {
      alert("Podaj poprawną stawkę!");
      return;
    }

    if (newBet > balance) {
      alert("Brak środków na koncie!");
      return;
    }

    const newBalance = balance - newBet;
    await updateUserBalance(newBalance);

    setBetAmount(newBet);
    setBombCount(bombs);
    setInputBombCount(bombs);

    const newMultiplier = calculateBombMultiplier(bombs);
    setBombMultiplier(newMultiplier);

    if (!gameStarted) {
      setGameStarted(true);
    }
    resetGame(bombs);
  };

  // Widok (jeśli gra jeszcze nie zaczęła się)
  if (!gameStarted) {
    return (
      <div className={styles.container}>
        <h1>Hazardowy Saper Emu! (Wonderhoy!☆)</h1>
        <p>Twoje aktualne saldo: <strong>{balance} zł</strong></p>

        <form onSubmit={startOrNewGame} className={styles.startForm}>
          <div className={styles.formGroup}>
            <label>Liczba bomb (1 - {boardSize - 1}):</label>
            <input
              type="number"
              min="1"
              max={boardSize - 1}
              value={inputBombCount}
              onChange={(e) => setInputBombCount(e.target.value)}
              className={styles.inputField}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Stawka (zł):</label>
            <input
              type="number"
              min="1"
              value={inputBet}
              onChange={(e) => setInputBet(e.target.value)}
              className={styles.inputField}
            />
          </div>
          <button type="submit" className={styles.btn}>Rozpocznij grę</button>
        </form>
      </div>
    );
  }

  // Widok (jeśli gra jest w toku lub skończona)
  return (
    <div className={styles.mainWrapper}>
      <div className={styles.menu}>
        <h1>Hazardowy Saper Emu! (Wonderhoy!☆)</h1>
        <div className={styles.info}>
          <p>Stawka: <strong>{betAmount} zł</strong></p>
          <p>Liczba bomb: <strong>{bombCount}</strong></p>
          <p>Odkryte pola: <strong>{revealedCount}</strong></p>
          <p>Wygrana: <strong>{winAmount} zł</strong></p>
          <p>Twoje saldo: <strong>{balance} zł</strong></p>
          {gameOver ? (
            <p className={styles.gameOver}>
              Gra zakończona! {revealedCount > 0
                ? `Twoja wygrana to: ${winAmount} zł`
                : "Trafiłeś bombę, brak wygranej!"}
            </p>
          ) : (
            <p className={styles.gameStatus}>Wybieraj pola, ale uważaj na bomby!</p>
          )}
        </div>
        {gameOver && (
          <form onSubmit={startOrNewGame} className={styles.startForm}>
            <div className={styles.formGroup}>
              <label>Liczba bomb (1 - {boardSize - 1}):</label>
              <input
                type="number"
                min="1"
                max={boardSize - 1}
                value={inputBombCount}
                onChange={(e) => setInputBombCount(e.target.value)}
                className={styles.inputField}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Stawka (zł):</label>
              <input
                type="number"
                min="1"
                value={inputBet}
                onChange={(e) => setInputBet(e.target.value)}
                className={styles.inputField}
              />
            </div>
            <button type="submit" className={styles.btn}>Nowa Gra</button>
          </form>
        )}
        {!gameOver && (
          <button onClick={handleCashOut} className={styles.btn} disabled={revealedCount === 0}>
            Wypłać wygraną
          </button>
        )}
      </div>
      <div className={styles.board}>
        <div className={styles.grid}>
          {board.map(cell => (
            <div
              key={cell.id}
              onClick={() => handleReveal(cell.id)}
              className={`${styles.cell} ${
                cell.revealed
                  ? cell.isBomb
                    ? styles.revealedBomb
                    : styles.revealedSafe
                  : styles.hidden
              } ${gameOver ? styles.disabled : ''}`}
            >
              {cell.revealed ? (cell.isBomb ? '💣' : '✔') : '?'}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}