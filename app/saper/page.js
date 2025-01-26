'use client';

import React, { useState, useEffect } from 'react';

// Funkcja do tworzenia planszy z bombami
function generateBoard(size, bombCount) {
  // Tworzymy tablicę obiektów
  const board = Array.from({ length: size }, (_, i) => ({
    id: i,
    isBomb: false,
    revealed: false,
  }));

  // Rozmieszczamy bomby w losowych miejscach
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
  // Ustawiamy podstawowe parametry gry
  const [boardSize] = useState(25); // np. 25 pól
  const [bombCount] = useState(5);  // np. 5 bomb
  const [betAmount] = useState(100); // Przykładowa stawka (100 zł)
  
  // Stan gry
  const [board, setBoard] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [winAmount, setWinAmount] = useState(0);
  const [bombMultiplier, setBombMultiplier] = useState(1);
  const [revealedCount, setRevealedCount] = useState(0);

  // Inicjujemy planszę przy starcie
  useEffect(() => {
    resetGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Funkcja do resetu gry
  const resetGame = () => {
    const newBoard = generateBoard(boardSize, bombCount);
    setBoard(newBoard);
    setGameOver(false);
    setRevealedCount(0);
    setBombMultiplier(calculateMultiplier(bombCount));
    setWinAmount(0);
  };

  // Mnożnik wygranej (przykładowy przelicznik w zależności od liczby bomb)
  // Można zrobić bardziej skomplikowaną logikę lub tabele
  const calculateMultiplier = (bombCount) => {
    // Im więcej bomb, tym wyższy teoretycznie mnożnik początkowy
    // Załóżmy prostą zależność:
    return 1 + bombCount * 0.2; // np. 1 + bombCount/5
  };

  // Kliknięcie w pole
  const handleReveal = (index) => {
    if (gameOver) return;

    const newBoard = [...board];
    const cell = newBoard[index];

    if (cell.revealed) return; // już odkryte – nic nie robimy

    cell.revealed = true;

    if (cell.isBomb) {
      // O nie! Bomba! Przegrana!
      setGameOver(true);
      // Odsłaniamy wszystkie bomby
      newBoard.forEach((item) => {
        if (item.isBomb) item.revealed = true;
      });
      setBoard(newBoard);
      return;
    }

    // Jeśli nie bomba – zwiększamy liczbę odkrytych pól
    const newRevealedCount = revealedCount + 1;
    setRevealedCount(newRevealedCount);

    // Przeliczamy nową wygraną (np. każda kolejna odkryta bezpieczna komórka podnosi wygraną)
    // Tutaj Emu przygotowała przykład, który mnoży naszą stawkę za każdym razem o rosnący współczynnik.
    let newWinAmount = betAmount * (bombMultiplier ** newRevealedCount);
    // Możesz zmienić tę formułę w zależności od pomysłu na nagrodę!

    setWinAmount(newWinAmount.toFixed(2));
    setBoard(newBoard);
  };

  // Funkcja do wypłacenia wygranej – kończy grę
  const handleCashOut = () => {
    if (!gameOver && revealedCount > 0) {
      setGameOver(true);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '30px' }}>
      <h1>Hazardowy Saper Emu! (Wonderhoy!☆)</h1>
      <div style={{ margin: '20px' }}>
        <p>Stawka: <strong>{betAmount} zł</strong></p>
        <p>Liczba bomb: <strong>{bombCount}</strong></p>
        <p>Odkryte pola: <strong>{revealedCount}</strong></p>
        <p>Aktualna potencjalna wygrana: <strong>{winAmount} zł</strong></p>
        {gameOver ? (
          <p style={{ color: 'red', fontWeight: 'bold' }}>
            Gra zakończona! {revealedCount > 0 
              ? `Twoja wygrana to: ${winAmount} zł` 
              : "Niestety, trafiłeś bombę i nic nie wygrałeś!"
            }
          </p>
        ) : (
          <p style={{ color: 'green' }}>Wybieraj pola, ale uważaj na bomby!</p>
        )}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', width: '250px', margin: '0 auto' }}>
        {board.map((cell) => (
          <div
            key={cell.id}
            onClick={() => handleReveal(cell.id)}
            style={{
              width: '50px',
              height: '50px',
              margin: '2px',
              backgroundColor: cell.revealed ? (cell.isBomb ? 'red' : 'lightgreen') : 'lightblue',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: gameOver ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontSize: '18px',
              userSelect: 'none'
            }}
          >
            {cell.revealed ? (cell.isBomb ? '💣' : '✔') : '?'}
          </div>
        ))}
      </div>

      <div style={{ margin: '20px' }}>
        <button
          onClick={handleCashOut}
          disabled={gameOver || revealedCount === 0}
          style={{ marginRight: '10px', padding: '10px 20px', cursor: 'pointer' }}
        >
          Wypłać wygraną
        </button>
        <button
          onClick={resetGame}
          style={{ padding: '10px 20px', cursor: 'pointer' }}
        >
          Nowa Gra
        </button>
      </div>
    </div>
  );
}
