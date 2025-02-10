'use client';

import React, { useState } from 'react';
import styles from './page.module.css';

function generateBoard(size, bombCount) {
  // Tworzymy planszę z komórkami gotowymi do odkrycia!
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
  const boardSize = 25; // Plansza z 25 polami!
  
  // Stan gry: liczba bomb, stawka, plansza, itp.
  const [bombCount, setBombCount] = useState(boardSize - 1);
  const [betAmount, setBetAmount] = useState(100);
  const [board, setBoard] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [winAmount, setWinAmount] = useState(0);
  const [bombMultiplier, setBombMultiplier] = useState(1);
  const [revealedCount, setRevealedCount] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  // Pola formularza dla liczby bomb i stawki podawane przez użytkownika
  const [inputBombCount, setInputBombCount] = useState(boardSize - 1);
  const [inputBet, setInputBet] = useState(100);

  // Resetujemy grę z nowymi ustawieniami – magia od razu!
  const resetGame = (bombs = bombCount) => {
    const newBoard = generateBoard(boardSize, bombs);
    setBoard(newBoard);
    setGameOver(false);
    setRevealedCount(0);
    setWinAmount(0);
  };

  const calculateBombMultiplier = (bombs) => {
    const minMultiplier = 1.1; // Minimalny mnożnik (przy małej liczbie bomb)
    const maxMultiplier = 4.0; // Maksymalny mnożnik (przy dużej liczbie bomb)
  
    // Mnożnik rośnie bardziej, jeśli bomb jest więcej!
    return minMultiplier + ((bombs / (boardSize - 1)) ** 4) * (maxMultiplier - minMultiplier)
  };

  const handleReveal = (index) => {
    if (gameOver) return;

    const newBoard = [...board];
    const cell = newBoard[index];
    if (cell.revealed) return; // Emu nie lubi powtórek!

    cell.revealed = true;

    if (cell.isBomb) {
      // BOOM! Trafiłeś bombę – gra kończy się, a wygrana to zero!
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

    // Wygrana zaczyna się od zera, rośnie wg wzoru:
    // win = betAmount * (bombMultiplier^(revealedCount) - 1)
    const newWinAmount = betAmount * (Math.pow(bombMultiplier, newRevealedCount) - 1);
    setWinAmount(newWinAmount.toFixed(2));
    setBoard(newBoard);
  };

  const handleCashOut = () => {
    if (!gameOver && revealedCount > 0) {
      setGameOver(true);
    }
  };

  // Rozpoczynamy grę lub nową rozgrywkę – nowe ustawienia wchodzą w życie od razu!
  const startOrNewGame = (e) => {
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
    setBetAmount(newBet);
    setBombCount(bombs);
    setInputBombCount(bombs); // Synchronizujemy stan
    const newMultiplier = calculateBombMultiplier(bombs);
    setBombMultiplier(newMultiplier);
    if (!gameStarted) {
      setGameStarted(true);
    }
    resetGame(bombs);
  };

  // Na początku wyświetlamy formularz, byś mógł podać liczbę bomb oraz swoją stawkę!
  if (!gameStarted) {
    return (
      <div className={styles.container}>
        <h1>Hazardowy Saper Emu! (Wonderhoy!☆)</h1>
        <form onSubmit={startOrNewGame} className={styles.startForm}>
          <div className={styles.formGroup}>
            <label>Podaj liczbę bomb (od 1 do {boardSize - 1}):</label>
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
            <label>Podaj stawkę (zł):</label>
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

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.menu}>
        <h1>Hazardowy Saper Emu! (Wonderhoy!☆)</h1>
        <div className={styles.info}>
          <p>Stawka: <strong>{betAmount} zł</strong></p>
          <p>Liczba bomb: <strong>{bombCount}</strong></p>
          <p>Odkryte pola: <strong>{revealedCount}</strong></p>
          <p>Wygrana: <strong>{winAmount} zł</strong></p>
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
              <label>Podaj liczbę bomb (od 1 do {boardSize - 1}):</label>
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
              <label>Podaj stawkę (zł):</label>
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
              className={`${styles.cell} ${cell.revealed ? (cell.isBomb ? styles.revealedBomb : styles.revealedSafe) : styles.hidden} ${gameOver ? styles.disabled : ''}`}
            >
              {cell.revealed ? (cell.isBomb ? '💣' : '✔') : '?'}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
